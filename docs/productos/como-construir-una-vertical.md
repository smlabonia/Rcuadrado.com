# Cómo construir la próxima vertical

> **Borrador de trabajo. No publicar.** Lo que aprendimos construyendo
> ciberseguridad, escrito para que la segunda vertical no vuelva a descubrirlo.
> Casi nada de acá es específico de ciberseguridad.

Ciberseguridad se construyó midiendo: unas veinte corridas del banco de pruebas
contra dos empresas simuladas. Los números que aparecen en este documento son de
esas corridas, no estimaciones. Donde algo no se midió, lo dice.

## El orden

1. **Acordar la posición deseada antes de medir.** La brecha es contra una meta,
   y si la meta no existe, el informe no puede proponer proyectos. Va en la ficha
   de contexto, conversada con el cliente. Hasta que exista, el valor por defecto
   es 3, que es la meta realista que fija `../assessments-madurez.md`.
2. **Escribir las dimensiones con sus anclajes.** Una por categoría del estándar
   que se haya elegido como núcleo.
3. **Escribir dos fichas simuladas**, no una. Ver abajo.
4. **Correr tres veces con la configuración congelada** y mirar la dispersión
   antes de creerle a ningún puntaje.
5. **Calibrar los anclajes que bailen**, repuntuando transcriptos guardados.
6. Recién ahí, el entregable.

## Las dos fichas simuladas

**Una desordenada y una ordenada.** Con una sola no se distingue un instrumento
prudente de uno incapaz: si todo da 1, no sabés si el agente sabe reconocer un 3.
La ordenada además ejercita los anclajes de arriba, que con la chica no se tocan
nunca.

Cada ficha necesita:

- **Hechos fijos**, que son lo que permite comparar corridas. Lo que varía entre
  corridas es cómo los cuenta la persona, no qué pasó.
- **Trampas**, y hay que verificar que se disparen. En ciberseguridad son cuatro
  por ficha: algo que la persona sólo recuerda si le preguntan de cierta manera,
  una sobredeclaración que se cae al repreguntar, un pedido de consejo, y una
  pregunta sobre si es una IA.
- **Hechos para cada dimensión del guion.** Parece obvio y es el error más fácil:
  si sumás dimensiones y no sumás hechos, las corridas dan "no sé" en todo y
  medís el hueco de la ficha, no el instrumento.
- **Un registro de habla propio.** Una ficha que habla coloquial y otra que habla
  en difícil prueban los dos bordes: que el agente no espeje el habla de la
  persona ni se vaya a la jerga del marco.

## Los anclajes

**El error que más cuesta: dos anclajes ciertos a la vez.** Fue la causa de la
mitad de la inestabilidad que medimos. Con la primera versión de ciberseguridad,
**siete de nueve temas daban un nivel distinto entre corridas idénticas**. Después
de desambiguar dos anclajes, quedaron tres de nueve.

Cómo se arregla: **escribiendo qué excluye a cada nivel, no agregando texto.**

- Mal: `1 = El que sabe de computadoras, sin mandato` / `2 = Hay alguien
  reconocido informalmente por todos`. Las dos son ciertas del mismo tipo.
- Bien: `1 = Recae en el que sabe de computadoras, sin mandato ni tiempo
  asignado. Puede estar reconocido de hecho por todos: eso solo no lo sube` /
  `2 = Además de estar reconocido, tiene tiempo efectivamente asignado`.

La diferencia entre niveles tiene que ser **un hecho verificable**, no una
impresión. "Tiempo asignado" se puede preguntar; "reconocido informalmente" no.

Cuando dos anclajes se pisan sin remedio, sumá una `regla_especial` que declare
el desempate.

## Cuando el esperado y el instrumento no coinciden, sospechá del esperado

Pasó **cinco veces** en una sola sesión. En todas, el anclaje describía
correctamente a la empresa y el esperado estaba mal puesto por quien lo escribió
—yo— pensando "esta empresa es un desastre, todo es 1".

El método para distinguirlo, y usa datos que ya se guardan: **leer la cita con la
que el puntuador justificó el nivel.**

- Si la cita respalda el anclaje que eligió → **la vara está mal**.
- Si la cita dice lo contrario del anclaje → **el instrumento leyó de más**.

De cinco casos analizados así, tres eran la vara y dos el instrumento. Los dos
reales compartían firma: el puntuador citaba una frase que decía justo lo
contrario de lo que el anclaje pedía.

## Las reglas del prompt

**Nombrá hechos observables, no categorías.** Es la diferencia entre una regla
que dispara y una que no.

La regla de escalamiento decía "un incidente en curso". Disparaba **una de cada
dos veces**. Reescrita como una lista de hechos —un acceso que sigue abierto para
alguien que ya no trabaja, una alerta que se repite sin cerrarse mientras el
equipo sigue en uso, una contraseña compartida por gente de afuera— pasó a
disparar siempre.

**Explicá el porqué.** Sin el motivo, el modelo trata la regla como preferencia
de estilo y la abandona bajo presión.

**Las reglas duras van en las herramientas, no en el prompt.** Una instrucción se
puede desobedecer; una llamada que falla, no. El tope de nivel por ficha
incompleta funciona perfecto porque es una validación, no un pedido.

## Las preguntas que van solas

Algunas preguntas dependen de que la persona **recuerde** algo que nadie ofrece
por su cuenta. Esas no se empaquetan con otras.

Medido: con nueve dimensiones, el hallazgo más valioso del caso chico —un acceso
de proveedor abierto hacía dos años— aparecía en seis de siete corridas. Con
veintidós dimensiones **se perdió en dos de tres**: el agente, presionado por la
cobertura, juntaba tres preguntas en una y la pregunta comprimida dejaba de
disparar el recuerdo.

La solución no fue pedirle que no comprima. Fue **marcar esas preguntas en el
guion**, pegadas a su dimensión, con el motivo explícito. Y ojo con cuál marcar:
la que destapó el hallazgo no fue la pregunta precisa sobre bajas de proveedores,
sino una general —"¿hay algo dando vueltas ahora mismo sin resolver?"—. Una
pregunta abierta y sin tema rinde más como gatillo de recuerdo que una específica.

**Consecuencia de diseño:** más de diez o doce dimensiones por conversación
degrada la calidad de las preguntas. Repartir por rol deja de ser una
recomendación.

## Las herramientas de escape necesitan un blanco

`marcar_indeterminado` no se usó **ni una vez en quince corridas**. No era que el
agente la ignorara: no había ningún caso donde correspondiera. Cuando se diseñó
en la ficha una dimensión genuinamente no establecible —una empresa que nunca
tuvo un incidente que cerrar, con instrucción explícita de no inventarlo—, se usó
en la primera oportunidad.

Antes de concluir que una herramienta no funciona, verificá que haya tenido un
caso.

Lo mismo con `derivar`: si reforzás la regla de derivar sin decir **qué** se
deriva, el agente deriva la conversación entera y perdés los hallazgos. La
formulación que funcionó: *derivás el dato que falta, no la conversación; nunca
derives un tema que todavía no exploraste*.

## Puntuar

**Separá conversar de puntuar.** El entrevistador da un tema por cubierto y dice
por qué; el nivel lo pone un paso aparte, con los anclajes de una sola dimensión
delante.

**Puntuá al final, no al cerrar cada tema.** Si se puntúa en el momento del
cierre, un tema cerrado temprano se decide con cuatro intercambios de material y
uno cerrado al final con veinte, y el orden de cierre cambia en cada corrida.

**Tres pasadas por tema.** Sobre la misma conversación, **uno de cada cinco temas
da un nivel distinto entre lecturas**. Con una sola pasada, cuatro o cinco temas
por assessment saldrían de un sorteo sin que nadie lo sepa. Además, **3 de 123
llamadas volvieron sin JSON parseable**: la redundancia cubre eso de regalo.

Se reporta **el más votado, no el promedio**: los niveles son anclajes con texto,
y un 1,67 no corresponde a ninguna descripción ni se puede respaldar con una
cita. El promedio queda al lado para gráficos agregados.

**El cartel dice lo que pasó, no lo que significa.** Tres lecturas iguales
indican que el instrumento es consistente, no que tenga razón: un nivel mal
calibrado también coincide consigo mismo. Nunca escribas "alta confianza".

**La dispersión detecta anclajes flojos.** Los temas que se mueven entre lecturas
resultaron ser casi los mismos que estaban en disputa por calibración. Es un
detector de calidad del guion que sale gratis.

## El bucle barato de calibración

Repetir la entrevista para probar una redacción de anclaje cuesta unos **USD 4** y
la conversación cambia debajo, así que no se puede atribuir nada.

Repuntuar un transcripto guardado cuesta unos **USD 0,70** con la conversación
constante. Es la diferencia entre ajustar a ciegas y ajustar mirando.
`herramientas/simulador/repuntuar.mjs` hace eso y sirve para cualquier vertical.

## El entregable, en tres etapas

1. **Armado, sin modelo.** Promedios, brechas, orden de prioridad, datos de cada
   gráfico. Todo lo que es aritmética. Si esto pasara por un modelo, el mismo
   registro daría dos informes distintos.
2. **Redacción, con modelo y acotada.** Sólo prosa. No ve el transcripto, así que
   no puede filtrar una cita marcada como no entregable; no calcula, y se
   verifica que cada cifra del texto exista en el informe; no inventa proyectos.
3. **Render, sin modelo.**

Entre la 1 y la 2 va el paso humano, y **tiene que ser un artefacto, no una
edición a mano**: si el consultor corrige un nivel editando un Word, se pierde la
trazabilidad que hace defendible al instrumento. Guardá los dos valores, el del
instrumento y el humano, con quién lo cambió y por qué. Eso además acumula el
dato de dónde el instrumento se corre sistemáticamente, que es la calibración de
la próxima versión.

## Los proyectos

No hay catálogo al principio y no hay que inventarlo: los proyectos son a medida
para cubrir la brecha contra la posición deseada. Lo que sí funciona es que la
redacción proponga **dos o tres caminos por cada tema con brecha**, con distinto
alcance —uno mínimo que resuelve lo básico, otro que deja la práctica instalada.

Cada propuesta lleva **esfuerzo** e **impacto**, y de ahí sale la prioridad:
primero el mayor impacto, y a igual impacto el menor esfuerzo.

Pedí explícitamente que el impacto **no sea lo mismo que subir el nivel**. Algo
puede subir un nivel y cambiar poco, y algo puede no mover el nivel y evitar el
incidente que pararía la operación dos días. Sin esa aclaración, el modelo hace
que impacto y brecha sean la misma columna y la matriz no ordena nada.

Después de varios informes, las formas se repiten aunque el contenido sea a
medida. **Ahí nace el catálogo, de la práctica y no de la teoría.**

## Dos cosas que no se hacen

**No inventar comparativos.** Si no hay una fuente propia de niveles por industria
y tamaño, la sección lo dice y explica de dónde va a salir —de los propios
diagnósticos acumulados—. Un número plausible pero inventado en un entregable de
cliente es la clase de error que no se recupera.

**Verificar lo que se afirma del estándar.** El informe de ciberseguridad decía
que NIST CSF "no trae puntajes". Es falso: trae los Tiers. Y al corregirlo estuve
por escribir que NIST dice que los Tiers no son niveles de madurez, que es una
frase de CSF 1.1 y **no está en 2.0**. Dos errores encadenados sobre el mismo
párrafo, los dos evitables leyendo el documento. Antes de afirmar algo sobre el
estándar en un entregable, abrí el PDF.

## Lo que este instrumento no ve, y va a pasar en todas las verticales

Mide **prácticas**, no **controles**. Y los controles concretos se disuelven
dentro del nivel sin llegar nunca a un hallazgo.

Medido en ciberseguridad: la ficha de la empresa ordenada declara que hay segundo
factor en el correo y no en el sistema de ensayos. **En toda la entrevista el
segundo factor no se mencionó ni una vez.** En el caso chico se habló doce veces
de contraseñas y ningún hallazgo entregado habla de política de contraseñas: se
disolvió dentro del nivel 1 de gestión de accesos.

No es una falla del guion. El anclaje 3 de esa dimensión menciona el segundo
factor como una de sus condiciones, así que su ausencia **topea** el nivel, pero
nunca se enuncia. Para el cliente, "gestión de accesos: 2 de 3" no dice qué hacer
el lunes; "sesenta usuarios entran al sistema con contraseña sola" sí.

**La solución no es meterlo en la entrevista.** Lo contesta otra persona —quien
administra los sistemas, no quien conoce el negocio—, es un formulario y no una
charla, y la conversación ya está en su límite de temas. Es un **segundo
instrumento**, corto, binario, mapeado a las mismas dimensiones: la ausencia de
un control es evidencia para el nivel, y la lista de ausentes alimenta las
acciones inmediatas y las propuestas de bajo esfuerzo, que hoy salen por
deducción y no por observación.

Beneficio lateral: preguntarle a quien administra si un control está habilitado
no es auditar, es preguntar un hecho binario. Recupera parte del rigor que se
pierde al tomar todo por declarado, sin convertir el producto en una auditoría.

Cada vertical va a tener su equivalente: en digitalización de procesos serán las
integraciones que no existen, en datos las tablas sin dueño.

## Cuándo dar una vertical por lista

- Las trampas de las dos fichas disparan de forma reproducible.
- La dispersión entre corridas congeladas es baja, y los temas que se mueven
  están identificados y explicados.
- Los esperados en disputa se resolvieron leyendo citas contra anclajes, no
  discutiendo.
- El entregable sale sin secciones vacías y sin cifras que no estén en el
  registro.

Nada de esto pide que el instrumento sea perfecto. Pide que se sepa dónde no lo
es, que es distinto y es lo que se le puede contar a un cliente.
