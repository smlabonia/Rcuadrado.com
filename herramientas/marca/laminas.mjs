// Los ladrillos de marca para armar láminas. Cualquier herramienta que genere
// presentaciones de R² usa esto en vez de redibujar los motivos.
//
// El criterio está en .claude/skills/presentaciones-r2/. Si acá cambia una
// regla, allá se documenta el porqué.

export const C = {
  coral: "FF4A1C",       // señal de acción — SOLO relleno
  coralText: "CC3B16",   // el mismo tono para texto sobre claro (4,71:1)
  amber: "FFB020",       // apoyo, nunca compite con el coral
  amberInk: "7A5000",    // ámbar para texto sobre claro
  ink: "17120F",         // tinta cálida — texto sobre claro
  ink2: "241D18",        // fondo oscuro de lámina
  ink3: "3A302A",
  paper: "FAF8F4",
  paper2: "F2EDE5",      // arena
  line: "DCD5CA",
  muted: "6E645C",
  muted2: "4A423C",
  onDarkMuted: "B5ACA3",
  gridLight: "ECEAE6",   // tinta al 6% sobre papel
  gridDark: "352E29",    // papel al 8% sobre ink-2
};

export const F = {
  display: "Big Shoulders Display", // titulares, SIEMPRE en mayúsculas
  sans: "IBM Plex Sans",
  mono: "IBM Plex Mono",
};

export const W = 13.333;
export const H = 7.5;
export const M = 0.75;

export const SOMBRA = () => ({
  type: "outer", color: "8A7F74", blur: 10, offset: 2, angle: 90, opacity: 0.16,
});

// Grilla de fondo. Sólo en portadas y separadores: en una lámina de contenido
// compite con el texto.
export function grilla(pres, s, oscuro = false) {
  const col = oscuro ? C.gridDark : C.gridLight;
  const paso = 0.583; // 56px
  for (let x = paso; x < W; x += paso) {
    s.addShape(pres.ShapeType.line, { x, y: 0, w: 0, h: H, line: { color: col, width: 0.75 } });
  }
  for (let y = paso; y < H; y += paso) {
    s.addShape(pres.ShapeType.line, { x: 0, y, w: W, h: 0, line: { color: col, width: 0.75 } });
  }
}

// La barra de proporción 60-25-10-5. Es EL divisor de la marca.
// Cada segmento tiene que verse contra su fondo: sobre oscuro se pierde la
// tinta, sobre papel se pierde la arena, que es el 60% y el que abre la barra.
export function barra(pres, s, x, y, ancho, { invertida = false, oscuro = false } = {}) {
  const tinta = oscuro ? C.ink3 : C.ink;
  const arena = oscuro ? C.paper2 : C.line;
  const partes = invertida
    ? [[C.amber, 0.05], [C.coral, 0.1], [tinta, 0.25], [arena, 0.6]]
    : [[arena, 0.6], [tinta, 0.25], [C.coral, 0.1], [C.amber, 0.05]];
  let cx = x;
  for (const [color, prop] of partes) {
    s.addShape(pres.ShapeType.rect, { x: cx, y, w: ancho * prop, h: 0.0625, fill: { color } });
    cx += ancho * prop;
  }
}

// Tarjeta: radio 16px, sin borde duro, separada del fondo por la sombra.
export function tarjeta(pres, s, x, y, w, h, { sobreArena = false, oscura = false } = {}) {
  const relleno = oscura ? C.ink3 : sobreArena ? C.paper : C.paper2;
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.14,
    fill: { color: relleno },
    line: { color: sobreArena ? C.line : relleno, width: 1 },
    ...(oscura ? {} : { shadow: SOMBRA() }),
  });
}

// Etiqueta en mono, versalitas con letter-spacing alto.
export function etiqueta(s, texto, x, y, color, tam = 10, ancho = 6) {
  s.addText(String(texto).toUpperCase(), {
    x, y, w: ancho, h: 0.25, isTextBox: true, margin: 0,
    fontFace: F.mono, fontSize: tam, color, charSpacing: 2, bold: true,
  });
}

// Encabezado de lámina de contenido: etiqueta, título y el divisor. Sin fondo
// de color: el encabezado se define por la tipografía y por la barra.
export function encabezado(pres, s, seccion, titulo, { tam = 40 } = {}) {
  if (seccion) etiqueta(s, seccion, M, 0.52, C.coralText, 10);
  s.addText(String(titulo).toUpperCase(), {
    x: M, y: 0.82, w: W - M * 2, h: 0.75, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: tam, color: C.ink, bold: true,
  });
  barra(pres, s, M, 1.62, W - M * 2);
}

export function pie(pres, s, n, documento = "Diagnóstico de ciberseguridad") {
  s.addShape(pres.ShapeType.line, { x: M, y: H - 0.75, w: W - M * 2, h: 0, line: { color: C.line, width: 1 } });
  etiqueta(s, "R² Tech Partner", M, H - 0.68, C.muted, 8, 4);
  s.addText(String(documento).toUpperCase(), {
    x: W / 2 - 2.5, y: H - 0.68, w: 5, h: 0.25, isTextBox: true, margin: 0,
    fontFace: F.mono, fontSize: 8, color: C.muted, charSpacing: 2, align: "center",
  });
  s.addText(String(n), {
    x: W - M - 1, y: H - 0.68, w: 1, h: 0.25, isTextBox: true, margin: 0,
    fontFace: F.mono, fontSize: 8, color: C.muted2, align: "right", bold: true,
  });
}

// Separador de sección.
export function separador(pres, s, numero, titulo, bajada) {
  s.background = { color: C.ink2 };
  grilla(pres, s, true);
  s.addText(String(numero), {
    x: M, y: 1.5, w: 3, h: 2.2, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 150, color: C.coral, bold: true,
  });
  s.addText(String(titulo).toUpperCase(), {
    x: M, y: 3.75, w: 11.5, h: 1, isTextBox: true, margin: 0,
    fontFace: F.display, fontSize: 54, color: C.paper, bold: true,
  });
  if (bajada) {
    s.addText(bajada, {
      x: M, y: 4.75, w: 10, h: 0.5, isTextBox: true, margin: 0,
      fontFace: F.sans, fontSize: 17, color: C.onDarkMuted,
    });
  }
  barra(pres, s, M, 5.6, W - M * 2, { oscuro: true });
}

// Coma decimal, que es lo que corresponde en castellano.
export const n = (x) => (x === null || x === undefined ? "—" : String(x).replace(".", ","));
