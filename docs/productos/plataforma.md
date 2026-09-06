# Plataforma de assessments — nota de arquitectura

> **Borrador de trabajo. No publicar. No se desarrolla todavía.** Es la
> descripción del destino, para que las decisiones de producto que tomamos
> ahora no lo contradigan.

## El modelo

Tres entidades, más una que aparece al cruzar el ruteo del guion con los
permisos:

| Entidad | Qué es | Quién la crea |
|---|---|---|
| **Tipo de assessment** | La plantilla: vertical, guion, anclajes, esquema, topes por sabor | Administrador |
| **Assessment** | Una corrida para un cliente, con sus parámetros y su ficha | Administrador |
| **Participación** | Una persona × el subconjunto de dimensiones que le toca | Administrador, al asignar |
| **Sesión** | Una conversación reanudable dentro de una participación | El participante |

**La participación es la entidad que faltaba en nuestros documentos.** El ruteo
del guion —GOVERN al dueño, ID.AM a sistemas, GV.PO también a un empleado
cualquiera— deja de ser una tabla en un markdown y pasa a ser datos: a cada
persona se le asignan sus dimensiones y sólo ve las suyas.

**Consecuencia sobre la regla 9.** `cerrar_entrevista` cierra la
*participación*, no el assessment: falla si queda abierta alguna dimensión **de
esa persona**. El assessment cierra cuando todas las participaciones cerraron.
La máquina de estados tiene dos niveles, no uno.

## Versionado de plantillas

Es lo que siempre se olvida y lo que rompe el benchmark. Si se cambia un anclaje
del guion, los assessments anteriores no pueden quedar comparados contra la
regla nueva: estarían midiendo cosas distintas con el mismo número.

**Cada corrida queda fijada a la versión del tipo de assessment con la que se
ejecutó**, y esa versión no se edita nunca — se publica una nueva. Es la
condición para que la promesa de "misma información final" sobreviva a la
tercera corrección del guion.

## Persistencia

**PostgreSQL alcanza.** No hace falta una base no estructurada.

| Dato | Dónde | Por qué |
|---|---|---|
| Corridas, participaciones, hallazgos, contexto, sistemas, evidencia, permisos, auditoría | Tablas | Es relacional y se consulta |
| Transcripto de la conversación, incluidas las llamadas a herramientas | `jsonb` | Semiestructurado; Postgres lo maneja sin traer otra base |
| Archivos de evidencia: capturas, políticas en PDF, planillas de inventario | Almacenamiento de objetos | Los binarios no van en la base; la tabla guarda metadatos y la clave |
| Búsqueda semántica entre assessments, si algún día hace falta | `pgvector`, en la misma base | No se necesita para empezar, y cuando se necesite no obliga a otra base |

Eso responde la duda: lo "no estructurado" que vas a tener son **archivos**, y
van a almacenamiento de objetos, no a una base documental.

## Permisos, que son más finos de lo que parecen

De acá depende que la gente conteste con sinceridad. Si el jefe de planta
sospecha que el dueño va a leer sus respuestas, el instrumento deja de medir.

- **El participante** ve su propia conversación y nada más. Ni las respuestas de
  otros, ni ningún puntaje, ni el avance general.
- **El coordinador del cliente** ve **si** cada participación está completa, no
  **qué** contestó cada uno.
- **El consultor** ve todo, incluidas las citas literales.
- **El cliente**, en el informe, ve lo que la regla de `cita_entregable` deje
  pasar.

Que el coordinador no vea las respuestas individuales no es un detalle técnico:
es lo que se le promete al participante en el cierre de la entrevista, así que
tiene que ser cierto en el sistema y no sólo en el discurso.

## Identidad de los participantes

Enlace personal, firmado, **reanudable**, con vencimiento. Enviado por correo o
WhatsApp. **Usuario y contraseña es una pared**: un jefe de planta en Añelo
contestando desde el celular no crea una cuenta, abandona.

Reanudable es lo importante, porque las entrevistas están cortadas en bloques de
15 a 20 minutos a propósito y nadie termina de una sentada:

- El mismo enlace se abre las veces que haga falta hasta que la participación
  cierra. Cada apertura es una **sesión**; la participación las agrupa.
- Al volver, el agente reencuadra en una línea: qué se vio, qué falta, cuánto
  queda. No arranca de cero ni finge que no pasó el tiempo.
- Vence por tiempo —tres semanas es razonable— o al cerrar la participación, lo
  que pase primero. Se puede reemitir; el anterior muere.
- Como el token viaja en la URL, la sesión se retoma desde otro dispositivo sin
  fricción. La contracara es que quien tenga el enlace puede contestar: hay que
  asumirlo, poder revocarlo, y no mandarlo a listas.

**Si alguien nunca termina**, la participación se marca `abandonada` y sus
dimensiones abiertas pasan a `indeterminado` con motivo. El assessment puede
cerrar igual y la falta queda escrita en la sección 10 del informe. Sin esa
salida, una persona de vacaciones bloquea el entregable entero.

**Recordatorios** a los 3 y a los 7 días. El coordinador del cliente ve "2 de 4
completas" — nunca el contenido.

## Seis cosas operativas que van a doler si no se piensan

1. **Reanudación.** El estado vive en la base, no en la memoria del servidor.
   Los servidores de aplicación son descartables.
2. **Idempotencia.** Si se corta la conexión en medio de una llamada a
   herramienta, el agente puede reintentar. `cerrar_dimension` dos veces no
   puede crear dos registros: la clave natural es participación + dimensión.
3. **Límites por participación.** Una conversación desbocada es costo real. Tope
   de turnos y de tokens, con corte elegante.
4. **Registro de uso por corrida.** Es lo que convierte la estimación de USD
   20-40 en un número medido, y lo que sostiene el argumento de precio.
5. **Auditoría.** Quién vio qué y cuándo. Sirve para la confianza del cliente y
   para defenderse si alguien discute un puntaje.
6. **Retención y borrado.** El transcripto es el dato más sensible del sistema:
   tiene citas literales que identifican personas. La política de retención y el
   borrado a pedido del cliente son función del producto, no un agregado. Es la
   decisión de confidencialidad que quedó pendiente, hecha software.

## Cuándo construirla

Hoy no. Los primeros tres a cinco assessments se pueden correr con mucho menos
—el agente, los archivos del guion y una planilla— y esa es la forma de
descubrir qué preguntas no funcionan.

Construir la plataforma antes de que el guion sobreviva a un cliente real es
construir la plataforma equivocada: es la misma trampa que marcamos para el
mapeo de procesos, aplicada al software propio.

**El umbral para empezar a construirla** es cualquiera de estos tres:

- El guion dejó de cambiar entre corridas.
- Coordinar participantes a mano cuesta más que el desarrollo.
- Hay dos assessments corriendo a la vez.

## Pendiente

- Elegir la nube. Condiciona la respuesta a "dónde se procesan mis datos", que
  el cliente va a preguntar.
- Decidir si el borrado a pedido es total o preserva los puntajes anonimizados
  para el benchmark. No es obvio y hay que poder explicarlo.
