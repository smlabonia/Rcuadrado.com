# Esquema de salida

> **Borrador de trabajo. No publicar.** Aplica a los seis assessments. Es la
> pieza de la que dependen el informe, el prompt del agente y el benchmark.

El agente emite datos, no prosa. El informe se genera después, desde acá. Es lo
que garantiza que treinta assessments produzcan la misma información final y
que se puedan comparar entre sí.

Tres tipos de registro: **assessment** (uno), **contexto** (uno, de la ficha),
**participación** (una por persona) y **hallazgo** (uno por dimensión, el
corazón).

## Quién llena qué

La columna *Origen* es la que marca los límites del agente:

- **ficha** — se completa antes de entrevistar
- **agente** — lo produce la entrevista
- **persona** — lo pone el consultor, después
- **derivado** — se calcula, no se guarda a mano

## Registro `assessment`

| Campo | Tipo | Origen |
|---|---|---|
| `assessment_id` | id | derivado |
| `cliente` | texto | ficha |
| `vertical` | enum: `estrategia` `procesos` `datos` `ia` `ciberseguridad` `servicios` | ficha |
| `sabor` | enum: `panorama` `verificacion` `planta` `seguimiento` | ficha |
| `version_metodo` | texto | derivado |
| `estandar_base` | texto (ej. `NIST CSF 2.0`) | derivado |
| `nivel_meta_default` | entero, por defecto `3` | ficha |
| `fecha_inicio` / `fecha_cierre` | fecha | derivado |
| `assessment_anterior_id` | id, opcional | ficha |

`assessment_anterior_id` es lo que habilita el sabor Seguimiento: sin él no hay
comparación contra línea de base.

## Registro `contexto`

Sale de la ficha. Alimenta la sección 7 del informe —el riesgo en términos de
la operación— que no sale de ningún marco.

| Campo | Tipo | Origen |
|---|---|---|
| `dotacion`, `areas[]`, `ubicaciones` | — | ficha |
| `tiene_ot` | booleano | ficha |
| `horario_operacion`, `temporada_critica` | texto | ficha |
| `sistemas[]` | lista de objetos, ver abajo | ficha |
| `quien_hace_ti` | enum: `interno` `proveedor` `nadie` `mixto` | ficha |
| `incidentes_24m` | lista | ficha |
| `trata_datos_personales` | booleano | ficha |
| `inscripto_aaip` | enum: `si` `no` `no_sabe` | ficha |
| `restricciones` | texto | ficha |
| `completitud_ficha` | enum: `completa` `parcial` `no_pudo` | persona |

Cada elemento de `sistemas[]`: `nombre`, `proceso_que_sostiene`, `proveedor`,
`donde_corre` (`nube` / `servidor_propio` / `equipo_de_alguien`), `usuarios`,
`tiene_datos_personales`, `tolerancia_caida` (horas).

**`completitud_ficha` no es administrativo.** Si el cliente no pudo armar el
inventario de sistemas, eso puntúa la dimensión de gestión de activos y va al
informe como hallazgo.

## Registro `participacion` — uno por persona

Lo que le toca a **una** persona dentro del assessment: el subconjunto de
dimensiones que puede contestar con hechos, según el ruteo del guion.

| Campo | Tipo | Origen |
|---|---|---|
| `participacion_id` | id | derivado |
| `assessment_id` | id | derivado |
| `rol` | texto, nunca nombre | persona |
| `dimensiones[]` | lista de `dimension_id` | derivado del ruteo del guion |
| `estado` | enum: `pendiente` `en_curso` `cerrada` `abandonada` | derivado |
| `sesiones` | entero | derivado |

`abandonada` es la salida de emergencia: si alguien nunca completa lo suyo, el
consultor la marca y sus dimensiones abiertas pasan a `indeterminado` con motivo
"el participante no completó". Sin eso, una persona de vacaciones bloquea el
entregable entero — y con eso, la falta queda visible en la sección 10 del
informe, que es donde corresponde.

## Registro `hallazgo` — uno por dimensión

| Campo | Tipo | Origen | Obligatorio |
|---|---|---|---|
| `hallazgo_id` | id | derivado | siempre |
| `dimension_id` / `dimension_nombre` | texto | derivado del guion | siempre |
| `funcion` | enum del marco (en ciber: `GV` `ID` `PR` `DE` `RS` `RC`) | derivado | siempre |
| `nivel` | entero 0-5, o nulo | agente | salvo indeterminado |
| `nivel_meta` | entero 0-5 | ficha o persona | siempre |
| `brecha` | entero | derivado (`meta − nivel`) | — |
| `estado_cobertura` | enum: `sin_tocar` `abierto` `cerrado` | agente | siempre |
| `estado_evidencia` | enum: `declarado` `respaldado` `verificado` `indeterminado` | agente / persona | siempre |
| `hallazgo` | texto, sobre la práctica y no sobre la persona | agente | si hay nivel |
| `cita_textual` | texto literal | agente | si hay nivel |
| `cita_entregable` | booleano | agente | siempre |
| `parafraseo` | texto | agente | si `cita_entregable` es falso |
| `rol_fuente[]` | lista de roles, nunca nombres | agente | si hay nivel |
| `evidencia_solicitada[]` / `evidencia_recibida[]` | listas | agente / persona | — |
| `esfuerzo` | enum: `bajo` `medio` `alto` | agente | si hay brecha |
| `conflicto` | booleano | agente | siempre |
| `detalle_conflicto` | texto | agente | si `conflicto` |
| `motivo_indeterminado` | texto | agente | si indeterminado |

`cita_entregable` se calcula con la regla de la decisión 3: es **falso** si se
puede deducir quién lo dijo **o** si el contenido perjudica a quien lo dijo. En
ese caso el informe muestra el `parafraseo`; la cita literal queda siempre en
el registro interno como respaldo del puntaje.

## Ausencias deliberadas

No las agregues después sin volver sobre esta decisión:

- **`proyecto_asociado`** — el agente no propone proyectos. El plan se construye
  en el taller posterior, con el cliente.
- **`prioridad`** — priorizar exige apetito de riesgo y contexto de negocio. Sale
  del taller, no de la entrevista.
- **`precio` / `costo`** — el plan lleva esfuerzo y plazo; el precio va en una
  propuesta aparte.
- **`nombre_persona`** — en ningún campo, en ningún registro.
- **`recomendacion`** — el agente no aconseja durante la entrevista.

## Reglas de validación

Son verificables por máquina, y por eso son el control de calidad real: la
repetibilidad la sostiene la validación, no la disciplina.

1. Toda dimensión del guion aparece **exactamente una vez**.
2. `nivel` nulo ⟺ `estado_evidencia = indeterminado`.
3. `indeterminado` ⟹ `motivo_indeterminado` no vacío.
4. `nivel` no nulo ⟹ `cita_textual` no vacía. **Sin cita no hay puntaje.**
5. `cita_entregable = false` ⟹ `parafraseo` no vacío.
6. `respaldado` ⟹ `evidencia_recibida` no vacía.
7. `verificado` ⟹ lo marcó una persona, nunca el agente.
8. `conflicto = true` ⟹ al menos dos `rol_fuente` y `detalle_conflicto` no vacío.
9. Una participación no cierra con ninguna de **sus** dimensiones en
   `sin_tocar` o `abierto`. El assessment cierra cuando cierran todas.
10. `rol_fuente` no contiene nombres propios.

La 4 y la 7 son las que sostienen la promesa: ningún puntaje sin respaldo, y
"verificado" no se lo puede poner el agente a sí mismo.

## Ejemplo

```json
{
  "hallazgo_id": "h-0142",
  "dimension_id": "RC.RP-01",
  "dimension_nombre": "Restauración probada",
  "funcion": "RC",
  "nivel": 1,
  "nivel_meta": 3,
  "estado_cobertura": "cerrado",
  "estado_evidencia": "declarado",
  "hallazgo": "Los respaldos se ejecutan de forma automática pero nunca se probó una restauración completa. No hay registro de pruebas ni responsable asignado.",
  "cita_textual": "backup hay, corre todas las noches, pero restaurar nunca restauramos nada, la verdad",
  "cita_entregable": false,
  "parafraseo": "Se confirma que el respaldo corre a diario y que no se realizaron pruebas de restauración.",
  "rol_fuente": ["responsable de sistemas"],
  "evidencia_solicitada": ["registro de la última restauración probada"],
  "evidencia_recibida": [],
  "esfuerzo": "bajo",
  "conflicto": false
}
```

La cita no se entrega: en una empresa chica se sabe quién la dijo y el contenido
lo expone. El informe muestra el parafraseo y el hallazgo, escritos sobre la
práctica y no sobre la persona.

## Pendiente

- Los `dimension_id` reales salen del guion, que todavía no está escrito.
- Decidir el formato de almacenamiento: un archivo por assessment alcanza para los
  primeros clientes; el benchmark va a pedir algo consultable.
