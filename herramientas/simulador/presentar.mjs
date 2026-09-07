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
  s.addText(`sobre una meta de ${n(inf.resumen.meta_general)}`, { x: 8.95, y: 3.42, w: 3.4, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted });

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
    ],
    {
      x: M, y: 1.95, w: W - M * 2, h: 4.1,
      barDir: "bar", barGrouping: "stacked",
      chartColors: [C.coral, C.paper2],
      showValue: true, dataLabelPosition: "ctr", dataLabelColor: C.ink,
      dataLabelFontFace: F.mono, dataLabelFontSize: 10,
      catAxisLabelColor: C.muted2, catAxisLabelFontFace: F.sans, catAxisLabelFontSize: 11,
      valAxisLabelColor: C.muted, valAxisLabelFontFace: F.mono, valAxisLabelFontSize: 9,
      valAxisMaxVal: inf.resumen.meta_general, valGridLine: { color: C.line, size: 1 }, catGridLine: { style: "none" },
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

{
  const s = lamina();
  s.background = { color: C.paper };
  encabezado(pres, s, "05 · Qué sigue", "Por dónde empezar");
  s.addText("Propuestas para conversar en el taller, ordenadas por brecha. No son indicaciones: el plan se arma con ustedes.", { x: M, y: 1.95, w: 10.5, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 14, color: C.muted });
  const proys = inf.proyectos_candidatos.slice(0, 4);
  proys.forEach((p, i) => {
    const x = M + (i % 2) * 6.15;
    const y = 2.5 + Math.floor(i / 2) * 2.02;
    const red = txt.proyectos?.find((r) => r.orden === p.orden);
    const dim = inf.dimensiones.find((d) => d.id === p.mueve);
    tarjeta(pres, s, x, y, 5.85, 1.88);
    s.addText(String(p.orden), { x: x + 0.3, y: y + 0.22, w: 0.5, h: 0.45, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 28, color: C.coralText, bold: true });
    s.addText(red?.nombre ?? p.nombre_tentativo, { x: x + 0.85, y: y + 0.25, w: 4.7, h: 0.35, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 14, color: C.ink, bold: true });
    s.addText(`${p.mueve} · de ${n(dim?.nivel)} a ${n(dim?.meta)} · esfuerzo ${p.esfuerzo ?? "—"}`, { x: x + 0.85, y: y + 0.63, w: 4.7, h: 0.26, isTextBox: true, margin: 0, fontFace: F.mono, fontSize: 9, color: C.muted, charSpacing: 1 });
    // Dos oraciones entran; tres se salen de la tarjeta.
    const desc = (red?.descripcion ?? "").split(". ").slice(0, 2).join(". ");
    s.addText(desc.length > 190 ? desc.slice(0, desc.lastIndexOf(" ", 190)) + "…" : desc, { x: x + 0.85, y: y + 0.97, w: 4.7, h: 0.8, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 10.5, color: C.muted, lineSpacing: 14 });
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
