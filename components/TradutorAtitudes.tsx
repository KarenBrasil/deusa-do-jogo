
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const TradutorAtitudes: React.FC = () => {
  const [atitude, setAtitude] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    if (!atitude.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise a atitude masculina: "${atitude}". 
        Explique o significado psicológico por trás disso e a melhor estratégia de reação para uma mulher de alto valor.
        Responda em JSON com as chaves: significado, estrategia, nivel_investimento (0-100).`,
        config: { responseMimeType: "application/json" }
      });
      setResult(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-10 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif italic">Tradutor de <span className="text-red-500">Atitudes</span></h2>
        <p className="text-gray-500 text-sm italic">"Ele faz o que ele sente, não o que ele diz."</p>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          value={atitude}
          onChange={(e) => setAtitude(e.target.value)}
          placeholder="Ex: Ele curte fotos de outras mas não as minhas..."
          className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-white placeholder-zinc-700 focus:outline-none focus:border-red-500/50 transition-all text-sm"
        />

        <button
          onClick={translate}
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
        >
          {loading ? 'ANALISANDO PADRÕES...' : 'REVELAR PSICOLOGIA'}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="card-minimal p-8 rounded-2xl border-l-4 border-l-red-500">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Significado Oculto</h4>
            <p className="text-gray-300 leading-relaxed mb-6">{result.significado}</p>
            
            <h4 className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-4">Sua Contra-estratégia</h4>
            <p className="text-gray-300 leading-relaxed italic">"{result.estrategia}"</p>
          </div>

          <div className="card-minimal p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Investimento Emocional Dele</span>
              <span className="text-white font-bold">{result.nivel_investimento}%</span>
            </div>
            <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-violet-600 transition-all duration-1000" 
                style={{ width: `${result.nivel_investimento}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradutorAtitudes;
