
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserDossier, Theme } from '../App';

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string;
  analysis?: Analysis;
}

interface Analysis {
  significado: string;
  virada: string;
  atitude: string;
}

interface ConversaMagneticaProps {
  userDossier: UserDossier | null;
  theme: Theme;
}

const ConversaMagnetica: React.FC<ConversaMagneticaProps> = ({ userDossier, theme }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('deusa_chat_history_v4');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('deusa_chat_history_v4', JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMsg: Message = { role: 'user', content: inputText, image: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts = [];
      if (userMsg.image) {
        parts.push({ inlineData: { data: userMsg.image.split(',')[1], mimeType: 'image/jpeg' } });
      }
      
      const dossierContext = userDossier ? 
        `Dossiê: Arquétipo ${userDossier.archetypeDominant}, Apego ${userDossier.attachment}.` : 
        "";

      const promptBase = `
        Aja como a Lógica Suprema do app "Deusa do Jogo".
        Sua missão: Entregar uma análise CURTA e DIRETA dividida em 3 partes fundamentais.
        Linguagem: Simples, direta, com um leve humor irônico e empática. 
        Foco total em reverter a situação para que a mulher domine o jogo.

        ${dossierContext}
        Contexto do usuário: "${inputText}"

        Retorne EXATAMENTE este formato JSON:
        {
          "significado": "Tradução real e ácida do que essa atitude dele significa na psicologia masculina.",
          "virada": "A estratégia mestre para inverter a polaridade e fazer ele correr atrás.",
          "atitude": "A postura exata que você deve assumir a partir de agora (ex: sumir, postar tal coisa, responder curto)."
        }
      `;

      parts.push({ text: promptBase });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      const aiMsg: Message = { role: 'ai', content: 'Análise estratégica concluída pela Lógica Suprema.', analysis: result };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oráculo offline. Use seu instinto de rainha e tente novamente em breve.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-10 no-scrollbar pb-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-deusa`}>
            <div className={`max-w-[95%] md:max-w-[85%] rounded-[36px] p-6 shadow-2xl ${msg.role === 'user' ? (theme === 'dark' ? 'bg-zinc-900 border border-white/5' : 'bg-white border border-black/5 shadow-md') : (theme === 'dark' ? 'bg-black border border-violet-500/20' : 'bg-violet-50 border border-violet-200')}`}>
              {msg.image && <img src={msg.image} className="rounded-2xl mb-4 w-full object-contain max-h-[400px]" alt="Print" />}
              <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-zinc-800'}`}>{msg.content}</p>
              
              {msg.analysis && (
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-violet-500 tracking-[0.2em]">O que significa:</p>
                    <div className={`p-4 rounded-2xl border text-base leading-relaxed ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-white border-black/5 text-zinc-700'}`}>
                        {msg.analysis.significado}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-fuchsia-500 tracking-[0.2em]">A virada do jogo:</p>
                    <div className={`p-4 rounded-2xl border text-base leading-relaxed ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-white border-black/5 text-zinc-700'}`}>
                        {msg.analysis.virada}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">Atitude que deve tomar:</p>
                    <div className={`p-6 rounded-[28px] border transition-all ${theme === 'dark' ? 'bg-violet-600/10 border-violet-500/20' : 'bg-white border-violet-200 shadow-sm'}`}>
                      <p className="text-base font-bold mb-4 leading-relaxed">{msg.analysis.atitude}</p>
                      <button 
                        onClick={() => copyToClipboard(msg.analysis!.atitude)} 
                        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                      >
                        Copiar Estratégia
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-deusa">
            <div className="p-4 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center gap-3">
               <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-.15s]"></div>
               <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${theme === 'dark' ? 'bg-black/80 border-white/10' : 'bg-white border-black/5'} backdrop-blur-xl`}>
        {selectedImage && (
          <div className="mb-4 relative inline-block">
             <img src={selectedImage} className="w-20 h-20 object-cover rounded-xl border-2 border-violet-500" alt="Preview" />
             <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs">×</button>
          </div>
        )}
        <div className="flex gap-2 items-center max-w-3xl mx-auto">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${theme === 'dark' ? 'bg-zinc-800 text-gray-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <i className="fa-solid fa-image"></i>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Mande o print ou desabafe aqui..."
            className={`flex-1 py-4 px-6 rounded-2xl text-base focus:outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border border-white/10 text-white focus:border-violet-500' : 'bg-gray-100 border border-black/5 focus:border-violet-600 text-zinc-900'}`}
          />
          <button 
            onClick={sendMessage} 
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center text-xl shadow-lg active:scale-90 transition-transform"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversaMagnetica;
