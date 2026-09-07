// Etapa 1 del entregable: armado. Sin modelo.
//
// Entra el registro de una participación y sale informe.json, con todo lo que
// es aritmética y ordenamiento ya resuelto: niveles por función, brechas,
// prioridad, datos de cada gráfico, y las listas que alimentan cada sección.
//
// Por qué sin modelo: puntuar lo mismo tres veces cambia el resultado en uno de
// cada cinco temas. Si los promedios y el orden de prioridad pasaran por un
// modelo, el mismo registro daría dos informes distintos. Acá el mismo insumo da
// siempre el mismo resultado, y cada número tiene un camino de vuelta hasta una
// cita.
//
//   node armar-informe.mjs salida/registros-E1.json chico
//
// La etapa 2 —la redacción— recibe este archivo y sólo escribe prosa. No ve el
// transcripto, así que no puede sacar una cita que acá se marcó como no
// entregable.

import { readFileSync, writeFileSync } from "node:fs";
import { DIMENSIONES } from "./guion.mjs";

const [archivo, casoArg] = process.argv.slice(2);
if (!archivo) {
  console.error("Uso: node armar-informe.mjs <registros.json> [chico|maduro]");
  process.exit(1);
}
const CASO = casoArg ?? "chico";
const { CLIENTE } = await import(CASO === "maduro" ? "./cliente-maduro.mjs" : "./cliente-simulado.mjs");

// La posición deseada. Debería acordarse con el cliente antes de entrevistar y
// vivir en la ficha de contexto; hasta que eso exista, 3 para todo, que es la
// meta realista que fija docs/assessments-madurez.md para PyMEs de la región.
const META_POR_DEFECTO = 3;
// La escala llega a 5 y el informe la muestra entera: el cliente tiene que ver
// dónde está contra el máximo, no sólo contra su meta. La brecha, en cambio, se
// calcula siempre contra la meta: es lo que se va a trabajar.
const ESCALA_MAXIMA = 5;
const metaDe = (id) => CLIENTE.metas?.[id] ?? META_POR_DEFECTO;

const FUNCIONES = [
  { id: "GV", nombre: "Gobernar" },
  { id: "ID", nombre: "Identificar" },
  { id: "PR", nombre: "Proteger" },
  { id: "DE", nombre: "Detectar" },
  { id: "RS", nombre: "Responder" },
  { id: "RC", nombre: "Recuperar" },
];

const promedio = (xs) => (xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2)) : null);

const registro = JSON.parse(readFileSync(archivo, "utf8"));
const porId = new Map(registro.registros.map((r) => [r.id, r]));

// ---------- Dimensiones ----------
const dimensiones = DIMENSIONES.map((d) => {
  const r = porId.get(d.id) ?? {};
  const meta = metaDe(d.id);
  const nivel = typeof r.nivel === "number" ? r.nivel : null;

  // La regla de la cita se resuelve acá, una sola vez. Si no es entregable, lo
  // que sale es el parafraseo y el textual no cruza a la etapa 2.
  const cita = r.cita_entregable === false ? r.parafraseo : r.cita_textual;

  return {
    id: d.id,
    nombre: d.nombre,
    funcion: d.id.slice(0, 2),
    mide: d.mide,
    estado: r.estado ?? "sin_tocar",
    nivel,
    meta,
    brecha: nivel === null ? null : Number((meta - nivel).toFixed(2)),
    ancla_actual: nivel === null ? null : d.anclajes[nivel],
    ancla_meta: d.anclajes[meta],
    // La banda es el rango que dieron las lecturas. Cuando las tres coinciden es
    // un punto; cuando no, es lo que el informe muestra como incertidumbre en
    // vez de afirmar un número que no está firme.
    lecturas: r.lecturas ?? null,
    acuerdo: r.acuerdo ?? null,
    banda: r.lecturas ? [Math.min(...r.lecturas), Math.max(...r.lecturas)] : null,
    firme: r.dispersion === 0,
    hallazgo: r.hallazgo ?? null,
    cita: cita ?? null,
    rol_fuente: r.rol_fuente ?? null,
    esfuerzo: r.esfuerzo ?? null,
    derivacion: r.derivacion ?? null,
    motivo_indeterminado: r.motivo_indeterminado ?? null,
    rol_que_sabria: r.rol_que_sabria ?? null,
  };
});

// ---------- Funciones ----------
// Se promedia dentro de cada función y después entre funciones. Promediar las 22
// dimensiones de una haría pesar a GOBERNAR el triple que a RECUPERAR, que tiene
// seis categorías contra dos.
const funciones = FUNCIONES.map((f) => {
  const suyas = dimensiones.filter((d) => d.funcion === f.id);
  const conNivel = suyas.filter((d) => d.nivel !== null);
  const nivel = promedio(conNivel.map((d) => d.nivel));
  const meta = promedio(suyas.map((d) => d.meta));
  return {
    ...f,
    categorias: suyas.length,
    puntuadas: conNivel.length,
    nivel,
    meta,
    brecha: nivel === null ? null : Number((meta - nivel).toFixed(2)),
  };
});

const conNivelGeneral = funciones.filter((f) => f.nivel !== null);
const nivelGeneral = promedio(conNivelGeneral.map((f) => f.nivel));
const metaGeneral = promedio(conNivelGeneral.map((f) => f.meta));

// ---------- Prioridad ----------
// Primero la brecha, que es lo que pidió el cliente: los puntos más bajos.
// Desempata que el tema tenga una acción inmediata asociada, y después el
// esfuerzo, porque a igual brecha conviene empezar por lo que se mueve solo.
const pesoEsfuerzo = { bajo: 0, medio: 1, alto: 2 };
const brechaPriorizada = dimensiones
  .filter((d) => d.brecha !== null && d.brecha > 0)
  .sort((a, b) => b.brecha - a.brecha || pesoEsfuerzo[a.esfuerzo] - pesoEsfuerzo[b.esfuerzo] || a.id.localeCompare(b.id));

// ---------- Proyectos ----------
// No hay catálogo todavía: los proyectos son a medida para cubrir la brecha de
// cada cliente. Lo que sale de acá es el esqueleto de cada uno —qué dimensión
// mueve, de qué nivel a cuál, con qué hallazgo— para que la etapa 2 lo redacte
// como propuesta y el consultor lo trabaje en el taller. No es una
// recomendación cerrada.
const proyectosCandidatos = brechaPriorizada.slice(0, 5).map((d, i) => ({
  orden: i + 1,
  mueve: d.id,
  nombre_tentativo: `${d.nombre}: de ${d.nivel} a ${d.meta}`,
  desde: d.ancla_actual,
  hasta: d.ancla_meta,
  hallazgo: d.hallazgo,
  esfuerzo: d.esfuerzo,
}));


// ---------- Los Tiers del marco ----------
// CSF 2.0 define cuatro Tiers —Parcial, Informado por riesgo, Repetible,
// Adaptativo— que caracterizan el rigor del enfoque de la organización. Son uno
// para toda la empresa, con dos columnas: gobernanza (GOVERN) y gestión (las
// otras cinco funciones). El marco NO define cómo derivarlos de un puntaje: la
// equivalencia contra la escala 0-5 la define R² y el informe lo dice.
const TIERS = [
  { n: 1, nombre: "Parcial", hasta: 1.5 },
  { n: 2, nombre: "Informado por riesgo", hasta: 2.5 },
  { n: 3, nombre: "Repetible", hasta: 3.5 },
  { n: 4, nombre: "Adaptativo", hasta: Infinity },
];
const tierDe = (x) => (x === null ? null : TIERS.find((t) => x < t.hasta));
const nivelGobernanza = funciones.find((f) => f.id === "GV")?.nivel ?? null;
const nivelGestion = promedio(
  funciones.filter((f) => f.id !== "GV" && f.nivel !== null).map((f) => f.nivel),
);
const tiers = {
  gobernanza: { nivel: nivelGobernanza, ...(tierDe(nivelGobernanza) ?? {}) },
  gestion: { nivel: nivelGestion, ...(tierDe(nivelGestion) ?? {}) },
  equivalencia_definida_por: "R² Tech Partner, no por el marco",
};

// ---------- Glosario ----------
// Las siglas del informe salen del marco y no se explican solas. Va completo:
// también los temas que no se pudieron puntuar.
const glosario = DIMENSIONES.map((d) => ({
  id: d.id,
  funcion: FUNCIONES.find((f) => f.id === d.id.slice(0, 2))?.nombre,
  nombre: d.nombre,
  mide: d.mide,
}));

// ---------- Ranuras de proyecto ----------
// Una por dimensión con brecha. La etapa de redacción llena cada una con dos o
// tres propuestas; acá sólo se declara qué habría que mover y desde dónde.
const ranurasDeProyecto = dimensiones
  .filter((d) => d.brecha !== null && d.brecha > 0)
  .map((d) => ({
    dimension: d.id,
    nombre: d.nombre,
    nivel: d.nivel,
    meta: d.meta,
    desde: d.ancla_actual,
    hasta: d.ancla_meta,
    hallazgo: d.hallazgo,
  }));

// ---------- El armado ----------
const informe = {
  cliente: {
    empresa: CLIENTE.empresa,
    fecha: new Date().toISOString().slice(0, 10),
    marco: "NIST CSF 2.0",
    escala: "0 a 5, propia y normalizada",
    escala_maxima: ESCALA_MAXIMA,
    origen: archivo,
  },
  alcance: {
    dimensiones: dimensiones.length,
    puntuadas: dimensiones.filter((d) => d.nivel !== null).length,
    derivadas: dimensiones.filter((d) => d.estado === "derivado").length,
    indeterminadas: dimensiones.filter((d) => d.estado === "cerrado" && d.nivel === null).length,
    participacion_cerrada: registro.participacion_cerrada ?? null,
    evaluacion_completa: registro.evaluacion_completa ?? null,
  },
  resumen: {
    nivel_general: nivelGeneral,
    meta_general: metaGeneral,
    brecha_general: nivelGeneral === null ? null : Number((metaGeneral - nivelGeneral).toFixed(2)),
    temas_no_firmes: dimensiones.filter((d) => d.nivel !== null && !d.firme).map((d) => d.id),
  },
  funciones,
  dimensiones,
  acciones_inmediatas: registro.escalamientos ?? [],
  brecha_priorizada: brechaPriorizada.map((d) => ({
    id: d.id, nombre: d.nombre, nivel: d.nivel, meta: d.meta, brecha: d.brecha, esfuerzo: d.esfuerzo, firme: d.firme,
  })),
  proyectos_candidatos: proyectosCandidatos,
  ranuras_de_proyecto: ranurasDeProyecto,
  glosario,
  tiers,
  evidencia_para_validar: registro.registros.flatMap((r) =>
    (r.evidencia_para_validar ?? []).map((e) => ({ dimension: r.id, que: e.que, por_que: e.por_que })),
  ),
  no_evaluado: {
    derivados: dimensiones.filter((d) => d.estado === "derivado").map((d) => ({
      id: d.id, nombre: d.nombre, rol_que_sabe: d.derivacion?.rol_que_sabe, que_falta: d.derivacion?.que_falta,
    })),
    indeterminados: dimensiones.filter((d) => d.estado === "cerrado" && d.nivel === null).map((d) => ({
      id: d.id, nombre: d.nombre, motivo: d.motivo_indeterminado, rol_que_sabria: d.rol_que_sabria,
    })),
  },
  graficos: {
    estrella: funciones.map((f) => ({ eje: f.nombre, nivel: f.nivel, meta: f.meta, maximo: ESCALA_MAXIMA })),
    // Tres tramos: lo que hay, lo que falta para la meta, y lo que queda hasta
    // el máximo de la escala. El tercero es contexto, no objetivo.
    barras: brechaPriorizada.map((d) => ({
      etiqueta: `${d.id} ${d.nombre}`,
      nivel: d.nivel,
      hasta_la_meta: d.brecha,
      resto_hasta_el_maximo: Number((ESCALA_MAXIMA - d.meta).toFixed(2)),
      meta: d.meta,
    })),
    sliders: dimensiones
      .filter((d) => d.nivel !== null)
      .map((d) => ({ etiqueta: d.id, nivel: d.nivel, meta: d.meta, banda: d.banda, firme: d.firme })),
  },
};

const destino = archivo.replace(/registros-?/, "informe-").replace(/\.json$/, ".json");
writeFileSync(destino, JSON.stringify(informe, null, 2));

// ---------- Qué salió ----------
console.log(`${CLIENTE.empresa} · ${informe.cliente.marco} · ${informe.cliente.fecha}`);
console.log(`Nivel general ${informe.resumen.nivel_general} · meta ${informe.resumen.meta_general} · brecha ${informe.resumen.brecha_general}\n`);
console.table(funciones.map((f) => ({ función: f.nombre, nivel: f.nivel ?? "-", meta: f.meta, brecha: f.brecha ?? "-", puntuadas: `${f.puntuadas}/${f.categorias}` })));
console.log(`\nAcciones inmediatas: ${informe.acciones_inmediatas.length}`);
for (const a of informe.acciones_inmediatas) console.log(`  ⚠ ${a.urgencia.toUpperCase()} — ${a.motivo.slice(0, 110)}`);
console.log(`\nPrimeros proyectos por brecha:`);
for (const p of proyectosCandidatos) console.log(`  ${p.orden}. [${p.mueve}] ${p.nombre_tentativo} · esfuerzo ${p.esfuerzo}`);
console.log(`\nSin firmeza (el instrumento no coincidió consigo mismo): ${informe.resumen.temas_no_firmes.join(", ") || "ninguno"}`);
console.log(`No evaluado: ${informe.no_evaluado.derivados.length} derivado(s), ${informe.no_evaluado.indeterminados.length} indeterminado(s)`);
console.log(`Evidencia para validar: ${informe.evidencia_para_validar.length}`);
console.log(`\nEscrito: ${destino}`);
