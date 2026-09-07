# Modelo de presentación

Genera el `.pptx` de plantilla que documenta el manual de marca en formato
lámina: portadas, agendas, separadores, contenido y gráficos.

```bash
npm install pptxgenjs
node modelo-presentacion.mjs modelo-r2.pptx
```

El generador está acá y no sólo el archivo, para que la plantilla se pueda
rehacer cuando cambie un token de `css/styles.css`. Si alguien edita el `.pptx`
a mano, el generador queda atrás: ahí el archivo pasa a mandar y esto queda como
referencia de cómo se armó.

## Tipografías

Usa los nombres reales de la marca —Big Shoulders Display, IBM Plex Sans, IBM
Plex Mono—. En `assets/fonts/` sólo están en `woff2`, que es formato web:
PowerPoint no los lee. Para que la plantilla se vea como corresponde hay que
instalar las versiones de escritorio en la máquina de quien la use. Las tres son
gratuitas y abiertas.

Sin ellas, PowerPoint sustituye y el registro condensado del display se pierde.
Sigue siendo legible, pero deja de ser la marca.

## Lo que resuelve y lo que no

Resuelve la aplicación del manual a láminas. No resuelve lo que el propio manual
declara faltante: el logo como archivo distribuible para fondos claros y
oscuros, y la foto propia. La plantilla usa el isotipo como texto, que funciona
mientras el display esté instalado.

## Instalar las tipografías

`fuentes-escritorio.py` genera los `.ttf` desde los `woff2` del sitio. En
Windows, copiar los archivos y escribir el registro **no alcanza**: las
aplicaciones no ven la fuente hasta el próximo inicio de sesión. Hay que
registrarlas también en la sesión con `AddFontResourceW` y avisar con
`WM_FONTCHANGE`.

```powershell
# por usuario, sin permisos de administrador
$dst = "$env:LOCALAPPDATA\Microsoft\Windows\Fonts"
# copiar los .ttf a $dst, registrarlos en
# HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts
# y después AddFontResourceW por archivo + SendMessage WM_FONTCHANGE
```

Para desinstalarlas: borrar los `.ttf` de esa carpeta y sus valores del
registro en `HKCU`.
