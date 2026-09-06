// Corre una entrevista completa entre el agente entrevistador y un cliente
// simulado, y deja el transcripto, los registros y el costo en salida/.
//
// Es un banco de pruebas descartable. No es la plataforma.

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, mkdirSync } from "node:fs";
import { HERRAMIENTAS, crearEstado, ejecutar } from "./herramientas.mjs";
import { DIMENSIONES } from "./guion.mjs";
import { CLIENTE, ESPERADO } from "./cliente-simulado.mjs";

const MODELO = "claude-opus-5";
const MAX_INTERCAMBIOS = 45;
const PRECIO = { entrada: 5, salida: 25, escritura_cache: 6.25, lectura_cache: 0.5 }; // USD por millón

const client = new Anthropic();
const uso = { entrevistador: vacio(), entrevistado: vacio() };
function vacio() { return { entrada: 0, salida: 0, escritura_cache: 0, lectura_cache: 0 }; }
function sumar(destino, u) {
  destino.entrada += u.input_tokens ?? 0;
  destino.salida += u.output_tokens ?? 0;
  destino.escritura_cache += u.cache_creation_input_tokens ?? 0;
  destino.lectura_cache += u.cache_read_input_tokens ?? 0;
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
Si te dicen que no saben, no insistas: marcalo indeterminado anotando qué rol
sabría, y seguí.

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
Un incidente en curso, un acceso activo de alguien que ya no trabaja ahí, algo
ilegal: escalalo y decilo sin alarmar.

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

const sistema = [
  { type: "text", text: CONDUCTA },
  { type: "text", text: GUION },
  { type: "text", text: `FICHA DE CONTEXTO DEL CLIENTE\n\n${CLIENTE.ficha}`, cache_control: { type: "ephemeral" } },
];

// ---------- El bucle ----------
const estado = crearEstado({
  nombresPropios: CLIENTE.nombresPropios,
  inventarioIncompleto: CLIENTE.inventarioIncompleto,
});
const transcripto = [];
let msgsEntrevistador = [{ role: "user", content: "[La persona abrió el enlace y está esperando. Saludala y arrancá.]" }];
let msgsEntrevistado = [];

const textoDe = (content) => content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();

for (let i = 0; i < MAX_INTERCAMBIOS && !estado.cerrada; i++) {
  // --- turno del entrevistador: puede llamar herramientas varias veces ---
  let dicho = [];
  for (let paso = 0; paso < 12; paso++) {
    const r = await client.messages.create({
      model: MODELO,
      max_tokens: 8000,
      system: sistema,
      messages: msgsEntrevistador,
      tools: HERRAMIENTAS,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
    });
    sumar(uso.entrevistador, r.usage);
    const t = textoDe(r.content);
    if (t) dicho.push(t);
    msgsEntrevistador.push({ role: "assistant", content: r.content });

    if (r.stop_reason !== "tool_use") break;

    const llamadas = r.content.filter((b) => b.type === "tool_use");
    const resultados = llamadas.map((c) => {
      const res = ejecutar(estado, c.name, c.input ?? {});
      transcripto.push({ tipo: "herramienta", nombre: c.name, args: c.input, resultado: res });
      return { type: "tool_result", tool_use_id: c.id, content: JSON.stringify(res), is_error: !!res.error };
    });
    msgsEntrevistador.push({ role: "user", content: resultados });
  }

  const mensaje = dicho.join("\n\n").trim();
  if (estado.cerrada && !mensaje) break;
  if (!mensaje) { console.error("El entrevistador no dijo nada. Corto."); break; }

  transcripto.push({ tipo: "agente", texto: mensaje });
  process.stdout.write(`\n\x1b[36mAGENTE\x1b[0m  ${mensaje}\n`);
  if (estado.cerrada) break;

  // --- turno del entrevistado ---
  msgsEntrevistado.push({ role: "user", content: mensaje });
  const r2 = await client.messages.create({
    model: MODELO,
    max_tokens: 2000,
    system: [{ type: "text", text: CLIENTE.persona, cache_control: { type: "ephemeral" } }],
    messages: msgsEntrevistado,
    output_config: { effort: "low" },
  });
  sumar(uso.entrevistado, r2.usage);
  const respuesta = textoDe(r2.content);
  msgsEntrevistado.push({ role: "assistant", content: r2.content });
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
  esperado: ESPERADO[d.id], evidencia: d.evidencia,
}));
writeFileSync(ruta("registros.json"), JSON.stringify({ registros, escalamientos: estado.escalamientos, cerrada: estado.cerrada }, null, 2));

const total = costo(uso.entrevistador) + costo(uso.entrevistado);
writeFileSync(ruta("uso.json"), JSON.stringify({ uso, costo_usd: { entrevistador: costo(uso.entrevistador), entrevistado: costo(uso.entrevistado), total } }, null, 2));

console.log("\n\n─────────────── RESULTADO ───────────────");
console.log(`Participación cerrada: ${estado.cerrada ? "sí" : "NO — se agotaron los intercambios"}`);
console.table(registros.map((r) => ({ tema: r.id, nivel: r.nivel ?? "indet.", esperado: r.esperado, evidencia: r.estado_evidencia ?? "-" })));
if (estado.escalamientos.length) console.log("Escalamientos:", estado.escalamientos);
else console.log("Escalamientos: ninguno  ← esperábamos uno (VPN del proveedor viejo)");
console.log(`\nCosto de esta corrida: USD ${total.toFixed(3)}`);
console.log("Archivos en salida/: transcripto.md, registros.json, uso.json");
