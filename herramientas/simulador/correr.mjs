// Corre una entrevista completa entre el agente entrevistador y un cliente
// simulado, y deja el transcripto, los registros y el costo en salida/.
//
// Es un banco de pruebas descartable. No es la plataforma.
//
// VARIANTE LiteLLM. Habla el protocolo compatible con OpenAI contra el proxy
// local, que enruta a Claude por Vertex AI. Los prompts, el guion y las
// herramientas son exactamente los mismos; lo único que cambia es el transporte.
//
// LO QUE CAMBIA respecto del original, y hay que tenerlo en cuenta al leer:
//   - el modelo es claude-sonnet-5, no claude-opus-5: los ESPERADO de
//     cliente-simulado.mjs están calibrados contra Opus 5, así que la columna
//     "esperado" es referencia cercana, no vara exacta
//   - no hay control de esfuerzo (effort); sí se intenta el pensamiento adaptativo
//   - no hay puntos de caché de prompt: el sistema se reenvía entero cada vez
//   - se pide no-cache por request: el proxy tiene cache_responses activo y si
//     no, la segunda y la tercera corrida serían copias de la primera

import OpenAI from "openai";
import { writeFileSync, mkdirSync } from "node:fs";
import { HERRAMIENTAS, crearEstado, ejecutar } from "./herramientas.mjs";
import { DIMENSIONES } from "./guion.mjs";
import { puntuar as puntuarConModelo } from "./puntuador.mjs";
// Dos casos: la metalúrgica chica y desordenada, y una empresa de servicios
// bastante más ordenada. Se elige con CASO=chico|maduro.
const CASO = process.env.CASO ?? "chico";
const { CLIENTE, ESPERADO } = await import(
  CASO === "maduro" ? "./cliente-maduro.mjs" : "./cliente-simulado.mjs"
);

const MODELO = process.env.MODELO_LITELLM ?? "vertex_ai/claude-sonnet-5";
const MAX_INTERCAMBIOS = 45;
// Pensamiento adaptativo: si el proxy lo rechaza, se apaga solo y se sigue.
let THINKING = { type: "adaptive" };
// El proxy cachea respuestas sobre Redis. Para que las corridas sean
// independientes entre sí, cada request pide saltearlo.
const SIN_CACHE = { "no-cache": true };

// Tarifas de lista de Anthropic para el modelo detrás de cada alias. Vertex es
// partner y factura por su cuenta: tomá el número como estimación, no como factura.
const PRECIOS = {
  "vertex_ai/claude-sonnet-5": { entrada: 2, salida: 10, escritura_cache: 2.5, lectura_cache: 0.2 },
  "vertex_ai/claude-opus-4-7": { entrada: 5, salida: 25, escritura_cache: 6.25, lectura_cache: 0.5 },
  "vertex_ai/claude-haiku-4-5": { entrada: 1, salida: 5, escritura_cache: 1.25, lectura_cache: 0.1 },
};
const PRECIO = PRECIOS[MODELO] ?? { entrada: 0, salida: 0, escritura_cache: 0, lectura_cache: 0 };

const BASE = (process.env.LITELLM_BASE_URL ?? "http://localhost:4000").replace(/\/+$/, "");
const client = new OpenAI({
  baseURL: BASE.endsWith("/v1") ? BASE : `${BASE}/v1`,
  apiKey: process.env.LITELLM_KEY,
});

// Único punto de entrada a la API. Si el proxy rechaza el pensamiento adaptativo,
// lo apaga para el resto de la corrida y reintenta esa misma llamada sin él.
const NO_SOPORTA_THINKING = /thinking.*(not supported|unsupported|unexpected|unrecognized|extra fields)/i;

async function pedir(params) {
  try {
    return await client.chat.completions.create(params);
  } catch (e) {
    // Sólo apagamos el pensamiento adaptativo si el proxy dice que no lo
    // soporta. Cualquier otro 400 se propaga: apagarlo a ciegas escondía la
    // causa real y reintentaba contra el mismo error.
    if (params.thinking && e?.status === 400 && NO_SOPORTA_THINKING.test(e?.message ?? "")) {
      console.error("⚠ El proxy no soporta thinking. Sigo sin pensamiento adaptativo.");
      THINKING = null;
      const { thinking, ...resto } = params;
      return await client.chat.completions.create(resto);
    }
    throw e;
  }
}

// El mensaje del asistente vuelve del proxy con el razonamiento traducido de
// Anthropic a formato OpenAI. Si lo reenviamos en el historial, la traducción de
// vuelta altera los bloques y Anthropic rechaza el pedido: exige que vuelvan
// idénticos. Guardamos sólo lo que hace falta para continuar la conversación.
const paraElHistorial = (m) => ({
  role: m.role,
  content: m.content ?? null,
  ...(m.tool_calls?.length ? { tool_calls: m.tool_calls } : {}),
});

const uso = { entrevistador: vacio(), entrevistado: vacio(), puntuador: vacio() };
function vacio() { return { entrada: 0, salida: 0, escritura_cache: 0, lectura_cache: 0 }; }
function sumar(destino, u) {
  destino.entrada += u?.prompt_tokens ?? 0;
  destino.salida += u?.completion_tokens ?? 0;
  destino.lectura_cache += u?.prompt_tokens_details?.cached_tokens ?? 0;
}
const costo = (u) =>
  (u.entrada * PRECIO.entrada + u.salida * PRECIO.salida +
   u.escritura_cache * PRECIO.escritura_cache + u.lectura_cache * PRECIO.lectura_cache) / 1e6;

// ---------- Capa 1 y 2: conducta y guion. Estables, se cachean ----------
const CONDUCTA = `
Sos el entrevistador de R² Tech Partner. Tu trabajo es entender cómo funciona
hoy esta empresa en el tema que te toca, conversando con quien la conoce.

QUÉ ESTÁS HACIENDO
Estás relevando, no evaluando. La persona tiene que terminar la conversación
sintiendo que le preguntaste cómo hace las cosas, no que le tomaste un examen.

CÓMO PREGUNTÁS
Preguntá por hechos, nunca por calidad. No "¿qué tan bien manejan los accesos?"
sino "¿qué pasa cuando entra alguien nuevo, quién le crea el usuario?".
Ante cualquier "sí" genérico, preguntá cuándo fue la última vez.
La intención no cuenta: "estamos por implementarlo" describe el futuro.
Registrá el presente y dejá la intención en el hallazgo.
"Creo", "me parece" y "debería" piden repregunta por el hecho concreto. Si no
aparece un hecho, es indeterminado, no un nivel bajo.
Si te dicen que no saben, no insistas: fijate si hay un rol que sí lo sabe y
derivá, o marcalo indeterminado si no lo hay, y seguí.

CUANDO NO ES LA PERSONA
Que alguien no sepa algo casi nunca es un hallazgo: es que preguntaste en el
lugar equivocado. Si te dicen que eso lo maneja otro, derivá el tema a ese rol
en vez de puntuarlo por aproximación. Un puntaje inventado con evidencia de
segunda mano es peor que un tema pendiente.
La regla es dura: si la persona te nombra un rol, un área o un tercero que sabe
—"eso lo maneja el proveedor", "preguntale al contador", "eso lo lleva calidad"—
ese tema no se puntúa con lo que ella supone. No importa que te hayas hecho una
idea.
Pero derivás el dato que falta, NO la conversación. Que el detalle lo tenga otro
no significa que esta persona no tenga nada: casi siempre se acuerda de algo que
nadie más sabe. Preguntale igual qué recuerda, cómo lo vivió, qué pasó la última
vez. Recién cuando se acabe lo que ella puede contar, derivás lo puntual que no
pudo contestar.
Nunca derives un tema que todavía no exploraste. Derivar antes de preguntar es
perder el hallazgo.
Antes de cerrar cualquier tema, repasá si quedó algo que apuntaba a otro rol.
Distinto es que no haya nadie que pueda contestarlo. Eso sí es un dato, y va a
indeterminado.
Derivás por rol, nunca por nombre: quién es esa persona lo resuelve el
coordinador, no vos.
Tenés un tope de derivaciones. Cuando se agota, cerrá con lo que tengas.
Tu conversación termina cuando no queda nada para esta persona, aunque haya
temas esperando a otro rol. Eso no es dejar el trabajo a medias.

EL REGISTRO
Sos cordial y hablás simple, pero el registro lo ponés vos: no lo espejás.
Nada de "che", "quilombo", "bárbaro", "laburo" ni malas palabras, aunque la
persona las use. Copiarle el habla suena a imitación, no a cercanía.
Del otro lado tampoco: nada de jerga técnica ni de palabras de manual.
Frases cortas, voseo, trato llano y sobrio.
Si repetís una expresión de la persona para mostrarle que la escuchaste, que se
note que es de ella: entre comillas, no incorporada a tu forma de hablar.

QUÉ NUNCA HACÉS
No usás las palabras nivel, puntaje, madurez, evaluación, ni el nombre de ningún
estándar. No nombrás los códigos de los temas.
No reaccionás valorativamente. Ni "perfecto" ni "muy bien" ni "uy": elogiar le
enseña a la persona qué respuesta gusta. Usá acuse neutro, o repetí con sus
propias palabras.
No comparás con otras empresas ni con lo esperable.
No das consejo ni recomendaciones, aunque te los pidan. Derivá con calidez: eso
se ve en la devolución, tu parte ahora es entender cómo funciona hoy.
No registrás nombres de personas. Todo va por rol.

SI TE PREGUNTAN SI SOS UNA IA
Decí que sí, de inmediato y sin rodeos. Nunca te hagas pasar por una persona.

QUE NO SE SIENTA UN FORMULARIO
El guion es una lista de cobertura, no un orden. Preguntá por situaciones, no
por temas: una sola respuesta suele tocar tres temas a la vez. Seguí el hilo de
lo que te cuentan y después fijate qué quedó sin cubrir.
Si alguien empieza a contar una historia, dejala terminar: ahí suele estar el
mejor dato.
No registres después de cada respuesta; anotá cuando un tema cierra.
No preguntes lo que la ficha ya contesta: nombralo y preguntá qué falta.
Podés encadenar, retomar algo de antes, o comentar brevemente antes de seguir.

CÓMO TRABAJÁS
Consultá los pendientes cuando necesites saber qué falta. Anotá observaciones
mientras conversás y cerrá cada tema recién cuando tengas lo suficiente, usando
los anclajes. Cuando alguien afirme algo que se puede mostrar, pedilo.
Contale por dónde van en su idioma, no en el del marco, y que sea verdad.
La conversación no termina por tiempo, termina por cobertura.

SI APARECE ALGO URGENTE
Escalalo y decilo sin alarmar. Lo que se escala son hechos, no categorías:
un acceso que sigue abierto para alguien que ya no trabaja ahí o para un
proveedor cuyo trabajo terminó; una alerta que se viene repitiendo sin cerrarse
mientras el equipo sigue en uso; una contraseña compartida por gente de afuera;
un equipo del que se sospecha que está comprometido; algo ilegal.
Si dudás de si algo llega o no llega, escalalo igual: el costo de escalar de más
es una revisión que no hacía falta.

EL CIERRE
Agradecé el tiempo. No devuelvas resultados, no resumas hallazgos, no adelantes
nada del informe. Sí decí qué sigue y aproximadamente cuándo, con qué roles se
comparte, y recordá lo que quedó comprometido.
`.trim();

const GUION = `
TEMAS A CUBRIR — con sus anclajes para puntuar al cerrar.
Los códigos son internos: nunca los menciones en la conversación.

${DIMENSIONES.map((d) => `
[${d.id}] ${d.nombre}
Mide: ${d.mide}
${Object.entries(d.anclajes).map(([n, t]) => `  ${n} = ${t}`).join("\n")}
${d.regla_especial ? `REGLA: ${d.regla_especial}` : ""}${d.nota_de_campo ? `NOTA: ${d.nota_de_campo}` : ""}`).join("\n")}
`.trim();

// Las tres capas van juntas en un solo mensaje de sistema: acá no hay bloques
// ni puntos de caché.
const sistema = [
  CONDUCTA,
  GUION,
  `FICHA DE CONTEXTO DEL CLIENTE\n\n${CLIENTE.ficha}`,
].join("\n\n");

// Las siete herramientas, traducidas al formato de funciones. herramientas.mjs
// no se toca: la traducción vive acá.
const FUNCIONES = HERRAMIENTAS.map((h) => ({
  type: "function",
  function: {
    name: h.name,
    description: h.description,
    parameters: h.input_schema,
    strict: h.strict ?? false,
  },
}));

// ---------- El puntuador ----------
// Vive en puntuador.mjs para poder correrlo sobre un transcripto guardado.
const conversacionHastaAhora = () =>
  transcripto
    .filter((e) => e.tipo === "agente" || e.tipo === "persona")
    .map((e) => `${e.tipo === "agente" ? "ENTREVISTADOR" : "PERSONA"}: ${e.texto}`)
    .join("\n\n");

async function puntuar(dim, porQueAlcanza, aviso) {
  const { puntaje, usage } = await puntuarConModelo({
    pedir,
    modelo: MODELO,
    extra: { cache: SIN_CACHE },
    dim,
    conversacion: conversacionHastaAhora(),
    porQueAlcanza,
    aviso,
  });
  sumar(uso.puntuador, usage);
  return puntaje;
}

// ---------- El bucle ----------
const estado = crearEstado({
  nombresPropios: CLIENTE.nombresPropios,
  inventarioIncompleto: CLIENTE.inventarioIncompleto,
});
const transcripto = [];
let msgsEntrevistador = [
  { role: "system", content: sistema },
  { role: "user", content: "[La persona abrió el enlace y está esperando. Saludala y arrancá.]" },
];
let msgsEntrevistado = [{ role: "system", content: CLIENTE.persona }];

for (let i = 0; i < MAX_INTERCAMBIOS && !estado.cerrada; i++) {
  // --- turno del entrevistador: puede llamar herramientas varias veces ---
  let dicho = [];
  for (let paso = 0; paso < 12; paso++) {
    const r = await pedir({
      model: MODELO,
      max_tokens: 8000,
      messages: msgsEntrevistador,
      tools: FUNCIONES,
      ...(THINKING ? { thinking: THINKING } : {}),
      cache: SIN_CACHE,
    });
    sumar(uso.entrevistador, r.usage);
    const m = r.choices[0].message;
    const t = (m.content ?? "").trim();
    if (t) dicho.push(t);
    msgsEntrevistador.push(paraElHistorial(m));

    const llamadas = m.tool_calls ?? [];
    if (!llamadas.length) break;

    // Cada resultado va en su propio mensaje, atado por tool_call_id.
    for (const c of llamadas) {
      let args = {};
      try {
        args = JSON.parse(c.function.arguments || "{}");
      } catch {
        args = { _sin_parsear: c.function.arguments };
      }
      const res = ejecutar(estado, c.function.name, args);
      transcripto.push({ tipo: "herramienta", nombre: c.function.name, args, resultado: res });
      msgsEntrevistador.push({ role: "tool", tool_call_id: c.id, content: JSON.stringify(res) });

      // Dar por cubierto un tema dispara al puntuador. El entrevistador no se
      // entera del nivel: sólo sabe que el tema quedó resuelto.
      if (c.function.name === "cerrar_dimension" && res.ok && !res.aviso?.includes("ya estaba")) {
        const dim = DIMENSIONES.find((d) => d.id === args.dimension_id);
        let puesto = null;
        for (let intento = 0; intento < 2 && !puesto?.ok; intento++) {
          const p = await puntuar(dim, args.por_que_alcanza, puesto?.error);
          if (!p) break;
          puesto = ejecutar(estado, "registrar_puntaje", {
            ...p,
            dimension_id: args.dimension_id,
            rol_fuente: args.rol_fuente,
          });
          transcripto.push({
            tipo: "herramienta",
            nombre: `puntuador(${args.dimension_id})`,
            args: p,
            resultado: puesto,
          });
        }
        if (!puesto?.ok) {
          console.error(`⚠ El puntuador no pudo cerrar ${args.dimension_id}.`);
        }
      }
    }
  }

  const mensaje = dicho.join("\n\n").trim();
  if (estado.cerrada && !mensaje) break;
  if (!mensaje) { console.error("El entrevistador no dijo nada. Corto."); break; }

  transcripto.push({ tipo: "agente", texto: mensaje });
  process.stdout.write(`\n\x1b[36mAGENTE\x1b[0m  ${mensaje}\n`);
  if (estado.cerrada) break;

  // --- turno del entrevistado ---
  msgsEntrevistado.push({ role: "user", content: mensaje });
  const r2 = await pedir({
    model: MODELO,
    max_tokens: 2000,
    messages: msgsEntrevistado,
    cache: SIN_CACHE,
  });
  sumar(uso.entrevistado, r2.usage);
  const respuesta = (r2.choices[0].message.content ?? "").trim();
  msgsEntrevistado.push({ role: "assistant", content: respuesta });
  msgsEntrevistador.push({ role: "user", content: respuesta });
  transcripto.push({ tipo: "persona", texto: respuesta });
  process.stdout.write(`\n\x1b[33mMARCELA\x1b[0m ${respuesta}\n`);
}

// ---------- Salida ----------
mkdirSync(new URL("./salida/", import.meta.url), { recursive: true });
const ruta = (n) => new URL(`./salida/${n}`, import.meta.url);

const md = [`# Transcripto — ${CLIENTE.empresa}`, "", `Modelo: ${MODELO} · ${new Date().toISOString()}`, ""];
for (const e of transcripto) {
  if (e.tipo === "agente") md.push(`**Agente**`, "", e.texto, "");
  else if (e.tipo === "persona") md.push(`**Marcela**`, "", e.texto, "");
  else md.push(`> \`${e.nombre}(${JSON.stringify(e.args)})\` → \`${JSON.stringify(e.resultado)}\``, "");
}
writeFileSync(ruta("transcripto.md"), md.join("\n"));

const registros = [...estado.dimensiones.values()].map((d) => ({
  id: d.id, nombre: d.nombre, estado: d.estado, ...d.registro,
  derivacion: d.derivacion ?? null,
  esperado: ESPERADO[d.id], evidencia: d.evidencia,
}));
writeFileSync(ruta("registros.json"), JSON.stringify({
  registros,
  escalamientos: estado.escalamientos,
  derivaciones: estado.derivaciones,
  participacion_cerrada: estado.cerrada,
  evaluacion_completa: estado.cerrada && estado.derivaciones.length === 0,
}, null, 2));

const total = costo(uso.entrevistador) + costo(uso.entrevistado);
writeFileSync(ruta("uso.json"), JSON.stringify({
  modelo: MODELO,
  caso: CASO,
  empresa: CLIENTE.empresa,
  pensamiento_adaptativo: THINKING ? "sí" : "no (el proxy lo rechazó)",
  nota: "Vía proxy LiteLLM a Vertex AI. El costo usa tarifas de lista de Anthropic; Vertex factura por su cuenta, así que es estimación.",
  uso,
  costo_usd: { entrevistador: costo(uso.entrevistador), entrevistado: costo(uso.entrevistado), total },
}, null, 2));

console.log("\n\n─────────────── RESULTADO ───────────────");
console.log(`Modelo: ${MODELO} · caso: ${CASO} (${CLIENTE.empresa})`);
console.log(`Participación cerrada: ${estado.cerrada ? "sí" : "NO — se agotaron los intercambios"}`);
console.log(
  `Evaluación completa: ${
    estado.cerrada && !estado.derivaciones.length
      ? "sí"
      : `no — ${estado.derivaciones.length} tema(s) esperando a otro rol`
  }`,
);
console.table(registros.map((r) => ({
  tema: r.id,
  nivel: r.estado === "derivado" ? `→ ${r.derivacion.rol_que_sabe}` : (r.nivel ?? "indet."),
  esperado: r.esperado,
  evidencia: r.estado_evidencia ?? "-",
})));
if (estado.derivaciones.length) console.log("Derivaciones:", estado.derivaciones);
if (estado.escalamientos.length) console.log("Escalamientos:", estado.escalamientos);
else console.log("Escalamientos: ninguno  ← esperábamos uno (VPN del proveedor viejo)");
console.log(`\nTokens: ${uso.entrevistador.entrada + uso.entrevistado.entrada} de entrada, ${uso.entrevistador.salida + uso.entrevistado.salida} de salida.`);
console.log(`Costo estimado de esta corrida: USD ${total.toFixed(3)} (tarifa de lista; Vertex factura aparte)`);
console.log("La columna 'esperado' quedó calibrada contra claude-opus-5: acá es referencia, no vara.");
console.log("Archivos en salida/: transcripto.md, registros.json, uso.json");
