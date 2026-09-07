# Informe de assessment de ciberseguridad — esqueleto

> **Borrador de trabajo. No publicar.** Primera pieza del producto de
> ciberseguridad. Define qué secciones tiene el entregable y qué dato alimenta
> cada una — de acá sale el esquema de salida del agente, no al revés.

Base: NIST CSF 2.0. Escala común 0-5. Método: entrevista agéntica más criterio
humano. Todo eso está en `docs/assessments-madurez.md`.

## Dos lectores, un solo documento

| Lector | Qué necesita | Cuánto lee |
|---|---|---|
| **Dueño o gerente general** | Si está en riesgo, cuánto cuesta arreglarlo, qué hace el lunes | Las primeras 3 páginas |
| **Técnico interno o proveedor de TI** | El detalle por función, para discutir puntajes | Todo, y va a discutir |

La consecuencia de diseño: **las primeras tres páginas tienen que sostenerse
solas**. La mayoría de los dueños no pasa de ahí, y está bien que así sea.

Extensión objetivo: 12 a 16 páginas. Más que eso no se lee; menos no se paga.

## Las secciones

| # | Sección | Qué muestra | De dónde sale | Páginas |
|---|---|---|---|---|
| 0 | *(insumo, no sección)* | La ficha de contexto se completa antes de entrevistar | Ver `alcance.md` | — |
| 1 | **Portada y alcance** | Cliente, fecha, qué se evaluó y qué no, roles que participaron, versión del método | Metadatos de la corrida | 1 |
| 2 | **Resumen ejecutivo** | Nivel general, las tres cosas que más urgen, qué pasa si no se hace nada | Agregado + las 3 de mayor prioridad | 1 |
| 3 | **Cómo leer esto** | La escala 0-5, por qué la meta es 3, los estados de evidencia | Fijo, no cambia entre clientes | 0,5 |
| 4 | **El panorama** | Radar de las seis funciones + barra de estados de evidencia | `nivel` y `estado_evidencia` de todas las dimensiones | 1 |
| 5 | **La brecha priorizada** | Tabla: dimensión, nivel, meta, brecha, esfuerzo, prioridad | El esquema completo, ordenado | 1-2 |
| 6 | **Hallazgos por función** | Seis bloques: Gobernar, Identificar, Proteger, Detectar, Responder, Recuperar | Un registro por dimensión | 5-6 |
| 7 | **Riesgo en términos de la operación** | Qué se detiene, cuánto tarda en volver, qué cuesta | Ficha de contexto + criterio humano | 1 |
| 8 | **Cumplimiento** | Ley 25.326 e inscripción ante la AAIP, Res. 47/2018, Ley 26.388 | Bloque de preguntas de cumplimiento | 0,5 |
| 9 | **Plan de trabajo** | Proyectos con qué resuelven, qué dimensiones mueven, esfuerzo y plazo | **No sale de la entrevista.** Taller posterior sobre los hallazgos | 2 |
| 10 | **Qué no se evaluó** | Fuera de alcance, e indeterminados con su motivo | `estado_evidencia = indeterminado` | 0,5 |
| 11 | **Anexo de evidencia** | Qué se pidió, qué llegó, qué falta | `evidencia_solicitada` / `evidencia_recibida` | 1 |

### Las tres que hacen la diferencia

**Sección 4 — el panorama.** El radar lo tiene cualquiera. Lo que no tiene nadie
es la barra de al lado: cuánto de ese puntaje está declarado, cuánto respaldado
y cuánto verificado. Una organización que no puede mostrar evidencia de lo que
afirma tiene un problema de gestión además de uno de madurez, y esa barra lo
dice sin acusar a nadie.

**Sección 9 — el plan.** No son recomendaciones, son proyectos: con nombre,
alcance, esfuerzo y orden. Es el puente a la ejecución y la razón por la que el
assessment se acredita contra el primer proyecto.

**Sección 10 — qué no se evaluó.** La que nadie pone y la que más confianza
construye. Declara lo que quedó fuera del alcance y lo que no se pudo
determinar, con el motivo. Es la contracara honesta de vender un diagnóstico
barato: el cliente sabe exactamente qué compró.

## Decisiones tomadas

1. **Número y meta, nunca el número solo.** Siempre "2 → meta 3". El número
   aislado invita a discutir el número; al lado de la meta, la conversación se va
   a la brecha. El número se guarda igual para el benchmark.
2. **Roles, no personas.** En todo el informe. Es lo que hace que la gente hable
   con sinceridad y lo que evita que el informe se use en una interna.
3. **La cita textual no se entrega si compromete.** Regla operativa, para que no
   quede a criterio del día: se parafrasea cuando *cualquiera* de las dos es
   cierta — se puede deducir quién lo dijo, o el contenido perjudica a quien lo
   dijo. En los demás casos se puede entregar textual. La cita siempre existe en
   el registro interno: es el respaldo del puntaje si alguien lo discute.
4. **El plan no sale de la entrevista.** Se trabaja después, sobre los
   hallazgos, en un taller con el cliente. La entrevista mide; el plan se
   construye. Consecuencia para el esquema: el agente **no** propone proyectos,
   sólo deja el hallazgo con su brecha y su esfuerzo estimado.
5. **Lenguaje directo sobre la práctica, nunca sobre la persona.** "No hay nadie
   con responsabilidad asignada sobre los backups", no "el encargado de sistemas
   no se ocupa". Sin adjetivos de catástrofe: los hechos asustan solos, y el
   miedo inflado es otra forma de mentirle al cliente.

## El taller de plan, que es más que un trámite

Que el plan se construya después y con el cliente no es una concesión, es una
ventaja. Un plan que el cliente ayudó a armar es un plan que el cliente
defiende internamente, y la reunión donde se arma es la conversación natural
sobre quién ejecuta. Es el mejor puente a la ejecución que tiene el producto.

Consecuencia de entrega: el informe se presenta en dos momentos —hallazgos
primero, plan después— o se entrega completo tras el taller. Hay que elegir una
y que sea siempre la misma.
