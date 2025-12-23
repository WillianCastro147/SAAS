export default async function handler(req, res) {
  // 1. Log inicial para saber que a requisição chegou
  console.log("--- Iniciando Geração de Imagem ---");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  // 2. Verifica se a chave existe (Causa comum de erro 500)
  if (!API_KEY || API_KEY === "") {
    console.error("ERRO: NANO_BANANA_KEY não encontrada nas variáveis de ambiente.");
    return res.status(500).json({ 
      error: "Chave API não configurada.",
      detail: "Vá em Settings > Environment Variables na Vercel e adicione NANO_BANANA_KEY" 
    });
  }

  const prompt = `Christmas card, ${style} style, empty central square frame, text "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}". 8k.`;

  try {
    console.log("Enviando requisição para Nano Banana...");
    
    const response = await fetch("https://api.nanobanana.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify({
        prompt: prompt,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    // 3. Verifica se a resposta do fetch é válida
    const data = await response.json();
    console.log("Resposta da Nano Banana recebida:", JSON.stringify(data));

    if (!response.ok) {
      console.error("A Nano Banana retornou um erro:", data);
      return res.status(response.status).json({ 
        error: "Erro na Nano Banana", 
        detail: data.error?.message || data.message || "Erro desconhecido na API externa" 
      });
    }

    // 4. Tenta extrair a URL de várias formas possíveis
    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url || (data.images && data.images[0]);

    if (imageUrl) {
      console.log("Sucesso! URL da imagem:", imageUrl);
      return res.status(200).json({ url: imageUrl });
    } else {
      console.error("Nenhuma URL encontrada no JSON de resposta.");
      return res.status(500).json({ error: "Resposta da API sem imagem.", detail: data });
    }

  } catch (error) {
    // 5. Captura erros catastróficos (ex: queda de rede)
    console.error("Erro catastrófico na API:", error);
    return res.status(500).json({ 
      error: "Erro interno no servidor", 
      detail: error.message 
    });
  }
}
