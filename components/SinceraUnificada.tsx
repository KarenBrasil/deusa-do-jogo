
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserDossier, LoveLanguages, Theme } from '../App';

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

interface SinceraUnificadaProps {
  userDossier: UserDossier | null;
  languages: LoveLanguages | null;
  theme: Theme;
}

const SinceraUnificada: React.FC<SinceraUnificadaProps> = ({ userDossier, languages, theme }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('deusa_chat_history_v5');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faqs = [
    { 
      q: "Ele está sumido há dias, o que isso significa?", 
      a1: "A tradução real: Ele entrou na 'caverna' ou está testando sua ansiedade para ver se você é um porto seguro ou uma fonte de drama.",
      a2: "O que fazer: Zero cobrança. Mantenha seu magnetismo ativo nas redes e, quando ele voltar, seja receptiva mas não disponível demais."
    },
    { 
      q: "Ele não gosta de planejar o futuro, devo me preocupar?", 
      a1: "Sinceramente? Ele pode estar focado no presente ou com medo de perder a liberdade. Homens de alto valor planejam quando veem valor real.",
      a2: "Estratégia: Em vez de cobrar datas, mostre como o futuro ao seu lado é um 'império' vantajoso. Use a linguagem do amor dele para criar esse desejo."
    },
    { 
      q: "A ex dele ainda é presente. Como agir?", 
      a1: "Papo reto: Se ela é presente por filhos, é maturidade. Se é por 'amizade', há um limite de respeito sendo testado.",
      a2: "Sua postura: Nunca compita. Seja a Deusa atual que ele não quer perder. Se o limite for ultrapassado, comunique sua necessidade de segurança sem drama."
    }
  ];

  useEffect(() => {
    localStorage.setItem('deusa_chat_history_v5', JSON.stringify(messages));
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
      
      const context = `
        Dossiê: Arquétipo ${userDossier?.archetypeDominant || 'Não definido'}, Apego ${userDossier?.attachment || 'Não definido'}.
        Linguagens: Sua(${languages?.user.primary}), Dele(${languages?.partner.primary}).
      `;

      const promptBase = `
        Aja como a Lógica Suprema da Deusa do Jogo. 
        BASE MESTRA: Use Deida, Bolen, Levine, Chapman e Boothman.
        REGRA DE OURO: Priorize RECONEXÃO e EVOLUÇÃO. Nunca sugira término ou 'ghosting' a menos que haja perigo físico.
        Objetivo: Fazer o casal amadurecer.

        ${context}
        Usuária diz: "${inputText}"

        Retorne JSON:
        {
          "significado": "Tradução emocional curta, irônica e empática.",
          "virada": "Como reverter para reconexão e domínio estratégico.",
          "atitude": "Postura exata e sugestão de fala para evoluir a relação."
        }
      `;

      parts.push({ text: promptBase });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      const aiMsg: Message = { role: 'ai', content: 'Análise estratégica concluída, Deusa.', analysis: result };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oráculo em recalibragem. Use sua intuição soberana por um momento.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar pb-10">
        
        {/* Bloco de Perguntas Sinceras */}
        <section className="space-y-4 pt-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif italic">Perguntas <span className="text-[#9d66ff]">Sinceras</span></h2>
            <p className="text-xs opacity-50 uppercase tracking-widest mt-1">O que toda mulher tem vontade de perguntar</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {faqs.map((f, i) => (
              <div key={i} className={`p-5 rounded-[28px] border transition-all ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left flex justify-between items-center gap-4"
                >
                  <span className="font-bold text-sm italic">"{f.q}"</span>
                  <i className={`fa-solid fa-chevron-${activeFaq === i ? 'up' : 'down'} opacity-30 text-xs`}></i>
                </button>
                {activeFaq === i && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-deusa">
                    <div>
                      <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest mb-1">A Realidade:</p>
                      <p className="text-sm opacity-80">{f.a1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-fuchsia-500 tracking-widest mb-1">Estratégia:</p>
                      <p className="text-sm opacity-80">{f.a2}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="h-[1px] bg-white/5 w-full my-8"></div>

        {/* Chat / Análise */}
        <div className="space-y-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-serif italic">Chat <span className="text-[#9d66ff]">Consultivo</span></h2>
            <p className="text-[10px] opacity-40 uppercase tracking-widest">Mande o print ou sua dúvida específica</p>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-deusa`}>
              <div className={`max-w-[95%] md:max-w-[85%] rounded-[32px] p-6 shadow-2xl ${msg.role === 'user' ? (theme === 'dark' ? 'bg-zinc-900 border border-white/5' : 'bg-white border border-black/5') : (theme === 'dark' ? 'bg-black border border-violet-500/20' : 'bg-violet-50 border border-violet-200')}`}>
                {msg.image && <img src={msg.image} className="rounded-2xl mb-4 w-full object-contain max-h-[300px]" alt="Print" />}
                <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-zinc-800'}`}>{msg.content}</p>
                
                {msg.analysis && (
                  <div className="mt-6 space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest">O que significa:</p>
                      <p className="text-sm leading-relaxed opacity-80">{msg.analysis.significado}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-fuchsia-500 tracking-widest">A virada:</p>
                      <p className="text-sm leading-relaxed opacity-80">{msg.analysis.virada}</p>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Sua Postura Soberana:</p>
                      <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white border border-violet-100'}`}>
                        <p className="text-base font-bold mb-4">{msg.analysis.atitude}</p>
                        <button 
                          onClick={() => copyToClipboard(msg.analysis!.atitude)} 
                          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                        >
                          Copiar Sugestão
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center gap-3">
                 <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                 <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input de Chat */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'bg-black/80 border-white/10' : 'bg-white border-black/5'} backdrop-blur-xl`}>
        <div className="flex gap-2 items-center max-w-3xl mx-auto">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${theme === 'dark' ? 'bg-zinc-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
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
            placeholder="Dúvida ou print da conversa..."
            className={`flex-1 py-4 px-6 rounded-xl text-sm focus:outline-none ${theme === 'dark' ? 'bg-zinc-900 border border-white/10 text-white' : 'bg-gray-100 border border-black/5 text-zinc-900'}`}
          />
          <button 
            onClick={sendMessage} 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg active:scale-90"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinceraUnificada;
