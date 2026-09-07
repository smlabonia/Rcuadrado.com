---
name: presentaciones-r2
description: Armar presentaciones, informes en lámina y cualquier entregable visual de R² Tech Partner respetando el manual de marca. Usalo cuando haya que generar un .pptx, maquetar un informe, hacer una portada, un separador, una lámina de contenido o un gráfico con la identidad de R². Cubre paleta, tipografía, anatomía de tarjeta, divisores, gráficos, y el control de calidad obligatorio.
---

# Presentaciones de R² Tech Partner

La fuente de verdad de la marca es el bloque `:root` de `css/styles.css`, y
`docs/marca.md` la documenta. Este skill traduce eso a láminas y agrega lo que
sólo se aprende maquetando.

**No inventes tokens.** Si un color o un tamaño no está acá ni en `styles.css`,
preguntá antes de improvisarlo.

## Cómo se genera

Con `pptxgenjs`. El generador de referencia es
`herramientas/marca/modelo-presentacion.mjs`: leelo antes de escribir uno nuevo,
porque ya tiene resueltos los motivos y las funciones auxiliares.

```bash
npm install pptxgenjs
node mi-presentacion.mjs salida.pptx
```

Una herramienta que arme presentaciones debe reusar las funciones de ese
generador —`barra`, `tarjeta`, `encabezado`, `pie`, `etiqueta`— en vez de
redibujarlas. Si necesitás una variante, agregala allá y usala desde acá.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| coral | `FF4A1C` | Señal de acción. **Sólo relleno** |
| coral-text | `CC3B16` | El coral para texto sobre claro |
| amber | `FFB020` | Apoyo. Nunca compite con el coral |
| amber-ink | `7A5000` | El ámbar para texto sobre claro |
| ink | `17120F` | Tinta cálida. Texto sobre claro |
| ink-2 | `241D18` | **Fondo oscuro de las láminas** |
| ink-3 | `3A302A` | Superficies y segmentos sobre oscuro |
| paper | `FAF8F4` | Fondo claro |
| paper-2 | `F2EDE5` | Arena. Relleno de tarjeta |
| line | `DCD5CA` | Bordes y separadores sobre claro |
| muted | `6E645C` | Texto secundario sobre claro |
| muted-2 | `4A423C` | Texto de cuerpo sobre claro |
| on-dark-muted | `B5ACA3` | Texto secundario sobre oscuro |

### Reglas de contraste que no se negocian

1. **El coral pleno no sirve para texto sobre papel** — 3,17:1 contra el 4,5 que
   pide AA. Para texto va `coral-text`. El coral pleno sí funciona como
   tipografía **sobre tinta**: es el caso del numeral grande de los separadores,
   y es el único.
2. **Sobre coral, el texto va en tinta al 100%.** Al 75% cae a 3,99:1.
3. Los fondos oscuros de lámina van en **ink-2, no en ink**. La tinta plena a
   pantalla completa golpea y no aporta.

## Tipografía

| Familia | Uso | Detalle |
|---|---|---|
| Big Shoulders Display | Titulares, isotipo, cifras destacadas | **Siempre en mayúsculas** |
| IBM Plex Sans | Texto corrido | |
| IBM Plex Mono | Etiquetas, datos, pies, fuentes | Versalitas con `charSpacing: 2` |

Tamaños: título de lámina 40pt, título de portada 62-66pt, cifra destacada
76pt, cuerpo 15pt, secundario 12-13pt, etiquetas mono 8-10pt.

### Las fuentes hay que instalarlas, y no alcanza con copiarlas

En `assets/fonts/` están sólo en `woff2`, que es formato web. PowerPoint no las
lee. `herramientas/marca/fuentes-escritorio.py` genera los `.ttf`.

**En Windows, copiar el archivo y escribir el registro no alcanza:** las
aplicaciones no ven la fuente hasta el próximo inicio de sesión. Hay que además
registrarla en la sesión con `AddFontResourceW` y avisar con `WM_FONTCHANGE`.

Verificá que estén visibles antes de confiar en un render:

```powershell
Add-Type -AssemblyName System.Drawing
(New-Object System.Drawing.Text.InstalledFontCollection).Families |
  Where-Object { $_.Name -like "*Plex*" -or $_.Name -like "*Shoulder*" }
```

Sin ese chequeo, PowerPoint sustituye por algo lo bastante parecido como para
que un render con sustituciones pase por bueno. Ya pasó.

## Motivos

### La barra de proporción 60-25-10-5

Arena 60, tinta 25, coral 10, ámbar 5, de 6px de alto. Es **el divisor** de la
marca: va bajo el encabezado de las láminas de contenido y bajo el título de
portadas y separadores.

**Cada segmento tiene que verse contra su fondo.** Sobre oscuro, el segmento de
tinta desaparece; sobre papel, el de arena. En los dos casos la barra se lee
cortada, como si empezara en el segundo segmento. Las sustituciones:

- Sobre oscuro: la tinta pasa a **ink-3**.
- Sobre papel: la arena pasa a **line**.

### La tarjeta

- Radio **16px** (0,14" a escala de lámina). Es la excepción al radio general de
  2px que fija el manual.
- Relleno **arena** sobre fondo papel; **papel** cuando la tarjeta va sobre arena.
- **Sin borde duro.** La separación del fondo la da una sombra apenas
  perceptible: `{ type: "outer", color: "8A7F74", blur: 10, offset: 2, angle: 90, opacity: 0.16 }`.
  Un borde de 1px sobre un relleno plano da una caja tosca.
- Padding interno 0,3". Etiqueta en mono arriba, contenido debajo.

### La grilla de fondo

Líneas cada 56px (0,583") al 6% sobre claro y 8% sobre oscuro. Va **sólo en
portadas y separadores**, nunca en láminas de contenido, donde compite con el
texto. Los valores ya calculados: `ECEAE6` sobre papel, `352E29` sobre ink-2.

## Anatomía de las láminas

**Encabezado de contenido.** Etiqueta de sección en mono coral-text arriba,
título en display mayúsculas debajo, y la barra de proporción como divisor.
**Sin fondo de color distinto**: el encabezado se define por la tipografía y el
divisor, no por una banda.

**Pie.** Línea en `line`, y tres bloques en mono 8pt: marca a la izquierda,
título del documento al centro, número de página a la derecha en muted-2.

**Portadas.** Tres variantes. Tinta —ink-2— por defecto. Papel para lo que se
imprime. Coral **sólo para propuestas comerciales**: el coral es señal de acción
y en un informe de hallazgos le da una energía que no corresponde.

**Separadores.** Numeral grande, título en display, bajada en Plex Sans, barra.
El numeral en coral pleno funciona sobre tinta.

## Gráficos

- **Dos series como máximo.** Coral para lo que hay hoy, tinta para la meta. Una
  tercera serie convierte cualquier gráfico en un ovillo.
- El coral como relleno de barra es su uso correcto.
- El ámbar queda libre para marcar una excepción, no para una tercera serie.
- Barras horizontales: el valor más alto **arriba**. PowerPoint invierte el
  orden de categorías, así que hay que pasar el arreglo al revés.
- Etiquetas de datos sobre coral: en tinta al 100%.
- En barras apiladas, `dataLabelPosition` debe ser `ctr`, `inEnd` o `inBase`.
  `outEnd` corrompe el archivo.
- Radar: `valAxisMajorUnit: 1`, si no los rótulos se amontonan en el centro.
- Ejes y grilla en `muted` y `line`, nunca en el color de la serie.

## Control de calidad, obligatorio

```bash
# 1. El archivo abre
PYTHONUTF8=1 python <skill pptx>/scripts/office/validate.py salida.pptx

# 2. Renderizar y MIRAR cada lámina
```

En esta máquina hay PowerPoint y no hay LibreOffice, así que el render fiel se
hace por COM:

```powershell
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($deck, $true, $false, $false)
$pres.Export($carpeta, "PNG", 1500, 844)
$pres.Close(); $ppt.Quit()
```

`PYTHONUTF8=1` es necesario: el validador lee el XML con la codificación de
Windows y se cae con los acentos y las comillas angulares.

**Mirá las imágenes.** Los tres defectos que aparecieron acá y que ninguna
validación detecta: un segmento de la barra invisible contra su fondo, una
fuente sustituida que se parece a la correcta, y una tarjeta que valida perfecto
y se ve tosca.

## Lo que todavía no existe

Del manual: el logo como archivo distribuible para fondos claros y oscuros, y
foto propia. Hoy el isotipo se dibuja como texto, lo que funciona sólo si el
display está instalado. Con un SVG o PNG se vuelve independiente de las fuentes.
