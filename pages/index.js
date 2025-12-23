import { useState, useRef } from 'react';
import Head from 'next/head';

export default function NatalSaaS() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState('');
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
    if (!userPhoto) return alert("Por favor, adicione uma foto sua.");
    
    setLoading(true);
    setBgImage(null);
    
    // Escolhe uma frase aleatória
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
        // Exibe o erro real vindo da API para facilitar o diagnóstico
        alert("Ops! Erro da Nano Banana: " + (data.error || "A API não retornou a imagem."));
      }
    } catch (e) {
      alert("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcfc] text-slate-800 font-sans pb-20">
      <Head>
        <title>NatalMagic Premium AI</title>
        {/* Tailwind carregado via CDN para evitar erros de compilação local */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
        <style>{`
          .font-premium { font-family: 'Cinzel', serif; }
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .animate-fade { animation: fadeIn 0.6s ease-out forwards; }
        `}</style>
      </Head>

      {/* Navbar */}
      <nav className="p-6 bg-white border-b flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-black text-red-600 tracking-tighter font-premium">NATAL<span className="text-slate-800">MAGIC</span></h1>
        <div className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase">Premium AI Edition</div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 mt-10">
        
        {/* Coluna 1: Formulário */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-red-50 h-fit">
          <h2 className="text-3xl font-bold mb-2 text-red-900 font-premium">Studio Criativo</h2>
          <p className="text-slate-500 mb-8 font-medium italic">Personalize sua arte com foto e inteligência artificial.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assinatura / Marca</label>
              <input 
                type="text" 
                placeholder="Ex: Família Silva" 
                className="w-full mt-2 p-4 bg-red-50/30 border border-red-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-red-900 transition-all"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Sua Foto para o Quadro</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="mt-2 border-2 border-dashed border-red-200 p-8 text-center rounded-3xl cursor-pointer hover:bg-red-50 transition-all group"
              >
                {userPhoto ? (
                  <div className="flex flex-col items-center">
                    <img src={userPhoto} className="w-20 h-20 object-cover rounded-full border-2 border-red-200 mb-2" />
                    <span className="text-green-600 font-bold">✅ Foto Adicionada!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-red-400 font-bold">Clique para subir sua foto</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Atmosfera Natalina</label>
              <select 
                className="w-full mt-2 p-4 bg-red-50/30 border border-red-100 rounded-2xl font-bold text-red-800 outline-none"
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="classic">🎅 Clássico Aconchegante</option>
                <option value="luxury">✨ Luxo Dourado</option>
                <option value="cute">🦌 Fofinho / Ilustração</option>
              </select>
            </div>

            <div className="flex gap-2 p-1 bg-red-50/50 rounded-2xl">
              <button onClick={() => setFmt('sq')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${fmt === 'sq' ? 'bg-red-600 text-white shadow-md' : 'text-red-300 hover:text-red-500'}`}>Post (1:1)</button>
              <button onClick={() => setFmt('st')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${fmt === 'st' ? 'bg-red-600 text-white shadow-md' : 'text-red-300 hover:text-red-500'}`}>Story (9:16)</button>
            </div>

            <button 
              onClick={generate} 
              disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded-[22px] font-black text-xl shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "CRIANDO MAGIA..." : "GERAR ARTE AGORA 🚀"}
            </button>
          </div>
        </div>

        {/* Coluna 2: Preview do Resultado */}
        <div className="flex flex-col items-center justify-start">
          <div className={`relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[10px] border-white transition-all duration-700 ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[420px] h-[420px]'}`}>
            
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-red-600 animate-pulse font-premium uppercase tracking-widest">A IA está gerando o cenário...</p>
              </div>
            )}

            {bgImage ? (
              <div className="relative w-full h-full animate-fade">
                {/* Imagem de Fundo Gerada pela IA */}
                <img src={bgImage} className="w-full h-full object-cover" alt="IA Background" />
                
                {/* Foto do Usuário sobreposta no centro */}
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[45%] h-[38%] overflow-hidden rounded-sm shadow-inner border-2 border-white/30 bg-gray-100">
                  <img src={userPhoto} className="w-full h-full object-cover" alt="User" />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50/50">
                <span className="text-7xl mb-4 opacity-50">🖼️</span>
                <p className="font-bold uppercase tracking-widest text-xs opacity-50">Preview da Arte Premium</p>
              </div>
            )}
          </div>

          {bgImage && !loading && (
            <div className="mt-8 text-center animate-fade">
              <div className="bg-white p-4 rounded-2xl border border-red-50 shadow-sm mb-4 italic text-slate-600 text-sm">
                "{currentPhrase}"
              </div>
              <p className="text-red-600 font-black text-sm mb-4 tracking-widest uppercase">✨ Sua arte está pronta! ✨</p>
              <p className="text-slate-400 text-xs font-bold mb-4 italic">Como este é um MVP, tire um print para salvar em alta qualidade!</p>
              
              <button 
                onClick={() => window.location.reload()}
                className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-slate-900 transition-all"
              >
                Criar outra arte 🔄
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center mt-12 opacity-30 text-[10px] font-bold uppercase tracking-[0.3em]">
        © 2025 NatalMagic AI • Todos os direitos reservados
      </footer>
    </div>
  );
}
