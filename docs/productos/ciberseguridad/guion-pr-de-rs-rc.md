# Guion de entrevista — PROTECT, DETECT, RESPOND y RECOVER

> **Borrador de trabajo. No publicar.** Completa el guion: trece dimensiones que
> se suman a las nueve de `guion-gv-id.md`. Veintidós, una por categoría del CSF.

Base: NIST CSF 2.0. Conducta: `../conducta-del-agente.md`. Salida:
`../esquema-de-salida.md`. Escala y método: `../../assessments-madurez.md`.

Los `dimension_id` son los códigos del CSF y son definitivos.

## Ruteo

Continúa la tabla de `guion-gv-id.md`. Con veintidós dimensiones el ruteo deja
de ser una recomendación: medido contra el cliente simulado, una sola
conversación que cubre las veintidós comprime las preguntas, y las preguntas
comprimidas dejan de disparar el recuerdo. Se pierden hallazgos, no tiempo.

| Dimensión | Quién contesta |
|---|---|
| PR.AA | Responsable de sistemas + RRHH |
| PR.AT | RRHH + **un empleado cualquiera** |
| PR.DS | Responsable de sistemas + dueño de la información |
| PR.PS, PR.IR | Responsable de sistemas o proveedor de TI |
| DE.CM, DE.AE | Responsable de sistemas o proveedor de TI |
| RS.MA, RS.AN, RS.MI | Responsable de sistemas + quien estuvo en el último incidente |
| RS.CO | Dueño o gerente general + comercial |
| RC.RP | Responsable de sistemas + dueño |
| RC.CO | Dueño o gerente general |

PR.AT se le pregunta también a alguien que no dictó la capacitación. Si RRHH
dice que se hace todos los años y el operario no se acuerda de ninguna, eso es
un `conflicto` y vale más que las dos respuestas por separado.

---

# PROTECT

## PR.AA · Gestión de identidades y accesos

**Qué mide:** si se sabe quién puede entrar a cada sistema, y si eso se corta
cuando la persona deja de necesitarlo.

**Preguntas**

- Cuando entra alguien nuevo, ¿quién le crea el usuario y en qué sistemas?
- Cuando alguien se va, ¿quién le saca los accesos y cuándo? ¿Y si la salida es
  de un día para el otro?
- ¿Qué pasa cuando **termina el trabajo de un proveedor** — quién le da de baja?
- Para entrar al correo desde afuera de la oficina, ¿alcanza con la contraseña?
- ¿Alguna vez alguien se sentó a repasar quién tiene acceso a qué?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Se trabaja con usuarios compartidos y nadie sabe con certeza quién entra a qué |
| 1 | Cada uno tiene su usuario en lo principal; la baja depende de que alguien se acuerde de avisar |
| 2 | Hay una rutina conocida de alta y baja que todos siguen, sin registro ni verificación posterior |
| 3 | Alta y baja documentadas con responsable, segundo factor en lo que se expone a internet, y un repaso de quién tiene qué al menos una vez al año |
| 4 | Los accesos se revisan con periodicidad y los desvíos que aparecen se corrigen |
| 5 | El alta y la baja se disparan solas desde el legajo o el contrato |

**Nota de campo:** preguntá por separado por los usuarios de adentro y los de
los proveedores; suelen estar en niveles distintos. El usuario compartido de un
proveedor es tema de GV.SC, no de acá.

**La pregunta del proveedor va sola y explícita.** Medido: cuando se la mete
como cláusula de una pregunta más larga sobre altas y contraseñas, deja de
disparar el recuerdo de accesos viejos que siguen abiertos.

**Evidencia a pedir:** lista de usuarios de un sistema, la última baja hecha.

## PR.AT · Concientización y formación

**Qué mide:** si la gente sabe qué se espera de ella y cómo reconocer un engaño.

**Preguntas**

- ¿A alguien le explicaron alguna vez cómo reconocer un correo falso?
- ¿Cuándo fue la última vez? ¿Quién estuvo?
- ¿Al que entra se le cuenta algo de esto?
- ¿Alguna vez probaron si sirvió?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nunca se habló del tema con nadie |
| 1 | Se avisó de boca cuando pasó algo |
| 2 | Hubo alguna charla o un correo general, sin material propio ni registro de quién participó |
| 3 | Hay formación al ingresar y al menos una vez al año, con registro de quién asistió |
| 4 | Se mide si sirvió —simulacros, pruebas de engaño— y el contenido se ajusta con eso |
| 5 | El contenido cambia según lo que muestran los incidentes propios y las pruebas |

**Evidencia a pedir:** registro de asistencia de la última capacitación, material.

## PR.DS · Seguridad de los datos

**Qué mide:** si la información que importa está protegida donde está guardada
y cuando sale de la empresa.

**Preguntas**

- ¿Cuál es la información que si se pierde o se filtra les hace daño? ¿Dónde está?
- ¿Quién puede abrir esas carpetas? ¿Quién decidió eso y cuándo?
- Cuando mandan un presupuesto o un informe a un cliente, ¿va por correo común?
- ¿Alguna vez recuperaron un archivo de una copia?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No se sabe dónde están los datos importantes |
| 1 | Se sabe dónde están; la protección es la que vino por defecto y nadie la tocó |
| 2 | Hay cuidados parciales —permisos por carpeta, copias— puestos en su momento y no revisados desde entonces |
| 3 | Está definido qué información es sensible, con permisos asignados, protección de lo que sale de la empresa y respaldo probado |
| 4 | Se verifica con periodicidad que los permisos y las copias sigan siendo los correctos |
| 5 | Un dato nuevo hereda su protección sin que nadie la configure |

**Evidencia a pedir:** captura de permisos de una carpeta crítica.

## PR.PS · Seguridad de las plataformas

**Qué mide:** si los equipos y sistemas se mantienen en un estado conocido y
actualizado.

**Preguntas**

- ¿Quién actualiza las computadoras y los servidores? ¿Cada cuánto?
- ¿Cómo se enteran de que una quedó sin actualizar?
- ¿Hay algún equipo que no se pueda tocar? ¿Qué se hizo al respecto?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nadie se ocupa; se actualiza cuando algo deja de andar |
| 1 | El proveedor actualiza cuando entra por otra cosa; adentro no se sabe qué quedó afuera |
| 2 | Las actualizaciones son más o menos regulares, pero no hay lista de qué equipo quedó sin cubrir |
| 3 | Hay un procedimiento de actualización con responsable, y los equipos que no se pueden actualizar están identificados **y** compensados |
| 4 | Se mide qué porcentaje quedó cubierto y cuánto tardó en aplicarse |
| 5 | Los desvíos se detectan y se corrigen sin que nadie los busque |

**Nota de campo:** el 3 pide las dos cosas. Un equipo viejo anotado en el
inventario pero sin ninguna medida alrededor no alcanza.

**Evidencia a pedir:** último informe de actualizaciones del proveedor.

## PR.IR · Resiliencia de la infraestructura

**Qué mide:** si lo que sostiene la operación aguanta una falla y se puede
volver a levantar.

**Preguntas**

- ¿Hay copias de seguridad? ¿De qué, y quién las hace?
- ¿Alguna vez restauraron algo de esas copias? ¿Cuándo, y funcionó?
- Si mañana se cae el servidor, ¿qué se levanta primero?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Si se rompe algo se ve en el momento; no hay copias |
| 1 | Hay copias de seguridad y poco más. Nunca se probó restaurarlas |
| 2 | Se restauró algo alguna vez y funcionó, pero fue suelto: no hay plan escrito ni prueba programada |
| 3 | Está escrito qué se levanta primero y en cuánto tiempo, y se probó al menos una vez en el último año |
| 4 | Se prueba con periodicidad fija y se mide el tiempo real que llevó |
| 5 | La operación tolera la caída de un componente sin que el negocio lo note |

**Nota de campo:** que el proveedor diga que hace respaldos no es evidencia de
que se pueda restaurar. Lo que separa el 1 del 2 es si alguna vez se recuperó
algo de verdad.

**Evidencia a pedir:** registro de la última restauración probada.

---

# DETECT

## DE.CM · Monitoreo

**Qué mide:** si alguien mira lo que pasa en los sistemas, o sólo se enteran
cuando algo se rompe.

**Preguntas**

- ¿Cómo se enteraron del último problema que tuvieron?
- ¿Alguien mira algo de los sistemas cuando no pasa nada?
- ¿El proveedor les manda algún informe? ¿Cada cuánto, y quién lo lee?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nadie mira nada; se sabe cuando algo deja de funcionar |
| 1 | El antivirus avisa en la máquina de cada uno y ahí termina; no hay nada centralizado |
| 2 | Alguien de afuera dice que mira algo, pero adentro no se sabe qué ni con qué frecuencia |
| 3 | Hay alguien que revisa las alertas con una frecuencia definida y queda registro de qué se miró |
| 4 | Se mide cuánto se tarda en detectar algo y se ajusta qué se monitorea |
| 5 | El monitoreo alcanza también a los proveedores y a lo que se expone a internet |

**Nota de campo:** la pregunta que más ordena esta dimensión es cómo se
enteraron del último problema. Si la respuesta es "llamó un cliente", el nivel
queda establecido sin hablar de herramientas.

**Evidencia a pedir:** último informe de monitoreo, si existe.

## DE.AE · Análisis de alertas

**Qué mide:** si cuando aparece una alerta alguien decide si es algo o no, y con
qué criterio.

**Preguntas**

- Cuando a alguien le salta una alerta del antivirus, ¿qué hace?
- ¿Quién decide si eso es un problema o no?
- ¿Hay alguna alerta dando vueltas ahora mismo sin resolver?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Las alertas se ignoran o se cierran sin mirarlas |
| 1 | Se miran caso por caso, según quién esté y cuánto tiempo tenga |
| 2 | Hay una costumbre de a quién avisar, sin criterio de qué es grave y qué no |
| 3 | Está escrito qué se considera incidente y quién lo decide, y cada alerta se cierra con una conclusión |
| 4 | Se clasifican por gravedad y se mide cuántas terminaron siendo reales |
| 5 | Lo que se aprende del análisis cambia lo que se monitorea |

**Evidencia a pedir:** la última alerta y cómo se cerró.

---

# RESPOND

## RS.MA · Gestión del incidente

**Qué mide:** si hay una forma acordada de responder, o se improvisa cada vez.

**Preguntas**

- La última vez que pasó algo, ¿a quién llamaron primero? ¿Por qué a esa persona?
- ¿Hay algo escrito de qué hacer, o se fue viendo sobre la marcha?
- Si pasara hoy a las once de la noche, ¿quién atiende?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Se improvisa por completo; no hay a quién llamar |
| 1 | Se llama al que sabe o al proveedor, sin pasos definidos |
| 2 | Hay pasos que conocen de memoria los que estuvieron la vez anterior |
| 3 | Hay un procedimiento escrito con roles, y se usó la última vez que pasó algo |
| 4 | El procedimiento se prueba aunque no haya incidentes, y se corrige con lo aprendido |
| 5 | La respuesta está ensayada junto con los proveedores y con quien haga falta de afuera |

**Evidencia a pedir:** el procedimiento, si existe.

## RS.AN · Análisis del incidente

**Qué mide:** si después de un incidente se establece qué pasó realmente y hasta
dónde llegó.

**Preguntas**

- Del último incidente: ¿supieron cómo entró?
- ¿Hasta dónde llegó? ¿Pudieron ver a qué más accedió, o quedó la duda?
- ¿Quedó algo escrito de eso?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No se averigua nada: se arregla y se sigue |
| 1 | Se entiende lo básico por lo que se ve, sin que quede registro |
| 2 | Se reconstruye lo que pasó de memoria, sin datos que lo respalden |
| 3 | Queda escrito qué pasó, cuándo empezó, hasta dónde llegó y cómo se supo |
| 4 | Se conserva evidencia que permite revisar el análisis más adelante |
| 5 | El análisis busca la causa de fondo y no sólo el hecho |

**Nota de campo:** el alcance es la parte que casi nunca se establece. Un
incidente contado con lujo de detalle no es lo mismo que un incidente analizado:
preguntá explícitamente hasta dónde llegó y cómo lo supieron.

**Evidencia a pedir:** el informe del último incidente, si existe.

## RS.CO · Comunicación durante el incidente

**Qué mide:** si se sabe a quién hay que avisar, adentro y afuera, y en qué
momento.

**Preguntas**

- La última vez, ¿a quién le avisaron adentro? ¿Y afuera?
- ¿Hubo clientes afectados? ¿Se les dijo algo?
- ¿Están obligados a avisarle a alguien —un cliente, el seguro, un organismo?
- Si esa obligación existe, ¿quién la cumpliría y en cuánto tiempo?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No se avisa a nadie: se resuelve entre los que se enteraron |
| 1 | Se le avisa a la dirección cuando alguien decide que es grave |
| 2 | Se sabe de memoria a quién avisar adentro; para afuera se resuelve sobre la marcha |
| 3 | Está definido a quién se avisa adentro y afuera —clientes, seguro, organismos— y en qué plazo |
| 4 | Los avisos quedan registrados y después se revisa si llegaron a tiempo |
| 5 | Hay mensajes preparados de antemano y está definido quién los emite |

**Nota de campo:** que exista una obligación de avisar —una cláusula de cliente,
una ley— no es lo mismo que tener definido cómo se cumple. Si aparece la
obligación, preguntá quién la ejecutaría y en qué plazo.

**Evidencia a pedir:** la cláusula contractual de notificación, si la mencionan.

## RS.MI · Contención del incidente

**Qué mide:** si se puede frenar el daño mientras el incidente está pasando.

**Preguntas**

- Si hoy sospechan que una máquina está comprometida, ¿quién la desconecta?
- ¿Esa persona puede hacerlo sola o tiene que pedir permiso?
- La última vez, ¿cuánto pasó desde que se dieron cuenta hasta que lo frenaron?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No hay forma de frenar nada; se espera a que alguien pueda |
| 1 | Se corta algo a mano, cuando aparece quien tiene con qué hacerlo |
| 2 | Se sabe qué habría que cortar, pero depende de que una persona en particular esté disponible |
| 3 | Está definido qué se aísla y quién tiene autoridad para hacerlo sin pedir permiso |
| 4 | La contención se practica y se mide cuánto tarda |
| 5 | Parte de la contención ocurre sola cuando se detecta el patrón |

**Nota de campo:** la autoridad para cortar sin pedir permiso es el hecho que
decide entre el 2 y el 3, y suele estar del otro lado de la pregunta "¿y si el
dueño no atiende el teléfono?".

---

# RECOVER

## RC.RP · Recuperación

**Qué mide:** si se puede volver a operar, y si alguien sabe en qué orden y en
cuánto tiempo.

**Preguntas**

- Si se cae todo un lunes a la mañana, ¿qué se levanta primero?
- ¿Cuánto tendría que llevar? ¿Alguien se comprometió a un tiempo?
- La última vez que pasó algo, ¿cuánto estuvieron sin poder trabajar?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Se vuelve como se puede, sin idea de cuánto va a llevar |
| 1 | Se depende del proveedor para levantar todo; adentro no se sabe el orden ni el tiempo |
| 2 | Se sabe qué es lo primero que hay que levantar, sin plan escrito ni tiempo comprometido |
| 3 | Hay plan escrito con orden y tiempos, y se ejecutó o se probó en el último año |
| 4 | Se mide el tiempo real de recuperación contra el que se había comprometido |
| 5 | La recuperación se prueba con la operación andando |

**Evidencia a pedir:** el plan de recuperación, si existe.

## RC.CO · Comunicación de la recuperación

**Qué mide:** si se le avisa a quien corresponde que se volvió a la normalidad,
y qué se le cuenta.

**Preguntas**

- Cuando se resolvió, ¿cómo se enteró el resto de la empresa?
- ¿A los clientes se les dijo algo?
- ¿Se contó qué había pasado, o sólo que ya estaba?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nadie avisa nada: la novedad se difunde sola y cada uno se entera por su cuenta |
| 1 | Alguien avisa de boca, puertas adentro, que ya está resuelto |
| 2 | Se avisa adentro y a los clientes que preguntaron, sin criterio de qué se cuenta |
| 3 | Está definido a quién se le informa el cierre y con qué contenido |
| 4 | Después se revisa si la comunicación alcanzó, para clientes y para el personal |
| 5 | La comunicación incluye qué se cambió para que no vuelva a pasar |

**Nota de campo:** si la empresa nunca tuvo un incidente que cerrar, esto no se
puede establecer con lo que la persona sabe. No lo puntúes por analogía con
otro circuito de comunicación: es indeterminado. Medido: es el caso donde
`marcar_indeterminado` funciona como corresponde.

---

## Cierre

Con las veintidós en `cerrado`, `indeterminado` o `derivado`, la participación
cierra según `../conducta-del-agente.md`. La evaluación cierra recién cuando no
quedan derivaciones pendientes.

## Pendiente

- Estabilizar los esperados de GV.RM, GV.OV e ID.IM, que se mueven entre
  corridas idénticas por calibración de la vara y no por redacción del anclaje.
- Hacer alcanzable el estado `respaldado`: hoy `pedir_evidencia` nunca se marca
  como recibida y todos los puntajes salen `declarado`.
- Un tercer cliente simulado que parezca maduro y no lo sea, para ejercitar el
  borde 3→4, que hoy no se prueba.
