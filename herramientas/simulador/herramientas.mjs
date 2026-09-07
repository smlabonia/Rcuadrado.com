// Las siete herramientas del agente entrevistador, con su estado y sus validaciones.
// Las reglas de docs/productos/esquema-de-salida.md se imponen acá: no son
// instrucciones que el modelo pueda desobedecer, son llamadas que fallan.

import { DIMENSIONES, dimensionPorId } from "./guion.mjs";

const esquemaVacio = { type: "object", properties: {}, required: [], additionalProperties: false };

export const HERRAMIENTAS = [
  {
    name: "consultar_pendientes",
    description:
      "Devuelve los temas de esta participación que todavía no cerraste, con su estado. Usalo para saber qué te falta y para contarle a la persona por dónde van, con la verdad.",
    input_schema: esquemaVacio,
    strict: true,
  },
  {
    name: "registrar_observacion",
    description:
      "Anota algo que escuchaste sin puntuarlo todavía. Usalo mientras conversás, cuando aparece un dato pero el tema no está cerrado.",
    input_schema: {
      type: "object",
      properties: {
        dimension_id: { type: "string", description: "Ej: GV.RR" },
        nota: { type: "string", description: "Qué se observó, en tus palabras" },
        cita_textual: { type: "string", description: "La frase literal de la persona" },
        rol_fuente: { type: "string", description: "El rol, nunca el nombre" },
      },
      required: ["dimension_id", "nota", "cita_textual", "rol_fuente"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "pedir_evidencia",
    description:
      "Registra que le pediste a la persona un documento o dato que respalde lo que afirmó. Pedilo en el momento, no al final.",
    input_schema: {
      type: "object",
      properties: {
        dimension_id: { type: "string" },
        que: { type: "string", description: "Qué se pidió" },
        por_que: { type: "string", description: "Qué afirmación respaldaría" },
      },
      required: ["dimension_id", "que", "por_que"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "cerrar_dimension",
    description:
      "Da por cubierto un tema y lo manda a puntuar. Vos no ponés el nivel: eso lo hace otro paso, con los anclajes de ese tema delante y la conversación completa. Usalo cuando ya preguntaste lo suficiente como para que alguien pueda decidir con hechos.",
    input_schema: {
      type: "object",
      properties: {
        dimension_id: { type: "string" },
        por_que_alcanza: {
          type: "string",
          description: "Qué se estableció en la conversación que permite decidir este tema",
        },
        rol_fuente: { type: "string", description: "El rol, nunca el nombre" },
      },
      required: ["dimension_id", "por_que_alcanza", "rol_fuente"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "marcar_indeterminado",
    description:
      "Cierra un tema sin puntaje porque no se pudo establecer. Usalo cuando la persona no sabe, en vez de insistir.",
    input_schema: {
      type: "object",
      properties: {
        dimension_id: { type: "string" },
        motivo: { type: "string" },
        rol_que_sabria: { type: "string", description: "Qué rol podría contestarlo" },
      },
      required: ["dimension_id", "motivo", "rol_que_sabria"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "escalar",
    description:
      "Marca algo que no puede esperar al informe: un incidente en curso, un acceso activo de alguien que ya no trabaja, algo ilegal.",
    input_schema: {
      type: "object",
      properties: {
        motivo: { type: "string" },
        urgencia: { type: "string", enum: ["alta", "media"] },
      },
      required: ["motivo", "urgencia"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "derivar",
    description:
      "Marca un tema como pendiente de otro rol: esta persona no es quien lo sabe. Es distinto de marcar_indeterminado, que es para cuando no hay nadie que pueda contestarlo. Usalo cuando te derivan a alguien concreto, en vez de puntuar por aproximación. Hay un tope por participación.",
    input_schema: {
      type: "object",
      properties: {
        dimension_id: { type: "string" },
        rol_que_sabe: { type: "string", description: "El rol que podría contestarlo, nunca el nombre" },
        que_falta: { type: "string", description: "Qué habría que averiguar con ese rol" },
      },
      required: ["dimension_id", "rol_que_sabe", "que_falta"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "cerrar_participacion",
    description:
      "Termina la conversación de esta persona. Funciona si no queda ningún tema abierto ni sin tocar; los temas derivados a otro rol no lo impiden, porque no son de ella. Si falla, seguí preguntando por lo que falte.",
    input_schema: esquemaVacio,
    strict: true,
  },
];

// Tope de derivaciones por participación. Sin esto, cada "no sé" genera un
// pedido a otra persona y una charla se convierte en un proyecto.
export const TOPE_DERIVACIONES = 3;

export function crearEstado({ nombresPropios = [], inventarioIncompleto = false } = {}) {
  const dimensiones = new Map(
    DIMENSIONES.map((d) => [
      d.id,
      { id: d.id, nombre: d.nombre, estado: "sin_tocar", observaciones: [], evidencia: [], registro: null },
    ]),
  );
  return {
    dimensiones,
    escalamientos: [],
    derivaciones: [],
    cerrada: false,
    nombresPropios,
    inventarioIncompleto,
  };
}

const err = (mensaje) => ({ error: mensaje });

function validarRol(estado, rol, campo = "rol_fuente") {
  const encontrado = estado.nombresPropios.find((n) =>
    rol.toLowerCase().includes(n.toLowerCase()),
  );
  return encontrado
    ? err(`El campo ${campo} contiene un nombre propio ("${encontrado}"). Usá el rol.`)
    : null;
}

export function ejecutar(estado, nombre, args = {}) {
  const dim = args.dimension_id ? estado.dimensiones.get(args.dimension_id) : null;
  if (args.dimension_id && !dim) {
    return err(`No existe el tema ${args.dimension_id}. Los válidos son: ${DIMENSIONES.map((d) => d.id).join(", ")}`);
  }

  switch (nombre) {
    case "consultar_pendientes": {
      const todas = [...estado.dimensiones.values()];
      // Pendientes = lo que le falta a ESTA persona. Lo derivado ya no es suyo.
      const pendientes = todas
        .filter((d) => d.estado === "sin_tocar" || d.estado === "abierto")
        .map((d) => ({ id: d.id, nombre: d.nombre, estado: d.estado }));
      const derivados = todas
        .filter((d) => d.estado === "derivado")
        .map((d) => ({ id: d.id, nombre: d.nombre, rol_que_sabe: d.derivacion.rol_que_sabe }));
      return {
        pendientes,
        derivados,
        cerrados: todas.filter((d) => d.estado === "cerrado").length,
        derivaciones_restantes: TOPE_DERIVACIONES - estado.derivaciones.length,
      };
    }

    case "registrar_observacion": {
      const malRol = validarRol(estado, args.rol_fuente);
      if (malRol) return malRol;
      if (dim.estado === "cerrado") return { ok: true, aviso: `${dim.id} ya estaba cerrado; la observación se guardó igual.` };
      dim.estado = "abierto";
      dim.observaciones.push({ nota: args.nota, cita: args.cita_textual, rol: args.rol_fuente });
      return { ok: true };
    }

    case "pedir_evidencia": {
      dim.evidencia.push({ que: args.que, por_que: args.por_que, recibida: false });
      if (dim.estado === "sin_tocar") dim.estado = "abierto";
      return { ok: true };
    }

    // El entrevistador sólo declara que el tema está cubierto. El nivel lo pone
    // registrar_puntaje, que no es una herramienta del modelo: la llama el
    // runner con el resultado del puntuador.
    case "cerrar_dimension": {
      if (dim.estado === "cerrado") return { ok: true, aviso: `${dim.id} ya estaba cerrado. No se duplicó.` };
      const malRolCierre = validarRol(estado, args.rol_fuente);
      if (malRolCierre) return malRolCierre;
      if (!args.por_que_alcanza?.trim()) {
        return err("Decí qué se estableció en la conversación que permite decidir este tema.");
      }
      dim.pendiente_de_puntaje = { por_que_alcanza: args.por_que_alcanza, rol_fuente: args.rol_fuente };
      return { ok: true, aviso: `${dim.id} queda cubierto y pasa a puntuarse.` };
    }

    case "registrar_puntaje": {
      if (dim.estado === "cerrado") return { ok: true, aviso: `${dim.id} ya estaba cerrado. No se duplicó.` };
      const malRol = validarRol(estado, args.rol_fuente);
      if (malRol) return malRol;
      if (!args.cita_textual?.trim()) return err("Sin cita textual no hay puntaje (regla 4).");
      if (!args.cita_entregable && !args.parafraseo?.trim()) {
        return err("Si la cita no es entregable, el parafraseo es obligatorio (regla 5).");
      }
      if (estado.inventarioIncompleto && args.dimension_id === "ID.AM" && args.nivel > 1) {
        return err(
          "La ficha indica que el inventario de sistemas no se pudo completar. ID.AM no puede superar el nivel 1: el hecho observado le gana a la declaración.",
        );
      }
      dim.estado = "cerrado";
      // Si el tema venía derivado y ahora alcanzó para puntuarlo, la derivación
      // no se cae: pasa a ser parcial. El nivel queda, el hueco sigue viajando.
      if (dim.derivacion && !dim.derivacion.parcial) {
        dim.derivacion.parcial = true;
        const registrada = estado.derivaciones.find((d) => d.dimension_id === dim.id);
        if (registrada) registrada.parcial = true;
      }
      dim.registro = {
        nivel: args.nivel,
        estado_evidencia: dim.evidencia.some((e) => e.recibida) ? "respaldado" : "declarado",
        hallazgo: args.hallazgo,
        cita_textual: args.cita_textual,
        cita_entregable: args.cita_entregable,
        parafraseo: args.parafraseo,
        rol_fuente: args.rol_fuente,
        esfuerzo: args.esfuerzo,
      };
      return { ok: true, cerrados: [...estado.dimensiones.values()].filter((d) => d.estado === "cerrado").length };
    }

    case "marcar_indeterminado": {
      if (dim.estado === "cerrado") return { ok: true, aviso: `${dim.id} ya estaba cerrado.` };
      if (!args.motivo?.trim()) return err("El motivo es obligatorio (regla 3).");
      dim.estado = "cerrado";
      dim.registro = {
        nivel: null,
        estado_evidencia: "indeterminado",
        motivo_indeterminado: args.motivo,
        rol_que_sabria: args.rol_que_sabria,
      };
      return { ok: true };
    }

    case "derivar": {
      if (dim.estado === "derivado") return { ok: true, aviso: `${dim.id} ya estaba derivado. No se duplicó.` };
      const malRol = validarRol(estado, args.rol_que_sabe, "rol_que_sabe");
      if (malRol) return malRol;
      if (estado.derivaciones.length >= TOPE_DERIVACIONES) {
        return err(
          `Se agotaron las ${TOPE_DERIVACIONES} derivaciones de esta participación. Cerrá ${dim.id} con lo que tengas, o marcalo indeterminado si no hay nada.`,
        );
      }
      // Un tema ya puntuado puede tener un punto que lo sabe otro rol. Eso se
      // anota como derivación parcial: el nivel queda, el hueco viaja.
      const parcial = dim.estado === "cerrado";
      dim.derivacion = { rol_que_sabe: args.rol_que_sabe, que_falta: args.que_falta, parcial };
      if (!parcial) dim.estado = "derivado";
      estado.derivaciones.push({ dimension_id: dim.id, ...dim.derivacion });
      return {
        ok: true,
        parcial,
        derivaciones_restantes: TOPE_DERIVACIONES - estado.derivaciones.length,
        aviso: parcial
          ? `${dim.id} conserva su nivel; el punto que falta queda pendiente del otro rol.`
          : "El tema queda pendiente de otra participación. No bloquea el cierre de esta conversación.",
      };
    }

    case "escalar": {
      estado.escalamientos.push({ motivo: args.motivo, urgencia: args.urgencia });
      return { ok: true, aviso: "Registrado para atención humana inmediata." };
    }

    case "cerrar_participacion": {
      // Lo derivado no bloquea: no es de esta persona. Cierra la conversación,
      // no la evaluación, que sigue incompleta hasta que se resuelvan.
      const abiertos = [...estado.dimensiones.values()].filter(
        (d) => d.estado === "sin_tocar" || d.estado === "abierto",
      );
      if (abiertos.length) {
        return err(
          `No podés cerrar todavía: quedan ${abiertos.length} tema(s) sin resolver — ${abiertos
            .map((d) => `${d.id} (${d.nombre})`)
            .join(", ")}. Cerralos, derivalos al rol que sepa, o marcalos indeterminados.`,
        );
      }
      estado.cerrada = true;
      return {
        ok: true,
        evaluacion_completa: estado.derivaciones.length === 0,
        derivaciones_pendientes: estado.derivaciones.length,
      };
    }

    default:
      return err(`Herramienta desconocida: ${nombre}`);
  }
}
