// Las nueve dimensiones de la rebanada GOVERN + IDENTIFY.
// Fuente: docs/productos/ciberseguridad/guion-gv-id.md — si cambia allá, cambia acá.

export const DIMENSIONES = [
  {
    id: "GV.OC",
    nombre: "Contexto organizacional",
    mide: "Si la empresa sabe qué la hace vulnerable en su propio negocio: de quién depende, qué le exigen, qué pasa si para.",
    anclajes: {
      0: "Nunca se lo plantearon",
      1: "Alguien lo tiene en la cabeza; no se conversó con nadie más",
      2: "Se conversó a raíz de un susto o del pedido de un cliente; no quedó escrito",
      3: "Está escrito qué es crítico, qué obligaciones hay y de quién se depende, revisado en el último año",
      4: "Se revisa con periodicidad fija y alimenta decisiones de inversión",
      5: "Un cambio en el contexto dispara la revisión sin que nadie la pida",
    },
    nota_de_campo:
      "El nivel 2 depende de un hecho que la persona no ofrece sola: preguntá explícitamente si alguna vez se habló del tema a raíz de un susto propio o ajeno —algo que le pasó a otra empresa conocida— o de un pedido de un cliente. Sin esa pregunta el tema queda en 1 por omisión, no por hecho.",
  },
  {
    id: "GV.RM",
    nombre: "Estrategia de gestión de riesgos",
    mide: "Si hay una forma acordada de decidir qué riesgo se acepta y cuánto se invierte.",
    anclajes: {
      0: "Nadie decide nada de antemano: sólo se gasta después de un incidente",
      1: "Decide una sola persona, caso por caso, sin criterio previo ni monto pensado",
      2: "Hay un criterio informal que otros conocen y se puede enunciar, típicamente lo que recomiende el proveedor de TI. Puede haber presupuesto, pero no hay criterio escrito",
      3: "Hay presupuesto asignado Y criterio escrito de qué se acepta y qué no",
      4: "Las decisiones se toman contra un registro de riesgos actualizado",
      5: "El nivel de riesgo aceptable está declarado y se mide contra él",
    },
    regla_especial:
      "Que hayan comprado algo después de un incidente no alcanza para el 0: el 0 es cuando además nadie decide de antemano. Si hay una persona que decide caso por caso, es 1. Para el 2 tiene que haber un criterio que la persona pueda enunciar y que otros conozcan, no sólo una costumbre que vos deduzcas.",
  },
  {
    id: "GV.RR",
    nombre: "Roles y responsabilidades",
    mide: "Si alguien responde por esto, con tiempo y con autoridad.",
    anclajes: {
      0: "Nadie. Se resuelve por reflejo cuando pasa",
      1: "Recae en el que sabe de computadoras, sin mandato ni tiempo asignado. Puede estar reconocido de hecho por todos: eso solo no lo sube",
      2: "Además de estar reconocido, tiene tiempo efectivamente asignado a esto, aunque no esté escrito",
      3: "Asignado por escrito, con tiempo y con autoridad para decidir",
      4: "La responsabilidad se evalúa como parte del desempeño",
      5: "Hay reemplazo definido y la autoridad delegada por escrito",
    },
  },
  {
    id: "GV.PO",
    nombre: "Política",
    mide: "Si existe una regla escrita y si la conoce quien tiene que cumplirla.",
    anclajes: {
      0: "No hay nada escrito",
      1: "Hay costumbres conocidas, nada escrito",
      2: "Hay un texto viejo, o un párrafo en el reglamento interno, que nadie recuerda",
      3: "Política vigente, comunicada, firmada al ingresar, revisada en los últimos dos años",
      4: "Se revisa con periodicidad y se mide si se cumple",
      5: "El incumplimiento tiene consecuencia aplicada, no sólo escrita",
    },
  },
  {
    id: "GV.OV",
    nombre: "Supervisión",
    mide: "Si la dirección mira esto alguna vez, o se enteró sólo cuando explotó.",
    anclajes: {
      0: "Nunca se habla",
      1: "Se habló una vez, después de un incidente",
      2: "Se habla cuando surge algo",
      3: "Hay un punto fijo con alguna frecuencia y queda registro",
      4: "Se reportan indicadores y se toman decisiones sobre ellos",
      5: "La dirección pide el dato antes de que se lo lleven",
    },
  },
  {
    id: "GV.SC",
    nombre: "Riesgo de proveedores",
    mide: "Si se sabe a quién de afuera se le dio acceso, y qué se le exige.",
    anclajes: {
      0: "No se sabe con certeza quién de afuera tiene acceso",
      1: "Se sabe de memoria y parcialmente",
      2: "Hay una lista aproximada, sin fecha",
      3: "Lista al día, cada proveedor con usuario propio, y cláusulas en los contratos",
      4: "Los accesos se revisan con periodicidad y se dan de baja al terminar",
      5: "Se exige y verifica evidencia de seguridad al proveedor",
    },
  },
  {
    id: "ID.AM",
    nombre: "Gestión de activos",
    mide: "Si se sabe qué hay que proteger. Empieza en la ficha de contexto.",
    anclajes: {
      0: "No hay inventario de nada",
      1: "Está en la cabeza de una persona",
      2: "Hay una planilla, desactualizada, sin dueño claro",
      3: "Inventario al día de equipos, sistemas y datos, con responsable",
      4: "Se concilia contra la realidad con periodicidad",
      5: "El alta y la baja de un activo actualizan el inventario solas",
    },
    regla_especial:
      "Si la ficha de contexto indica que el inventario de sistemas no se pudo completar, esta dimensión NO puede superar el nivel 1, diga lo que diga la entrevista. El hecho observado le gana a la declaración.",
  },
  {
    id: "ID.RA",
    nombre: "Evaluación de riesgos",
    mide: "Si alguna vez se buscaron las debilidades a propósito, en vez de esperar que aparezcan.",
    anclajes: {
      0: "Nunca se revisó nada",
      1: "Se reacciona cuando algo falla",
      2: "El proveedor de TI hace algo, pero adentro no se sabe qué ni cada cuánto",
      3: "Hay revisión periódica documentada y una lista de debilidades conocidas con plan",
      4: "Las debilidades se priorizan por riesgo y se mide el tiempo de corrección",
      5: "La evaluación cubre también a los proveedores",
    },
    nota_de_campo:
      "Que exista un equipo viejo que no se puede apagar porque sostiene una máquina NO es en sí un hallazgo negativo. Lo negativo es que nadie lo tenga anotado ni compensado.",
  },
  {
    id: "ID.IM",
    nombre: "Mejora",
    mide: "Si lo que sale mal se convierte en un cambio, o se olvida.",
    anclajes: {
      0: "Nada cambia después de un incidente",
      1: "Se arregla lo puntual y ahí termina",
      2: "A veces se toman medidas, sin registro de qué ni por qué",
      3: "Hay registro de incidentes, de qué cambió, y una lista de mejoras con responsable",
      4: "Se revisan tendencias y se prueban los planes",
      5: "Las pruebas se hacen aunque no haya pasado nada",
    },
  },
  {
    id: "PR.AA",
    nombre: "Gestión de identidades y accesos",
    mide: "Si se sabe quién puede entrar a cada sistema, y si eso se corta cuando la persona deja de necesitarlo.",
    anclajes: {
      0: "Se trabaja con usuarios compartidos y nadie sabe con certeza quién entra a qué",
      1: "Cada uno tiene su usuario en lo principal; la baja depende de que alguien se acuerde de avisar",
      2: "Hay una rutina conocida de alta y baja que todos siguen, sin registro ni verificación posterior",
      3: "Alta y baja documentadas con responsable, segundo factor en lo que se expone a internet, y un repaso de quién tiene qué al menos una vez al año",
      4: "Los accesos se revisan con periodicidad y los desvíos que aparecen se corrigen",
      5: "El alta y la baja se disparan solas desde el legajo o el contrato",
    },
    nota_de_campo:
      "Preguntá por separado por los usuarios de adentro y los de los proveedores: suelen estar en niveles distintos, y el usuario compartido de un proveedor es tema de riesgo de proveedores, no de acá.",
  },
  {
    id: "PR.AT",
    nombre: "Concientización y formación",
    mide: "Si la gente sabe qué se espera de ella y cómo reconocer un engaño.",
    anclajes: {
      0: "Nunca se habló del tema con nadie",
      1: "Se avisó de boca cuando pasó algo",
      2: "Hubo alguna charla o un correo general, sin material propio ni registro de quién participó",
      3: "Hay formación al ingresar y al menos una vez al año, con registro de quién asistió",
      4: "Se mide si sirvió —simulacros, pruebas de engaño— y el contenido se ajusta con eso",
      5: "El contenido cambia según lo que muestran los incidentes propios y las pruebas",
    },
  },
  {
    id: "PR.DS",
    nombre: "Seguridad de los datos",
    mide: "Si la información que importa está protegida donde está guardada y cuando sale de la empresa.",
    anclajes: {
      0: "No se sabe dónde están los datos importantes",
      1: "Se sabe dónde están; la protección es la que vino por defecto y nadie la tocó",
      2: "Hay cuidados parciales —permisos por carpeta, copias— puestos en su momento y no revisados desde entonces",
      3: "Está definido qué información es sensible, con permisos asignados, protección de lo que sale de la empresa y respaldo probado",
      4: "Se verifica con periodicidad que los permisos y las copias sigan siendo los correctos",
      5: "Un dato nuevo hereda su protección sin que nadie la configure",
    },
  },
  {
    id: "PR.PS",
    nombre: "Seguridad de las plataformas",
    mide: "Si los equipos y sistemas se mantienen en un estado conocido y actualizado.",
    anclajes: {
      0: "Nadie se ocupa; se actualiza cuando algo deja de andar",
      1: "El proveedor actualiza cuando entra por otra cosa; adentro no se sabe qué quedó afuera",
      2: "Las actualizaciones son más o menos regulares, pero no hay lista de qué equipo quedó sin cubrir",
      3: "Hay un procedimiento de actualización con responsable, y los equipos que no se pueden actualizar están identificados Y compensados",
      4: "Se mide qué porcentaje quedó cubierto y cuánto tardó en aplicarse",
      5: "Los desvíos se detectan y se corrigen sin que nadie los busque",
    },
    nota_de_campo:
      "El nivel 3 pide las dos cosas: identificado y compensado. Un equipo viejo anotado en el inventario pero sin ninguna medida alrededor no alcanza para 3.",
  },
  {
    id: "PR.IR",
    nombre: "Resiliencia de la infraestructura",
    mide: "Si lo que sostiene la operación aguanta una falla y se puede volver a levantar.",
    anclajes: {
      0: "Si se rompe algo se ve en el momento; no hay copias",
      1: "Hay copias de seguridad y poco más. Nunca se probó restaurarlas",
      2: "Hay copias y algún reemplazo previsto de palabra, sin plan escrito; la restauración se probó alguna vez suelta",
      3: "Está escrito qué se levanta primero y en cuánto tiempo, y se probó al menos una vez en el último año",
      4: "Se prueba con periodicidad fija y se mide el tiempo real que llevó",
      5: "La operación tolera la caída de un componente sin que el negocio lo note",
    },
    nota_de_campo:
      "Que el proveedor diga que hace respaldos no es evidencia de que se pueda restaurar. La pregunta que decide entre 1 y 2 es si alguna vez se recuperó algo de verdad.",
  },
];

export const dimensionPorId = (id) => DIMENSIONES.find((d) => d.id === id);
