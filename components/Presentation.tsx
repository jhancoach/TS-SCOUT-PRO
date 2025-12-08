import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Home, Target, MapPin, 
  Trophy, Activity, Users, Star, Gift, Shield, 
  UserCheck, MessageSquare, Zap, MonitorPlay, Heart, Utensils
} from 'lucide-react';

interface PresentationProps {
  onBack: () => void;
}

export const Presentation: React.FC<PresentationProps> = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: 'cover',
      title: 'TEAM SOLID ESPORTS',
      subtitle: '"Onde Talentos Viram Lendas"',
      detail: 'Free Fire Division • Temporada 2025',
      icon: <Shield size={80} />
    },
    {
      type: 'content',
      title: 'Quem Somos',
      content: [
        'Organização consolidada no cenário competitivo de Free Fire',
        'Foco em formação de atletas, desempenho contínuo e ambiente profissional',
        'Participação nos principais campeonatos da região',
        'Estrutura moderna e corpo técnico experiente'
      ],
      icon: <Users size={48} />
    },
    {
      type: 'content',
      title: 'Nossa Missão',
      highlight: 'Formar jogadores de alto rendimento, oferecendo ambiente, ferramentas e acompanhamento para maximizar o desempenho competitivo.',
      icon: <Target size={48} />
    },
    {
      type: 'grid',
      title: 'Nossa GH (Gaming House)',
      subtitle: 'Infraestrutura de Elite',
      items: [
        { label: 'Alojamento Completo', icon: <Home /> },
        { label: 'Setup Profissional', icon: <MonitorPlay /> },
        { label: 'Espaço de Estratégia', icon: <MapPin /> },
        { label: 'Sala Tática com TVs', icon: <Activity /> },
        { label: 'Cozinha e Refeitório', icon: <Utensils /> },
        { label: 'Suporte Psicológico', icon: <Heart /> },
      ]
    },
    {
      type: 'content',
      title: 'Estrutura Competitiva',
      content: [
        'Treinadores especializados',
        'Analista de desempenho (estatísticas, leitura de jogo, rotações)',
        'Head Coach com experiência em Series A / B',
        'Cronograma diário de treinos',
        'Rotinas de VOD Review',
        'Desenvolvimento individual e coletivo'
      ],
      icon: <Activity size={48} />
    },
    {
      type: 'content',
      title: 'Resultados e Histórico',
      content: [
        'Campeonatos vencidos e Títulos Expressivos',
        'TOPs relevantes nas principais ligas',
        'Destaques de jogadores revelados para o cenário',
        'Parcerias e notoriedade no mercado'
      ],
      icon: <Trophy size={48} />
    },
    {
      type: 'process',
      title: 'Processo de Treino',
      steps: [
        { time: 'Treino 1', desc: 'Rotação e Early Game' },
        { time: 'Treino 2', desc: 'Mid Game e Controle' },
        { time: 'Treino 3', desc: 'End Game e Decisão' },
        { time: 'Review', desc: 'Análise de VOD Diária' }
      ]
    },
    {
      type: 'content',
      title: 'Oportunidades para o Atleta',
      content: [
        'Visibilidade nacional e exposição de mídia',
        'Suporte técnico e psicológico completo',
        'Ambiente 100% profissional',
        'Acompanhamento de carreira e gestão de imagem',
        'Chance real de disputar Series A'
      ],
      icon: <Star size={48} />
    },
    {
      type: 'content',
      title: 'O Que Procuramos',
      content: [
        'Disciplina tática e comportamental',
        'Compromisso inegociável com a rotina',
        'Humildade para aprender e evoluir',
        'Resiliência emocional sob pressão',
        'Comunicação clara e objetiva (Call)'
      ],
      icon: <UserCheck size={48} />
    },
    {
      type: 'grid',
      title: 'Benefícios ao Atleta',
      subtitle: 'Valorização do Profissional',
      items: [
        { label: 'Possibilidade de Salário', icon: <Gift /> },
        { label: 'Moradia na GH', icon: <Home /> },
        { label: 'Alimentação Completa', icon: <Utensils /> },
        { label: 'Premiações', icon: <Trophy /> },
        { label: 'Apoio de Mídia', icon: <MonitorPlay /> },
        { label: 'Profissionalização', icon: <Star /> },
      ]
    },
    {
      type: 'content',
      title: 'Cultura Team Solid',
      content: [
        'Respeito acima de tudo',
        'Profissionalismo dentro e fora de jogo',
        'Mentalidade de evolução contínua',
        'Espírito competitivo voraz',
        'Foco em metas claras e mensuráveis'
      ],
      icon: <Shield size={48} />
    },
    {
      type: 'process',
      title: 'Processo de Seleção',
      steps: [
        { time: '01', desc: 'Avaliação Individual' },
        { time: '02', desc: 'Teste Prático (Treinos)' },
        { time: '03', desc: 'Análise Estatística' },
        { time: '04', desc: 'Feedback Técnico' },
        { time: '05', desc: 'Seleção Final' }
      ]
    },
    {
      type: 'content',
      title: 'Depoimentos',
      highlight: '"A Team Solid não é apenas um time, é uma escola de campeões. A estrutura e o suporte que recebi aqui foram fundamentais para minha evolução como jogador e como pessoa."',
      subtitle: '- Ex-Atleta Revelação',
      icon: <MessageSquare size={48} />
    },
    {
      type: 'content',
      title: 'Nosso Diferencial',
      content: [
        'Estrutura física e administrativa Premium',
        'Gestão séria e projeto de longo prazo',
        'Sistema próprio de análise de dados',
        'Replay Premium Plus e Mapeamento de Zonas',
        'Metodologia exclusiva de Picks & Bans'
      ],
      icon: <Zap size={48} />
    },
    {
      type: 'contact',
      title: 'Faça Parte da Lenda',
      subtitle: 'Entre em contato e inicie sua jornada',
      content: [
        'Instagram: @teamsolid_oficial',
        'Email: contato@teamsolid.gg',
        'WhatsApp: (XX) 9XXXX-XXXX',
        'Link na Bio: Formulário de Inscrição'
      ],
      icon: <Shield size={64} />
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') onBack();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[100] flex flex-col animate-fade-in text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-yellow-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
      </div>

      {/* Top Controls */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors uppercase font-bold text-sm tracking-wider"
        >
          <ChevronLeft size={16} /> Voltar ao App
        </button>
        <div className="text-zinc-500 font-rajdhani font-bold tracking-[0.2em] text-sm">
          SLIDE {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-5xl w-full">
          
          {/* Cover Slide Style */}
          {slide.type === 'cover' && (
            <div className="text-center space-y-8 animate-fade-in-up">
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-zinc-900 border-2 border-yellow-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)] text-yellow-500">
                  {slide.icon}
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-black font-rajdhani tracking-tighter text-white leading-none">
                TEAM <span className="text-yellow-500">SOLID</span>
              </h1>
              <p className="text-2xl md:text-3xl text-zinc-400 font-light italic">{slide.subtitle}</p>
              <div className="pt-8">
                <span className="inline-block px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 font-bold uppercase tracking-widest text-sm">
                  {slide.detail}
                </span>
              </div>
            </div>
          )}

          {/* Standard Content Slide */}
          {slide.type === 'content' && (
            <div className="animate-fade-in-up flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-3 text-yellow-500 mb-2">
                  {slide.icon}
                  <div className="h-px w-20 bg-yellow-500/50"></div>
                </div>
                <h2 className="text-5xl font-bold font-rajdhani text-white uppercase leading-none">{slide.title}</h2>
                {slide.subtitle && <p className="text-xl text-zinc-500 italic">{slide.subtitle}</p>}
                
                {slide.highlight ? (
                   <p className="text-2xl md:text-3xl font-light text-zinc-200 leading-relaxed border-l-4 border-yellow-500 pl-6 py-2">
                     {slide.highlight}
                   </p>
                ) : (
                  <ul className="space-y-4 mt-8">
                    {slide.content?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-4 text-xl text-zinc-300">
                        <span className="w-2 h-2 mt-2.5 bg-yellow-500 rounded-full shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Grid Slide */}
          {slide.type === 'grid' && (
            <div className="animate-fade-in-up w-full">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold font-rajdhani text-white uppercase mb-2">{slide.title}</h2>
                <p className="text-xl text-zinc-500 uppercase tracking-widest">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {slide.items?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-yellow-500/50 hover:bg-zinc-900 transition-all duration-300 group">
                    <div className="text-zinc-500 group-hover:text-yellow-500 transition-colors transform group-hover:scale-110 duration-300">
                      {React.cloneElement(item.icon, { size: 40 })}
                    </div>
                    <span className="font-rajdhani font-bold text-lg text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process Slide */}
          {slide.type === 'process' && (
            <div className="animate-fade-in-up w-full">
              <h2 className="text-5xl font-bold font-rajdhani text-white uppercase mb-12 text-center">{slide.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slide.steps?.map((step: any, idx: number) => (
                  <div key={idx} className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-lg overflow-hidden group hover:border-yellow-500 transition-colors">
                    <div className="absolute top-0 right-0 p-4 text-6xl font-black font-rajdhani text-zinc-800 group-hover:text-yellow-500/10 transition-colors z-0">
                      {idx + 1}
                    </div>
                    <div className="relative z-10">
                      <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-2 block">{step.time}</span>
                      <h3 className="text-xl font-bold text-white">{step.desc}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Slide */}
          {slide.type === 'contact' && (
            <div className="animate-fade-in-up text-center space-y-8">
              <div className="flex justify-center">
                 <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-black animate-pulse">
                   <Target size={48} />
                 </div>
              </div>
              <h2 className="text-5xl font-bold font-rajdhani text-white uppercase">{slide.title}</h2>
              <p className="text-2xl text-zinc-400 font-light">{slide.subtitle}</p>
              
              <div className="flex flex-col items-center gap-4 mt-8">
                {slide.content?.map((item: string, idx: number) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-full text-xl font-rajdhani font-bold hover:border-yellow-500 transition-colors">
                    {item}
                  </div>
                ))}
              </div>
              <div className="pt-8">
                 <button onClick={onBack} className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                   Voltar ao Início
                 </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 p-6 flex justify-between items-center bg-zinc-950/50 backdrop-blur-sm border-t border-zinc-900">
        <button 
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`p-4 rounded-full border transition-all ${currentSlide === 0 ? 'border-zinc-800 text-zinc-700 cursor-not-allowed' : 'border-zinc-700 text-white hover:bg-zinc-800 hover:border-yellow-500'}`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-zinc-800'}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className={`p-4 rounded-full border transition-all ${currentSlide === slides.length - 1 ? 'border-zinc-800 text-zinc-700 cursor-not-allowed' : 'border-zinc-700 text-white hover:bg-zinc-800 hover:border-yellow-500'}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};