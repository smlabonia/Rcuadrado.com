# Assessments de madurez por vertical — catálogo de estándares

El sitio promete dos veces "armemos tu plan de madurez" y hoy no hay detrás un
instrumento para medirla. Este documento es el paso previo a construirlo: qué
estándares existen para cada vertical, para qué sirve cada uno, cuál conviene
como base y cuál no se puede usar por licencia.

**No es el assessment.** Es la lista de materiales y la recomendación de con
cuáles construirlo. Cada assessment se desarrolla aparte, en su propio
documento.

Versiones verificadas a septiembre de 2026. Las que se mueven rápido (ITIL,
DCAM, DMBOK) están marcadas.

> **Estado: borrador interno en desarrollo. No publicar.**
> Este documento se sigue trabajando en varias sesiones. Nada de acá va al
> sitio ni se publica como artifact hasta que se decida explícitamente. El
> artifact existente es una foto vieja y no se actualiza salvo pedido expreso.

---

## Cuatro decisiones antes de elegir estándar

### 1. Una escala común para las cinco verticales

Cada estándar trae su propia escala y ninguna es compatible con la otra: CISA
usa cuatro etapas (Tradicional → Óptimo), C2M2 usa cuatro MIL (0-3), Hammer usa
P-1 a P-4, DCAM y COBIT usan cinco niveles. Si cada vertical se puntúa con la
escala de su estándar, no hay forma de poner los cinco resultados en un mismo
gráfico ni de decirle al cliente "tu punto más débil es datos".

La decisión es **normalizar todo a una escala 0-5 propia** y usar cada estándar
como fuente de *qué preguntar*, no de *cómo puntuar*. Esto además esquiva el
problema de licencia: las preguntas propias no son obra derivada del modelo
ajeno, la escala tampoco.

### 2. Medir capacidad, no inventario de tecnología

Los cinco estándares serios miden lo mismo en el fondo: si una práctica existe,
si está escrita, si se cumple siempre, si se mide y si se mejora. Los modelos
de proveedor (Microsoft, Google, AWS) miden otra cosa: cuánto de su producto
está instalado. Sirven de checklist técnico, no de diagnóstico.

### 3. La licencia decide más que el contenido

Un modelo puede ser excelente y aun así ser inusable como base de un servicio
pago. El caso más filoso es CIS Controls: se distribuye bajo Creative Commons
**Atribución - No Comercial - Sin Derivadas**, y sus términos de uso dicen
explícitamente que no se puede usar para asistir a terceros en su evaluación.
Es exactamente lo que hace una consultora. Ver la sección de licencias al final.

### 4. El assessment termina en un plan, no en un número

Es coherente con el posicionamiento del sitio: "el diagnóstico es el punto de
partida cuando hace falta, no el producto". Cada assessment tiene que cerrar
con brecha priorizada, esfuerzo estimado y orden de ejecución. El radar es la
carátula, no el entregable.

---

## La escala común propuesta

| Nivel | Nombre | Prueba que lo confirma |
|---|---|---|
| 0 | Inexistente | No pasa. Nadie es responsable |
| 1 | Inicial | Pasa cuando alguien se acuerda. Depende de una persona |
| 2 | Repetible | Hay una forma conocida de hacerlo, no está escrita o no se sigue siempre |
| 3 | Definido | Está escrito, es el estándar de la casa y se cumple |
| 4 | Gestionado | Se mide, hay metas y alguien revisa el número |
| 5 | Optimizado | El número se usa para cambiar la práctica. Mejora sostenida |

Los mismos cinco anclajes sirven para las cinco verticales: **¿existe? ¿está
escrito? ¿se cumple siempre? ¿se mide? ¿se mejora?** Cada pregunta del
assessment se responde con evidencia, no con opinión: si el entrevistado dice
3, hay que poder ver el documento.

Para la mayoría de las PyMEs industriales de la región el objetivo realista es
**3**, no 5. Conviene decirlo desde el instrumento: la meta se fija por
vertical y por riesgo, no se aspira a 5 en todo.

---

## Tabla maestra

| Estándar | Dueño | Versión vigente | Estructura | Licencia | Rol recomendado |
|---|---|---|---|---|---|
| **NIST CSF 2.0** | NIST (EE.UU.) | 2.0, feb 2024 | 6 funciones, 22 categorías, 106 subcategorías, Tiers 1-4 | Dominio público | **Núcleo** ciberseguridad |
| **CIS Controls** | CIS | v8.1, jun 2024 | 18 controles, 153 salvaguardas, IG1/IG2/IG3 | CC BY-NC-ND ⚠️ | Contraste técnico interno |
| **NIST SP 800-207** | NIST | ago 2020 | Arquitectura zero trust, principios | Dominio público | Vocabulario de diseño |
| **CISA ZTMM** | CISA (EE.UU.) | v2.0, abr 2023 | 5 pilares × 4 etapas + 3 capacidades transversales | Dominio público | **Núcleo** módulo zero trust |
| **ISO/IEC 27001** | ISO/IEC | 2022 + Amd 1:2024 | SGSI + 93 controles Anexo A | Norma paga | Horizonte de certificación |
| **C2M2** | DOE (EE.UU.) | v2.1, jun 2022 | 10 dominios, +350 prácticas, MIL0-3 | Uso libre | **Núcleo** para clientes con OT |
| **IEC 62443** | IEC/ISA | serie | Zonas y conductos, SL 1-4 | Norma paga | Módulo planta industrial |
| **COBIT** | ISACA | 2019 | 40 objetivos, 5 dominios, capacidad 0-5, 11 design factors | Licencia ISACA | **Núcleo** estrategia y gobierno |
| **ISO/IEC 38500** | ISO/IEC | 2015 | 6 principios de gobernanza de TI | Norma paga | Lenguaje para directorio |
| **TOGAF + ACMM** | The Open Group | TOGAF 10 / guía G203 | 9-10 dominios de arquitectura, niveles 0-5 | Uso interno con licencia | Sólo si hay función de arquitectura |
| **AWS CAF** | AWS | 3.0 | 6 perspectivas, 47 capacidades, 4 fases | Libre, sesgo de proveedor | Módulo nube (cliente AWS) |
| **Microsoft CAF + WAF** | Microsoft | continua | Strategy/Plan/Ready/Adopt/Govern/Manage; WAF 5 pilares | Libre, sesgo de proveedor | Módulo nube (cliente Azure) |
| **Google CAF** | Google | continua | 4 temas × 3 fases (táctico/estratégico/transformacional) | Libre, sesgo de proveedor | Módulo nube (cliente GCP) |
| **FinOps Framework** | FinOps Foundation | continua | Capacidades + madurez Crawl/Walk/Run | Abierta | Módulo costos de nube |
| **Hammer PEMM** | Hammer & Co. (HBR 2007) | 2007 | 5 facilitadores P-1..P-4 + 4 capacidades E-1..E-4 | Publicado en HBR ⚠️ | **Núcleo** procesos |
| **OMG BPMM** | OMG | 1.0, 2008 | 5 niveles tipo CMMI, 30 áreas de proceso | Spec pública | Descartado por peso |
| **APQC PCF** | APQC | continua, con versión de petróleo y gas | Taxonomía jerárquica de procesos | Registro gratuito | Mapa de alcance |
| **acatech I4.0 Maturity Index** | acatech (Alemania) | 2020 | 6 etapas × 4 áreas estructurales | Publicación gratuita | **Núcleo** procesos de planta |
| **SIRI** | INCIT / EDB Singapur | continua | 16 dimensiones × 6 bandas, 3 capas | Requiere assessor certificado ⚠️ | Descartado por costo |
| **DAMA-DMBOK** | DAMA International | 2ª ed. 2017 (3.0 en desarrollo) | 11 áreas de conocimiento | Libro con derechos | **Taxonomía** de datos |
| **DCAM** | EDM Council | v3.1 (v3 jul 2025) | 8 componentes, 5 niveles | Membresía/licencia ⚠️ | Sólo cliente regulado |
| **CMMI DMM** | ISACA / CMMI Institute | 2014 | 6 categorías, 25 áreas de proceso | Licencia ISACA | Descartado por licencia |
| **NIST AI RMF** | NIST | 1.0, ene 2023 + perfil GenAI jul 2024 | GOVERN / MAP / MEASURE / MANAGE | Dominio público | **Núcleo** gobierno de IA |
| **ISO/IEC 42001** | ISO/IEC | 2023 | Sistema de gestión de IA, PDCA, Anexo A | Norma paga | Horizonte de certificación |
| **ITIL 4** | PeopleCert | 2019 | SVS, 4 dimensiones, 34 prácticas | Licencia PeopleCert ⚠️ | Vocabulario, no scoring |
| **ITIL 5** | PeopleCert | feb 2026 | Unifica producto y servicio; 36% material nuevo | Licencia PeopleCert ⚠️ | En observación |
| **ISO/IEC 20000-1** | ISO/IEC | 2018 | Requisitos auditables de SGS | Norma paga | Horizonte de certificación |
| **FitSM** | Comunidad FitSM | continua | 6 partes; FitSM-6 es modelo de madurez + planilla | Creative Commons, libre | **Núcleo** gestión de servicios |

⚠️ = revisar licencia antes de reempaquetar. Ver la última sección.

---

## 01 · Estrategia tecnológica empresarial

Es la vertical más difícil de medir porque no tiene un objeto técnico:
se mide cómo se decide, no qué está instalado.

### Candidatos

**COBIT 2019 (ISACA).** El único marco que cubre gobierno de TI de punta a
punta con una escala de capacidad ya definida (0-5, heredada de CMMI) sobre 40
objetivos en cinco dominios. Su mejor función acá son los **design factors**:
once variables (estrategia de la empresa, perfil de riesgo, tamaño, modelo de
sourcing, rol de TI) que recortan los 40 objetivos a los 12-15 que le importan
a ese cliente. Es exactamente el problema de una PyME que no puede ser evaluada
contra 40. Fuerte para: defender el resultado ante un directorio o una
auditoría. Débil en: jerga impenetrable, y la licencia de ISACA obliga a
reescribir todo en lenguaje propio.

**ISO/IEC 38500.** Seis principios de gobernanza en pocas páginas. No es un
modelo de madurez, pero es el mejor lenguaje disponible para hablar con un
directorio que no es técnico. Sirve para redactar las preguntas de nivel alto.

**TOGAF 10 + la guía de modelos de madurez de arquitectura (G203).** Sólo
aplica si el cliente tiene una función de arquitectura. En la industria de la
región casi ninguno la tiene, así que rinde poco.

**Gartner ITScore, Forrester, MIT CISR.** Conceptualmente muy buenos y detrás
de un muro de pago. No se pueden usar como base de un producto propio. Sirven
para leer y robar ideas de estructura, no para citar.

### Módulo nube

La nube no es una vertical del sitio y no hace falta que lo sea: entra como
módulo de esta vertical, con el marco del proveedor que el cliente ya usa.

- **AWS CAF 3.0** — seis perspectivas (Negocio, Personas, Gobierno, Plataforma,
  Seguridad, Operaciones) y 47 capacidades. Es el más completo de los tres en
  la parte no técnica: gobierno, personas y operación pesan tanto como la
  plataforma.
- **Microsoft CAF** — el más práctico para ejecutar (Strategy, Plan, Ready,
  Adopt, Govern, Manage), con autoevaluaciones gratuitas online y el
  Well-Architected Framework para revisar cargas concretas contra cinco
  pilares. Si el cliente es de Microsoft 365 — la mayoría en la región — es el
  camino natural.
- **Google CAF** — cuatro temas (aprender, liderar, escalar, asegurar) sobre
  tres fases. El más simple de explicar, el menos accionable.
- **FinOps Framework** — el único que mide gobierno del gasto en nube, con
  madurez Crawl/Walk/Run. Abierto y liviano. Vale como sub-módulo cuando el
  cliente ya está en nube y le duele la factura.

Los tres CAF miden adopción de *ese* proveedor. Como diagnóstico neutral no
sirven; como checklist de brechas después de decidir proveedor, son excelentes.

### Recomendación

**Núcleo:** COBIT 2019 recortado con design factors, reescrito en lenguaje
llano. **Complemento:** ISO/IEC 38500 para el registro de directorio, CAF del
proveedor + FinOps para el módulo nube. **Descartar:** TOGAF salvo cliente
grande, Gartner/Forrester por licencia.

### Dimensiones propuestas

1. Rumbo — ¿existe un plan tecnológico escrito y alineado al plan de negocio?
2. Decisión e inversión — quién aprueba, con qué criterio, con qué caso de negocio
3. Cartera y prioridades — qué proyectos hay, cómo se ordenan, qué se mata
4. Capacidades y proveedores — qué se hace adentro, qué se terceriza, cómo se controla
5. Arquitectura e integración — qué tan acoplado está todo, cuánto cuesta cambiar
6. Nube y plataforma — dónde corre, quién lo opera, qué cuesta
7. Riesgo y continuidad — qué pasa si falla, quién lo sabe
8. Medición — ¿se sabe si la tecnología está dando resultado?

---

## 02 · Digitalización de procesos

Acá el error clásico es medir la organización cuando lo que hay que medir es
**cada proceso**. Un cliente puede tener compras en nivel 4 y mantenimiento en
nivel 1, y el promedio no le dice nada.

Pero antes de medir un proceso hay que encontrarlo. Esta vertical no es un
assessment sino cuatro etapas encadenadas: cada una más profunda y sobre menos
cosas que la anterior.

### El embudo

| Etapa | Profundidad | Sobre qué | Duración estimada |
|---|---|---|---|
| **1. Barrido** | Área | Todas las áreas | 2-3 h con 4-5 referentes |
| **2. Mapeo** | Proceso, un solo nivel | Todas las áreas + 3-4 cadenas | Medio día a un día cada 4-5 áreas |
| **3. Selección** | — | Compuerta con criterios | 1 reunión |
| **4. PEMM** | Proceso, con evidencia | Los 5-8 procesos elegidos | ~2 h por proceso |

La profundidad es despareja a propósito. **Mapear procesos y subprocesos de
todas las áreas es donde se mueren estos trabajos**: tres semanas quemadas, un
mapa hermoso y un cliente que todavía no vio nada funcionando. El detalle de
subprocesos y actividades es trabajo de implementación, no de diagnóstico: se
releva cuando ya se sabe que ese proceso se va a tocar, porque ahí se paga solo.

El corte comercial natural cae después de la etapa 3: lo de arriba es corto y
acotado, lo de abajo ya es el proyecto.

### Etapa 1 · Barrido de cobertura

Encuentra los agujeros blancos: áreas sin herramienta, con el trabajo en papel,
sin registro y sostenidas por una sola persona. Es el instrumento que el sitio
ya promete en dos tarjetas — "¿cada área de tu empresa tiene una herramienta que
la soporte?" y "¿cuánto del trabajo diario se coordina por mensajes y
planillas?".

Seis preguntas por área:

1. **¿Qué herramienta sostiene el trabajo del área?** Ninguna / planillas / un
   sistema general / un sistema propio del área.
2. **¿Qué sale en papel?** Formularios, partes, remitos, planillas de campo.
3. **¿Dónde queda el registro?** No queda / papel / planilla local / planilla
   compartida / sistema.
4. **¿Quién consume lo que el área produce, y cómo se lo pasan?** Mail,
   WhatsApp, papel, integración.
5. **¿Cuántas personas saben hacerlo?** Una / algunas / está documentado.
6. **¿Cuántas horas por semana se van recargando datos de un lado a otro?**

Dos advertencias sobre este instrumento:

- **La pregunta 4 pesa más que la 1.** El caso más frecuente no es el área sin
  sistema: es el área que tiene sistema, lo usa de repositorio y coordina el
  trabajo real por WhatsApp y una planilla paralela. Preguntar qué está
  licenciado no lo detecta; preguntar dónde se coordina, sí.
- **La pregunta 5 se reporta aparte, con su propio número.** Al dueño de una
  PyME no lo mueve un 1,8 sobre 5; lo mueve "si Marta se va, compras se para
  tres semanas". Es además lo que separa el nivel 1 del 2 en la escala común.

El barrido tiene resolución para distinguir un 0-2 de un 3 o más, no para fijar
el nivel exacto. Eso lo confirma la etapa 4.

Sale de acá con hallazgos que pertenecen a tres verticales y conviene
etiquetarlos al salir: "no hay herramienta" va a 02, "el dato no queda o nadie
confía en él" va a 03, "el sistema existe pero nadie lo administra" va a 01. Una
sola entrevista alimenta tres assessments: es el mejor argumento para hacerlo
primero.

### Etapa 2 · Mapeo

Inventario de procesos a **un solo nivel de profundidad**, en todas las áreas.
APQC PCF da la jerarquía ya hecha —categoría, grupo de procesos, proceso,
actividad— con versión de petróleo y gas: se usan los dos primeros niveles para
todas las áreas y se baja al tercero sólo en los candidatos. Evita discutir con
el cliente qué es un proceso y qué un subproceso, conversación que no lleva a
ningún lado.

**Más una pasada por cadenas punta a punta: tres o cuatro, no más.** Si el
barrido es por área y el mapeo también, todo lo que cruza áreas queda invisible
—y ahí está el dolor real, porque nadie es dueño de eso—. Es el facilitador
"Responsable" de PEMM, detectado antes de llegar a PEMM. En una empresa
industrial de la región las cadenas suelen ser:

- Aviso de falla → orden de trabajo → repuesto → ejecución → cierre
- Requerimiento → compra → recepción → pago
- Pedido → programación → entrega → facturación
- Búsqueda → contratación → alta → habilitaciones

Se sigue cada cadena preguntando en cada pase: qué recibís, de quién, en qué
formato, y qué hacés antes de poder usarlo. Donde A dice que manda algo que B
dice que no recibe, hay un proceso roto que ningún relevamiento por área iba a
encontrar.

### Etapa 3 · Selección

Compuerta explícita, con los criterios escritos y acordados **antes** de mirar
los resultados. Si no, la elección parece arbitraria y el cliente elige por
política interna.

| Criterio | Qué mira | De dónde sale |
|---|---|---|
| **Dolor** | Horas, errores, retrabajo, reclamos | Barrido, preguntas 2 y 6 |
| **Riesgo** | Cuánta gente sabe hacerlo, cumplimiento, seguridad, continuidad | Barrido, pregunta 5 |
| **Valor** | Volumen y criticidad para el negocio | Mapeo y cadenas |
| **Factibilidad** | ¿Se puede tocar sin rehacer todo lo demás? | Mapeo |

Dolor y riesgo salen del barrido casi gratis. Poder decir "estos cinco, por
esto" es la mitad de la venta del proyecto de ejecución.

### Etapa 4 · Medición del proceso

Recién acá entra el modelo de madurez propiamente dicho, sobre los 5-8 procesos
seleccionados y con evidencia. Los candidatos evaluados para esta etapa:

### Candidatos

**Hammer PEMM (Harvard Business Review, abril 2007).** El mejor candidato para
PyME y el más subestimado. Evalúa cada proceso contra cinco facilitadores
—diseño, ejecutores, responsable, infraestructura e indicadores— en cuatro
niveles (P-1 a P-4), y en paralelo evalúa cuatro capacidades de la empresa
—liderazgo, cultura, expertise y gobierno— en E-1 a E-4. Fuerte para: entra en
dos páginas, se completa en un taller, y el eje de "capacidades de empresa"
explica por qué los procesos no maduran aunque se los rediseñe. Es el modelo
que mejor traduce a lenguaje de dueño de PyME.

**OMG BPMM 1.0.** Cinco niveles tipo CMMI sobre 30 áreas de proceso. Riguroso y
gratuito como especificación, y desproporcionado: pensado para organizaciones
que ya tienen una oficina de procesos.

**APQC Process Classification Framework.** No es un modelo de madurez: es la
taxonomía de procesos, con versión general y versiones sectoriales —incluida
**petróleo y gas**—. Su valor acá es distinto y grande: es el instrumento de la
etapa 2, el que define de qué procesos estamos hablando para que el
relevamiento no se invente su propio mapa cada vez. Registro gratuito.

**acatech Industrie 4.0 Maturity Index.** Seis etapas encadenadas
—informatización, conectividad, visibilidad, transparencia, capacidad
predictiva, adaptabilidad— sobre cuatro áreas estructurales (recursos, sistemas
de información, cultura, estructura organizativa). La progresión es la mejor
explicación disponible de por qué no se puede predecir nada si antes no se ve
nada. Para clientes con planta, es el marco correcto.

**SIRI (Singapur).** 16 dimensiones en seis bandas, con benchmark
internacional. Muy bueno y cerrado: la evaluación oficial requiere assessor
certificado. Descartado por costo y por dependencia.

**ISO 9001:2015.** Si el cliente ya está certificado, su enfoque a procesos y
sus procedimientos son la evidencia más barata que hay para puntuar. Vale
preguntarlo primero.

### Recomendación

**Núcleo:** Hammer PEMM en la etapa 4, proceso por proceso, sobre los 5-8
seleccionados. **Complemento:** APQC PCF como instrumento de la etapa 2,
acatech cuando el proceso vive en planta. **Descartar:** OMG BPMM por peso,
SIRI por licencia.

### Dimensiones propuestas — etapa 4

Por cada proceso relevado:

1. Diseño — ¿está documentado de punta a punta o sólo por área?
2. Responsable — ¿hay un dueño con autoridad sobre todo el proceso?
3. Ejecutores — ¿la gente conoce el proceso completo o sólo su paso?
4. Soporte digital — ¿hay herramienta, o son planillas y mensajes?
5. Datos y trazabilidad — ¿queda registro de quién hizo qué y cuándo?
6. Indicadores — ¿se mide tiempo, costo o error del proceso?
7. Excepciones — ¿qué pasa cuando algo sale de lo normal?

Más el eje de empresa (una sola vez): liderazgo, cultura, expertise, gobierno.

---

## 03 · Analítica de datos

La vertical con más modelos y menos consenso. Casi todos los que se venden como
"modelo de madurez de datos" son escaleras de marketing.

### Candidatos

**DAMA-DMBOK 2ª edición.** Once áreas de conocimiento (gobierno, arquitectura,
modelado, almacenamiento, seguridad, integración, documentos, referencia y
maestros, data warehousing e inteligencia de negocios, metadatos, calidad). Es
la taxonomía estándar de la disciplina. **No es un modelo de madurez**: no trae
niveles ni scoring, aunque describe cómo hacer una evaluación (DMMA). La 3ª
edición está en desarrollo con foco en IA y nube, sin fecha. Usarlo como mapa
del territorio y ponerle encima la escala propia es la jugada correcta.

**DCAM v3.1 (EDM Council).** Ocho componentes, cinco niveles, el más riguroso
del mercado y con benchmark entre pares. Nació en la industria financiera y se
nota: pide un nivel de formalidad que una PyME industrial no tiene ni necesita.
Requiere membresía. Reservarlo para clientes regulados o corporativos.

**CMMI Data Management Maturity.** Seis categorías, 25 áreas de proceso. Sólido
y con licencia de ISACA. Descartado por costo frente a lo que aporta.

**Modelo de madurez EIM de Gartner** (cinco niveles: consciente, reactivo,
proactivo, gestionado, efectivo). Retirado como producto pero citadísimo. Sirve
para nombrar los niveles en lenguaje comercial.

**La escalera analítica** (descriptiva → diagnóstica → predictiva →
prescriptiva). Es la mejor lámina para una reunión comercial y la peor escala
de medición que existe: una empresa puede tener un modelo predictivo andando y
no saber quién es dueño del dato que lo alimenta. Usarla para comunicar el
horizonte, jamás para puntuar.

**ISO/IEC 38505-1** (gobernanza de datos) e **ISO 8000** (calidad de datos)
como referencia normativa cuando hay que sostener un criterio.

### Recomendación

**Núcleo:** DMBOK como taxonomía + escala 0-5 propia. **Complemento:** DCAM
sólo para cliente regulado; vocabulario de Gartner para la presentación.
**Descartar:** CMMI DMM por licencia, escalera analítica como escala.

### Dimensiones propuestas

1. Gobierno — ¿alguien es dueño de cada dato crítico?
2. Fuentes y captura — ¿el dato nace digital o se recarga a mano?
3. Arquitectura y almacenamiento — dónde vive, cómo se integra
4. Calidad — ¿se sabe si el dato está bien? ¿alguien lo corrige?
5. Definiciones — ¿"producción" significa lo mismo en dos áreas?
6. Acceso y seguridad — quién ve qué, con qué control
7. Consumo — tableros, informes, y si alguien decide con ellos
8. Retención y respaldo — qué se guarda, cuánto, y si se probó restaurarlo

La dimensión 5 es la que más brecha revela en la industria de la región y no
aparece explícita en casi ningún modelo comercial.

---

## 04 · Adopción de inteligencia artificial

Hay que medir dos cosas distintas y no confundirlas: **si el cliente está en
condiciones de adoptar** y **si puede hacerlo sin meterse en un problema**.
Ningún marco único cubre las dos.

### Candidatos

**NIST AI RMF 1.0 + perfil de IA generativa (NIST AI 600-1).** Cuatro funciones
—GOVERN, MAP, MEASURE, MANAGE— con un playbook de acciones sugeridas. Dominio
público, sin costo, sin scoring formal (lo cual acá es una ventaja: se le pone
la escala propia). Es el esqueleto correcto para el eje de riesgo y gobierno.

**ISO/IEC 42001:2023.** Sistema de gestión de IA certificable, con estructura
PDCA y anexo de controles. Complementario, no competidor, del AI RMF: uno da la
estructura de gestión, el otro la metodología de riesgo. Es el horizonte para
un cliente que algún día necesite demostrarle a un tercero que gobierna su IA.
Acompañan ISO/IEC 23894 (riesgo), 22989 (conceptos) y 5338 (ciclo de vida).

**EU AI Act.** No aplica por estar en Argentina, sí aplica si el cliente
exporta a la Unión Europea o su producto se usa allá. Vale una pregunta de
filtro en el assessment, no un módulo.

**Modelos de proveedor** (Microsoft, cuatro niveles; Google; Gartner, cinco
niveles sobre siete pilares y detrás de un muro de pago). Miden preparación
técnica para su propia plataforma. Sirven como lista de verificación de
prerrequisitos, no como diagnóstico.

### Recomendación

**Núcleo:** dos ejes propios — preparación (datos, plataforma, casos, personas,
procesos) y gobierno (NIST AI RMF). **Complemento:** ISO/IEC 42001 como
horizonte declarado. **Descartar:** modelos de proveedor como base.

### Dimensiones propuestas

Eje preparación:

1. Casos de uso — ¿hay casos identificados con valor estimado, o entusiasmo suelto?
2. Datos disponibles — ¿existe el dato que el caso necesita, y en qué estado?
3. Plataforma y herramientas — qué hay licenciado, qué se usa realmente
4. Personas — quién sabe usarla, quién la usa a escondidas
5. Procesos — ¿el proceso se adaptó, o se le encajó IA arriba de lo mismo?

Eje gobierno:

6. Política de uso — ¿está escrito qué se puede subir a un modelo y qué no?
7. Supervisión — ¿alguien revisa lo que la IA produce antes de que salga?
8. Riesgo y cumplimiento — datos personales, propiedad intelectual, sesgo, proveedores

La pregunta 6 es hoy la de mayor brecha real: casi todas las empresas ya tienen
gente pegando información interna en un chat, y casi ninguna tiene una regla
escrita sobre eso.

---

## 05 · Ciberseguridad

La vertical con los mejores materiales disponibles, todos gratuitos y de
dominio público. Acá no hace falta inventar casi nada.

### Candidatos

**NIST CSF 2.0 (febrero 2024).** La columna vertebral. Seis funciones —GOVERN,
IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER— con 22 categorías y 106
subcategorías. La novedad de la versión 2.0 es GOVERN, que subió la
ciberseguridad de problema técnico a responsabilidad de dirección: es
justamente la conversación que hay que tener con el dueño de una PyME. Trae dos
mecanismos aprovechables: los **Tiers** (1 a 4, que miden qué tan
institucionalizada está la gestión de riesgo, no qué controles hay) y los
**Perfiles** actual y objetivo, que producen la brecha priorizada sin trabajo
extra. Dominio público, reutilizable sin restricción.

**CIS Controls v8.1.** 18 controles y 153 salvaguardas ordenadas en tres grupos
de implementación; IG1 son 56 salvaguardas definidas como "higiene cibernética
esencial" y es un excelente piso para una PyME. El contenido es el mejor que
hay para traducir el CSF a acciones concretas. **Problema serio de licencia:**
CC Atribución-No Comercial-Sin Derivadas, y los términos de uso limitan el uso
a la evaluación interna de la propia organización, excluyendo asistir a
terceros. Como consultora, usarlo internamente como guía de qué recomendar es
un uso defendible; publicarlo o incorporarlo a un entregable pago no lo es.
Antes de basar el producto en CIS hay que consultar con CIS por membresía.

**NIST SP 800-207 (Zero Trust Architecture).** Define el modelo conceptual:
verificación explícita, mínimo privilegio, asumir la brecha. No mide nada. Es
el vocabulario.

**CISA Zero Trust Maturity Model v2.0 (abril 2023).** Lo que sí mide. Cinco
pilares —identidad, dispositivos, redes, aplicaciones y cargas de trabajo,
datos— evaluados por separado en cuatro etapas (tradicional, inicial, avanzado,
óptimo), más tres capacidades transversales: visibilidad y analítica,
automatización y orquestación, gobernanza. La versión 2.0 agregó la etapa
"inicial" precisamente porque el salto de tradicional a avanzado era
inalcanzable de una vez, que es la situación de cualquier PyME. Dominio
público. Es un módulo excelente y autocontenido, sobre todo la parte de
identidad.

**ISO/IEC 27001:2022 + Amd 1:2024.** El horizonte cuando el cliente necesita el
sello para una licitación o un cliente internacional. La enmienda de 2024
agregó la consideración de cambio climático en el contexto de la organización
(cláusulas 4.1 y 4.2), sin invalidar certificados existentes. Como instrumento
de diagnóstico es rígido: mide conformidad, no madurez.

**C2M2 v2.1 (Departamento de Energía de EE.UU., junio 2022).** Diez dominios,
más de 350 prácticas, cuatro niveles indicadores de madurez (MIL0 a MIL3) por
dominio, diseñado para IT y OT y alineado al CSF. Tiene herramienta de
autoevaluación gratuita, pensada para completarse en un día, con tablero de
resultados. **Para clientes de energía y petróleo y gas de la región es el
marco de mayor afinidad.** Existe una versión específica de petróleo y gas
(ONG-C2M2) pero es de 2014 y está desactualizada: conviene usar el C2M2
general.

**IEC 62443.** La serie de OT industrial: zonas y conductos, niveles de
seguridad SL 1 a 4, con partes para el operador (62443-2-1) y para el sistema
(62443-3-3). Norma paga. Necesaria cuando el alcance incluye planta,
instrumentación o SCADA.

**NIST SP 800-171 / CMMC.** Sólo aplican a cadena de suministro de defensa de
EE.UU. Descartables acá.

### Recomendación

**Núcleo:** NIST CSF 2.0. Las seis funciones son directamente las seis
secciones del informe. **Complemento:** CISA ZTMM como módulo de identidad y
acceso; C2M2 cuando hay OT; IEC 62443 cuando hay planta; CIS v8.1 como
referencia interna para redactar recomendaciones, con la cautela de licencia.
**Horizonte:** ISO/IEC 27001 para quien necesite certificar.

### Dimensiones propuestas

Las seis funciones del CSF 2.0, con el módulo zero trust dentro de PROTECT:

1. Gobierno — quién responde, con qué política, con qué presupuesto
2. Identificar — activos, datos, proveedores, riesgos conocidos
3. Proteger — identidad y acceso (aquí entra ZTMM), configuración, respaldo, gente
4. Detectar — ¿alguien se enteraría? ¿en cuánto tiempo?
5. Responder — plan, roles, ensayo, comunicación
6. Recuperar — restauración probada, tiempo objetivo, continuidad del negocio

Más un módulo condicional de OT (C2M2 / 62443) cuando el cliente tiene planta.

---

## 06 · Gestión de servicios — transversal

No es una de las cinco verticales del sitio y conviene decidir qué es: módulo
dentro de estrategia tecnológica, o sexta vertical con oferta propia. Si se
vuelve vertical, hay que actualizar el sitio en dos lugares (la grilla de
servicios y el catálogo de datos estructurados).

### Candidatos

**ITIL 4 (2019).** El vocabulario dominante: sistema de valor del servicio,
cuatro dimensiones, 34 prácticas de gestión. **No trae modelo de madurez en sus
libros centrales**; el ITIL Maturity Model es un producto licenciado aparte de
PeopleCert. Es decir: ITIL sirve para nombrar las prácticas, no para puntuarlas
gratis.

**ITIL 5 (febrero de 2026).** PeopleCert publicó Foundation el 12 de febrero de
2026 y los módulos avanzados entre marzo y abril, con publicaciones adicionales
de transformación y gobierno de IA. Unifica gestión de producto y de servicio
en un ciclo único; alrededor de un tercio del contenido es nuevo y no reemplaza
a ITIL 4, que convive durante la transición. **Recomendación: observar, no
adoptar todavía.** Es demasiado nuevo para basar un producto propio, y el
material de referencia todavía se está asentando.

**ISO/IEC 20000-1:2018.** Requisitos auditables de un sistema de gestión de
servicios. Certificable. ISO/IEC TS 20000-11:2021 documenta la correspondencia
con ITIL, lo cual ahorra el trabajo de mapear a mano.

**FitSM.** El hallazgo de esta búsqueda. Familia de estándares libres bajo
Creative Commons, compatible con ISO/IEC 20000-1 e ITIL, con seis partes; la
parte **FitSM-6 es un modelo de madurez y capacidad con esquema de evaluación,
en planilla, con descripciones de situación para puntuar**. Es decir: un
instrumento de evaluación ya construido, gratuito, reutilizable y liviano,
pensado exactamente para organizaciones que no pueden con ITIL completo.

### Recomendación

**Núcleo:** FitSM (FitSM-1 para los requisitos, FitSM-6 para la evaluación).
**Complemento:** ISO/IEC 20000-1 como horizonte de certificación; ITIL 4 como
vocabulario en el informe, porque es lo que el cliente escuchó nombrar.
**Descartar por ahora:** ITIL 5 y cualquier modelo de madurez licenciado.

---

## Normativa argentina que conviene tener mapeada

No son marcos de madurez, son obligaciones. Aparecen en el assessment de
ciberseguridad y en el de datos como preguntas de cumplimiento, y son el
argumento comercial más eficaz que existe con un dueño de PyME.

| Norma | Qué exige | Dónde entra |
|---|---|---|
| **Ley 25.326** (2000) | Protección de datos personales; inscripción de bases de datos ante la AAIP como condición de licitud | Ciber + Datos |
| **Resolución AAIP 47/2018** | Medidas de seguridad recomendadas para tratamiento y conservación de datos personales. Derogó la Disposición DNPDP 11/2006 | Ciber |
| **Ley 26.388** (2008) | Delitos informáticos en el Código Penal: acceso ilegítimo (art. 153 bis), datos personales (art. 157 bis) | Ciber |
| **Reforma de la ley de datos** | Proyectos en el Congreso, inspirados en un anteproyecto de la AAIP, alineados a GDPR y a la ley brasileña: responsabilidad proactiva, privacidad por diseño, portabilidad, oposición a decisiones automatizadas | A vigilar |
| **EU AI Act** | Aplica si el cliente exporta a la UE o su producto se usa allá | IA |

El dato comercial más útil: la inscripción de bases de datos ante la AAIP es
obligatoria desde el año 2000 y la enorme mayoría de las empresas no la hizo.
Es una brecha concreta, verificable en cinco minutos y con costo de
regularización bajo. Sirve de primera recomendación en casi cualquier informe.

---

## Licencias — qué se puede reempaquetar y qué no

Esta tabla es la que evita un problema legal cuando el assessment se convierta
en un entregable pago.

| Se puede usar y reempaquetar libremente | Requiere cuidado | No usar como base |
|---|---|---|
| NIST CSF 2.0, SP 800-207, AI RMF (dominio público, EE.UU.) | **CIS Controls** — CC BY-NC-ND y términos que excluyen asistir a terceros. Consultar membresía antes de incorporarlo a un producto | Gartner, Forrester, MIT CISR (paywall) |
| CISA ZTMM v2.0 (dominio público) | **COBIT, CMMI, ITIL** — licencia de ISACA / PeopleCert. Se pueden usar como fuente conceptual; el texto no se copia | SIRI (requiere assessor certificado) |
| C2M2 v2.1 y su herramienta (DOE) | **DCAM** — membresía EDM Council | ITIL Maturity Model (producto licenciado) |
| FitSM (Creative Commons) | **Hammer PEMM** — publicado en HBR, con derechos. La estructura es de dominio conceptual; las tablas no se reproducen | |
| FinOps Framework | **APQC PCF** — gratuito con registro, revisar términos de redistribución | |
| CAF de AWS, Microsoft y Google (con sesgo de proveedor) | **Normas ISO/IEC e IEC** — se compran, no se reproducen. Se puede citar la cláusula, no transcribirla | |

La regla práctica: **las preguntas se escriben propias**. Un estándar dice qué
temas cubrir y en qué orden; la redacción, la escala y el informe son obra
propia. Eso mantiene el producto limpio y además lo hace mejor, porque ningún
estándar está escrito en el idioma de un gerente de planta de Neuquén.

---

## Recomendación en una tabla

| Vertical | Núcleo | Complemento | Horizonte |
|---|---|---|---|
| 01 Estrategia tecnológica | COBIT 2019 recortado | ISO/IEC 38500; CAF del proveedor; FinOps | — |
| 02 Digitalización de procesos | Hammer PEMM, en la etapa 4 de un embudo de cuatro | APQC PCF en el mapeo; acatech I4.0 en planta | ISO 9001 si ya está |
| 03 Analítica de datos | DAMA-DMBOK + escala propia | DCAM si es regulado | ISO/IEC 38505 |
| 04 Adopción de IA | Preparación propia + NIST AI RMF | Perfil GenAI de NIST | ISO/IEC 42001 |
| 05 Ciberseguridad | NIST CSF 2.0 | CISA ZTMM; C2M2 e IEC 62443 con OT; CIS como referencia interna | ISO/IEC 27001 |
| 06 Gestión de servicios | FitSM | ITIL 4 como vocabulario | ISO/IEC 20000-1 |

Tres de los seis núcleos son gratuitos y de uso libre (CSF, AI RMF, FitSM), uno
es un artículo de 2007 cuya estructura se puede reimplementar (PEMM), uno es
una taxonomía pública (DMBOK) y sólo uno tiene licencia paga (COBIT), y ahí la
licencia se necesita para leerlo, no para preguntar lo que enseña.

---

## Lo que falta

- Decidir si gestión de servicios es la sexta vertical o un módulo. Si es
  vertical, actualizar la grilla de servicios y el JSON-LD del sitio.
- Definir el formato común: cantidad de preguntas, duración del taller, quién
  responde cada bloque, qué evidencia se pide, cómo se ve el informe.
- Escribir el primer assessment completo como plantilla de los otros cinco. El
  candidato natural es ciberseguridad: es el de mejor material gratuito, el de
  mayor demanda declarada y el que ya tiene una estadística en el sitio.
- Resolver la consulta de licencia con CIS antes de que las salvaguardas IG1
  aparezcan en un entregable.
- Definir los valores de referencia: contra qué se compara un nivel 2 para
  decir si está bien o mal. Sin eso el número no significa nada.
