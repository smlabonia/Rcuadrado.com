# Manual de marca — R² Tech Partner

`css/styles.css` se llamaba a sí mismo "Manual de Marca v1.0" pero el documento
no existía. Esto lo escribe: **documenta lo que el código ya hace**, no reglas
nuevas. La fuente de verdad sigue siendo el bloque `:root` de la hoja de
estilos; si algo se cambia allá, se actualiza acá.

## Nombre

Tres formas conviven y se refuerzan si se las usa con criterio:

| Forma | Dónde |
|---|---|
| **R²** | Isotipo. Solo, funciona en avatar, favicon y pestaña |
| **R² Tech Partner** | Lockup completo. Header, footer, firma |
| **rcuadrado.com** | Dominio. Es la lectura fonética de R², no un nombre distinto |

## Color

### Paleta

| Token | Hex | Rol |
|---|---|---|
| `--coral` | `#FF4A1C` | Señal de acción. **Solo relleno** |
| `--coral-text` | `#CC3B16` | El mismo tono al 80% de brillo, para texto sobre claro |
| `--amber` | `#FFB020` | Apoyo. Nunca compite con el coral |
| `--ink` | `#17120F` | Tinta cálida. Fondo oscuro y texto sobre claro |
| `--paper` | `#FAF8F4` | Papel. Fondo base |
| `--paper-2` | `#F2EDE5` | Arena |
| `--ink-2` / `--ink-3` | `#241D18` / `#3A302A` | Superficies y bordes sobre oscuro |

### Tres reglas que no son obvias

Salieron de medir contraste WCAG sobre el color computado contra el fondo real,
no de estimar. Romperlas rompe accesibilidad:

1. **El coral de marca no sirve para texto sobre papel.** `#FF4A1C` sobre
   `#FAF8F4` da **3,17:1** y el mínimo AA es 4,5. Para texto va `--coral-text`
   (**4,71:1**). El coral pleno queda para rellenos, bordes y superficies.
2. **`--on-dark-faint` (`#5C5049`) es solo para bordes.** Como texto da entre
   2,14 y 2,39:1. Para texto terciario sobre oscuro hay dos tokens según el
   fondo: `--on-dark-faint-2` sobre `--ink-2` y `--on-dark-faint-3` sobre
   `--ink`.
3. **Sobre coral, el texto va en tinta al 100%.** Al 75% cae a 3,99:1.

### Proporción 60-25-10-5

Arena 60, tinta 25, coral 10, ámbar 5. Es el motivo de la barra divisoria y
vive en CSS (`.proportion-bar span:nth-child(n)`), no repetido en el markup.
La variante invertida es la misma barra con `flex-direction: row-reverse`.

## Tipografía

| Familia | Uso | Pesos |
|---|---|---|
| **Big Shoulders Display** | Titulares, logo, cifras destacadas | 700, 800, 900 |
| **IBM Plex Sans** | Texto corrido | 400, 700 |
| **IBM Plex Mono** | Etiquetas, botones, datos, fuentes | 400, 500, 600 |

Los titulares van siempre en **mayúsculas**. El mono en versalitas con
`letter-spacing` alto (0.08–0.18em) es lo que da el registro técnico-editorial.

Las tres se sirven desde `assets/fonts/`, subset latin. Display y Sans son
variables (un archivo cubre el rango); Mono no tiene versión variable, van los
tres pesos por separado. El display se precarga porque el H1 es el elemento
más grande de la primera pantalla.

## Motivos

- **Grilla de fondo**: líneas cada 56px, 6% de opacidad sobre claro y 8% sobre
  oscuro. Es el motivo que aparece detrás del hero y de las secciones oscuras.
- **Barra de proporción**: 6px de alto, como divisor entre secciones.
- **Radio de esquina**: `--radius: 2px`. Casi recto a propósito. La excepción
  son las tarjetas, a 16px.

## Accesibilidad

Parte de la marca, no un agregado:

- Foco de teclado visible siempre: anillo de 3px, tinta sobre claro y papel
  sobre oscuro, con 3px de separación.
- Área táctil mínima de 24×24px en todo control (WCAG 2.2, 2.5.8).
- Todo texto llega a AA (4,5:1 normal, 3:1 grande).
- `prefers-reduced-motion` respetado, incluido el scroll suave.

## Lo que todavía no existe

- Foto real: el sitio no tiene una sola imagen propia.
- Kit comercial: portada de LinkedIn 1128×191, firma de mail, plantillas de
  propuesta y de slides.
- Versión del logo para fondos claros y oscuros como archivo distribuible.
