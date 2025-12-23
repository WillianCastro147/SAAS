export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Chave API não configurada na Vercel." });

  // TENTE MUDAR A URL ABAIXO SE O ERRO PERSISTIR:
  // Opção A: https://api.nanobanana.com/v1/images/generations
  // Opção B: https://api.nanobanana.pro/v1/images/generations
  const URL_API = "https://api.nanobanana.com/v1/images/generations";

  const prompt = `Christmas card background, ${style} style, empty central frame, text "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}". 8k.`;

  try {
    const response = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`,
        // ADICIONADO: User-Agent ajuda a evitar erros de handshake SSL em algumas CDNs
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        model: "flux", 
        prompt: prompt,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    // Se o erro de SSL persistir aqui, o Node vai cair no 'catch' abaixo
    const data = await response.json();

    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url;

    if (imageUrl) {
      return res.status(200).json({ url: imageUrl });
    } else {
      return res.status(500).json({ error: "API retornou erro", detail: data });
    }

  } catch (error) {
    console.error("ERRO DE CONEXÃO DETECTADO:", error);
    
    // Se der erro de SSL, vamos avisar o usuário para testar a URL alternativa
    return res.status(500).json({ 
      error: "Erro de Segurança (SSL) na Nano Banana", 
      detail: "O servidor da API recusou a conexão segura. Verifique se a URL da API no código está correta (tente mudar de .com para .pro)." 
    });
  }
}
