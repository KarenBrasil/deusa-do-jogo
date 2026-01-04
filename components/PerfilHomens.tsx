
import React, { useState } from 'react';
import { Theme } from '../App';
import { GoogleGenAI } from "@google/genai";

interface Profile {
    id: string;
    name: string;
    tag: string;
    color: string;
    keyword: string;
    highlight: string;
    logic: string;
    warning: string;
    details: string[];
}

const PerfilHomens: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizInput, setQuizInput] = useState('');
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const profiles: Profile[] = [
    { 
        id: 'provedor', name: 'O Provedor', tag: 'ELITE / DIAMANTE', color: 'text-green-500', 
        keyword: "Investimento",
        highlight: "Ele sabe que o tempo é dinheiro e você é o prêmio.",
        logic: "Trata o date como uma missão de conquista. Ele não economiza em conforto porque o valor dele está na capacidade de prover.",
        warning: "Exige uma Deusa à altura: mantenha seus padrões no topo para manter o respeito dele.",
        details: ["Paga tudo por instinto", "Agenda com antecedência", "Protege seu conforto", "Foco em provisão real"]
    },
    { 
        id: 'betinha', name: 'O Betinha', tag: 'PLEBEU / BAIXO INVESTIMENTO', color: 'text-yellow-500', 
        keyword: "Insegurança",
        highlight: "Sempre espera que você tome a iniciativa ou divida o peso.",
        logic: "Não tem instinto de liderança. Ele quer os benefícios de estar com você sem o ônus de ser o homem da relação.",
        warning: "Você acabará sendo a mãe dele. Se ele não lidera, ele não serve.",
        details: ["Pergunta o que você quer fazer", "Sugere dividir a conta", "Fica em cima do muro", "Medo de rótulos"]
    },
    { 
        id: 'narcisista', name: 'O Narcisista', tag: 'PERIGO / VAMPIRO EMOCIONAL', color: 'text-red-600', 
        keyword: "Egoísmo",
        highlight: "Tudo gira em torno dele, inclusive você.",
        logic: "Usa o Love Bombing para te prender e o Descarte para te destruir. Você é apenas um suprimento para o ego dele.",
        warning: "Saída imediata. Não há cura para quem não tem empatia.",
        details: ["Início intenso demais", "Só fala de si mesmo", "Incapaz de aceitar críticas", "Alterna entre adoração e desprezo"]
    },
    { 
        id: 'manipulador', name: 'O Manipulador', tag: 'ALERTA / MESTRE DAS SOMBRAS', color: 'text-fuchsia-500', 
        keyword: "Controle",
        highlight: "Faz você se sentir culpada pelos erros dele.",
        logic: "Joga com a sua mente através de silêncios punitivos e meias-verdades. Ele quer te manter confusa para te controlar.",
        warning: "Confie na sua intuição. Se parece errado, é porque é manipulação.",
        details: ["Inverte situações", "Usa o silêncio como arma", "Promessas vazias", "Padrão quente e frio"]
    },
    { 
        id: 'baixo-padrao', name: 'Baixo Padrão', tag: 'PROMESSA / ECONÔMICO', color: 'text-zinc-500', 
        keyword: "Miséria",
        highlight: "Quer acesso VIP com investimento de varejo.",
        logic: "Sugere 'ficar em casa' ou encontros baratos. Ele tenta economizar esforço e dinheiro enquanto busca sua atenção.",
        warning: "O que é barato sai caro. Valorize-se e ele sumirá por conta própria.",
        details: ["Date de última hora", "Propostas sem investimento", "Desleixado com a imagem", "Pão-duro emocional"]
    }
  ];

  const handleDiagnose = async () => {
    if (!quizInput.trim()) return;
    setLoadingQuiz(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Aja como a Lógica Suprema do app "Deusa do Jogo".
        Analise o comportamento deste homem: "${quizInput}"
        
        Identifique se ele é: Provedor, Betinha, Narcisista, Manipulador ou Baixo Padrão.
        Dê um diagnóstico curto em 2 partes:
        1. Classificação e porquê.
        2. Atitude de soberania recomendada.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setQuizResult(response.text);
    } catch (error) {
      console.error(error);
      setQuizResult("O radar falhou. Tente novamente, Rainha.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <div className="p-6 space-y-12 animate-deusa pb-24">
      {!selectedProfile && !showQuiz && (
        <>
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-serif italic leading-tight">Mapeamento de <span className="text-[#9d66ff]">Alvos</span></h2>
            <p className="text-base opacity-60">Pare de ver o potencial e comece a ver a realidade. Informação é a sua melhor defesa.</p>
          </section>

          <button 
            onClick={() => setShowQuiz(true)}
            className="w-full p-8 rounded-[40px] bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex flex-col items-center gap-2 shadow-xl"
          >
            <i className="fa-solid fa-wand-sparkles text-2xl"></i>
            <span className="font-black uppercase tracking-widest text-xs">Diagnóstico de Alvo</span>
            <p className="text-[10px] opacity-80">Descubra o perfil dele através do comportamento</p>
          </button>

          <div className="grid grid-cols-1 gap-8">
            {profiles.map(p => (
              <div key={p.id} className={`p-10 rounded-[48px] border shadow-xl ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{p.name}</h3>
                    <span className={`text-[10px] font-black px-4 py-1.5 bg-black/40 rounded-full border border-white/10 uppercase tracking-widest ${p.color}`}>{p.tag}</span>
                  </div>
                </div>
                <div className="space-y-4 mb-10">
                  <p className="text-base font-bold uppercase tracking-widest text-violet-500">{p.highlight}</p>
                  <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-zinc-600'}`}>{p.logic}</p>
                </div>
                <button 
                  onClick={() => setSelectedProfile(p)}
                  className={`w-full py-5 rounded-3xl text-xs font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                >
                  ANÁLISE DETALHADA
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {showQuiz && (
        <div className="animate-deusa space-y-8">
          <button onClick={() => {setShowQuiz(false); setQuizResult(null); setQuizInput('');}} className="flex items-center gap-3 text-violet-500 font-bold text-sm uppercase tracking-widest">
            <i className="fa-solid fa-arrow-left"></i> Voltar ao Mapeamento
          </button>
          
          <section className={`p-10 rounded-[48px] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-black/5'}`}>
            <h3 className="text-2xl font-serif italic mb-6">Diagnóstico de Alvo</h3>
            <p className="text-sm opacity-60 mb-6">Descreva como ele age, como são os dates e como ele investe em você.</p>
            
            <textarea
              value={quizInput}
              onChange={(e) => setQuizInput(e.target.value)}
              placeholder="Ex: Ele me chama só depois das 22h, nunca me levou pra jantar e sempre reclama de dinheiro..."
              className={`w-full p-6 rounded-3xl border min-h-[160px] text-base focus:outline-none ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white' : 'bg-gray-50 border-black/5'}`}
            />

            {!quizResult ? (
              <button 
                onClick={handleDiagnose}
                disabled={loadingQuiz || !quizInput.trim()}
                className="w-full py-6 rounded-3xl bg-violet-600 text-white font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
              >
                {loadingQuiz ? 'Analisando Alvo...' : 'Verificar Perfil'}
              </button>
            ) : (
              <div className="space-y-6">
                <div className={`p-8 rounded-3xl border leading-relaxed text-base font-medium ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-200' : 'bg-violet-50 border-violet-100 text-zinc-800'}`}>
                  {quizResult}
                </div>
                <button 
                  onClick={() => {setQuizResult(null); setQuizInput('');}}
                  className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-500/30 text-violet-500`}
                >
                  Novo Diagnóstico
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {selectedProfile && (
        <div className="animate-deusa space-y-10">
          <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-3 text-violet-500 font-bold text-sm uppercase tracking-widest">
            <i className="fa-solid fa-arrow-left"></i> Voltar
          </button>

          <div className={`p-12 rounded-[56px] border shadow-2xl ${theme === 'dark' ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
            <div className="mb-10">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${selectedProfile.color}`}>{selectedProfile.tag}</span>
              <h3 className={`text-5xl font-serif italic mt-2 ${selectedProfile.color}`}>{selectedProfile.name}</h3>
            </div>
            
            <div className="space-y-12">
              <section className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Tópicos de Destaque</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProfile.details.map((d, i) => (
                    <div key={i} className={`p-6 rounded-3xl border text-base font-bold ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-gray-50 border-black/5'}`}>
                      ✦ {d}
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-8 rounded-[40px] bg-violet-600/10 border border-violet-600/20">
                <p className="text-[10px] font-black uppercase text-violet-600 mb-4 tracking-widest">Postura Soberana:</p>
                <p className="text-lg font-bold leading-relaxed">{selectedProfile.warning}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilHomens;
