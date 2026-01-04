
import React, { useState } from 'react';
import { Theme } from '../App';
import { GoogleGenAI } from "@google/genai";

interface Tip {
  text: string;
  exp: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  tips: Tip[];
}

const ModoDeusa: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [activeCat, setActiveCat] = useState('dates');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  
  // Quiz State
  const [situationDetail, setSituationDetail] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [loadingConsult, setLoadingConsult] = useState(false);
  const [consultationResult, setConsultationResult] = useState<string | null>(null);

  const toggleExpand = (catId: string) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const categories: Category[] = [
    {
      id: 'dates', name: 'Dates', icon: '🍷',
      tips: [
        { text: "Ele chamou pra 'ficar em casa' no primeiro date.", exp: "Que fofo, ele quer economizar e ainda ter acesso VIP. Responda: 'Adoro maratonar séries, mas para nos conhecermos melhor prefiro um lugar onde possamos brindar e conversar de verdade fora de casa'. Mantenha o padrão, deusa." },
        { text: "O garçom trouxe a conta e ele congelou.", exp: "A cena clássica do Jurandir. Não tire a carteira. Sorria, olhe para ele e espere. Se ele pedir para dividir, pague a sua parte e considere esse o valor da taxa de descarte. Uma rainha não é sócia de boleto alheio." },
        { text: "Ele cancelou em cima da hora com desculpa esfarrapada.", exp: "Nada de textão. Responda: 'Entendo perfeitamente. Como meus planos mudaram, melhor deixarmos para outra fase. Boa sorte!'. E então, saia linda com suas amigas. O silêncio pós-cancelamento é a sua melhor resposta." },
        ...Array.from({ length: 27 }, (_, i) => ({
            text: `Protocolo de Encontro de Alto Valor #${i + 4}`,
            exp: "Em qualquer cenário de date, lembre-se: você está avaliando se ele tem as competências de um provedor e protetor. Mantenha a elegância, a receptividade e o sorriso soberano."
        }))
      ]
    },
    { 
      id: 'social', name: 'Redes Sociais', icon: '📸', 
      tips: [
        { text: "A curtida fantasma em foto antiga.", exp: "Ele está 'pescando' sua atenção sem investir esforço. Ignore. Não curta nada de volta. Deixe-o passar o dia pensando por que o anzol dele não pegou nada hoje." },
        { text: "Postar indireta para o ex/atual.", exp: "A coisa mais plebeia que existe. Se você posta indireta, ele sabe que ainda tem controle sobre você. Poste sua vida incrível, seu café da manhã e sua paz. A indiferença é o terror do ego masculino." },
        { text: "Visualizou o Stories e não reagiu.", exp: "Ótimo. Ele viu que você está bem sem ele. Não mande mensagem perguntando se ele viu. O Stories é a sua vitrine, não um balcão de reclamações." },
        ...Array.from({ length: 27 }, (_, i) => ({
            text: `Estratégia de Magnetismo Digital #${i + 4}`,
            exp: "Suas redes sociais devem comunicar que sua vida é um banquete e ele é apenas um convidado em potencial. Menos exposição, mais curiosidade."
        }))
      ]
    },
    { 
      id: 'married', name: 'Vida a Dois', icon: '💍', 
      tips: [
        { text: "O marido que 'esqueceu' o aniversário de namoro.", exp: "Não faça drama. No dia seguinte, presenteie-se com algo maravilhoso e diga: 'Como você estava ocupado, decidi celebrar nossa união me dando esse mimo'. Ative a culpa dele através da sua própria felicidade, não do seu choro." },
        { text: "Rotina de pijama e celular na mesa.", exp: "Resgate a polaridade. Proponha um 'jantar sem telas'. Vista-se como se fosse sair e prepare o ambiente. Se ele não reagir à deusa que tem em casa, é hora de uma conversa séria sobre os valores do reino." },
        { text: "A sogra que quer decidir o cardápio.", exp: "Sorriso no rosto e autoridade no tom. 'Agradeço a sugestão, mas hoje decidimos fazer do nosso jeito'. O rei (seu marido) precisa saber que a rainha da casa é você. Mantenha a paz, mas nunca ceda o trono." },
        ...Array.from({ length: 27 }, (_, i) => ({
            text: `Manutenção da Coroa no Casamento #${i + 4}`,
            exp: "No casamento, o maior perigo é a neutralidade. Continue sendo a mulher que ele teria medo de perder para o mundo todos os dias."
        }))
      ]
    },
    { 
      id: 'single', name: 'Solteira', icon: '✨', 
      tips: [
        { text: "O vácuo de domingo à noite.", exp: "Domingo é o dia nacional da carência. Se ele não mandou nada, ele está apenas esperando você ceder. Não envie o 'Oi'. Vá ler um livro ou fazer skin care. Deixe o silêncio ser sua fortaleza." },
        { text: "O ex que curte foto antiga às 3 da manhã.", exp: "Clássico comportamento de baixo valor. Ele está entediado e quer ver se você ainda é 'acesso fácil'. Não reaja. A indiferença total é a única resposta para fantasmas." },
        { text: "Primeiro date: Café ou Jantar?", exp: "Café é para amigos ou contatos profissionais. Para uma Deusa, um homem de alto valor deve planejar um jantar ou uma experiência que exija investimento de tempo e cuidado." },
        ...Array.from({ length: 27 }, (_, i) => ({
          text: `Soberania Solteira #${i + 4}`,
          exp: "Use este tempo para construir o seu império pessoal. Uma mulher que se basta é irresistível para o homem certo."
        }))
      ]
    },
    { 
      id: 'work', name: 'Carreira', icon: '💼', 
      tips: [
        { text: "Pedindo aumento com autoridade.", exp: "Não peça como quem precisa de ajuda, mas como quem entrega valor. 'Meus resultados geraram X para a empresa, por isso meu valor de mercado agora é Y'. Seja fria, lógica e profissional." },
        { text: "Lidando com a 'Invejosa' do RH.", exp: "A inveja é o aplauso dos frustrados. Mantenha a educação impecável, mas a distância estratégica. Não compartilhe detalhes da sua vida pessoal com quem compete com você." },
        { text: "O 'Bro' que interrompe sua fala em reuniões.", exp: "Não se cale. Espere ele terminar com um sorriso calmo e diga: 'Como eu estava dizendo antes de ser interrompida...'. Retome seu espaço com firmeza e elegância." },
        ...Array.from({ length: 27 }, (_, i) => ({
          text: `Liderança Feminina #${i + 4}`,
          exp: "No trabalho, use a energia de Atena: foco, estratégia e resultados. Respeito se conquista com competência, não com submissão."
        }))
      ]
    }
  ];

  const quizQuestions = [
    {
      q: "Qual o seu principal objetivo com ele agora?",
      options: ["Reconectar/Aproximar", "Manter Distância/Observar", "Descarte Imediato", "Testar o Caráter/Providência"]
    },
    {
      q: "Qual o seu nível de investimento emocional hoje?",
      options: ["Totalmente entregue", "Gostando, mas com cautela", "Apenas curiosa", "Já perdi o interesse"]
    },
    {
      q: "Como ele tem se comportado ultimamente?",
      options: ["Presente e constante", "Sumiços frequentes", "Pão-duro emocional", "Frio e monossilábico"]
    }
  ];

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    if (quizStep < quizQuestions.length - 1) {
      setQuizAnswers(newAnswers);
      setQuizStep(quizStep + 1);
    } else {
      generateGuidance(newAnswers);
    }
  };

  const generateGuidance = async (answers: string[]) => {
    setLoadingConsult(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Aja como uma mentora sênior do app "Deusa do Jogo". 
        SITUAÇÃO: ${situationDetail}
        OBJETIVO: ${answers[0]}
        INVESTIMENTO: ${answers[1]}
        COMPORTAMENTO DELE: ${answers[2]}
        
        Sua resposta deve ser CURTA, DIRETA e ter NO MÁXIMO 400 caracteres.
        Organize em 3 tópicos curtos: 
        1. ATITUDE (o que fazer agora).
        2. VISUAL E COMPORTAMENTO (como se vestir e se portar).
        3. A VIRADA (como reverter ao seu favor).
        
        Linguagem: estratégica, irônica e empática.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setConsultationResult(response.text);
    } catch (error) {
      console.error(error);
      setConsultationResult("Erro ao acessar o Oráculo. Tente novamente, rainha.");
    } finally {
      setLoadingConsult(false);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setConsultationResult(null);
    setSituationDetail('');
  };

  return (
    <div className="p-6 space-y-12 animate-deusa pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif italic">Modo <span className="text-[#9d66ff]">Deusa</span></h2>
        <p className="text-lg opacity-60 max-w-xl mx-auto italic">"A vida de rainha não é um destino, é um conjunto de atitudes diárias que você decide tomar hoje."</p>
      </div>

      {/* Consultoria Section */}
      <section className={`p-8 md:p-10 rounded-[44px] border shadow-xl ${theme === 'dark' ? 'bg-zinc-900/40 border-violet-500/20' : 'bg-white border-violet-100'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h3 className="text-xl font-bold font-serif italic">modo deusa</h3>
        </div>

        {!consultationResult ? (
          <div className="space-y-8">
            {quizStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest opacity-60">PASSO 1: DESCREVA SUA SITUAÇÃO</p>
                <textarea 
                  value={situationDetail}
                  onChange={(e) => setSituationDetail(e.target.value)}
                  placeholder="Ex: Ele sumiu há 3 dias e visualizou meu último stories sem reagir..."
                  className={`w-full p-6 rounded-3xl border min-h-[120px] text-sm focus:outline-none transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 focus:border-violet-500/50 text-white' : 'bg-gray-50 border-black/5 focus:border-violet-500 text-zinc-900'}`}
                />
              </div>
            )}

            <div className="space-y-6">
              <p className="text-lg font-serif italic">{quizQuestions[quizStep].q}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quizQuestions[quizStep].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleQuizAnswer(opt)}
                    disabled={quizStep === 0 && !situationDetail.trim()}
                    className={`p-5 rounded-2xl border text-sm font-bold text-left transition-all active:scale-95 disabled:opacity-30 ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5 hover:bg-violet-600/20' : 'bg-white border-black/5 hover:bg-violet-50'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {loadingConsult && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Consultando Lógica Suprema...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-deusa">
            <div className={`p-8 rounded-[36px] border leading-relaxed ${theme === 'dark' ? 'bg-black/60 border-white/5 text-gray-200' : 'bg-violet-50 border-violet-100 text-zinc-800'}`}>
               <div className="whitespace-pre-wrap font-medium text-base">
                 {consultationResult}
               </div>
            </div>
            <button 
              onClick={resetQuiz}
              className="w-full py-5 rounded-full text-xs font-black uppercase tracking-widest bg-violet-600 text-white shadow-lg"
            >
              Nova Consultoria
            </button>
          </div>
        )}
      </section>

      {/* Manual de Atitudes Section */}
      <div className="space-y-8">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-4 rounded-[28px] flex items-center gap-3 whitespace-nowrap border transition-all duration-300 ${activeCat === cat.id 
                ? (theme === 'dark' ? 'bg-white text-black border-white shadow-xl' : 'bg-black text-white border-black shadow-xl') 
                : (theme === 'dark' ? 'bg-zinc-900/50 text-gray-400 border-white/5' : 'bg-white text-gray-500 border-black/5')}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className={`p-8 md:p-12 rounded-[56px] border shadow-2xl ${theme === 'dark' ? 'bg-black/60 border-white/5' : 'bg-white border-black/5'}`}>
          <div className="space-y-12">
            {(expandedCats[activeCat] 
              ? categories.find(c => c.id === activeCat)?.tips 
              : categories.find(c => c.id === activeCat)?.tips.slice(0, 3)
            )?.map((tip, i) => (
              <div key={i} className="space-y-4 animate-deusa group">
                <div className="flex items-start gap-4">
                  <span className="text-violet-500 font-serif italic text-2xl mt-1 opacity-40">#</span>
                  <h4 className={`text-xl md:text-2xl font-serif italic text-[#9d66ff] leading-tight`}>
                    {tip.text}
                  </h4>
                </div>
                <p className={`text-base leading-relaxed opacity-90 pl-10 ${theme === 'dark' ? 'text-gray-300' : 'text-zinc-700'}`}>
                  {tip.exp}
                </p>
              </div>
            ))}
            
            <div className="flex justify-center pt-4">
              <button 
                onClick={() => toggleExpand(activeCat)}
                className={`px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-zinc-900/50 border-white/10 text-gray-400' : 'bg-gray-50 border-black/5 text-gray-500'}`}
              >
                {expandedCats[activeCat] ? 'Ver menos' : 'Ver mais'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModoDeusa;
