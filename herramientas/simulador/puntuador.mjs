// El puntuador, separado del entrevistador y del transporte.
//
// No conversa con nadie: lee una entrevista que ya ocurrió y decide UN solo
// tema, con los anclajes de ese tema delante y nada más. Vive en su propio
// módulo para que se lo pueda correr sobre un transcripto guardado, sin repetir
// la entrevista: es la única forma barata de medir cuánto se mueve el puntaje
// cuando la conversación es idéntica.

const anclajesDe = (d) =>
  Object.entries(d.anclajes).map(([n, t]) => `  ${n} = ${t}`).join("\n");

export const PUNTUADOR = (d) => `
Sos el puntuador de R² Tech Partner. Leés una entrevista que ya ocurrió y ponés
el nivel de un solo tema. No conversás con nadie y no hacés preguntas.

EL TEMA
[${d.id}] ${d.nombre}
Mide: ${d.mide}
${anclajesDe(d)}
${d.regla_especial ? `REGLA: ${d.regla_especial}` : ""}${d.nota_de_campo ? `NOTA: ${d.nota_de_campo}` : ""}

CÓMO PUNTUÁS
Elegís el anclaje que describe el hecho observado, no la intención ni lo que la
persona cree que pasa. "Estamos por implementarlo" describe el futuro.
Si dos anclajes parecen ciertos a la vez, suele ser porque uno describe lo que
existe y el otro lo que efectivamente se hace: quedate con el que describe lo
que se hace.
La cita tiene que ser textual de la persona entrevistada y tiene que respaldar
el nivel que elegiste. Sin cita no hay puntaje.
El hallazgo es sobre la práctica, nunca sobre la persona, y sin adjetivos de
catástrofe.
No escribís nombres propios en ningún campo: todo va por rol.
cita_entregable es falso si se puede deducir quién lo dijo o si el contenido
perjudica a quien lo dijo. En ese caso el parafraseo es obligatorio.
esfuerzo es cuánto costaría subir un nivel: bajo, medio o alto.

Devolvés SÓLO un objeto JSON, sin texto alrededor, con estas claves exactas:
nivel, hallazgo, cita_textual, cita_entregable, parafraseo, esfuerzo.
`.trim();

const soloJSON = (texto) => {
  const crudo = texto.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(crudo);
  } catch {
    const m = crudo.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  }
};

// `pedir` se inyecta para que el módulo no sepa nada del transporte.
export async function puntuar({ pedir, modelo, extra = {}, dim, conversacion, porQueAlcanza, aviso }) {
  const r = await pedir({
    model: modelo,
    max_tokens: 1500,
    messages: [
      { role: "system", content: PUNTUADOR(dim) },
      {
        role: "user",
        content:
          `ENTREVISTA\n\n${conversacion}\n\n` +
          `EL ENTREVISTADOR DA POR CUBIERTO ESTE TEMA PORQUE: ${porQueAlcanza}` +
          (aviso ? `\n\nTU INTENTO ANTERIOR FUE RECHAZADO: ${aviso}\nCorregilo.` : ""),
      },
    ],
    ...extra,
  });
  const texto = (r.choices[0].message.content ?? "").trim();
  return { puntaje: soloJSON(texto), usage: r.usage };
}
