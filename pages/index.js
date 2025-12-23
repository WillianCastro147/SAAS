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
    "Gratidão por este ano incrível!"
  ];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  const generate = async () => {
    if (!name || !userPhoto) return alert("Preencha o nome e adicione uma foto!");
    
    setLoading(true);
    setBgImage(null);
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(phrase);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, phrase })
      });
      const data = await res.json();
      if (data.url) setBgImage(data.url);
      else alert(data.error || "Erro ao gerar");
    } catch (e) {
      alert("Erro de conexão");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] text-slate-900 font-sans pb-20">
      <Head>
        <title>NatalMagic AI - Premium</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <nav className="p-6 bg-white border-b flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black text-red-600 tracking-tighter">NATAL<span className="text-slate-800">MAGIC</span></h1>
        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">AI EDITION</span>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 mt-10">
        {/* Painel de Criação */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50 h-fit">
          <h2 className="text-2xl font-bold text-red-900 mb-6 italic">Studio de Natal 🎅</h2>
          
          <div className="space-y-6">
            <input 
              type="text" placeholder="Seu Nome ou Marca" 
              className="w-full p-4 bg-red-50/30 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold"
              onChange={(e) => setName(e.target.value)}
            />

            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-red-200 rounded-2xl p-6 text-center cursor-pointer hover:bg-red-50 transition-all"
            >
              {userPhoto ? (
                <p className="text-green-600 font-bold">✅ Foto Adicionada!</p>
              ) : (
                <p className="text-red-400 font-medium">📸 Clique para subir sua foto</p>
              )}
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
            </div>

            <select className="w-full p-4 bg-red-50/30 border rounded-2xl outline-none font-bold text-red-900" onChange={(e) => setStyle(e.target.value)}>
              <option value="classic">Clássico (Vermelho/Verde)</option>
              <option value="luxury">Luxo (Ouro/Prata)</option>
              <option value="cute">Fofo (Infantil/3D)</option>
            </select>

            <div className="flex gap-2">
              <button onClick={() => setFmt('sq')} className={`flex-1 p-3 rounded-xl font-bold ${fmt === 'sq' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Feed</button>
              <button onClick={() => setFmt('st')} className={`flex-1 p-3 rounded-xl font-bold ${fmt === 'st' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Story</button>
            </div>

            <button 
              onClick={generate} disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              {loading ? "CRIANDO MAGIA..." : "GERAR MINHA ARTE 🎁"}
            </button>
          </div>
        </div>

        {/* Preview da Arte */}
        <div className="flex flex-col items-center">
          <div className={`relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white transition-all duration-500 ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[400px] h-[400px]'}`}>
            {loading && (
              <div className="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-red-600">A IA está processando...</p>
              </div>
            )}

            {bgImage ? (
              <div className="relative w-full h-full">
                <img src={bgImage} className="w-full h-full object-cover" />
                {/* A foto do usuário "encaixada" no quadro da IA */}
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[45%] h-[40%] rounded-sm shadow-inner overflow-hidden border-4 border-white/20">
                  <img src={userPhoto} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <span className="text-6xl mb-4">🖼️</span>
                <p className="font-bold uppercase tracking-widest text-xs">Aguardando Criação</p>
              </div>
            )}
          </div>
          
          {bgImage && !loading && (
            <div className="mt-6 text-center animate-bounce">
              <p className="text-red-600 font-bold mb-2">✨ Ficou lindo! Tire um print para salvar ✨</p>
              <p className="text-sm italic text-slate-500">"{currentPhrase}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
