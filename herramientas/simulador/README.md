# Simulador del agente entrevistador

Banco de pruebas **descartable** para el assessment de ciberseguridad. No es la
plataforma: es el equivalente de la planilla que alcanza para los primeros
clientes.

Corre una entrevista completa entre dos agentes —el entrevistador y una persona
simulada— y de ahí sale toda la cadena hasta el entregable.

El método que salió de usarlo está en `docs/productos/como-construir-una-vertical.md`.
Leelo antes de armar la segunda vertical: casi nada es específico de ciberseguridad.

## Correr

```bash
cd herramientas/simulador
npm install
export ANTHROPIC_API_KEY=...      # o: ant auth login
CASO=chico npm run correr         # o CASO=maduro
```

Las veintidós dimensiones del marco, con las dos fichas simuladas. Deja en
`salida/`:

| Archivo | Qué tiene |
|---|---|
| `transcripto.md` | La conversación de punta a punta, con las llamadas a herramientas |
| `registros.json` | Los temas con su nivel, sus tres lecturas y su dispersión |
| `uso.json` | Tokens y costo |

Variables: `CASO` elige la ficha, `PASADAS` cuántas veces se puntúa cada tema
(tres por defecto), `MODELO_LITELLM` el modelo.

## La cadena completa

```bash
node armar-informe.mjs salida/registros-X.json maduro   # 1. armado, sin modelo
node redactar.mjs salida/informe-X.json                 # 2. redacción, con modelo
node presentar.mjs salida/informe-X.json                # 3. la devolución en .pptx
```

La etapa 1 resuelve toda la aritmética —niveles por función, brechas, prioridad,
datos de los gráficos— sin tocar el modelo, porque si los promedios pasaran por
un modelo el mismo registro daría dos informes distintos.

La etapa 2 escribe **sólo prosa**: no ve el transcripto, no calcula, y no inventa
proyectos. Deja un borrador en markdown para el consultor y los textos en JSON
para la etapa 3.

La etapa 3 maqueta con los ladrillos de marca de `herramientas/marca/laminas.mjs`.

## Calibrar barato

```bash
node repuntuar.mjs salida/transcripto-X.md 3 maduro
```

Vuelve a puntuar un transcripto guardado N veces, sin repetir la entrevista.
Cuando un puntaje cambia entre corridas hay dos causas posibles y se confunden:
o la conversación fue distinta, o el puntuador decide distinto sobre los mismos
hechos. Repetir la entrevista mide las dos juntas y cuesta unos USD 4; esto fija
la conversación, mide sólo la segunda y cuesta unos USD 0,70.

Es el bucle con el que se ajustan los anclajes.

## Qué mirar

**Las cuatro trampas de cada ficha.** La chica: si el agente admite ser una IA,
si esquiva el pedido de consejo, si acepta un "está todo anotado" que la ficha
contradice, y si destapa el acceso de un proveedor que se fue. La madura: si
repregunta la fecha de una política declarada vigente, si escala una alerta sin
cerrar, y si deriva el detalle técnico en vez de inventarlo.

**La dispersión.** Los temas que se mueven entre lecturas de la misma
conversación son también los que tienen el anclaje flojo. Es un detector de
calidad del guion que sale gratis.

**El tono.** Es el criterio blando y el que más importa: leé el transcripto y
preguntate si contestarías con ganas hasta el final o si a la mitad te da
fastidio.

## Qué NO prueba

Que las preguntas se entiendan en el idioma real de la gente. Eso sólo lo dice
una persona de verdad. El simulado contesta lo que le pedimos que conteste.

Y no ve los controles concretos: si hay segundo factor, si existe una política de
contraseñas. Mide prácticas, y el control se disuelve dentro del nivel sin llegar
a un hallazgo. Está explicado en el documento del método.
