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

  const phrases = [
    "Que a magia ilumine sua vida!",
    "Tempo de paz e união.",
    "Celebrando momentos!",
    "Gratidão por este ano!"
  ];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  const generate = async () => {
    if (!name || !userPhoto) return alert("Preencha o nome e a foto!");
    setLoading(true);
    setBgImage(null);
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, phrase })
      });
      const data = await res.json();
      if (data.url) setBgImage(data.url);
      else alert("Erro ao gerar fundo");
    } catch (e) {
      alert("Erro de conexão");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffcfc] text-slate-800">
      <Head>
        <title>NatalMagic Premium</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <nav className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-red-600">NATAL<span className="text-slate-800">MAGIC</span></h1>
        <div className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">PREMIUM AI</div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-10 mt-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-red-50">
          <h2 className="text-2xl font-bold mb-6 italic text-red-900">Studio de Natal 🎁</h2>
          
          <div className="space-y-5">
            <input type="text" placeholder="Nome ou Marca" className="w-full p-4 border-2 border-red-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-red-900" onChange={(e) => setName(e.target.value)} />
            
            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-red-200 p-6 text-center rounded-2xl cursor-pointer hover:bg-red-50">
              {userPhoto ? <span className="text-green-600 font-bold">✅ Foto Adicionada</span> : <span className="text-red-400 font-bold">📸 Clique para subir sua foto</span>}
              <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
            </div>

            <select className="w-full p-4 border-2 border-red-50 rounded-2xl font-bold text-red-800" onChange={(e) => setStyle(e.target.value)}>
              <option value="classic">Estilo Clássico</option>
              <option value="luxury">Luxo e Ouro</option>
              <option value="cute">Fofo / 3D</option>
            </select>

            <button onClick={generate} disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-red-700 disabled:opacity-50">
              {loading ? "CRIANDO..." : "GERAR ARTE AGORA 🚀"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className={`relative bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white ${fmt === 'st' ? 'w-[280px] h-[500px]' : 'w-[380px] h-[380px]'}`}>
            {loading && <div className="absolute inset-0 z-10 bg-white/90 flex items-center justify-center font-bold text-red-600">IA Gerando...</div>}
            
            {bgImage ? (
              <div className="relative w-full h-full">
                <img src={bgImage} className="w-full h-full object-cover" alt="IA Background" />
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[45%] h-[35%] overflow-hidden border-2 border-white shadow-lg">
                  <img src={userPhoto} className="w-full h-full object-cover" alt="User" />
                </div>
              </div>
            ) : (
              <div className="text-gray-300 font-bold uppercase tracking-widest text-center p-10">Preview da Arte</div>
            )}
          </div>
          {bgImage && <p className="mt-4 text-red-600 font-bold animate-pulse">✨ Tire um print para salvar! ✨</p>}
        </div>
      </main>
    </div>
  );
}
