"""Genera las tipografías de escritorio a partir de las de la web.

En assets/fonts/ las tres familias están sólo en woff2, que es formato web:
PowerPoint, Word y el sistema no lo leen. Esto produce los .ttf equivalentes
para instalar en una máquina.

    pip install fonttools brotli
    python fuentes-escritorio.py salida/

Dos de las tres son variables —Big Shoulders 700-900 e IBM Plex Sans 400-700— y
PowerPoint las maneja mal: renderiza una instancia que no es la que se pidió.
Por eso de cada variable se generan dos estáticas, y el name table se reescribe
para que Windows las empareje como una familia con su negrita.

El subset es el mismo que sirve el sitio (latin). Alcanza para castellano,
incluidos los acentos, la apertura de interrogación y el ² del isotipo.
"""

import os
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ORIGEN = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "fonts")

# familia, subfamilia, archivo de origen, eje de peso (None si ya es estática),
# y el usWeightClass que corresponde declarar.
CARAS = [
    ("Big Shoulders Display", "Regular", "big-shoulders-display-700-900.woff2", 700, 700),
    ("Big Shoulders Display", "Bold", "big-shoulders-display-700-900.woff2", 900, 900),
    ("IBM Plex Sans", "Regular", "ibm-plex-sans-400-700.woff2", 400, 400),
    ("IBM Plex Sans", "Bold", "ibm-plex-sans-400-700.woff2", 700, 700),
    ("IBM Plex Mono", "Regular", "ibm-plex-mono-400.woff2", None, 400),
    ("IBM Plex Mono", "Bold", "ibm-plex-mono-600.woff2", None, 600),
]


def generar(destino):
    os.makedirs(destino, exist_ok=True)
    for familia, subfamilia, archivo, wght, peso in CARAS:
        fuente = TTFont(os.path.join(ORIGEN, archivo))
        if "fvar" in fuente:
            fuente = instancer.instantiateVariableFont(
                fuente, {"wght": wght}, inplace=False, updateFontNames=False
            )

        completo = familia if subfamilia == "Regular" else f"{familia} {subfamilia}"
        postscript = (familia + subfamilia).replace(" ", "")
        for reg in fuente["name"].names:
            if reg.nameID == 1 or reg.nameID == 16:
                reg.string = familia
            elif reg.nameID == 2 or reg.nameID == 17:
                reg.string = subfamilia
            elif reg.nameID == 3:
                reg.string = f"{postscript};R2"
            elif reg.nameID == 4:
                reg.string = completo
            elif reg.nameID == 6:
                reg.string = postscript

        negrita = subfamilia == "Bold"
        fuente["OS/2"].usWeightClass = peso
        # fsSelection: bit 0 itálica, bit 5 negrita, bit 6 regular. Se limpian
        # los tres y se enciende uno solo; dejar dos encendidos hace que el
        # validador proteste y que Windows empareje mal la familia.
        fuente["OS/2"].fsSelection = (fuente["OS/2"].fsSelection & ~0x61) | (
            0x20 if negrita else 0x40
        )
        fuente["head"].macStyle = 1 if negrita else 0

        fuente.flavor = None
        salida = os.path.join(destino, f"{familia.replace(' ', '')}-{subfamilia}.ttf")
        fuente.save(salida)
        print(f"  {os.path.basename(salida)}")


if __name__ == "__main__":
    generar(sys.argv[1] if len(sys.argv) > 1 else "ttf")
