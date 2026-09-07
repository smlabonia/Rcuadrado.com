// Etapa 2 del entregable: redacción. Acá sí hay modelo, y sólo escribe prosa.
//
//   node redactar.mjs salida/informe-E1.json
//
// Recibe informe.json y devuelve informe-borrador.md, que es el prearmado sobre
// el que trabaja el consultor. Tres restricciones lo hacen seguro:
//
//   - No ve el transcripto. Sólo el informe ya armado. Así no puede sacar una
//     cita que la etapa 1 marcó como no entregable.
//   - No calcula. Los números le llegan hechos y los tiene que repetir. Al
//     final se verifica que cada cifra del texto exista en el informe.
//   - No inventa proyectos. Redacta los que la brecha ya seleccionó.
//
// El documento lo arma este script; el modelo sólo rellena las partes de prosa.
// Si el modelo falla, el borrador sale igual, con los huecos marcados.

import OpenAI from "openai";
import { readFileSync, writeFileSync } from "node:fs";

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: node redactar.mjs <informe.json>");
  process.exit(1);
}
const inf = JSON.parse(readFileSync(archivo, "utf8"));

const MODELO = process.env.MODELO_LITELLM ?? "vertex_ai/claude-sonnet-5";
const BASE = (process.env.LITELLM_BASE_URL ?? "http://localhost:4000").replace(/\/+$/, "");
const client = new OpenAI({
  baseURL: BASE.endsWith("/v1") ? BASE : `${BASE}/v1`,
  apiKey: process.env.LITELLM_KEY,
});

const NOMBRE_FUNCION = { GV: "Gobernar", ID: "Identificar", PR: "Proteger", DE: "Detectar", RS: "Responder", RC: "Recuperar" };

// ---------- La prosa ----------
const REDACTOR = `
Escribís el borrador de un informe de diagnóstico de ciberseguridad para R² Tech
Partner. Lo recibe el dueño o gerente general de una PyME industrial, que no es
técnico, y después lo revisa un consultor que lo corrige antes de entregarlo.

CÓMO ESCRIBÍS
Sobre la práctica, nunca sobre la persona. "No hay nadie con responsabilidad
asignada sobre los respaldos", no "el encargado no se ocupa".
Sin adjetivos de catástrofe. Los hechos asustan solos, y el miedo inflado es
otra forma de mentirle al cliente.
Roles, nunca nombres propios.
Frases cortas, voseo, trato llano. Nada de jerga técnica ni de palabras de
manual. Nada de "sinergia", "robustecer", "apalancar".
Nunca el número solo: siempre el número y la meta juntos. "Está en 1, la meta es
3." El número aislado invita a discutir el número; al lado de la meta, la
conversación se va a la brecha.

QUÉ NO HACÉS
No inventás datos, ni cifras, ni hallazgos. Todo lo que digas tiene que estar en
el informe que te paso.
No propones proyectos que no estén en la lista. Los que están, los redactás.
No adelantás conclusiones sobre lo que no se midió.
No uses las palabras madurez, puntaje, evaluación ni el nombre del estándar en
el cuerpo del texto: eso ya está en la sección del marco.

QUÉ DEVOLVÉS
Sólo un objeto JSON, sin texto alrededor, con estas claves:

  "frase_estado": una sola oración que ubique a la empresa. Dónde está, contra
    qué meta, y qué tipo de organización es eso. Máximo 40 palabras.
  "resumen_ejecutivo": dos o tres párrafos cortos para la primera página. Qué se
    encontró, qué es lo que más urge y qué pasa si no se hace nada. No repitas
    la lista de acciones inmediatas: van aparte, abajo.
  "narrativa": un objeto con una clave por función —GV, ID, PR, DE, RS, RC— y un
    párrafo corto en cada una, que explique qué se vio en esa función y por qué
    quedó donde quedó. Apoyate en los hallazgos que te paso.
  "proyectos": una lista, en el mismo orden que te llega, con { "orden",
    "nombre", "descripcion" }. El nombre es corto y en infinitivo: "Ordenar los
    accesos de terceros". La descripción son dos o tres oraciones: qué resuelve,
    qué haría falta, y en qué cambia la situación. Marcalo como propuesta para
    conversar, no como una indicación.
`.trim();

async function escribir() {
  const r = await client.chat.completions.create({
    model: MODELO,
    max_tokens: 12000,
    messages: [
      { role: "system", content: REDACTOR },
      { role: "user", content: `EL INFORME ARMADO\n\n${JSON.stringify(inf, null, 1)}` },
    ],
    cache: { "no-cache": true },
  });
  const t = (r.choices[0].message.content ?? "").trim();
  const crudo = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  // El borrador tiene que salir aunque la redacción falle: los huecos quedan
  // marcados y el consultor los completa. No se cae la etapa entera por esto.
  for (const intento of [crudo, crudo.match(/\{[\s\S]*\}/)?.[0]]) {
    if (!intento) continue;
    try {
      return { texto: JSON.parse(intento), usage: r.usage };
    } catch { /* probamos el siguiente */ }
  }
  console.error(`⚠ La redacción no devolvió JSON válido (${crudo.length} caracteres, stop: ${r.choices[0].finish_reason}).`);
  return { texto: null, usage: r.usage };
}

let { texto, usage } = await escribir();
// El modelo escribe 1.99 y las tablas dicen 1,99. Se unifica en coma, que es lo
// que corresponde en español y evita que el mismo número aparezca de dos formas.
const aComa = (x) => (typeof x === "string" ? x.replace(/(\d),?(\d)*\.(\d)/g, (m) => m.replace(".", ",")) : x);
if (texto) {
  texto.frase_estado = aComa(texto.frase_estado);
  texto.resumen_ejecutivo = aComa(texto.resumen_ejecutivo);
  for (const k of Object.keys(texto.narrativa ?? {})) texto.narrativa[k] = aComa(texto.narrativa[k]);
  for (const pr of texto.proyectos ?? []) pr.descripcion = aComa(pr.descripcion);
}
const falta = "*(la redacción falló para esta sección; completar a mano)*";

// ---------- El documento ----------
const n = (x) => (x === null || x === undefined ? "—" : String(x).replace(".", ","));
const md = [];
const p = (...ls) => md.push(...ls, "");

p(`# Diagnóstico de ciberseguridad — ${inf.cliente.empresa}`);
p(`**Borrador automático.** Primera versión para revisión y corrección del consultor. Ninguna sección está lista para entregar sin leerla.`);
p(`Fecha: ${inf.cliente.fecha} · Marco: ${inf.cliente.marco} · Escala: ${inf.cliente.escala} · Origen: \`${inf.cliente.origen}\``);

p("---", "");
p("## Resumen ejecutivo");
p(texto?.frase_estado ? `**${texto.frase_estado}**` : falta);
p(texto?.resumen_ejecutivo ?? falta);

p("### El marco");
p(
  `Se usó **NIST CSF 2.0**, el marco de ciberseguridad del instituto de estándares del gobierno de Estados Unidos. Es de dominio público y es la referencia más usada del mundo para ordenar este tema.`,
  `Tiene seis funciones —gobernar, identificar, proteger, detectar, responder y recuperar— divididas en veintidós categorías. Se relevaron las veintidós.`,
  `La escala 0 a 5 es propia y normalizada, para que el resultado sea comparable contra los otros diagnósticos de R². La meta de referencia es 3: significa que la práctica está escrita, se cumple y se revisa. No es 5, y no debería serlo.`,
);

p("### Dónde está hoy");
md.push(`| Función | Hoy | Meta | Brecha |`, `|---|---|---|---|`);
for (const f of inf.funciones) md.push(`| ${f.nombre} | ${n(f.nivel)} | ${n(f.meta)} | ${n(f.brecha)} |`);
md.push("", `**General: ${n(inf.resumen.nivel_general)} sobre una meta de ${n(inf.resumen.meta_general)}.**`, "");

if (inf.acciones_inmediatas.length) {
  p("### Acciones inmediatas");
  p("Esto no espera al plan de trabajo ni al taller.");
  for (const a of inf.acciones_inmediatas) md.push(`- **${a.urgencia.toUpperCase()}** — ${a.motivo}`);
  md.push("");
}

if (inf.proyectos_candidatos.length) {
  p("### Los primeros proyectos");
  p("*Propuestas para conversar en el taller, no indicaciones. Se ordenan por brecha.*");
  for (const pr of inf.proyectos_candidatos) {
    const red = texto?.proyectos?.find((x) => x.orden === pr.orden);
    const dim = inf.dimensiones.find((x) => x.id === pr.mueve);
    md.push(
      `**${pr.orden}. ${red?.nombre ?? pr.nombre_tentativo}** · mueve ${pr.mueve} ` +
        `de ${n(dim?.nivel)} a ${n(dim?.meta)} · esfuerzo ${pr.esfuerzo ?? "—"}`,
    );
    md.push("", red?.descripcion ?? falta, "");
    md.push(`> Hoy: ${pr.desde}`, `> Meta: ${pr.hasta}`, "");
  }
}

p("---", "");
p("## Cómo leer esto");
p(
  `Cada tema se ubica en una escala de 0 a 5. **0** es que nunca se lo plantearon; **1**, que alguien lo resuelve por reflejo; **2**, que hay una costumbre que funciona pero no está escrita; **3**, que está escrito, se cumple y se revisó hace poco; **4** y **5**, que además se mide y se corrige solo.`,
  `La meta para una empresa de este tamaño es 3. Llegar a 4 o 5 tiene sentido en lo que sostiene el negocio, no en todo.`,
  `Los niveles salen de lo que se conversó en la entrevista y se toman como válidos. Este diagnóstico no audita ni verifica documentos: al final está la lista de lo que se podría pedir si en algún momento se quisiera comprobar.`,
);
if (inf.resumen.temas_no_firmes.length) {
  p(
    `En ${inf.resumen.temas_no_firmes.length} tema(s) el instrumento no coincidió consigo mismo al releer la conversación: ${inf.resumen.temas_no_firmes.join(", ")}. Van marcados con **~** y conviene conversarlos antes de darlos por firmes.`,
  );
}

p("---", "");
p("## La brecha, ordenada");
md.push(`| # | Tema | Hoy | Meta | Brecha | Esfuerzo |`, `|---|---|---|---|---|---|`);
inf.brecha_priorizada.forEach((d, i) =>
  md.push(`| ${i + 1} | ${d.id} ${d.nombre}${d.firme ? "" : " ~"} | ${n(d.nivel)} | ${n(d.meta)} | ${n(d.brecha)} | ${d.esfuerzo ?? "—"} |`),
);
md.push("");

p("---", "");
p("## Hallazgos por función");
for (const f of inf.funciones) {
  p(`### ${f.nombre} — ${n(f.nivel)} sobre ${n(f.meta)}`);
  p(texto?.narrativa?.[f.id] ?? falta);
  for (const d of inf.dimensiones.filter((x) => x.funcion === f.id)) {
    if (d.estado === "derivado") {
      md.push(`**${d.nombre}** — pendiente de ${d.derivacion?.rol_que_sabe}. Falta: ${d.derivacion?.que_falta}`, "");
      continue;
    }
    if (d.nivel === null) {
      md.push(`**${d.nombre}** — no se pudo establecer. ${d.motivo_indeterminado ?? ""}`, "");
      continue;
    }
    md.push(`**${d.nombre} — ${n(d.nivel)} / meta ${n(d.meta)}${d.firme ? "" : "  ~"}**`, "");
    md.push(d.hallazgo ?? "", "");
    if (d.cita) md.push(`> «${d.cita}» — ${d.rol_fuente}`, "");
  }
}

p("---", "");
p("## Qué no se evaluó");
if (inf.no_evaluado.derivados.length) {
  p("**Pendiente de otra persona.** Estos temas los sabe otro rol y quedaron para una segunda conversación:");
  for (const d of inf.no_evaluado.derivados) md.push(`- **${d.nombre}** — ${d.rol_que_sabe}. ${d.que_falta}`);
  md.push("");
}
if (inf.no_evaluado.indeterminados.length) {
  p("**No se pudo establecer.**");
  for (const d of inf.no_evaluado.indeterminados) md.push(`- **${d.nombre}** — ${d.motivo}. Lo sabría: ${d.rol_que_sabria}`);
  md.push("");
}
if (!inf.no_evaluado.derivados.length && !inf.no_evaluado.indeterminados.length) p("Se cubrieron todos los temas del marco.");

p("---", "");
p("## Si alguna vez se quisiera validar");
if (inf.evidencia_para_validar.length) {
  p("Lo que sigue se tomó por declarado. No hace falta para este diagnóstico; queda anotado por si en algún momento se quiere comprobar.");
  for (const e of inf.evidencia_para_validar) md.push(`- **${e.dimension}** — ${e.que}`);
  md.push("");
} else {
  p("No quedó documentación anotada para validar.");
}

// ---------- Verificación ----------
// Que el modelo no haya inventado una cifra. Se extraen los números de la prosa
// y se comparan contra los que existen en el informe.
const prosa = [texto?.frase_estado, texto?.resumen_ejecutivo, ...Object.values(texto?.narrativa ?? {}), ...(texto?.proyectos ?? []).map((x) => x.descripcion)]
  .filter(Boolean)
  .join(" ");
// Se comparan como números, no como texto: da igual el separador decimal.
const comoNumero = (x) => Number(String(x).replace(",", "."));
const permitidos = new Set((JSON.stringify(inf).match(/-?\d+(?:\.\d+)?/g) ?? []).map(comoNumero));
for (const x of [0, 1, 2, 3, 4, 5, 6, 22]) permitidos.add(x); // la escala y el tamaño del marco
const inventados = [
  ...new Set((prosa.match(/\d+(?:[.,]\d+)?/g) ?? []).filter((x) => !permitidos.has(comoNumero(x)))),
];

const destino = archivo.replace(/informe-?/, "borrador-").replace(/\.json$/, ".md");
writeFileSync(destino, md.join("\n"));

console.log(`${inf.cliente.empresa} · ${md.join("\n").split(/\s+/).length} palabras`);
console.log(`Secciones sin redactar: ${md.join("\n").split(falta).length - 1}`);
console.log(inventados.length ? `⚠ Cifras en la prosa que no están en el informe: ${inventados.join(", ")}` : "Cifras verificadas: ninguna inventada");
console.log(`Tokens: ${usage?.prompt_tokens ?? 0} entrada, ${usage?.completion_tokens ?? 0} salida · USD ${(((usage?.prompt_tokens ?? 0) * 2 + (usage?.completion_tokens ?? 0) * 10) / 1e6).toFixed(3)}`);
console.log(`Escrito: ${destino}`);
