import { useState, useRef } from 'react';
import Head from 'next/head';

export default function NatalSaaS() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Lista de frases que mudam a cada geração
  const christmasPhrases = [
    "Que a magia ilumine sua vida!",
    "Tempo de paz, amor e união.",
    "Celebrando momentos inesquecíveis.",
    "Que a alegria transborde hoje!",
    "Um brinde aos novos começos.",
    "Gratidão por este ano incrível."
  ];

  // Lida com o upload da foto do usuário
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cria uma URL local para mostrar a foto instantaneamente
      setUserPhoto(URL.createObjectURL(file));
    }
  };

  const generate = async () => {
    if (!name) return alert("Por favor, digite o nome da marca ou família.");
    if (!userPhoto) return alert("Por favor, adicione uma foto para o quadro.");
    
    setLoading(true);
    setBgImage(null);

    // Escolhe uma frase aleatória da lista
    const randomPhrase = christmasPhrases[Math.floor(Math.random() * christmasPhrases.length)];

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          style, 
          fmt,
          dynamicPhrase: randomPhrase // Envia a frase escolhida para o backend
        })
      });
      
      const data = await res.json();
      
      if (data.url) {
        setBgImage(data.url);
      } else {
        alert("Erro ao gerar o fundo. Tente novamente.");
      }
    } catch (e) {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-[#fcf8f5] text-slate-900 font-sans selection:bg-red-200">
      <Head>
        <title>NatalMagic Premium - Crie sua Arte</title>
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Adicionando uma fonte mais elegante */}
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet"/>
        <style jsx global>{`
          body { font-family: 'Lato', sans-serif; }
          h1, h2, .premium-font { font-family: 'Cinzel', serif; }
          .gold-gradient { background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); -webkit-background-clip: text; color: transparent; }
        `}</style>
      </Head>

      {/* Navbar Premium */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-red-100 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✨</span>
            <h1 className="text-2xl font-black tracking-tighter text-red-800">NATAL<span className="gold-gradient">MAGIC</span></h1>
          </div>
          <div className="text-[10px] font-bold bg-red-600 text-white px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
            Edição Premium
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-5 gap-12 mt-8 relative">
        
        {/* Coluna Esquerda: Formulário (Ocupa 2/5) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(220,38,38,0.1)] border border-red-50 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500"></div>
            <h2 className="text-3xl font-bold text-red-900 mb-2">Studio Criativo</h2>
            <p className="text-slate-600 mb-8">Personalize sua arte exclusiva com foto.</p>
            
            <div className="space-y-6">
              {/* Input de Nome */}
              <div>
                <label className="text-xs font-bold text-red-400 uppercase tracking-wider ml-1">Assinatura / Marca</label>
                <input 
                  type="text" 
                  placeholder="Ex: Família Silva" 
                  className="w-full mt-2 p-4 bg-red-50/50 border-2 border-red-100 rounded-2xl outline-none focus:border-red-400 transition-all font-bold text-red-900 placeholder:text-red-200/70"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

               {/* Upload de Foto */}
               <div>
                <label className="text-xs font-bold text-red-400 uppercase tracking-wider ml-1">Sua Foto para o Quadro</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="mt-2 border-2 border-dashed border-red-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 transition-all group relative overflow-hidden"
                >
                  {userPhoto ? (
                    <>
                      <img src={userPhoto} className="w-full h-32 object-cover rounded-xl opacity-50 group-hover:opacity-20 transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-red-700 bg-white/30 backdrop-blur-sm">
                        <span className="text-2xl mr-2">📸</span> Foto Selecionada (Clique para trocar)
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                       <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📸</span>
                       <p className="text-sm font-bold text-red-400 group-hover:text-red-600">Clique para enviar sua foto</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                </div>
              </div>

              {/* Estilo */}
              <div>
                <label className="text-xs font-bold text-red-400 uppercase tracking-wider ml-1">Atmosfera</label>
                <select 
                  className="w-full mt-2 p-4 bg-red-50/50 border-2 border-red-100 rounded-2xl outline-none cursor-pointer font-bold text-red-900 focus:border-red-400"
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="classic">🎅 Clássico & Aconchegante</option>
                  <option value="luxury">✨ Luxo Dourado</option>
                  <option value="cute">🦌 Fofo & Animado</option>
                </select>
              </div>

              {/* Formato */}
              <div className="flex gap-3 p-1 bg-red-50/50 rounded-2xl border-2 border-red-100">
                <button onClick={() => setFmt('sq')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${fmt === 'sq' ? 'bg-red-600 text-white shadow-md' : 'text-red-400 hover:bg-red-100/50'}`}>Feed (Quadrado)</button>
                <button onClick={() => setFmt('st')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${fmt === 'st' ? 'bg-red-600 text-white shadow-md' : 'text-red-400 hover:bg-red-100/50'}`}>Story (Vertical)</button>
              </div>

              <button 
                onClick={generate} 
                disabled={loading || !userPhoto}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-5 rounded-[22px] font-black text-xl hover:from-red-700 hover:to-red-900 transition-all shadow-xl shadow-red-200/50 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "A IA ESTÁ TRABALHANDO..." : <>GERAR ARTE MÁGICA <span className="group-hover:rotate-12 transition-transform">🎁</span></>}
                </span>
              </button>
               {!userPhoto && <p className="text-xs text-center text-red-400 font-bold">Adicione uma foto para liberar o botão.</p>}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Resultado (Ocupa 3/5) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-start pt-8">
          {/* Container da Arte - A MÁGICA ACONTECE AQUI */}
          <div className={`relative bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-white overflow-hidden transition-all duration-700 group ${fmt === 'st' ? 'w-[320px] h-[568px]' : 'w-[450px] h-[450px]'}`}>
            
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 border-8 border-red-100 border-t-red-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-black text-red-800 mb-2 premium-font">Criando sua Obra-Prima</h3>
                <p className="text-red-600 font-medium animate-pulse">A IA está desenhando o cenário e emoldurando sua foto...</p>
              </div>
            )}

            {!bgImage && !loading ? (
              <div className="w-full h-full bg-red-50/30 flex flex-col items-center justify-center p-10 border-4 border-dashed border-red-200 m-4 rounded-[2rem]">
                <span className="text-7xl mb-6 opacity-30 animate-bounce-slow">🖼️</span>
                <p className="text-lg font-bold text-red-300 uppercase tracking-widest text-center premium-font">Sua arte aparecerá aqui</p>
                 <p className="text-sm text-red-200 mt-2">Preencha os dados e clique em gerar.</p>
              </div>
            ) : (
                // AQUI É O TRUQUE: Fundo da IA + Foto do Usuário por cima
                <div className="relative w-full h-full animate-fade-in">
                    {/* 1. O Fundo gerado pela IA */}
                    <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" alt="Fundo de Natal" />

                    {/* 2. A Foto do Usuário (posicionada com CSS para cair dentro da moldura da IA) */}
                    {userPhoto && (
                        <div className={`absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-sm shadow-inner ${fmt === 'st' ? 'top-[22%] w-[48%] h-[26%]' : 'top-[25%] w-[42%] h-[38%]'}`} style={{boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'}}>
                             <img src={userPhoto} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Foto do usuário" />
                        </div>
                    )}
                </div>
            )}
          </div>

          {bgImage && !loading && (
            <div className="mt-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
              <p className="text-center text-red-400 font-bold text-sm mb-4 premium-font">✨ Sua arte exclusiva está pronta! ✨</p>
              {/* Botão de Download Falso (para MVP, pois o download real dessa composição exige canvas) */}
              <button 
                onClick={() => alert("Em um app real, isso baixaria a imagem composta. Como este é um MVP rápido, o usuário pode tirar print da tela!")}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-10 py-4 rounded-full font-black shadow-lg shadow-yellow-200/50 hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:-translate-y-1"
              >
                <span>📥</span> BAIXAR ARTE PREMIUM
              </button>
               <p className="text-xs text-center text-slate-400 mt-3">(Dica: Em celulares, tire um print da tela para salvar!)</p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; scale: 0.95; } to { opacity: 1; scale: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
