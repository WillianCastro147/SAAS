import { useState, useRef } from 'react';
import Head from 'next/head';

export default function NatalMagic() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [phrase, setPhrase] = useState('');
  const fileInputRef = useRef(null);

  const phrases = [
    "Que a magia ilumine sua vida!",
    "Tempo de paz e união!",
    "Celebrando o amor!",
    "Boas festas para você!"
  ];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  const generate = async () => {
    if (!name || !userPhoto) return alert("Digite seu nome e escolha uma foto!");
    setLoading(true);
    setBgImage(null);
    const selPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPhrase(selPhrase);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, phrase: selPhrase })
      });
      const data = await res.json();
      if (res.ok && data.url) setBgImage(data.url);
      else alert(data.error || "Erro ao gerar arte.");
    } catch (e) {
      alert("Erro de conexão.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <Head>
        <title>NatalMagic AI - Premium</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
        <style>{`.premium-font { font-family: 'Cinzel', serif; }`}</style>
      </Head>

      <nav className="p-6 bg-white border-b flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-black text-red-600 tracking-tighter premium-font">NATAL MAGIC</h1>
        <div className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">OpenAI Edition</div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 mt-10">
        {/* Formulário */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50 h-fit space-y-6">
          <h2 className="text-2xl font-bold text-red-900 premium-font">Studio Criativo 🎁</h2>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assinatura</label>
            <input 
              type="text" placeholder="Seu Nome ou Marca" 
              className="w-full mt-1 p-4 bg-red-50/30 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-red-200 p-8 text-center rounded-3xl cursor-pointer hover:bg-red-50 transition-all">
            {userPhoto ? <span className="text-green-600 font-bold">✅ Foto Adicionada!</span> : <span className="text-red-400 font-bold">📸 Clique para subir sua foto</span>}
            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Estilo Visual</label>
            <select className="w-full mt-1 p-4 bg-red-50/30 border rounded-2xl font-bold text-red-800" onChange={(e) => setStyle(e.target.value)}>
              <option value="classic">Clássico Natalino</option>
              <option value="luxury">Luxo e Ouro</option>
              <option value="cute">Fofo em 3D</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setFmt('sq')} className={`flex-1 py-3 rounded-xl font-bold ${fmt === 'sq' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>Feed</button>
            <button onClick={() => setFmt('st')} className={`flex-1 py-3 rounded-xl font-bold ${fmt === 'st' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>Story</button>
          </div>

          <button 
            onClick={generate} disabled={loading}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-700 shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? "CRIANDO MAGIA..." : "GERAR ARTE AGORA 🚀"}
          </button>
        </div>

        {/* Resultado */}
        <div className="flex flex-col items-center">
          <div className={`relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white transition-all duration-700 ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[420px] h-[420px]'}`}>
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center text-center p-6">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-red-600">A IA está gerando sua arte...</p>
              </div>
            )}

            {bgImage ? (
              <div className="relative w-full h-full animate-in fade-in duration-500">
                <img src={bgImage} className="w-full h-full object-cover" />
                <div className={`absolute left-1/2 -translate-x-1/2 overflow-hidden shadow-inner border-2 border-white/30 bg-slate-100 ${fmt === 'st' ? 'top-[22%] w-[48%] h-[26%]' : 'top-[25%] w-[45%] h-[40%]'}`}>
                  <img src={userPhoto} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-200 font-bold uppercase tracking-widest text-xs bg-slate-50">Preview</div>
            )}
          </div>
          {bgImage && !loading && (
            <p className="mt-6 text-red-600 font-bold animate-bounce text-sm">✨ FICOU LINDO! TIRE UM PRINT PARA SALVAR ✨</p>
          )}
        </div>
      </main>
    </div>
  );
}
