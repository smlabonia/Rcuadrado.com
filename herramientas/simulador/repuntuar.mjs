// Vuelve a puntuar un transcripto ya guardado, varias veces, sin repetir la
// entrevista.
//
// Para qué: cuando el puntaje de un tema cambia entre corridas, hay dos causas
// posibles y se confunden. O la conversación fue distinta —el entrevistador
// preguntó otra cosa— o el puntuador decide distinto sobre los mismos hechos.
// Repetir la entrevista mide las dos juntas y cuesta caro. Esto fija la
// conversación y mide sólo la segunda, por una fracción del precio.
//
//   node repuntuar.mjs salida/transcripto-S1.md 3 chico

import OpenAI from "openai";
import { readFileSync } from "node:fs";
import { DIMENSIONES } from "./guion.mjs";
import { puntuar } from "./puntuador.mjs";

const [archivo, pasadasArg, casoArg] = process.argv.slice(2);
if (!archivo) {
  console.error("Uso: node repuntuar.mjs <transcripto.md> [pasadas] [chico|maduro]");
  process.exit(1);
}
const PASADAS = Number(pasadasArg ?? 3);
const CASO = casoArg ?? "chico";
const MODELO = process.env.MODELO_LITELLM ?? "vertex_ai/claude-sonnet-5";

const { ESPERADO } = await import(
  CASO === "maduro" ? "./cliente-maduro.mjs" : "./cliente-simulado.mjs"
);

const BASE = (process.env.LITELLM_BASE_URL ?? "http://localhost:4000").replace(/\/+$/, "");
const client = new OpenAI({
  baseURL: BASE.endsWith("/v1") ? BASE : `${BASE}/v1`,
  apiKey: process.env.LITELLM_KEY,
});
const pedir = (params) => client.chat.completions.create(params);

// ---------- Leer el transcripto ----------
const md = readFileSync(archivo, "utf8");

// La conversación: los bloques de **Agente** y de la persona, sin las llamadas
// a herramientas, que es exactamente lo que ve el puntuador en una corrida real.
const conversacion = [];
let quien = null;
for (const linea of md.split("\n")) {
  const enc = linea.match(/^\*\*(.+?)\*\*\s*$/);
  if (enc) {
    quien = enc[1] === "Agente" ? "ENTREVISTADOR" : "PERSONA";
    continue;
  }
  if (linea.startsWith("> `") || linea.startsWith("#") || !quien) continue;
  if (linea.trim()) conversacion.push(`${quien}: ${linea.trim()}`);
}
const texto = conversacion.join("\n");

// El motivo con el que el entrevistador dio por cubierto cada tema, para que la
// repetición sea fiel a lo que pasó.
const motivos = {};
for (const m of md.matchAll(/cerrar_dimension\((\{.*?\})\)/g)) {
  try {
    const a = JSON.parse(m[1]);
    if (a.dimension_id) motivos[a.dimension_id] = a.por_que_alcanza ?? "";
  } catch {
    /* línea rota, se ignora */
  }
}

const cubiertas = DIMENSIONES.filter((d) => d.id in motivos);
console.log(
  `${archivo} · ${conversacion.length} líneas de conversación · ` +
    `${cubiertas.length} temas cubiertos · ${PASADAS} pasadas · caso ${CASO}\n`,
);

// ---------- Repuntuar ----------
const resultados = new Map();
let entrada = 0;
let salida = 0;

for (const dim of cubiertas) {
  const niveles = [];
  for (let i = 0; i < PASADAS; i++) {
    // Una de cada quince respuestas vuelve sin JSON parseable. Se reintenta una
    // vez antes de darla por perdida, para no confundir un fallo de formato con
    // un puntaje que se mueve.
    let nivel = null;
    for (let intento = 0; intento < 2 && nivel === null; intento++) {
      const { puntaje, usage } = await puntuar({
        pedir,
        modelo: MODELO,
        extra: { cache: { "no-cache": true } },
        dim,
        conversacion: texto,
        porQueAlcanza: motivos[dim.id],
        aviso: intento ? "no devolviste un objeto JSON válido" : undefined,
      });
      entrada += usage?.prompt_tokens ?? 0;
      salida += usage?.completion_tokens ?? 0;
      nivel = puntaje?.nivel ?? null;
    }
    niveles.push(nivel);
  }
  resultados.set(dim.id, niveles);
  const unico = new Set(niveles).size === 1;
  const esperado = ESPERADO[dim.id];
  process.stdout.write(
    `${dim.id.padEnd(7)} ${niveles.join(" ").padEnd(3 * PASADAS)} ` +
      `esperado ${esperado ?? "ind"}  ${unico ? "" : "← se mueve"}\n`,
  );
}

// ---------- Resumen ----------
const movidos = [...resultados.entries()].filter(([, n]) => new Set(n).size > 1);
const aciertaSiempre = [...resultados.entries()].filter(
  ([id, n]) => new Set(n).size === 1 && n[0] === ESPERADO[id],
);
console.log(`\nEstables: ${resultados.size - movidos.length}/${resultados.size}`);
console.log(`Estables y en el esperado: ${aciertaSiempre.length}/${resultados.size}`);
if (movidos.length) console.log("Se mueven:", movidos.map(([id, n]) => `${id} (${n.join("/")})`).join(", "));
console.log(`Tokens: ${entrada} de entrada, ${salida} de salida`);
console.log(`Costo estimado: USD ${((entrada * 2 + salida * 10) / 1e6).toFixed(3)}`);
