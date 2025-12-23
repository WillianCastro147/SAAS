import { useState, useRef } from 'react';
import Head from 'next/head';

export default function NatalSaaS() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq'); // sq = square, st = story
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const phrases = [
    "Que a magia ilumine sua vida!",
    "Tempo de paz, amor e união.",
    "Celebrando momentos inesquecíveis.",
    "Gratidão por este ano incrível!",
    "Um brinde aos novos começos!",
    "Que a alegria transborde hoje!"
  ];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(URL.createObjectURL(file));
    }
  };

  const generate = async () => {
    if (!name) return alert("Por favor, digite o nome da marca ou família.");
    if (!userPhoto) return alert("Por favor, adicione uma foto para o quadro.");
    
    setLoading(true);
    setBgImage(null);
    
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(selectedPhrase);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          style, 
          fmt, 
          phrase: selectedPhrase 
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        setBgImage(data.url);
      } else {
        alert("Erro: " + (data.error || "A API não conseguiu gerar a imagem. Verifique sua chave e saldo."));
      }
    } catch (e) {
      alert("Erro de conexão. Verifique os logs da Vercel.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(currentPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWA = () => {
    const text = encodeURIComponent(`🎅 Olha a arte de Natal que criei para ${name}!\n\n"${currentPhrase}"`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fffafa] text-slate-900 font-sans pb-20">
      <Head>
        <title>NatalMagic AI - Premium</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Lato', sans-serif; }
          .premium-font { font-family: 'Cinzel', serif; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade { animation: fadeIn 0.8s ease-out forwards; }
        `}</style>
      </Head>

      {/* Header */}
      <nav className="p-6 bg-white border-b flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h1 className="text-xl font-black text-red-700 tracking-tighter premium-font">NATAL<span className="text-slate-800">MAGIC</span></h1>
        </div>
        <div className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-[0.2em]">Premium AI</div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 mt-10">
        
        {/* Painel de Controle */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-red-50 h-fit">
          <h2 className="text-3xl font-bold mb-2 text-red-900 premium-font">Studio Criativo</h2>
          <p className="text-slate-500 mb-8 font-medium">Crie artes exclusivas com sua foto e IA.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assinatura do Post</label>
              <input 
                type="text" 
                placeholder="Ex: Família Silva ou Loja da Lu" 
                className="w-full mt-2 p-4 bg-red-50/30 border border-red-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-red-900 transition-all"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Sua Foto (Aparecerá no Quadro)</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="mt-2 border-2 border-dashed border-red-200 p-8 text-center rounded-3xl cursor-pointer hover:bg-red-50 transition-all group overflow-hidden relative"
              >
                {userPhoto ? (
                  <div className="flex flex-col items-center">
                    <img src={userPhoto} className="w-20 h-20 object-cover rounded-full border-2 border-red-200 mb-2 shadow-md" />
                    <span className="text-green-600 font-bold">✅ Foto Selecionada</span>
                    <span className="text-[10px] text-slate-400 mt-1">Clique para trocar</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-red-400 font-bold">Clique para subir sua foto</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Estilo da Arte</label>
              <select 
                className="w-full mt-2 p-4 bg-red-50/30 border border-red-100 rounded-2xl font-bold text-red-800 outline-none appearance-none"
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="classic">🎅 Natal Tradicional (Vermelho/Verde)</option>
                <option value="luxury">✨ Luxo & Requinte (Dourado/Preto)</option>
                <option value="cute">🦌 Infantil & Fofinho (Estilo 3D)</option>
              </select>
            </div>

            <div className="flex gap-2 p-1 bg-red-50/50 rounded-2xl border border-red-100">
              <button onClick={() => setFmt('sq')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${fmt === 'sq' ? 'bg-red-600 text-white shadow-md' : 'text-red-300'}`}>Post (1:1)</button>
              <button onClick={() => setFmt('st')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${fmt === 'st' ? 'bg-red-600 text-white shadow-md' : 'text-red-300'}`}>Story (9:16)</button>
            </div>

            <button 
              onClick={generate} 
              disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded-[22px] font-black text-xl shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "🪄 CRIANDO MAGIA..." : "GERAR ARTE AGORA 🎁"}
            </button>
          </div>
        </div>

        {/* Preview do Resultado */}
        <div className="flex flex-col items-center">
          <div className={`relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[10px] border-white transition-all duration-700 ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[420px] h-[420px]'}`}>
            
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black text-red-600 animate-pulse premium-font uppercase tracking-widest">A IA está processando...</p>
              </div>
            )}

            {bgImage ? (
              <div className="relative w-full h-full animate-fade">
                {/* 1. Imagem da IA (Fundo) */}
                <img src={bgImage} className="w-full h-full object-cover" alt="IA Background" />
                
                {/* 2. Foto do Usuário (Sobreposta no centro) */}
                {userPhoto && (
                  <div className={`absolute left-1/2 -translate-x-1/2 overflow-hidden shadow-2xl border-4 border-white/50 bg-slate-100 ${fmt === 'st' ? 'top-[22%] w-[48%] h-[26%]' : 'top-[25%] w-[44%] h-[38%]'}`}>
                    <img src={userPhoto} className="w-full h-full object-cover" alt="User Photo" />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50/50">
                <span className="text-7xl mb-4 opacity-30">🖼️</span>
                <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-40">Preview da Arte</p>
              </div>
            )}
          </div>

          {bgImage && !loading && (
            <div className="mt-8 w-full max-w-[420px] animate-fade">
              <div className="bg-white p-6 rounded-3xl border border-red-50 shadow-sm mb-4">
                <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Mensagem Gerada</p>
                <p className="text-slate-600 font-medium italic">"{currentPhrase}"</p>
                <div className="flex gap-2 mt-4">
                   <button onClick={copyText} className="flex-1 bg-slate-50 text-slate-500 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition-all">
                    {copied ? "✅ COPIADO" : "📋 COPIAR TEXTO"}
                   </button>
                   <button onClick={shareWA} className="flex-1 bg-green-500 text-white py-2 rounded-xl text-[10px] font-bold hover:bg-green-600 transition-all">
                    🟢 WHATSAPP
                   </button>
                </div>
              </div>
              
              <p className="text-center text-red-600 font-black text-xs uppercase tracking-widest mb-4">✨ Arte pronta! Tire um print para salvar ✨</p>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg"
              >
                Criar outra versão 🔄
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 py-10 text-center opacity-20 text-[10px] font-bold uppercase tracking-[0.5em]">
        © 2025 NatalMagic AI • Feliz Natal
      </footer>
    </div>
  );
}
