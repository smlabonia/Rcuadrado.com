# Alcance, ficha de contexto y sabores

> **Borrador de trabajo. No publicar.**

Un assessment del 100% de una empresa no existe a este precio, y prometerlo
sería la primera mentira. Lo que sí existe es un alcance declarado, con tope, y
sabores distintos para necesidades distintas.

## Paso 0 · La ficha de contexto

Se completa **antes** de la primera entrevista, en unos 15 minutos, con quien
coordina del lado del cliente. No es una entrevista: es un formulario de hechos.

Hace cuatro cosas a la vez:

1. **Define el alcance** — qué sistemas y qué áreas entran.
2. **Personaliza al agente** — no preguntar por SCADA donde no hay planta.
3. **Alimenta la sección 7 del informe** — el riesgo en términos de la
   operación, que no sale de ningún marco sino del negocio.
4. **Es la primera medición.** Ver abajo.

### Qué pide

| Bloque | Campos |
|---|---|
| **Identidad** | Actividad, dotación, áreas, ubicaciones, si hay planta u OT |
| **Operación** | Horario, temporada crítica, qué se detiene si se cae todo, cuánto se tolera |
| **Sistemas** | Nombre, qué proceso sostiene, quién lo provee, dónde corre, cuántos usuarios, si tiene datos personales |
| **Quién hace TI** | Interno, proveedor o nadie; cuántas personas; qué dice el contrato |
| **Antecedentes** | Incidentes de los últimos 24 meses, auditorías previas, requisitos que pidan clientes |
| **Cumplimiento** | Si tratan datos personales de terceros, si están inscriptos ante la AAIP |
| **Restricciones** | Qué no se puede tocar, con quién no se puede hablar, qué no se puede preguntar |

### La ficha ya es una medición

Si el cliente **no puede completar el bloque de sistemas**, eso no es un
contratiempo administrativo: es el primer hallazgo, y es grave. La función
IDENTIFY del CSF 2.0 arranca justamente en gestión de activos — no se puede
proteger lo que no se sabe que existe.

Así que la ficha se puntúa: completarla sin esfuerzo es un 3 o más en gestión de
activos; reconstruirla a mano durante una semana es un 1. **La definición del
alcance y la primera medición son el mismo acto**, y eso hay que decírselo al
cliente en la devolución, no guardárselo.

## Los topes del alcance base

Sin tope, el alcance se desborda y se rompe la promesa de "mismo alcance,
mismo precio". El assessment base cubre:

| Límite | Valor |
|---|---|
| Sistemas | Hasta 10 |
| Áreas | Hasta 6 |
| Entrevistados | Hasta 10 |
| Ubicaciones | 1 |
| Profundidad | Las seis funciones del CSF 2.0, un nivel |
| Evidencia | Declarado, más la documental que el cliente aporte |

Lo que excede el tope no se hace gratis ni se rechaza: se cotiza como extensión
o se pasa a otro sabor. Y lo que quedó afuera va escrito en la sección 10 del
informe, con nombre.

## Los sabores

| Sabor | Qué agrega | Para quién |
|---|---|---|
| **Panorama** *(base)* | Las seis funciones, todo declarado más evidencia documental | El 101 generalizado. La puerta de entrada |
| **Con verificación** | Comprobación técnica acotada: identidad y accesos, restauración real de un backup, exposición externa | Quien necesita saber si lo que le dijeron es cierto |
| **Con planta** | Módulo OT sobre C2M2 o IEC 62443 | Industria con SCADA, instrumentación o control |
| **Seguimiento** | Re-medición contra la línea de base | Quien ya hizo uno |

**El sabor Panorama declara su propio límite.** Mide amplitud, no profundidad:
distingue con confianza un 0-2 de un 3 o más, pero no un 3 de un 4. Eso se dice
en la sección 3 del informe, al principio, no se descubre al final. Es la
contracara honesta de un diagnóstico accesible.

**Seguimiento es el sabor que le falta al negocio.** Un assessment de una sola
vez no genera recurrencia. Una re-medición a los 6 o 12 meses cuesta bastante
menos —la ficha y la línea de base ya existen—, le muestra al cliente que se
movió, y es lo que hace crecer el benchmark propio. Conviene ofrecerlo desde el
primer informe, no inventarlo después.

## Pendiente

- Fijar el precio de cada sabor. Sólo Panorama tiene número (USD 2.000).
- Decidir si el sabor Con verificación lo ejecuta la consultora o se terceriza.
- Escribir la ficha como formulario real, listo para mandar.
