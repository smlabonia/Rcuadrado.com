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
  },
  {
    id: "GV.RM",
    nombre: "Estrategia de gestión de riesgos",
    mide: "Si hay una forma acordada de decidir qué riesgo se acepta y cuánto se invierte.",
    anclajes: {
      0: "No hay criterio; se compra cuando ya pasó algo",
      1: "Decide una persona por intuición, caso por caso",
      2: "Hay un criterio informal conocido, típicamente lo que pida el proveedor de TI",
      3: "Hay presupuesto y criterio escrito de qué se acepta y qué no",
      4: "Las decisiones se toman contra un registro de riesgos actualizado",
      5: "El nivel de riesgo aceptable está declarado y se mide contra él",
    },
  },
  {
    id: "GV.RR",
    nombre: "Roles y responsabilidades",
    mide: "Si alguien responde por esto, con tiempo y con autoridad.",
    anclajes: {
      0: "Nadie. Se resuelve por reflejo cuando pasa",
      1: "El que sabe de computadoras, sin mandato ni tiempo asignado",
      2: "Hay alguien reconocido informalmente por todos",
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
];

export const dimensionPorId = (id) => DIMENSIONES.find((d) => d.id === id);
