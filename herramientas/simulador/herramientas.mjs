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
      "Puntúa y cierra un tema. Usalo recién cuando tengas lo suficiente, con los anclajes delante. Requiere la cita literal que respalda el puntaje.",
    input_schema: {
      type: "object",
      properties: {
        dimension_id: { type: "string" },
        nivel: { type: "integer", minimum: 0, maximum: 5 },
        hallazgo: {
          type: "string",
          description: "Sobre la práctica, nunca sobre la persona. Sin adjetivos de catástrofe.",
        },
        cita_textual: { type: "string", description: "La frase literal que respalda el nivel" },
        cita_entregable: {
          type: "boolean",
          description:
            "Falso si se puede deducir quién lo dijo, o si el contenido perjudica a quien lo dijo.",
        },
        parafraseo: {
          type: "string",
          description: "Versión no atribuible. Obligatorio si cita_entregable es falso.",
        },
        rol_fuente: { type: "string" },
        esfuerzo: { type: "string", enum: ["bajo", "medio", "alto"] },
      },
      required: [
        "dimension_id",
        "nivel",
        "hallazgo",
        "cita_textual",
        "cita_entregable",
        "parafraseo",
        "rol_fuente",
        "esfuerzo",
      ],
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
    name: "cerrar_participacion",
    description:
      "Termina la conversación. Sólo funciona si no queda ningún tema abierto. Si falla, seguí preguntando por lo que falte.",
    input_schema: esquemaVacio,
    strict: true,
  },
];

export function crearEstado({ nombresPropios = [], inventarioIncompleto = false } = {}) {
  const dimensiones = new Map(
    DIMENSIONES.map((d) => [
      d.id,
      { id: d.id, nombre: d.nombre, estado: "sin_tocar", observaciones: [], evidencia: [], registro: null },
    ]),
  );
  return { dimensiones, escalamientos: [], cerrada: false, nombresPropios, inventarioIncompleto };
}

const err = (mensaje) => ({ error: mensaje });

function validarRol(estado, rol) {
  const encontrado = estado.nombresPropios.find((n) =>
    rol.toLowerCase().includes(n.toLowerCase()),
  );
  return encontrado
    ? err(`El campo rol_fuente contiene un nombre propio ("${encontrado}"). Usá el rol.`)
    : null;
}

export function ejecutar(estado, nombre, args = {}) {
  const dim = args.dimension_id ? estado.dimensiones.get(args.dimension_id) : null;
  if (args.dimension_id && !dim) {
    return err(`No existe el tema ${args.dimension_id}. Los válidos son: ${DIMENSIONES.map((d) => d.id).join(", ")}`);
  }

  switch (nombre) {
    case "consultar_pendientes": {
      const pendientes = [...estado.dimensiones.values()]
        .filter((d) => d.estado !== "cerrado")
        .map((d) => ({ id: d.id, nombre: d.nombre, estado: d.estado }));
      return { pendientes, cerrados: [...estado.dimensiones.values()].filter((d) => d.estado === "cerrado").length };
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

    case "cerrar_dimension": {
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

    case "escalar": {
      estado.escalamientos.push({ motivo: args.motivo, urgencia: args.urgencia });
      return { ok: true, aviso: "Registrado para atención humana inmediata." };
    }

    case "cerrar_participacion": {
      const abiertos = [...estado.dimensiones.values()].filter((d) => d.estado !== "cerrado");
      if (abiertos.length) {
        return err(
          `No podés cerrar todavía: quedan ${abiertos.length} tema(s) sin resolver — ${abiertos
            .map((d) => `${d.id} (${d.nombre})`)
            .join(", ")}. Cerralos o marcalos indeterminados.`,
        );
      }
      estado.cerrada = true;
      return { ok: true };
    }

    default:
      return err(`Herramienta desconocida: ${nombre}`);
  }
}
