export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Mensagens inválidas"
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.groq_api_key}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Você é Betinha, uma assistente virtual amigável, inteligente, natural e acolhedora. Responda em português do Brasil. Você consegue conversar naturalmente, responder perguntas, fazer cálculos, explicar assuntos, ajudar a escrever textos e manter o contexto da conversa. Não diga que só consegue responder sobre sentimentos. Seja clara e útil."
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erro na API da IA"
      });
    }

    return res.status(200).json({
      response: data.choices?.[0]?.message?.content || "Não consegui responder."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao conectar com a IA."
    });
  }
}
