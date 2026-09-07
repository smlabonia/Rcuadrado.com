// Etapa 3 del entregable: la presentación de devolución.
//
//   node presentar.mjs salida/informe-E2.json
//
// Toma el informe armado y los textos redactados, y produce el .pptx con el que
// se hace la devolución al cliente. Sin modelo: acá ya no se decide nada, se
// maqueta lo que las etapas 1 y 2 dejaron resuelto.
//
// Los motivos de marca vienen de herramientas/marca/laminas.mjs. El criterio,
// de .claude/skills/presentaciones-r2/.

import pptxgen from "pptxgenjs";
import { readFileSync } from "node:fs";
import {
  C, F, W, H, M, SOMBRA, grilla, barra, tarjeta, etiqueta, encabezado, pie, separador, n,
} from "../marca/laminas.mjs";

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: node presentar.mjs <informe.json>");
  process.exit(1);
}
const inf = JSON.parse(readFileSync(archivo, "utf8"));
const txt = JSON.parse(readFileSync(archivo.replace(/informe-?/, "textos-"), "utf8"));

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "R² Tech Partner";
pres.company = "R² Tech Partner";
pres.title = `Diagnóstico de ciberseguridad — ${inf.cliente.empresa}`;

const DOC = "Devolución del diagnóstico";
let pagina = 0;
const lamina = () => pres.addSlide();
const conPie = (s) => pie(pres, s, ++pagina, DOC);

const dimsDe = (fid) => inf.dimensiones.filter((d) => d.funcion === fid);
const conNivel = (d) => d.nivel !== null && d.nivel !== undefined;

// La prioridad sale de la matriz: primero lo de mayor impacto, y a igual
// impacto lo de menor esfuerzo. Arriba queda lo que más cambia con menos.
const PESO_IMPACTO = { alto: 0, medio: 1, bajo: 2 };
const PESO_ESFUERZO = { bajo: 0, medio: 1, alto: 2 };
const porPrioridad = (a, b) =>
  (PESO_IMPACTO[a.impacto] ?? 1) - (PESO_IMPACTO[b.impacto] ?? 1) ||
  (PESO_ESFUERZO[a.esfuerzo] ?? 1) - (PESO_ESFUERZO[b.esfuerzo] ?? 1);

// ─────────── Portada ───────────
{
  const s = lamina();
  s.background = { color: C.ink2 };
  grilla(pres, s, true);
  s.addText("R²", { x: M, y: 0.6, w: 2, h: 1, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 54, color: C.paper, bold: true });
  s.addText("DIAGNÓSTICO DE\nCIBERSEGURIDAD", { x: M, y: 2.5, w: 9, h: 2, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 66, color: C.paper, bold: true, lineSpacing: 62 });
  s.addText(inf.cliente.empresa, { x: M, y: 4.6, w: 9, h: 0.5, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 20, color: C.onDarkMuted });
  barra(pres, s, M, 5.35, W - M * 2, { oscuro: true });
  etiqueta(s, `${inf.cliente.fecha} · ${inf.cliente.marco}`, M, 5.6, C.onDarkMuted, 10);
  s.addNotes("Devolución del diagnóstico. La conversación arranca por el resumen: el dueño necesita saber dónde está antes que cómo se midió.");
}

// ─────────── Agenda ───────────
{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "Contenido", "Agenda");
  const items = [
    ["01", "Dónde están hoy"],
    ["02", "Cómo se midió"],
    ["03", "El panorama"],
    ["04", "Hallazgos por función"],
    ["05", "Qué sigue"],
    ["06", "Qué no se evaluó"],
  ];
  items.forEach(([num, t], i) => {
    const x = M + (i % 3) * 4.03;
    const y = 2.1 + Math.floor(i / 3) * 2.0;
    tarjeta(pres, s, x, y, 3.75, 1.75);
    s.addText(num, { x: x + 0.3, y: y + 0.25, w: 1, h: 0.55, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 32, color: C.coralText, bold: true });
    s.addText(t, { x: x + 0.3, y: y + 0.9, w: 3.15, h: 0.7, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 15, color: C.ink, bold: true });
  });
  conPie(s);
}

// ─────────── Resumen ejecutivo en una lámina ───────────
// Todo lo que hay que saber, en una sola página. Si la reunión se corta acá o
// si esto es lo único que circula por mail, tiene que alcanzar.
{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "Resumen ejecutivo", "Todo en una página");

  // Bloque de cifras.
  const cifra = (x, w, et, val, sub, color = C.ink) => {
    tarjeta(pres, s, x, 1.95, w, 1.35);
    etiqueta(s, et, x + 0.25, 2.12, C.muted, 8, w - 0.5);
    s.addText(String(val), { x: x + 0.25, y: 2.35, w: w - 0.5, h: 0.65, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 40, color, bold: true });
    s.addText(sub, { x: x + 0.25, y: 2.95, w: w - 0.5, h: 0.28, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 10, color: C.muted });
  };
  cifra(M, 2.6, "Nivel general", n(inf.resumen.nivel_general), `meta ${n(inf.resumen.meta_general)} de ${inf.cliente.escala_maxima}${inf.tiers?.gestion?.n ? ` · Tier ${inf.tiers.gestion.n} del marco` : ""}`);
  cifra(M + 2.75, 2.6, "Temas relevados", `${inf.alcance.puntuadas}/${inf.alcance.dimensiones}`, `${inf.alcance.derivadas} derivado(s), ${inf.alcance.indeterminadas} sin establecer`);
  cifra(M + 5.5, 2.6, "No espera", inf.acciones_inmediatas.length, "acción inmediata", C.coralText);
  cifra(M + 8.25, 2.83, "Propuestas", (txt.proyectos ?? []).length, "para el taller");
  if (inf.tiers?.gestion?.n) {
    s.addText(`Tier ${inf.tiers.gestion.n} del marco — ${inf.tiers.gestion.nombre}`, { x: M + 8.5, y: 2.62, w: 2.4, h: 0.26, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 8, color: C.coralText, charSpacing: 1 });
  }

  // La frase de estado.
  s.addText(txt.frase_estado ?? "", { x: M, y: 3.5, w: 11.83, h: 0.85, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 15, color: C.ink, bold: true, lineSpacing: 21 });

  // Función por función, en una fila.
  etiqueta(s, "Función por función, hoy sobre la meta", M, 4.32, C.coralText, 9, 6);
  inf.funciones.forEach((f, i) => {
    const x = M + i * 1.98;
    s.addText(f.nombre, { x, y: 4.6, w: 1.85, h: 0.28, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 11, color: C.muted2 });
    s.addText(`${n(f.nivel)} / ${n(f.meta)}`, { x, y: 4.85, w: 1.85, h: 0.35, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 22, color: C.ink, bold: true });
    s.addShape(pres.ShapeType.rect, { x, y: 5.26, w: 1.7, h: 0.1, fill: { color: C.line } });
    s.addShape(pres.ShapeType.rect, { x, y: 5.26, w: 1.7 * Math.min(1, (f.nivel ?? 0) / inf.cliente.escala_maxima), h: 0.1, fill: { color: C.coral } });
    // marca de la meta sobre la escala completa
    s.addShape(pres.ShapeType.rect, { x: x + 1.7 * (f.meta / inf.cliente.escala_maxima), y: 5.21, w: 0.02, h: 0.2, fill: { color: C.ink } });
  });

  // Lo más urgente y lo primero a hacer.
  const top = [...(txt.proyectos ?? [])].sort(porPrioridad).slice(0, 3);
  etiqueta(s, "Por dónde se empieza", M, 5.62, C.coralText, 9, 6);
  top.forEach((pr, i) => {
    s.addText(`${i + 1}. ${pr.nombre}`, { x: M, y: 5.9 + i * 0.23, w: 7.2, h: 0.24, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 11, color: C.muted2 });
    s.addText(`${pr.dimension} · esfuerzo ${pr.esfuerzo} · impacto ${pr.impacto}`, { x: 8.2, y: 5.9 + i * 0.23, w: 4.4, h: 0.24, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 9, color: C.muted, charSpacing: 1 });
  });
  conPie(s);
  s.addNotes("Esta es la lámina que circula por mail si no circula nada más.");
}

// ─────────── 01 · Dónde están hoy ───────────
separador(pres, lamina(), "01", "Dónde están hoy", "El resultado en una página");

{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "01 · Dónde están hoy", "El resultado");
  // La frase de estado son cuatro líneas largas: sin alto propio se come el
  // párrafo de abajo.
  s.addText(txt.frase_estado ?? "", { x: M, y: 1.98, w: 7.4, h: 1.8, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 18, color: C.ink, bold: true, lineSpacing: 25 });
  const parrafos = (txt.resumen_ejecutivo ?? "").split(/\n\n+/).slice(0, 2).join("\n\n");
  s.addText(parrafos, { x: M, y: 3.88, w: 7.4, h: 2.0, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.muted, lineSpacing: 17 });

  tarjeta(pres, s, 8.65, 2.0, 3.95, 1.85);
  etiqueta(s, "Nivel general", 8.95, 2.22, C.muted, 9, 3.4);
  s.addText(n(inf.resumen.nivel_general), { x: 8.95, y: 2.5, w: 2.2, h: 1.0, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 68, color: C.ink, bold: true });
  s.addText(`sobre una meta de ${n(inf.resumen.meta_general)}`, { x: 8.95, y: 3.36, w: 3.4, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted });
  if (inf.tiers?.gestion?.n) {
    etiqueta(s, `Tier ${inf.tiers.gestion.n} del marco · ${inf.tiers.gestion.nombre}`, 8.95, 3.62, C.coralText, 8, 3.4);
  }

  tarjeta(pres, s, 8.65, 4.05, 3.95, 1.8);
  etiqueta(s, "Lo que no espera", 8.95, 4.27, C.coralText, 9, 3.4);
  s.addText(String(inf.acciones_inmediatas.length), { x: 8.95, y: 4.62, w: 1.2, h: 0.8, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 52, color: C.coralText, bold: true });
  s.addText(inf.acciones_inmediatas.length === 1 ? "acción inmediata, que se ve\nen la sección 05" : "acciones inmediatas, en la\nsección 05", { x: 10.0, y: 4.78, w: 2.45, h: 0.8, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.muted, lineSpacing: 16 });
  conPie(s);
  s.addNotes("Si la reunión se corta acá, esta lámina tiene que alcanzar. El número no va solo: va contra la meta.");
}

// ─────────── 02 · Cómo se midió ───────────
separador(pres, lamina(), "02", "Cómo se midió", "La escala, la meta y qué se tomó por declarado");

{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "02 · Cómo se midió", "La escala");
  const niveles = [
    ["0", "Nunca se lo plantearon"],
    ["1", "Alguien lo resuelve por reflejo, sin nada acordado"],
    ["2", "Hay una costumbre que funciona, pero no está escrita"],
    ["3", "Está escrito, se cumple y se revisó hace poco"],
    ["4", "Además se mide y las decisiones salen de esa medición"],
    ["5", "Se corrige solo, sin que nadie lo pida"],
  ];
  niveles.forEach(([num, desc], i) => {
    const y = 2.0 + i * 0.62;
    const meta = num === "3";
    s.addText(num, { x: M, y, w: 0.5, h: 0.45, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 30, color: meta ? C.coralText : C.line, bold: true });
    s.addText(desc, { x: M + 0.6, y: y + 0.08, w: 6.2, h: 0.4, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 14, color: meta ? C.ink : C.muted2, bold: meta });
  });
  s.addText("← la meta", { x: M + 6.9, y: 2.0 + 3 * 0.62 + 0.08, w: 1.3, h: 0.35, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 11, color: C.coralText, charSpacing: 1 });

  tarjeta(pres, s, 8.65, 2.0, 3.95, 3.85);
  etiqueta(s, "Tres cosas para tener presentes", 8.95, 2.25, C.coralText, 9, 3.5);
  s.addText(
    [
      { text: "La meta es 3, no 5. ", options: { bold: true, color: C.ink } },
      { text: "Llegar a 4 o 5 tiene sentido en lo que sostiene el negocio, no en todo.\n\n", options: { color: C.muted } },
      { text: "Se tomó lo declarado como válido. ", options: { bold: true, color: C.ink } },
      { text: "Esto no es una auditoría: no se verificaron documentos. Al final está la lista de lo que se podría pedir si en algún momento se quisiera comprobar.\n\n", options: { color: C.muted } },
      { text: "Los niveles salen de una conversación. ", options: { bold: true, color: C.ink } },
      { text: `En ${inf.resumen.temas_no_firmes.length} tema(s) el instrumento no coincidió consigo mismo al releerla: van marcados y conviene conversarlos.`, options: { color: C.muted } },
    ],
    { x: 8.95, y: 2.6, w: 3.4, h: 3.05, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, lineSpacing: 17 },
  );
  conPie(s);
}

// ─────────── El marco y el glosario ───────────
{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "02 · Cómo se midió", "El marco");
  s.addText(
    [
      { text: "NIST CSF 2.0", options: { bold: true, color: C.ink } },
      { text: " es el marco de ciberseguridad del Instituto Nacional de Estándares y Tecnología del gobierno de Estados Unidos. Es de dominio público, no hay que licenciarlo, y es la referencia más usada del mundo para ordenar este tema. La versión 2.0 es de 2024.", options: { color: C.muted2, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Se organiza en seis funciones y veintidós categorías. ", options: { bold: true, color: C.ink } },
      { text: "Las funciones son las seis preguntas grandes; las categorías, los temas concretos dentro de cada una. Se relevaron las veintidós: no es una muestra.", options: { color: C.muted2, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "El marco trae sus propios niveles, los Tiers: ", options: { bold: true, color: C.ink } },
      { text: "Parcial, Informado por riesgo, Repetible y Adaptativo. Describen qué tan riguroso es el enfoque de la organización, y son uno solo para toda la empresa, no uno por tema.", options: { color: C.muted2, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "La escala 0-5 por categoría es de R². ", options: { bold: true, color: C.ink } },
      { text: "El marco describe resultados a lograr, no puntajes por categoría. Los 0-5 los define R² para poder decir dónde está cada uno de los veintidós temas y comparar entre diagnósticos.", options: { color: C.muted2 } },
    ],
    { x: M, y: 2.0, w: 6.4, h: 3.6, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, lineSpacing: 19 },
  );

  const funcs = [
    ["GV", "Gobernar", "Quién responde, con qué reglas y con qué presupuesto"],
    ["ID", "Identificar", "Qué hay que proteger y qué puede salir mal"],
    ["PR", "Proteger", "Qué se hace para que no pase"],
    ["DE", "Detectar", "Cómo se enteran cuando pasa"],
    ["RS", "Responder", "Qué se hace mientras está pasando"],
    ["RC", "Recuperar", "Cómo se vuelve a trabajar"],
  ];
  tarjeta(pres, s, 7.15, 2.0, 5.45, 3.85);
  etiqueta(s, "Las seis funciones", 7.45, 2.2, C.coralText, 9, 4.9);
  funcs.forEach(([sigla, nombre, que], i) => {
    const y = 2.58 + i * 0.55;
    s.addText(sigla, { x: 7.45, y, w: 0.5, h: 0.28, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 11, color: C.coralText, bold: true, charSpacing: 1 });
    s.addText(nombre, { x: 8.0, y, w: 1.5, h: 0.28, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.ink, bold: true });
    s.addText(que, { x: 9.5, y: y + 0.02, w: 2.9, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 9.5, color: C.muted });
  });
  conPie(s);
}

// El glosario, en dos láminas de once.
for (const mitad of [0, 1]) {
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "02 · Cómo se midió", mitad === 0 ? "Los veintidós temas" : "Los veintidós temas (continúa)");
  const items = inf.glosario.slice(mitad * 11, mitad * 11 + 11);
  items.forEach((g, i) => {
    const y = 2.0 + i * 0.42;
    const d = inf.dimensiones.find((x) => x.id === g.id);
    s.addText(g.id, { x: M, y, w: 0.85, h: 0.3, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 10, color: C.coralText, bold: true, charSpacing: 1 });
    s.addText(g.nombre, { x: M + 0.95, y, w: 2.9, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 11.5, color: C.ink, bold: true });
    s.addText(g.mide, { x: M + 3.95, y: y + 0.01, w: 7.0, h: 0.32, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 10, color: C.muted });
    const nivel = d && d.nivel !== null ? `${n(d.nivel)}/${n(d.meta)}` : d?.estado === "derivado" ? "pend." : "—";
    s.addText(nivel, { x: 11.9, y, w: 0.7, h: 0.3, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 10, color: C.muted2, align: "right" });
  });
  conPie(s);
}

// ─────────── 03 · El panorama ───────────
separador(pres, lamina(), "03", "El panorama", `Las seis funciones de ${inf.cliente.marco}`);

{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "03 · El panorama", "Las seis funciones");
  const etiquetas = inf.funciones.map((f) => f.nombre);
  s.addChart(
    pres.ChartType.radar,
    [
      { name: "Hoy", labels: etiquetas, values: inf.funciones.map((f) => f.nivel ?? 0) },
      { name: "Meta", labels: etiquetas, values: inf.funciones.map((f) => f.meta) },
    ],
    {
      x: 0.6, y: 1.95, w: 6.4, h: 4.2,
      radarStyle: "marker",
      chartColors: [C.coral, C.ink],
      catAxisLabelColor: C.muted2, catAxisLabelFontFace: F.sans, catAxisLabelFontSize: 12,
      valAxisLabelColor: C.muted, valAxisLabelFontFace: F.mono, valAxisLabelFontSize: 9,
      valAxisMaxVal: 5, valAxisMinVal: 0, valAxisMajorUnit: 1,
      showLegend: true, legendPos: "b", legendColor: C.muted2, legendFontFace: F.sans, legendFontSize: 11,
    },
  );
  tarjeta(pres, s, 7.3, 1.95, 5.3, 4.2);
  etiqueta(s, "Función por función", 7.6, 2.18, C.coralText, 9, 4.7);
  inf.funciones.forEach((f, i) => {
    const y = 2.55 + i * 0.58;
    s.addText(f.nombre, { x: 7.6, y, w: 2.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.ink });
    s.addText(`${n(f.nivel)} / ${n(f.meta)}`, { x: 10.1, y, w: 1.0, h: 0.3, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 13, color: C.muted2, align: "right" });
    // barrita de avance hacia la meta
    const ancho = 1.1;
    s.addShape(pres.ShapeType.rect, { x: 11.3, y: y + 0.09, w: ancho, h: 0.11, fill: { color: C.line } });
    s.addShape(pres.ShapeType.rect, { x: 11.3, y: y + 0.09, w: ancho * Math.min(1, (f.nivel ?? 0) / f.meta), h: 0.11, fill: { color: C.coral } });
  });
  conPie(s);
  s.addNotes("Dos series y nada más. El coral es lo que hay hoy, la tinta la meta. Se promedia dentro de cada función y después entre funciones.");
}

{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "03 · El panorama", "Los temas más lejos de la meta");
  const top = inf.brecha_priorizada.slice(0, 8).reverse(); // PowerPoint invierte el orden
  s.addChart(
    pres.ChartType.bar,
    [
      { name: "Hoy", labels: top.map((d) => `${d.id} ${d.nombre}`), values: top.map((d) => d.nivel) },
      { name: "Falta para la meta", labels: top.map((d) => `${d.id} ${d.nombre}`), values: top.map((d) => d.brecha) },
      { name: "Resto de la escala", labels: top.map((d) => `${d.id} ${d.nombre}`), values: top.map((d) => inf.cliente.escala_maxima - d.meta) },
    ],
    {
      x: M, y: 1.95, w: W - M * 2, h: 4.1,
      barDir: "bar", barGrouping: "stacked",
      chartColors: [C.coral, C.paper2, C.paper],
      showValue: true, dataLabelPosition: "ctr", dataLabelColor: C.ink,
      dataLabelFontFace: F.mono, dataLabelFontSize: 10,
      catAxisLabelColor: C.muted2, catAxisLabelFontFace: F.sans, catAxisLabelFontSize: 11,
      valAxisLabelColor: C.muted, valAxisLabelFontFace: F.mono, valAxisLabelFontSize: 9,
      valAxisMaxVal: inf.cliente.escala_maxima, valGridLine: { color: C.line, size: 1 }, catGridLine: { style: "none" },
      showLegend: true, legendPos: "b", legendColor: C.muted2, legendFontFace: F.sans, legendFontSize: 11,
      barGapWidthPct: 60,
    },
  );
  conPie(s);
}

// ─────────── 04 · Hallazgos ───────────
separador(pres, lamina(), "04", "Hallazgos", "Qué se encontró en cada función");

for (const f of inf.funciones) {
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, `04 · Hallazgos`, f.nombre, { tam: 40 });
  s.addText(`${n(f.nivel)} sobre una meta de ${n(f.meta)}`, { x: M, y: 1.82, w: 5, h: 0.3, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 11, color: C.muted, charSpacing: 1 });

  s.addText(txt.narrativa?.[f.id] ?? "", { x: M, y: 2.3, w: 6.1, h: 2.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted2, lineSpacing: 19 });

  // La cita más representativa de la función, si hay alguna entregable.
  const conCita = dimsDe(f.id).find((d) => d.cita && conNivel(d));
  if (conCita) {
    const recortar = (t, max = 200) =>
      t.length <= max ? t : t.slice(0, t.lastIndexOf(" ", max)) + "…";
    s.addShape(pres.ShapeType.rect, { x: M, y: 4.85, w: 0.06, h: 1.15, fill: { color: C.coral } });
    s.addText(`«${recortar(conCita.cita)}»`, { x: M + 0.28, y: 4.85, w: 5.85, h: 1.1, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12.5, color: C.ink, italic: true, lineSpacing: 17 });
    etiqueta(s, `— ${conCita.rol_fuente ?? "rol de la empresa"}`, M + 0.28, 6.05, C.muted, 8, 5);
  }

  // Las dimensiones de la función, con su nivel y su meta.
  const dims = dimsDe(f.id);
  tarjeta(pres, s, 7.15, 2.3, 5.45, Math.min(3.75, 0.55 + dims.length * 0.55));
  etiqueta(s, "Los temas de esta función", 7.45, 2.5, C.coralText, 9, 4.9);
  dims.forEach((d, i) => {
    const y = 2.85 + i * 0.55;
    const estado = d.estado === "derivado" ? "pendiente" : conNivel(d) ? `${n(d.nivel)} / ${n(d.meta)}` : "sin establecer";
    s.addText(d.nombre + (d.firme === false && conNivel(d) ? "  ~" : ""), { x: 7.45, y, w: 3.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.ink });
    s.addText(estado, { x: 11.0, y, w: 1.35, h: 0.3, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 11, color: conNivel(d) ? C.muted2 : C.coralText, align: "right" });
  });
  conPie(s);
}

// ─────────── 05 · Qué sigue ───────────
separador(pres, lamina(), "05", "Qué sigue", "Lo que no espera y por dónde empezar");

if (inf.acciones_inmediatas.length) {
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "05 · Qué sigue", "No espera al plan");
  s.addText("Esto salió en la entrevista y no conviene dejarlo para después del taller.", { x: M, y: 1.95, w: 9, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 14, color: C.muted });
  inf.acciones_inmediatas.forEach((a, i) => {
    const y = 2.55 + i * 1.7;
    tarjeta(pres, s, M, y, W - M * 2, 1.45);
    s.addShape(pres.ShapeType.rect, { x: M + 0.3, y: y + 0.28, w: 0.06, h: 0.9, fill: { color: a.urgencia === "alta" ? C.coral : C.amber } });
    etiqueta(s, `Urgencia ${a.urgencia}`, M + 0.55, y + 0.26, a.urgencia === "alta" ? C.coralText : C.amberInk, 9, 3);
    s.addText(a.motivo, { x: M + 0.55, y: y + 0.58, w: 10.9, h: 0.75, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted2, lineSpacing: 18 });
  });
  conPie(s);
}

// La matriz esfuerzo-impacto: es la lámina que ordena la conversación del taller.
{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "05 · Qué sigue", "Proyectos de madurez");
  s.addText(`${(txt.proyectos ?? []).length} propuestas sobre ${inf.ranuras_de_proyecto.length} temas. Dos o tres caminos por tema, con distinto alcance. Son para conversar en el taller: el plan se arma con ustedes.`, { x: M, y: 1.95, w: 11.8, h: 0.5, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted, lineSpacing: 18 });

  // Cuadrícula 3x3. Eje horizontal esfuerzo, vertical impacto.
  const x0 = 2.0, y0 = 2.7, celda = 1.25;
  const esfuerzos = ["bajo", "medio", "alto"];
  const impactos = ["alto", "medio", "bajo"];
  etiqueta(s, "Impacto", 0.75, 2.6, C.muted, 8, 1.2);
  etiqueta(s, "Esfuerzo →", 0.75, y0 + celda * 3 + 0.12, C.muted, 8, 1.2);
  impactos.forEach((imp, fila) => {
    s.addText(imp, { x: 0.75, y: y0 + fila * celda + celda / 2 - 0.13, w: 1.1, h: 0.26, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 9, color: C.muted, charSpacing: 1, align: "right" });
    esfuerzos.forEach((esf, col) => {
      const x = x0 + col * celda;
      const y = y0 + fila * celda;
      // El cuadrante que más rinde —alto impacto, bajo esfuerzo— se destaca.
      const estrella = imp === "alto" && esf === "bajo";
      s.addShape(pres.ShapeType.rect, { x, y, w: celda - 0.06, h: celda - 0.06, fill: { color: estrella ? C.paper2 : C.paper }, line: { color: C.line, width: 1 } });
      const cuantos = (txt.proyectos ?? []).filter((p) => p.esfuerzo === esf && p.impacto === imp);
      if (cuantos.length) {
        s.addText(String(cuantos.length), { x: x + 0.1, y: y + 0.18, w: celda - 0.26, h: 0.55, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 34, color: estrella ? C.coralText : C.muted2, bold: true, align: "center" });
        s.addText(cuantos.length === 1 ? "propuesta" : "propuestas", { x: x + 0.1, y: y + 0.72, w: celda - 0.26, h: 0.25, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 9, color: C.muted, align: "center" });
      }
    });
  });
  esfuerzos.forEach((esf, col) => {
    s.addText(esf, { x: x0 + col * celda, y: y0 + celda * 3 + 0.12, w: celda - 0.06, h: 0.25, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 9, color: C.muted, charSpacing: 1, align: "center" });
  });

  tarjeta(pres, s, 6.4, 2.7, 6.2, 3.75);
  etiqueta(s, "Las primeras seis", 6.7, 2.92, C.coralText, 9, 5.6);
  [...(txt.proyectos ?? [])].sort(porPrioridad).slice(0, 6).forEach((pr, i) => {
    const y = 3.3 + i * 0.5;
    s.addText(`${i + 1}`, { x: 6.7, y, w: 0.3, h: 0.28, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 18, color: C.coralText, bold: true });
    s.addText(pr.nombre, { x: 7.05, y: y + 0.02, w: 3.7, h: 0.28, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 11.5, color: C.ink });
    s.addText(`${pr.esfuerzo} / ${pr.impacto}`, { x: 10.85, y: y + 0.03, w: 1.5, h: 0.26, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 9, color: C.muted, charSpacing: 1, align: "right" });
  });
  conPie(s);
  s.addNotes("El cuadrante destacado —alto impacto, bajo esfuerzo— es por donde conviene arrancar. La matriz ordena la discusión sin que nadie tenga que defender un orden.");
}

// Lo que más rinde: el cuadrante de bajo esfuerzo y alto impacto. Va solo,
// porque es la lámina sobre la que se decide en la reunión.
{
  const rinde = (txt.proyectos ?? []).filter((p) => p.esfuerzo === "bajo" && p.impacto === "alto");
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "05 · Qué sigue", "Lo que más rinde");
  s.addText(
    rinde.length
      ? `${rinde.length} propuestas de bajo esfuerzo y alto impacto. Se resuelven con la gente que ya está y en días, no en meses. Si sólo se hiciera esto, la foto cambia.`
      : "Ninguna propuesta quedó en bajo esfuerzo y alto impacto: todo lo que mueve la aguja acá pide tiempo o plata.",
    { x: M, y: 1.95, w: 11.8, h: 0.4, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted },
  );
  rinde.slice(0, 6).forEach((pr, i) => {
    const x = M + (i % 2) * 6.15;
    const y = 2.5 + Math.floor(i / 2) * 1.42;
    const dim = inf.dimensiones.find((d) => d.id === pr.dimension);
    tarjeta(pres, s, x, y, 5.85, 1.28);
    s.addText(String(i + 1), { x: x + 0.28, y: y + 0.2, w: 0.45, h: 0.4, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 26, color: C.coralText, bold: true });
    s.addText(pr.nombre, { x: x + 0.8, y: y + 0.22, w: 4.8, h: 0.32, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13.5, color: C.ink, bold: true });
    s.addText(`${pr.dimension} ${dim?.nombre ?? ""}`, { x: x + 0.8, y: y + 0.57, w: 4.8, h: 0.24, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 8.5, color: C.muted, charSpacing: 1 });
    const d = (pr.descripcion ?? "").split(". ")[0] + ".";
    s.addText(d.length > 140 ? d.slice(0, d.lastIndexOf(" ", 140)) + "…" : d, { x: x + 0.8, y: y + 0.84, w: 4.8, h: 0.36, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 10, color: C.muted, lineSpacing: 13 });
  });
  conPie(s);
  s.addNotes("Es la lámina de la decisión. Nada de acá necesita presupuesto ni un tercero.");
}

// El resto de las iniciativas, para que quede a la vista que hay más y de qué
// tamaño es cada una.
{
  const resto = [...(txt.proyectos ?? [])]
    .filter((p) => !(p.esfuerzo === "bajo" && p.impacto === "alto"))
    .sort(porPrioridad);
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "05 · Qué sigue", "El resto de las iniciativas");
  s.addText(`Las otras ${resto.length}, ordenadas por impacto y esfuerzo. El detalle de cada una está en el informe escrito.`, { x: M, y: 1.95, w: 11.8, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted });
  const porColumna = Math.ceil(Math.min(resto.length, 26) / 2);
  resto.slice(0, 26).forEach((pr, i) => {
    const col = Math.floor(i / porColumna);
    const fila = i % porColumna;
    const x = M + col * 6.15;
    const y = 2.42 + fila * 0.325;
    s.addText(pr.nombre, { x, y, w: 3.8, h: 0.28, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 10.5, color: C.muted2 });
    s.addText(pr.dimension, { x: x + 3.9, y: y + 0.01, w: 0.72, h: 0.26, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 8.5, color: C.coralText, charSpacing: 1 });
    s.addText(`${pr.esfuerzo}/${pr.impacto}`, { x: x + 4.65, y: y + 0.01, w: 1.15, h: 0.26, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 8.5, color: C.muted, align: "right" });
  });
  conPie(s);
}

// ─────────── 06 · Qué no se evaluó ───────────
{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "06 · Alcance", "Qué no se evaluó");
  s.addText("Declararlo es parte del método: así saben exactamente qué compraron.", { x: M, y: 1.95, w: 10, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 14, color: C.muted });

  let y = 2.5;
  if (inf.no_evaluado.derivados.length) {
    etiqueta(s, "Pendiente de otro rol", M, y, C.coralText, 9, 6);
    y += 0.35;
    for (const d of inf.no_evaluado.derivados) {
      s.addText([{ text: `${d.nombre} — `, options: { bold: true, color: C.ink } }, { text: `${d.rol_que_sabe}. ${d.que_falta}`, options: { color: C.muted } }], { x: M, y, w: 11.8, h: 0.5, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, lineSpacing: 17 });
      y += 0.62;
    }
    y += 0.2;
  }
  if (inf.no_evaluado.indeterminados.length) {
    etiqueta(s, "No se pudo establecer", M, y, C.coralText, 9, 6);
    y += 0.35;
    for (const d of inf.no_evaluado.indeterminados) {
      s.addText([{ text: `${d.nombre} — `, options: { bold: true, color: C.ink } }, { text: `${d.motivo} Lo sabría: ${d.rol_que_sabria}.`, options: { color: C.muted } }], { x: M, y, w: 11.8, h: 0.5, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, lineSpacing: 17 });
      y += 0.62;
    }
  }
  conPie(s);
}

if (inf.evidencia_para_validar.length) {
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "06 · Alcance", "Si alguna vez quisieran validarlo");
  s.addText("Nada de esto hizo falta para el diagnóstico: lo que dijeron se tomó como válido. Queda anotado por si en algún momento quieren comprobarlo.", { x: M, y: 1.95, w: 11.5, h: 0.5, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 14, color: C.muted, lineSpacing: 19 });
  inf.evidencia_para_validar.slice(0, 8).forEach((e, i) => {
    const y = 2.65 + i * 0.45;
    s.addText(e.dimension, { x: M, y, w: 0.9, h: 0.3, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 10, color: C.coralText, charSpacing: 1, bold: true });
    s.addText(e.que, { x: M + 1.0, y, w: 10.8, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.muted2 });
  });
  conPie(s);
}

// Comparación. La estructura existe; los números NO se inventan.
{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "06 · Alcance", "Contra qué se compara");
  s.addText(
    [
      { text: "Contra la meta y contra la escala completa. ", options: { bold: true, color: C.ink } },
      { text: `Hoy el resultado se lee contra la meta acordada de ${n(inf.resumen.meta_general)} y contra el máximo de la escala, que es ${inf.cliente.escala_maxima}. Las dos referencias están en todos los gráficos.

`, options: { color: C.muted2 } },
      { text: "Contra otras empresas, todavía no. ", options: { bold: true, color: C.ink } },
      { text: "R² no publica un comparativo por industria o por tamaño porque no tiene una fuente propia que lo sostenga, y usar cifras de terceros sin poder verificarlas sería peor que no dar ninguna.", options: { color: C.muted2, breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "De dónde va a salir. ", options: { bold: true, color: C.ink } },
      { text: "De estos mismos diagnósticos. Cada empresa que se mide con la misma escala suma un punto de comparación real, verificable y propio. A partir de una cantidad razonable, el informe podrá decir dónde está esta empresa respecto de las demás de su tamaño y su sector.", options: { color: C.muted2 } },
    ],
    { x: M, y: 2.0, w: 7.2, h: 3.6, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, lineSpacing: 19 },
  );
  tarjeta(pres, s, 8.5, 2.0, 4.1, 2.5);
  etiqueta(s, "Las dos referencias de hoy", 8.8, 2.22, C.coralText, 9, 3.5);
  s.addText(`${n(inf.resumen.nivel_general)}`, { x: 8.8, y: 2.55, w: 1.6, h: 0.7, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 44, color: C.ink, bold: true });
  s.addText(`meta ${n(inf.resumen.meta_general)}
escala hasta ${inf.cliente.escala_maxima}`, { x: 10.3, y: 2.7, w: 2.1, h: 0.6, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.muted, lineSpacing: 17 });
  s.addShape(pres.ShapeType.rect, { x: 8.8, y: 3.5, w: 3.5, h: 0.14, fill: { color: C.line } });
  s.addShape(pres.ShapeType.rect, { x: 8.8, y: 3.5, w: 3.5 * (inf.resumen.nivel_general / inf.cliente.escala_maxima), h: 0.14, fill: { color: C.coral } });
  s.addShape(pres.ShapeType.rect, { x: 8.8 + 3.5 * (inf.resumen.meta_general / inf.cliente.escala_maxima), y: 3.44, w: 0.025, h: 0.26, fill: { color: C.ink } });
  etiqueta(s, "0", 8.8, 3.72, C.muted, 8, 0.4);
  etiqueta(s, `${inf.cliente.escala_maxima}`, 12.1, 3.72, C.muted, 8, 0.4);
  s.addText("La marca de tinta es la meta.", { x: 8.8, y: 4.0, w: 3.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 11, color: C.muted });
  conPie(s);
  s.addNotes("Si el cliente pregunta cómo está contra otros: hoy no hay dato propio y no se usan cifras de terceros sin verificar. Se construye con los diagnósticos que R² va haciendo.");
}

// ─────────── Cierre ───────────
{
  const s = lamina();
  s.background = { color: C.ink2 };
  grilla(pres, s, true);
  s.addText("GRACIAS", { x: M, y: 2.3, w: 8, h: 1.2, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 72, color: C.paper, bold: true });
  s.addText("El plan de trabajo se arma con ustedes, sobre estos hallazgos.", { x: M, y: 3.6, w: 9, h: 0.5, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 17, color: C.onDarkMuted });
  s.addText("rcuadrado.com", { x: M, y: 4.25, w: 6, h: 0.4, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 14, color: C.onDarkMuted, charSpacing: 2 });
  barra(pres, s, M, 5.1, W - M * 2, { oscuro: true });
}

const destino = archivo.replace(/informe-?/, "devolucion-").replace(/\.json$/, ".pptx");
await pres.writeFile({ fileName: destino });
console.log(`${inf.cliente.empresa} · ${pagina + 6} láminas`);
console.log(`Escrito: ${destino}`);
