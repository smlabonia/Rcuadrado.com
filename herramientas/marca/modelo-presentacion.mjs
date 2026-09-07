// Modelo de presentación — R² Tech Partner
// Genera el .pptx de plantilla con las láminas propuestas.
//
// NOTA: este archivo quedó con `require` dentro de un `.mjs` y por eso no corría.
// Los motivos ahora viven en laminas.mjs y se importan; si tocás un motivo,
// tocalo allá para que la plantilla y los entregables no se separen.

import pptxgen from "pptxgenjs";
import { C, F, W, H, M, grilla, barra, tarjeta, etiqueta, encabezado, pie } from "./laminas.mjs";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "R² Tech Partner";
pres.company = "R² Tech Partner";
pres.title = "Modelo de presentación";

const nota = (s, t) => s.addNotes(t);

// ═══════════════ PORTADAS ═══════════════

// Portada A — tinta plena. La que usaría por defecto.
{
  const s = pres.addSlide();
  s.background = { color: C.ink2 };
  grilla(pres, s, true);
  s.addText("R²", {
    x: M, y: 0.6, w: 2, h: 1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 54, color: C.paper, bold: true,
  });
  s.addText("DIAGNÓSTICO DE\nCIBERSEGURIDAD", {
    x: M, y: 2.5, w: 9, h: 2, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 66, color: C.paper, bold: true, lineSpacing: 62,
  });
  s.addText("Metalúrgica del Valle", {
    x: M, y: 4.6, w: 8, h: 0.5, isTextBox: true, margin: 0,
    fontFace: F.sans, fontSize: 20, color: C.onDarkMuted,
  });
  barra(pres, s, M, 5.35, W - M * 2, { oscuro: true });
  etiqueta(s, "Septiembre 2026 · NIST CSF 2.0", M, 5.6, C.onDarkMuted, 10);
  nota(s, "Portada A — tinta plena. Es la que recomiendo por defecto: el fondo oscuro da peso y deja al coral para la barra, sin competir. El título va en display, siempre en mayúsculas.");
}

// Portada B — papel. Para informes que se imprimen.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  grilla(pres, s, false);
  s.addText("R²", {
    x: 1.1, y: 0.6, w: 2, h: 1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 48, color: C.ink, bold: true,
  });
  s.addText("DIAGNÓSTICO DE\nCIBERSEGURIDAD", {
    x: 1.1, y: 2.3, w: 9, h: 2, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 62, color: C.ink, bold: true, lineSpacing: 58,
  });
  s.addText("Metalúrgica del Valle", {
    x: 1.1, y: 4.35, w: 8, h: 0.5, isTextBox: true, margin: 0,
    fontFace: F.sans, fontSize: 20, color: C.muted2,
  });
  barra(pres, s, 1.1, 5.1, W - 1.1 - M);
  etiqueta(s, "Septiembre 2026 · NIST CSF 2.0", 1.1, 5.35, C.muted, 10);
  nota(s, "Portada B — papel. Para cuando el informe se imprime o se manda en PDF y no se proyecta. El bloque de tinta a la izquierda ancla la página sin gastar tinta plena.");
}

// Portada C — coral. Sólo para propuestas comerciales, no para diagnósticos.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 4.4, fill: { color: C.coral } });
  s.addText("R²", {
    x: M, y: 0.5, w: 2, h: 1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 48, color: C.ink, bold: true,
  });
  s.addText("PLAN DE\nMADUREZ", {
    x: M, y: 1.9, w: 9, h: 2, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 66, color: C.ink, bold: true, lineSpacing: 62,
  });
  s.addText("Metalúrgica del Valle", {
    x: M, y: 4.85, w: 8, h: 0.5, isTextBox: true, margin: 0,
    fontFace: F.sans, fontSize: 20, color: C.muted2,
  });
  etiqueta(s, "Septiembre 2026", M, 5.4, C.muted, 10);
  barra(pres, s, M, 6.4, W - M * 2, { invertida: true });
  nota(s, "Portada C — coral pleno. Guardarla para propuestas comerciales, no para diagnósticos: el coral es señal de acción y usarlo en un informe de hallazgos le da una energía que no corresponde. Sobre coral, el texto va en tinta al 100%, nunca en papel.");
}

// ═══════════════ AGENDA ═══════════════

// Agenda A — lista numerada, dos columnas.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  encabezado(pres, s, "Contenido", "Agenda");
  const items = [
    ["01", "Resumen ejecutivo", "Dónde está la empresa y qué es lo que más urge"],
    ["02", "Cómo leer esto", "La escala, la meta y qué significa cada nivel"],
    ["03", "El panorama", "Las seis funciones del marco, hoy contra la meta"],
    ["04", "La brecha ordenada", "Los veintidós temas, del más lejos al más cerca"],
    ["05", "Hallazgos", "Qué se encontró en cada función, con las palabras de la empresa"],
    ["06", "Qué sigue", "Acciones inmediatas y los primeros proyectos"],
  ];
  items.forEach(([n, t, d], i) => {
    const col = i % 2;
    const fila = Math.floor(i / 2);
    const x = M + col * 6.2;
    const y = 2.05 + fila * 1.35;
    s.addText(n, {
      x, y, w: 0.85, h: 0.6, isTextBox: true, margin: 0,
      fontFace: F.display, fontSize: 34, color: C.coralText, bold: true,
    });
    s.addText(t, {
      x: x + 0.9, y: y + 0.02, w: 4.9, h: 0.35, isTextBox: true, margin: 0,
      fontFace: F.sans, fontSize: 16, color: C.ink, bold: true,
    });
    s.addText(d, {
      x: x + 0.9, y: y + 0.38, w: 4.9, h: 0.55, isTextBox: true, margin: 0,
      fontFace: F.sans, fontSize: 12, color: C.muted,
    });
  });
  pie(pres, s, 2);
  nota(s, "Agenda A — dos columnas. El número en display y coral-text es lo que da el registro; el coral pleno no serviría acá porque sobre papel no llega a contraste AA.");
}

// Agenda B — tarjetas.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  encabezado(pres, s, "Contenido", "Agenda");
  const items = [
    ["01", "Resumen ejecutivo"], ["02", "Cómo leer esto"], ["03", "El panorama"],
    ["04", "La brecha ordenada"], ["05", "Hallazgos por función"], ["06", "Qué sigue"],
  ];
  items.forEach(([n, t], i) => {
    const col = i % 3;
    const fila = Math.floor(i / 3);
    const x = M + col * 4.03;
    const y = 2.1 + fila * 2.0;
    tarjeta(pres, s, x, y, 3.75, 1.75);
    s.addText(n, {
      x: x + 0.3, y: y + 0.25, w: 1, h: 0.55, isTextBox: true, margin: 0,
      fontFace: F.display, fontSize: 32, color: C.coralText, bold: true,
    });
    s.addText(t, {
      x: x + 0.3, y: y + 0.9, w: 3.15, h: 0.7, isTextBox: true, margin: 0,
      fontFace: F.sans, fontSize: 15, color: C.ink, bold: true,
    });
  });
  pie(pres, s, 3);
  nota(s, "Agenda B — tarjetas en arena con borde de línea. Sirve cuando la agenda se muestra en pantalla y no se lee; la A sirve cuando se lee. El radio de esquina de la marca es 2px, o sea casi recto: las tarjetas del sitio van a 16px, pero en un slide la esquina recta se sostiene mejor.");
}

// ═══════════════ SEPARADORES ═══════════════

// Separador A — tinta plena con numeral grande.
{
  const s = pres.addSlide();
  s.background = { color: C.ink2 };
  grilla(pres, s, true);
  s.addText("03", {
    x: M, y: 1.5, w: 3, h: 2.2, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 150, color: C.coral, bold: true,
  });
  s.addText("EL PANORAMA", {
    x: M, y: 3.75, w: 10, h: 1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 54, color: C.paper, bold: true,
  });
  s.addText("Las seis funciones del marco, hoy contra la meta", {
    x: M, y: 4.75, w: 9, h: 0.5, isTextBox: true, margin: 0,
    fontFace: F.sans, fontSize: 17, color: C.onDarkMuted,
  });
  barra(pres, s, M, 5.6, W - M * 2, { oscuro: true });
  nota(s, "Separador A — el numeral grande en coral es el único lugar del sistema donde el coral pleno funciona como tipografía, porque va sobre tinta y no sobre papel.");
}

// Separador B — arena, más liviano.
{
  const s = pres.addSlide();
  s.background = { color: C.paper2 };
  s.addText("04", {
    x: M, y: 2.4, w: 2.5, h: 1.8, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 120, color: C.line, bold: true,
  });
  s.addText("LA BRECHA ORDENADA", {
    x: 3.4, y: 2.75, w: 9, h: 1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 48, color: C.ink, bold: true,
  });
  s.addText("Los veintidós temas, del más lejos al más cerca de la meta", {
    x: 3.45, y: 3.75, w: 9, h: 0.5, isTextBox: true, margin: 0,
    fontFace: F.sans, fontSize: 16, color: C.muted2,
  });
  barra(pres, s, 3.45, 4.5, 6);
  nota(s, "Separador B — arena. Para cuando hay muchos separadores seguidos y el oscuro cansa. El numeral en color de línea queda de fondo, sin pelear con el título.");
}

// ═══════════════ CONTENIDO ═══════════════

// Contenido A — dos columnas, la hoja de trabajo.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  encabezado(pres, s, "03 · El panorama", "Dónde está hoy");
  s.addText(
    "Este es el formato base para cualquier lámina de texto. El encabezado lleva la sección en mono arriba y el título en display debajo, siempre en mayúsculas. El cuerpo va en IBM Plex Sans a 15 puntos, alineado a la izquierda y nunca centrado.",
    { x: M, y: 2.15, w: 5.7, h: 1.6, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 15, color: C.muted, lineSpacing: 22 },
  );
  s.addText(
    "El ancho de columna está pensado para unos sesenta caracteres por línea. Más ancho que eso y el ojo se pierde al volver; más angosto, el texto se corta demasiado seguido.",
    { x: M, y: 3.6, w: 5.7, h: 1.4, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 15, color: C.muted, lineSpacing: 22 },
  );
  tarjeta(pres, s, 7.05, 2.15, 5.5, 3.6);
  etiqueta(s, "Bloque destacado", 7.4, 2.25, C.coralText, 9);
  s.addText("1,1", {
    x: 7.4, y: 2.8, w: 2.5, h: 1.1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 76, color: C.ink, bold: true,
  });
  s.addText("sobre una meta de 3", {
    x: 7.4, y: 3.95, w: 4.8, h: 0.35, isTextBox: true, margin: 0,
    fontFace: F.sans, fontSize: 15, color: C.muted,
  });
  s.addText(
    "La cifra grande va en display. Es el único lugar donde un número se lleva la lámina, y funciona porque al lado está la meta: el número solo invita a discutir el número.",
    { x: 7.4, y: 4.45, w: 4.8, h: 1, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 12, color: C.muted, lineSpacing: 17 },
  );
  pie(pres, s, 8);
  nota(s, "Contenido A — dos columnas, texto a la izquierda y bloque destacado a la derecha. Encabezado, pie, número de página. Es la lámina que más se repite en el informe.");
}

// Contenido B — cita y hallazgo.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  encabezado(pres, s, "05 · Hallazgos", "Riesgo de proveedores");
  s.addShape(pres.ShapeType.rect, { x: M, y: 1.95, w: 0.06, h: 1.5, fill: { color: C.coral } });
  s.addText(
    "«Eso lo tenemos todo en la cabeza, nomás.»",
    { x: M + 0.3, y: 1.95, w: 7.5, h: 0.9, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 24, color: C.ink, italic: true, lineSpacing: 30 },
  );
  etiqueta(s, "— Gerencia de administración", M + 0.3, 2.95, C.muted, 9);
  s.addText(
    "Los accesos de proveedores externos se conocen de memoria, sin una lista escrita ni fechas de alta. No hay revisión periódica ni proceso de baja sistemático.",
    { x: M, y: 3.8, w: 7.5, h: 1.1, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 16, color: C.muted2, lineSpacing: 24 },
  );
  const caja = (x, et, val, sub) => {
    tarjeta(pres, s, x, 1.95, 2.1, 1.35);
    etiqueta(s, et, x + 0.22, 2.15, C.muted, 8);
    s.addText(val, { x: x + 0.22, y: 2.4, w: 1.7, h: 0.7, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 42, color: C.ink, bold: true });
    s.addText(sub, { x: x + 0.22, y: 2.95, w: 1.7, h: 0.3, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 10, color: C.muted });
  };
  caja(8.55, "Hoy", "1", "de 5");
  caja(10.85, "Meta", "3", "de 5");
  tarjeta(pres, s, 8.55, 3.55, 4.4, 1.35);
  etiqueta(s, "Esfuerzo estimado", 8.77, 3.75, C.muted, 8);
  s.addText("MEDIO", { x: 8.77, y: 4.0, w: 4, h: 0.6, isTextBox: true, margin: 0, fontFace: F.display, fontSize: 38, color: C.amberInk, bold: true });
  pie(pres, s, 14);
  nota(s, "Contenido B — hallazgo con cita. La cita va en Plex Sans en cursiva, con la marca de coral al costado como único acento. La atribución es siempre por rol, nunca por nombre.");
}

// ═══════════════ GRÁFICOS ═══════════════

// Gráfico A — barras horizontales, la brecha ordenada.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  encabezado(pres, s, "04 · La brecha", "Los temas más lejos de la meta");
  s.addChart(
    pres.ChartType.bar,
    [
      { name: "Hoy", labels: ["PR.AT Formación", "GV.RM Gestión de riesgos", "GV.OV Supervisión", "DE.CM Monitoreo", "ID.RA Evaluación de riesgos", "RS.CO Comunicación"], values: [1, 1, 1, 1, 0, 0] },
      { name: "Falta para la meta", labels: ["PR.AT Formación", "GV.RM Gestión de riesgos", "GV.OV Supervisión", "DE.CM Monitoreo", "ID.RA Evaluación de riesgos", "RS.CO Comunicación"], values: [2, 2, 2, 2, 3, 3] },
    ],
    {
      x: M, y: 1.95, w: W - M * 2, h: 4.1,
      barDir: "bar", barGrouping: "stacked",
      chartColors: [C.coral, C.paper2],
      showValue: true, dataLabelPosition: "ctr", dataLabelColor: C.ink,
      dataLabelFontFace: F.mono, dataLabelFontSize: 10,
      catAxisLabelColor: C.muted2, catAxisLabelFontFace: F.sans, catAxisLabelFontSize: 11,
      valAxisLabelColor: C.muted, valAxisLabelFontFace: F.mono, valAxisLabelFontSize: 9,
      valAxisMaxVal: 3, valGridLine: { color: C.line, size: 1 }, catGridLine: { style: "none" },
      showLegend: true, legendPos: "b", legendColor: C.muted2, legendFontFace: F.sans, legendFontSize: 11,
      barGapWidthPct: 60,
    },
  );
  pie(pres, s, 11);
  nota(s, "Gráfico A — barras horizontales apiladas. El coral pleno como relleno es su uso correcto: marca lo que hay, y la arena marca lo que falta. Las etiquetas de datos van en tinta al 100% porque están sobre coral. En apiladas, la posición de la etiqueta tiene que ser centrada.");
}

// Gráfico B — estrella de las seis funciones.
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  encabezado(pres, s, "03 · El panorama", "Las seis funciones");
  s.addChart(
    pres.ChartType.radar,
    [
      { name: "Hoy", labels: ["Gobernar", "Identificar", "Proteger", "Detectar", "Responder", "Recuperar"], values: [1.4, 0.5, 1.2, 1.5, 1.0, 1.0] },
      { name: "Meta", labels: ["Gobernar", "Identificar", "Proteger", "Detectar", "Responder", "Recuperar"], values: [3, 3, 3, 3, 3, 3] },
    ],
    {
      x: 0.9, y: 1.9, w: 6.6, h: 4.3,
      radarStyle: "marker",
      chartColors: [C.coral, C.ink],
      catAxisLabelColor: C.muted2, catAxisLabelFontFace: F.sans, catAxisLabelFontSize: 12,
      valAxisLabelColor: C.muted, valAxisLabelFontFace: F.mono, valAxisLabelFontSize: 9,
      valAxisMaxVal: 5, valAxisMinVal: 0, valAxisMajorUnit: 1,
      showLegend: true, legendPos: "b", legendColor: C.muted2, legendFontFace: F.sans, legendFontSize: 11,
    },
  );
  tarjeta(pres, s, 7.9, 1.95, 4.65, 4.15);
  etiqueta(s, "Cómo se lee", 8.2, 2.2, C.coralText, 9);
  s.addText(
    "La estrella compara las seis funciones contra la meta. Se promedia dentro de cada función y después entre funciones: promediar los veintidós temas de una haría pesar a Gobernar el triple que a Recuperar, que tiene seis categorías contra dos.",
    { x: 8.2, y: 2.55, w: 4.1, h: 1.6, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted, lineSpacing: 19 },
  );
  s.addText(
    "Dos series y nada más. El coral es lo que hay hoy; la tinta, la meta. Sumar una tercera serie —el promedio del sector, el año pasado— convierte la estrella en un ovillo.",
    { x: 8.2, y: 4.3, w: 4.1, h: 1.4, isTextBox: true, margin: 0, fontFace: F.sans, fontSize: 13, color: C.muted, lineSpacing: 19 },
  );
  pie(pres, s, 9);
  nota(s, "Gráfico B — estrella. Es el gráfico que va en la primera página. Dos series como máximo. El ámbar queda libre para marcar una función bajo revisión, si hiciera falta.");
}

// ═══════════════ Cierre ═══════════════
{
  const s = pres.addSlide();
  s.background = { color: C.ink2 };
  grilla(pres, s, true);
  s.addText("R²", {
    x: M, y: 2.4, w: 3, h: 1.2, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 72, color: C.paper, bold: true,
  });
  s.addText("rcuadrado.com", {
    x: M, y: 3.7, w: 6, h: 0.5, isTextBox: true, margin: 0,
    fontFace: F.mono, fontSize: 16, color: C.onDarkMuted, charSpacing: 2,
  });
  barra(pres, s, M, 4.6, W - M * 2, { oscuro: true });
  nota(s, "Cierre — el isotipo solo. El dominio va en mono porque es un dato, no un titular.");
}

await pres.writeFile({ fileName: process.argv[2] ?? "modelo-r2.pptx" });
console.log("Escrito");
