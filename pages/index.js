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

  const generate = async () => {
    if (!name || !userPhoto) return alert("Preencha o nome e a foto!");
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, phrase: "Boas Festas!" })
      });
      const data = await res.json();
      if (data.url) setBgImage(data.url);
      else alert("Erro ao gerar");
    } catch (e) {
      alert("Erro de conexão");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Head>
        <title>NatalMagic AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <nav className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">NATAL MAGIC</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8 mt-10">
        <div className="space-y-4">
          <input type="text" placeholder="Seu Nome" className="w-full p-4 border rounded-xl" onChange={(e) => setName(e.target.value)} />
          <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed p-6 text-center rounded-xl cursor-pointer">
            {userPhoto ? "✅ Foto OK" : "📸 Clique aqui e envie sua foto"}
            <input type="file" ref={fileInputRef} onChange={(e) => setUserPhoto(URL.createObjectURL(e.target.files[0]))} className="hidden" accept="image/*" />
          </div>
          <select className="w-full p-4 border rounded-xl" onChange={(e) => setStyle(e.target.value)}>
            <option value="classic">Clássico</option>
            <option value="luxury">Luxo</option>
          </select>
          <button onClick={generate} disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold">
            {loading ? "GERANDO..." : "GERAR ARTE 🎁"}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className={`relative bg-gray-100 rounded-xl overflow-hidden shadow-xl ${fmt === 'st' ? 'w-[250px] h-[444px]' : 'w-[350px] h-[350px]'}`}>
            {bgImage ? (
              <div className="relative w-full h-full">
                <img src={bgImage} className="w-full h-full object-cover" alt="Fundo" />
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[40%] h-[35%] overflow-hidden border-2 border-white">
                  <img src={userPhoto} className="w-full h-full object-cover" alt="User" />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Preview</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
