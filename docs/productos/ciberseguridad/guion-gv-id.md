# Guion de entrevista — GOVERN e IDENTIFY

> **Borrador de trabajo. No publicar.** Rebanada delgada del assessment de
> ciberseguridad: dos funciones completas en vez de seis a medias. Sirve para
> correr una entrevista real de punta a punta antes de escribir el resto.

Base: NIST CSF 2.0. Conducta: `../conducta-del-agente.md`. Salida:
`../esquema-de-salida.md`.

**Una dimensión = una categoría del CSF.** Nueve acá, veintidós en el guion
completo. Es la granularidad que corresponde al sabor Panorama: más fino que la
función, más grueso que las 106 subcategorías, y comparable contra cualquier
otro assessment CSF.

## Ruteo

El guion no se le hace entero a una sola persona. Cada bloque va a quien puede
contestarlo con hechos:

| Dimensión | Quién contesta |
|---|---|
| GV.OC, GV.RM, GV.OV | Dueño o gerente general |
| GV.RR | Dueño + responsable de sistemas |
| GV.PO | Dueño + RRHH + **un empleado cualquiera** |
| GV.SC | Responsable de sistemas + compras |
| ID.AM, ID.RA | Responsable de sistemas o proveedor de TI |
| ID.IM | Responsable de sistemas + dueño |

GV.PO se le pregunta también a alguien que **no** escribió la política. Si el
dueño dice que existe y el operario no la conoce, eso es un `conflicto` y vale
más que cualquiera de las dos respuestas por separado.

## Reglas de repregunta

Aplican a todo el guion. Son lo que separa una encuesta de una entrevista.

1. **"¿Cuándo fue la última vez?"** — la repregunta más útil que existe.
   Convierte una afirmación en un hecho verificable. Ante cualquier "sí"
   genérico, va siempre.
2. **La intención no cuenta.** "Estamos por implementar", "lo tenemos en
   carpeta", "el año que viene" describen el futuro. Se registra el presente y
   se deja constancia de la intención en el hallazgo, no en el nivel.
3. **"Creo", "me parece", "debería"** disparan repregunta por el hecho concreto.
   Si sigue sin haber hecho, es `indeterminado`, no un nivel bajo.
4. **Todo "sí" que se pueda mostrar, se pide.** Es el pasaje de `declarado` a
   `respaldado`, y se pide en el momento, no al final.
5. **Nombre propio que aparece se convierte en rol.** Nunca se registra el
   nombre.
6. **Dos respuestas distintas no se promedian.** Se marca `conflicto` con las
   dos versiones y el rol de cada una.
7. **"No sé" cierra el tema.** No se insiste: `indeterminado`, anotando el rol
   que sí sabría. Insistir con quien no sabe sólo produce invención.

---

# GOVERN

## GV.OC · Contexto organizacional

**Qué mide:** si la empresa sabe qué la hace vulnerable en su propio negocio —
de quién depende, qué le exigen, qué pasa si para.

**Preguntas**

- Si mañana la empresa no pudiera operar por dos días, ¿qué es lo primero que se
  rompe? ¿Se enteran ustedes antes que un cliente?
- ¿Algún cliente les pidió alguna vez requisitos de seguridad para trabajar con
  ustedes — un cuestionario, una cláusula, una certificación?
- ¿Hay algo que la empresa esté obligada a cumplir por ley o por contrato sobre
  datos o sistemas?
- ¿De qué proveedores no podrían prescindir ni una semana?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nunca se lo plantearon |
| 1 | Alguien lo tiene en la cabeza; no se conversó con nadie más |
| 2 | Se conversó a raíz de un susto o del pedido de un cliente; no quedó escrito |
| 3 | Está escrito qué es crítico, qué obligaciones hay y de quién se depende, y se revisó en el último año |
| 4 | Se revisa con periodicidad fija y alimenta decisiones de inversión |
| 5 | Un cambio en el contexto dispara la revisión sin que nadie la pida |

**Evidencia a pedir:** cláusula o cuestionario de seguridad de algún cliente,
análisis de impacto si existe.

## GV.RM · Estrategia de gestión de riesgos

**Qué mide:** si hay una forma acordada de decidir qué riesgo se acepta y
cuánto se invierte.

**Preguntas**

- Cuando aparece un gasto de seguridad —un antivirus, un backup, un seguro—,
  ¿quién decide y con qué criterio?
- ¿Alguna vez decidieron conscientemente **no** hacer algo de seguridad porque
  no valía la pena? ¿Quién lo decidió?
- ¿Hay presupuesto asignado a esto, o sale de donde se pueda?
- ¿Tienen seguro que cubra un incidente informático?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No hay criterio; se compra cuando ya pasó algo |
| 1 | Decide una persona por intuición, caso por caso |
| 2 | Hay un criterio informal conocido — típicamente "lo que pida el proveedor de TI" |
| 3 | Hay presupuesto y criterio escrito de qué se acepta y qué no |
| 4 | Las decisiones se toman contra un registro de riesgos que se mantiene actualizado |
| 5 | El nivel de riesgo aceptable está declarado y se mide contra él |

**Evidencia:** línea de presupuesto, póliza, acta donde conste una decisión de
no hacer algo.

## GV.RR · Roles y responsabilidades

**Qué mide:** si alguien responde por esto, con tiempo y con autoridad.

**Preguntas**

- Si mañana hay un problema de seguridad, ¿a quién llaman primero? ¿Y esa
  persona qué puede decidir sola — por ejemplo, apagar un sistema?
- ¿Esa responsabilidad está en la descripción de puesto de alguien, o se asumió?
- ¿Cuánto tiempo por semana le dedica?
- El proveedor de TI, ¿tiene esto en el contrato o se da por sentado?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nadie. Se resuelve por reflejo cuando pasa |
| 1 | "El que sabe de computadoras", sin mandato ni tiempo asignado |
| 2 | Hay alguien reconocido informalmente por todos |
| 3 | Asignado por escrito, con tiempo y con autoridad para decidir |
| 4 | La responsabilidad se evalúa como parte del desempeño |
| 5 | Hay reemplazo definido y la autoridad está delegada por escrito |

**Repregunta obligatoria:** la de autoridad. Muchas empresas tienen un
responsable que no puede apagar nada sin llamar al dueño — eso es un 1 o un 2
aunque el organigrama diga otra cosa.

## GV.PO · Política

**Qué mide:** si existe una regla escrita y si la conoce quien tiene que
cumplirla.

**Preguntas**

- ¿Hay algo escrito que diga qué se puede y qué no con los sistemas y la
  información de la empresa? ¿Dónde está?
- Cuando entra alguien nuevo, ¿firma algo? ¿Le explican algo?
- ¿Cuándo se actualizó por última vez?
- ¿Qué pasa si alguien no la cumple?

**Al empleado, aparte:** ¿hay reglas escritas sobre el uso de los sistemas?
¿Las viste alguna vez? ¿Podrías decirme una?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No hay nada escrito |
| 1 | Hay costumbres conocidas, nada escrito |
| 2 | Hay un texto viejo, o un párrafo en el reglamento interno, que nadie recuerda |
| 3 | Política vigente, comunicada, firmada al ingresar, revisada en los últimos dos años |
| 4 | Se revisa con periodicidad y se mide si se cumple |
| 5 | El incumplimiento tiene consecuencia aplicada, no sólo escrita |

**Evidencia:** el documento, y la constancia de firma de alguien que entró este
año.

## GV.OV · Supervisión

**Qué mide:** si la dirección mira esto alguna vez, o se enteró sólo cuando
explotó.

**Preguntas**

- ¿Cada cuánto se habla de seguridad informática en una reunión de dirección?
- ¿Alguien le reporta algo a la dirección sobre esto? ¿Qué le reporta?
- La última vez que se decidió algo en esta materia, ¿quién lo aprobó?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nunca se habla |
| 1 | Se habló una vez, después de un incidente |
| 2 | Se habla cuando surge algo |
| 3 | Hay un punto fijo con alguna frecuencia y queda registro |
| 4 | Se reportan indicadores y se toman decisiones sobre ellos |
| 5 | La dirección pide el dato antes de que se lo lleven |

## GV.SC · Riesgo de proveedores

**Qué mide:** si se sabe a quién de afuera se le dio acceso, y qué se le exige.

**Preguntas**

- ¿Qué proveedores tienen acceso a los sistemas o a los datos? El de TI, el del
  ERP, el contador, ¿alguno más?
- ¿Cómo entran — usuario propio, uno compartido, conexión remota?
- Cuando se termina la relación con un proveedor, ¿quién le saca el acceso?
- ¿Los contratos dicen algo de confidencialidad o de seguridad?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No se sabe con certeza quién de afuera tiene acceso |
| 1 | Se sabe de memoria y parcialmente |
| 2 | Hay una lista aproximada, sin fecha |
| 3 | Lista al día, cada proveedor con usuario propio, y cláusulas en los contratos |
| 4 | Los accesos se revisan con periodicidad y se dan de baja al terminar |
| 5 | Se exige y verifica evidencia de seguridad al proveedor |

**Nota de campo:** suele ser la dimensión peor puntuada y la que más sorprende
al dueño. La pregunta de la baja de acceso es la que más veces destapa un
proveedor que dejó de trabajar hace años y todavía puede entrar.

---

# IDENTIFY

## ID.AM · Gestión de activos

**Qué mide:** si se sabe qué hay que proteger. **Empieza en la ficha de
contexto, no en la entrevista.**

**Preguntas**

- (De la ficha) ¿Cuánto costó armar la lista de sistemas? ¿Existía o hubo que
  reconstruirla?
- ¿Hay una lista de las computadoras y los celulares que usa la empresa? ¿Quién
  la mantiene y cuándo se actualizó?
- ¿Saben qué datos personales tienen y dónde están guardados?
- Cuando alguien se va, ¿cómo saben qué equipos tenía y a qué accedía?
- ¿Hay equipos personales usados para trabajar?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | No hay inventario de nada |
| 1 | Está en la cabeza de una persona |
| 2 | Hay una planilla, desactualizada, sin dueño claro |
| 3 | Inventario al día de equipos, sistemas y datos, con responsable |
| 4 | Se concilia contra la realidad con periodicidad |
| 5 | El alta y la baja de un activo actualizan el inventario solas |

**El puntaje de la ficha manda.** Si el cliente no pudo completar el bloque de
sistemas, esta dimensión no puede estar por encima de 1, diga lo que diga la
entrevista. Es el caso donde el hecho observado le gana a la declaración.

**Evidencia:** la planilla de inventario, la lista de sistemas de la ficha.

## ID.RA · Evaluación de riesgos

**Qué mide:** si alguna vez se buscaron las debilidades a propósito, en vez de
esperar que aparezcan.

**Preguntas**

- ¿Alguna vez alguien revisó, desde afuera, qué de la empresa es visible en
  internet?
- ¿Cómo se enteran de que hay que actualizar algo? ¿Los sistemas se actualizan
  solos?
- ¿Hubo incidentes en los últimos dos años? ¿Qué pasó?
- ¿Hay algún sistema que sepan que está viejo o desactualizado y que no se puede
  tocar?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nunca se revisó nada |
| 1 | Se reacciona cuando algo falla |
| 2 | El proveedor de TI hace algo, pero adentro no se sabe qué ni cada cuánto |
| 3 | Hay revisión periódica documentada y una lista de debilidades conocidas con plan |
| 4 | Las debilidades se priorizan por riesgo y se mide el tiempo de corrección |
| 5 | La evaluación cubre también a los proveedores |

**Nota de campo:** la última pregunta casi siempre tiene respuesta afirmativa en
industria — hay un equipo viejo que sostiene una máquina y no se puede apagar.
No es un hallazgo negativo en sí mismo: lo negativo es que nadie lo tenga
anotado ni compensado.

## ID.IM · Mejora

**Qué mide:** si lo que sale mal se convierte en un cambio, o se olvida.

**Preguntas**

- La última vez que hubo un problema —un virus, un correo que alguien abrió, una
  caída—, ¿qué cambió después?
- ¿Se probó alguna vez qué pasaría si se cae todo? Un simulacro, aunque sea
  informal.
- ¿Hay una lista de cosas pendientes de mejorar en esto? ¿Quién la mantiene?

**Anclajes**

| Nivel | Señal |
|---|---|
| 0 | Nada cambia después de un incidente |
| 1 | Se arregla lo puntual y ahí termina |
| 2 | A veces se toman medidas, sin registro de qué ni por qué |
| 3 | Hay registro de incidentes, de qué cambió, y una lista de mejoras con responsable |
| 4 | Se revisan tendencias y se prueban los planes |
| 5 | Las pruebas se hacen aunque no haya pasado nada |

---

## Cierre del bloque

Cuando las nueve dimensiones están en `cerrado` o `indeterminado`, el agente
cierra según `../conducta-del-agente.md`: agradece, dice qué sigue y con qué
roles se comparte, recuerda la evidencia comprometida, y no devuelve nada.

## Pendiente

- Probarlo contra un cliente simulado y ajustar las preguntas que no funcionen.
- Escribir PROTECT, DETECT, RESPOND y RECOVER — trece dimensiones más.
- Los `dimension_id` de este guion ya son definitivos: son los códigos del CSF.
