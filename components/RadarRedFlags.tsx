
import React, { useState } from 'react';
import { Theme } from '../App';

const RadarRedFlags: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [activeQ, setActiveQ] = useState<number | null>(null);

  const faqs = [
    { 
        q: "Ele some e volta do nada. Devo dar uma chance?", 
        a: "Minha Deusa, pare de ser o 'porto seguro' de quem não tem bússola. Homens de alto valor não se perdem no caminho. Se ele some, ele está testando se você é um entretenimento de reserva. Se ele voltar, a resposta é o silêncio."
    },
    { 
        q: "Ele diz que não gosta de rótulos. O que eu faço?", 
        a: "Rótulos são para produtos, compromisso é para homens. Se ele não te assume, ele está te mantendo na vitrine para ver se aparece algo 'melhor'. Retire-se e deixe o lugar vago para um Provedor real."
    },
    { 
        q: "Ele divide a conta de um café de 15 reais. Isso é normal?", 
        a: "É normal para um 'parceirinho' ou um amigo de faculdade. Para um homem que deseja conquistar uma Deusa, é um atestado de baixo padrão. Não se sinta mal em não querer um liso."
    }
  ];

  return (
    <div className="p-6 space-y-10 animate-deusa pb-24">
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-serif italic leading-tight">Perguntas <span className="text-red-500">Sinceras</span></h2>
        <p className="text-sm opacity-60">O que toda mulher deveria saber, mas tem medo de perguntar.</p>
      </section>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className={`p-6 rounded-[32px] border transition-all ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
            <button 
                onClick={() => setActiveQ(activeQ === i ? null : i)}
                className="w-full text-left flex justify-between items-center gap-4"
            >
                <p className="font-bold text-sm leading-tight italic">"{f.q}"</p>
                <i className={`fa-solid fa-chevron-${activeQ === i ? 'up' : 'down'} opacity-40`}></i>
            </button>
            {activeQ === i && (
                <div className="mt-6 pt-6 border-t border-white/5 animate-deusa">
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {f.a}
                    </p>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-violet-500">#DicaDeOuroDaDeusa</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarRedFlags;
