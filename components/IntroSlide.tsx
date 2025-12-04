import React from 'react';
import { CheckCircle2, ShieldCheck, Trophy, Target, Brain, Heart, Star, Briefcase } from 'lucide-react';

interface IntroSlideProps {
  onStart: () => void;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({ onStart }) => {
  const requirements = [
    { icon: <Target />, text: "Um time pronto" },
    { icon: <Briefcase />, text: "Baixo a médio custo" },
    { icon: <Brain />, text: "Metodologia de Trabalho" },
    { icon: <Trophy />, text: "Mentalidade de Campeão" },
    { icon: <ShieldCheck />, text: "Vestir a camisa" },
    { icon: <Heart />, text: "Senso de Responsabilidade e Pertencimento" },
    { icon: <Star />, text: "Habilidades Técnicas" },
    { icon: <CheckCircle2 />, text: "Caráter e Ética" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden bg-zinc-950">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl w-full space-y-12 z-10">
        
        {/* Header Section: Current Status */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full shadow-lg">
            <CheckCircle2 className="text-yellow-500" size={20} />
            <span className="text-zinc-100 font-rajdhani font-bold tracking-wider text-lg uppercase">Já temos a estrutura</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-rajdhani text-white leading-none tracking-tight">
            O QUE PRECISAMOS PARA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-sm">
              CHEGAR DISPUTANDO
            </span>
          </h1>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req, idx) => (
            <div 
              key={idx}
              className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-500/30 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:transform hover:translate-x-2"
            >
              <div className="p-3 bg-zinc-950 rounded-lg group-hover:bg-yellow-500 group-hover:text-black text-yellow-500 transition-colors duration-300 border border-zinc-800 group-hover:border-yellow-500">
                {React.cloneElement(req.icon as React.ReactElement, { size: 24 })}
              </div>
              <span className="text-lg text-zinc-300 group-hover:text-white font-medium transition-colors">{req.text}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 bg-yellow-500 text-black font-bold text-xl rounded-none uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center gap-3 overflow-hidden skew-x-[-10deg]"
          >
            <span className="relative z-10 skew-x-[10deg]">Analisar Elenco</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer" />
            <Target className="relative z-10 skew-x-[10deg]" />
          </button>
        </div>

      </div>

      <div className="absolute bottom-6 text-zinc-500 text-xs font-rajdhani font-bold tracking-[0.2em] uppercase">
        Desenvolvido pela Comissão Técnica da TS
      </div>
    </div>
  );
};