# El agente entrevistador — ensamblado y prompt

> **Borrador de trabajo. No publicar.** Ensambla la ficha, el guion, la conducta
> y el esquema en algo ejecutable.

## La decisión de arquitectura: el estado no vive en el prompt

Si el agente lleva la cuenta de qué dimensiones cerró "de memoria", en una
conversación larga se le desordena: cierra temas que no cerró, repite otros, y
la promesa de repetibilidad se cae. **El estado vive en herramientas que
mantiene el sistema**, no en el contexto.

Esto además convierte las diez reglas de validación de
`esquema-de-salida.md` en algo estructural: no son instrucciones que el agente
puede desobedecer, son esquemas de herramienta que rechazan la llamada.

La más importante: **`cerrar_participacion` falla si queda alguna dimensión en
`sin_tocar` o `abierto`.** El agente no puede terminar antes de tiempo aunque
quiera; recibe el error y sigue. La regla 9 deja de depender de la buena
voluntad del modelo.

## Las herramientas

Son **siete**, todas dentro de una participación — el agente nunca ve lo que
contestó otra persona.

| Herramienta | Argumentos | Qué regla impone |
|---|---|---|
| `consultar_pendientes` | — | Da el avance honesto del hilo |
| `registrar_observacion` | `dimension_id`, `nota`, `cita_textual`, `rol_fuente` | Permite volver sin anclar el número temprano |
| `pedir_evidencia` | `dimension_id`, `que`, `por_que` | Pasaje de `declarado` a `respaldado` |
| `cerrar_dimension` | `dimension_id`, `nivel`, `hallazgo`, `cita_textual`, `cita_entregable`, `parafraseo`, `rol_fuente`, `esfuerzo` | Exige cita si hay nivel (regla 4) |
| `marcar_indeterminado` | `dimension_id`, `motivo`, `rol_que_sabria` | Exige motivo (regla 3) |
| `escalar` | `motivo`, `urgencia` | La regla de escalamiento |
| `cerrar_participacion` | — | **Falla si queda algo abierto** (regla 9) |

**El conflicto entre personas no es una herramienta de la entrevista.** Se
detecta en la síntesis, comparando dimensiones cerradas entre participaciones.
El motivo es de privacidad, no de diseño: si el agente que habla con el operario
supiera lo que dijo el dueño, podría filtrárselo al repreguntar, y ahí se cae la
promesa que le hicimos al entrevistado.

Todas con `strict: true`, para que los argumentos validen contra el esquema y no
haya que corregir a mano después.

`registrar_observacion` y `cerrar_dimension` separadas a propósito: si el agente
puntúa apenas escucha algo, ancla temprano y deja de repreguntar. Observa
mientras conversa; puntúa cuando cierra el tema, con los anclajes delante.

## Las capas del contexto

En este orden, que es el que aprovecha la caché — lo estable primero, lo volátil
al final:

| Capa | Contenido | Estabilidad |
|---|---|---|
| 1 | Conducta + mecánica + esquema | Igual para las seis verticales |
| 2 | Guion y anclajes de la vertical | Igual para todos los clientes de esa vertical |
| 3 | Ficha de contexto del cliente | Fija durante toda la corrida |
| 4 | La conversación | Cambia en cada turno |

Las capas 1 y 2 se cachean una vez y sirven para todos los clientes; la 3 se
cachea por corrida. Es lo que hace que el costo por entrevista quede en unos
pocos dólares en vez de crecer con cada turno.

## El prompt del sistema

```
Sos el entrevistador de R² Tech Partner. Tu trabajo es entender cómo funciona
hoy esta empresa en el tema que te toca, conversando con quien la conoce.

QUÉ ESTÁS HACIENDO
Estás relevando, no evaluando. La persona con la que hablás tiene que terminar
la conversación sintiendo que le preguntaste cómo hace las cosas, no que le
tomaste un examen. La medición existe y no es secreta, pero no es el marco de
esta charla.

CÓMO PREGUNTÁS
Preguntá por hechos, nunca por calidad. No "¿qué tan bien manejan los accesos?"
sino "¿qué pasa cuando entra alguien nuevo, quién le crea el usuario?".
Ante cualquier "sí" genérico, preguntá cuándo fue la última vez. Es lo que
convierte una afirmación en un hecho.
La intención no cuenta: "estamos por implementarlo" describe el futuro.
Registrá el presente y dejá la intención en el hallazgo.
"Creo", "me parece" y "debería" piden una repregunta por el hecho concreto. Si
no aparece un hecho, es indeterminado, no un nivel bajo.
Si te dicen que no saben, no insistas. Marcalo indeterminado anotando qué rol
sabría, y seguí.

QUÉ NUNCA HACÉS
No usás las palabras nivel, puntaje, madurez, evaluación, ni el nombre de
ningún estándar.
No reaccionás valorativamente. Ni "perfecto" ni "muy bien" ni "uy": elogiar le
enseña a la persona qué respuesta gusta, y desde ahí te contesta para agradar.
Usá acuse neutro, o repetí con sus propias palabras para confirmar que
entendiste.
No comparás con otras empresas ni con lo esperable.
No das consejo ni recomendaciones, aunque te los pidan. Derivá con calidez:
eso se ve en la devolución, tu parte ahora es entender cómo funciona hoy.
No registrás nombres de personas. Todo va por rol.

SI TE PREGUNTAN SI SOS UNA IA
Decí que sí, de inmediato y sin rodeos. Nunca te hagas pasar por una persona.

CÓMO TRABAJÁS
Consultá los pendientes cuando necesites saber qué falta. Anotá observaciones
mientras conversás y cerrá cada dimensión recién cuando tengas lo suficiente,
usando los anclajes.
Cuando alguien afirme algo que se puede mostrar, pedilo en el momento.
Contale a la persona por dónde van, en su idioma y no en el del marco: "ya
vimos cómo se maneja el acceso a los sistemas, ahora unas preguntas sobre
respaldos y después cerramos". Que sea verdad: si quedan tres temas abiertos,
no digas que ya casi terminan.
La conversación no termina por tiempo, termina por cobertura.

SI APARECE ALGO URGENTE
Un incidente en curso, un acceso activo de alguien que ya no trabaja ahí, algo
ilegal: escalalo para atención humana inmediata y decilo sin alarmar. Es lo
único que interrumpe la entrevista.

EL CIERRE
Agradecé el tiempo. No devuelvas resultados, no resumas hallazgos, no adelantes
nada del informe. Sí decí qué sigue y aproximadamente cuándo, con qué roles se
comparte, y recordá lo que quedó comprometido. Si insisten en saber cómo salió:
el panorama se arma con todas las áreas juntas y todavía no está.
```

Debajo van, como capas separadas: el guion con sus anclajes, y la ficha del
cliente.

## Configuración

| Parámetro | Valor | Motivo |
|---|---|---|
| Modelo | `claude-opus-5` | El producto es el criterio de la repregunta |
| `thinking` | `{type: "adaptive"}` | Decidir si repreguntar o cerrar es lo que hay que pensar |
| `output_config.effort` | `high` | Ajustar sólo con medición, no de entrada |
| Streaming | Sí | Conversación larga; evita timeouts y se siente en vivo |
| Herramientas | `strict: true` | Las reglas de validación se imponen al escribir |
| Caché | Sobre las capas 1-3 | Es lo que mantiene el costo por entrevista en pocos dólares |

Tres cosas que no van, porque el modelo las rechaza o sobran: `budget_tokens`
(se reemplazó por `effort`), prefill del turno del asistente, y cualquier
instrucción de "no pienses".

**Sobre el estilo del prompt:** está escrito como encuadre y reglas, no como
árbol de decisión. Guionar cada rama lo empeora — la capacidad de decidir
cuándo repreguntar es justamente lo que estamos comprando.

## Segundo paso: la síntesis

La entrevista no escribe el informe. Un segundo paso toma todos los registros de
la corrida y revisa consistencia: que los anclajes se hayan aplicado igual entre
dimensiones, que ninguna cita contradiga su puntaje, que los conflictos estén
marcados. Recién después se genera la prosa.

Ese paso es el "revisor" del control de calidad, y es donde una persona mira
antes de que nada salga.

## Cómo se prueba

1. **Cliente simulado.** Un caso escrito con respuestas fijas, incluidas las
   difíciles: el que contesta vaguedades, el que se contradice con otro, el que
   pregunta si es una IA, el que pide consejo.
2. **Correrlo tres veces.** Los puntajes tienen que dar iguales. Si no dan, o
   los anclajes son ambiguos o el prompt es blando.
3. **Casos trampa.** Uno donde el entrevistado afirme algo que la ficha
   contradice; el agente tiene que marcar conflicto, no elegir.

## Pendiente

- Escribir los esquemas JSON de las siete herramientas.
- Escribir el primer cliente simulado.
- Decidir dónde corre esto: qué usa la persona para lanzar una entrevista y qué
  recibe el entrevistado — un link, un chat, un formulario conversacional.
