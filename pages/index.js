const generate = async () => {
    if (!name) return alert("Por favor, digite o nome!");
    if (!userPhoto) return alert("Por favor, adicione uma foto!");
    
    setLoading(true);
    setBgImage(null);

    const randomPhrase = christmasPhrases[Math.floor(Math.random() * christmasPhrases.length)];

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, dynamicPhrase: randomPhrase })
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        setBgImage(data.url);
      } else {
        // Agora o alerta vai dizer o ERRO REAL (ex: "Sem créditos" ou "Chave inválida")
        alert("Ops! " + (data.error || "Erro desconhecido"));
      }
    } catch (e) {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
};
