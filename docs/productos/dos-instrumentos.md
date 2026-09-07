# Dos instrumentos por vertical, no uno

> **Borrador de trabajo. No publicar.** Decisión de arquitectura de producto que
> aplica a las seis verticales de `../assessments-madurez.md`.

Cada vertical tiene **dos** productos distintos, no uno con dos partes:

| | Madurez de procesos | Cumplimiento técnico |
|---|---|---|
| **La pregunta** | ¿Cómo hacen las cosas? | ¿Esto está o no está? |
| **Qué mide** | Si la práctica existe fuera de la cabeza de alguien | Si el control concreto está presente |
| **Formato** | Conversación guiada, ~25 intercambios | Formulario, ítems binarios |
| **Quién contesta** | Quien conoce el negocio y la operación | Quien administra los sistemas |
| **Base** | El estándar de la vertical, por categorías | Una lista de buenas prácticas |
| **Salida** | Niveles, brechas, proyectos | Presentes, ausentes, y qué falta |
| **Se toma por** | Declarado | Verificable, aunque no auditado |
| **Cadencia** | Anual o ante un cambio grande | Trimestral, o ante cambios |

Los dos son legítimos y ninguno reemplaza al otro. Confundirlos es lo que hace
que un informe de madurez decepcione a un cliente que quería saber si tiene el
segundo factor encendido.

## Por qué no se mezclan en la misma entrevista

Tres motivos, y el tercero está medido.

**Los contesta otra persona.** La gerenta que sabe cómo se decide una compra no
sabe si hay segundo factor en el sistema de ensayos. Forzarla a contestarlo
produce ruido, no dato.

**Uno es una charla y el otro es un formulario.** Cuarenta ítems binarios en
conversación son una tortura para las dos partes, y no aprovechan nada de lo que
una conversación puede hacer.

**La conversación ya está en su límite.** Con veintidós temas el agente empieza a
comprimir preguntas, y las preguntas comprimidas dejan de disparar el recuerdo:
el hallazgo más valioso de un caso de prueba se perdió en dos de tres corridas
por eso. Sumarle cuarenta controles rompe el instrumento que ya funciona.

## Regla para los anclajes de madurez

**Un anclaje de madurez no debe exigir un control concreto.** Si lo hace, la
ausencia del control topea el nivel sin que el informe lo diga nunca, y el
cliente recibe un 2 sin enterarse de por qué no es un 3.

Pasó en ciberseguridad: el nivel 3 de gestión de accesos exige "segundo factor en
lo que se expone a internet". En la entrevista a la empresa ordenada, el segundo
factor **no se mencionó ni una vez** y sin embargo estaba condicionando el
resultado.

La corrección es que el anclaje hable de la práctica —"hay un repaso periódico de
quién tiene acceso a qué, y los desvíos se corrigen"— y que el control viva en el
instrumento técnico, donde se pregunta y se responde con un sí o un no.

## Cómo se conectan

Cada control del instrumento técnico **se mapea a una dimensión** del de madurez.
Con eso:

- La ausencia de un control es **evidencia** para el nivel, y evidencia de mejor
  calidad que una declaración en una conversación.
- La lista de ausentes alimenta las **acciones inmediatas** y las propuestas de
  bajo esfuerzo, que hoy salen por deducción y no por observación.
- El informe puede decir qué hacer el lunes, que es lo que un nivel no dice.

Y recupera parte del rigor que se pierde al tomar todo por declarado, sin
convertir el producto en una auditoría: preguntarle a quien administra si un
control está habilitado no es auditar, es preguntar un hecho binario.

## La brecha entre los dos es un hallazgo

Esto es lo que justifica tener los dos, más allá de vender dos cosas.

**Controles altos, madurez baja.** Es el caso más común y el más engañoso: todo
está bien configurado porque un proveedor lo hizo bien una vez, y adentro nadie
sabe qué hay ni podría rehacerlo. Funciona hasta que esa persona no está. El
instrumento técnico solo diría "está todo bien"; el de madurez muestra que no hay
nada que lo sostenga.

**Controles bajos, madurez alta.** Es raro y casi siempre significa que el
proceso está escrito pero no se ejecuta. Vale la pena mirarlo de cerca, porque
suele ser documentación armada para pasar una auditoría.

**Los dos altos** es el objetivo, y **los dos bajos** es el punto de partida de
la mayoría de las PyMEs de la región.

Esa lectura cruzada no la da ninguno de los dos por separado.

## Consecuencia comercial

La madurez se mide una vez por año o ante un cambio grande: es un proyecto con
principio y fin. El cumplimiento técnico se mide seguido, porque la configuración
se mueve todo el tiempo: es recurrente.

Son dos conversaciones comerciales distintas y conviene no venderlas como una.

## Pendiente

- Escribir la lista de controles de ciberseguridad y su mapeo a las veintidós
  categorías. Es el próximo instrumento a construir.
- Revisar los anclajes de ciberseguridad que hoy exigen un control concreto y
  reescribirlos en términos de práctica.
- Definir los nombres con los que se le presentan al cliente. "Assessment de
  madurez" y "assessment técnico" describen bien pero son de jerga interna.
