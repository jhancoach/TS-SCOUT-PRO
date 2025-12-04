import React, { useState } from 'react';
import { TeamData } from '../types';
import { StatsChart } from './RadarChart';
import { generateTeamPitch } from '../services/geminiService';
import { ArrowLeft, Bot, CheckCircle, AlertTriangle, Shield, Sword, User } from 'lucide-react';

interface TeamDetailProps {
  team: TeamData;
  onBack: () => void;
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ team, onBack }) => {
  const [pitch, setPitch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePitch = async () => {
    setLoading(true);
    const result = await generateTeamPitch(team);
    setPitch(result);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 mb-6 transition-colors font-bold uppercase tracking-wider text-sm"
      >
        <ArrowLeft size={18} />
        Voltar para Seleção
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Roster & Identity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl relative overflow-hidden">
             {/* Decorative Top Border */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
            
            <h1 className="text-5xl font-bold font-rajdhani mb-2 text-white">
              {team.name}
            </h1>
            <p className="text-zinc-400 text-lg mb-8 font-light border-l-2 border-yellow-500/50 pl-4">{team.summary}</p>
            
            <div className="space-y-4">
              <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-[0.2em] mb-4">Lineup Titular</h3>
              {team.roster.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">
                      <User size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-white block font-rajdhani text-lg">{player.name}</span>
                      {player.role && <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">{player.role}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-xl font-rajdhani font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Características
            </h3>
            <ul className="space-y-4">
              {team.characteristics.map((char, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle size={18} className="text-zinc-600 mt-1 shrink-0" />
                  <span className="text-sm font-medium">{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Visuals & AI */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Section */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-rajdhani font-bold text-white">Performance Radar</h3>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Sword size={14} className="text-yellow-500" /> Agressividade
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Shield size={14} className="text-white" /> Consistência
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 w-full relative">
                {/* Background Grid Pattern for chart area */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none"></div>
                <StatsChart stats={team.stats} color={team.themeColor} />
              </div>
              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500">Potencial</span>
                    <span className="text-white">{team.stats.potential}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-white" 
                      style={{ width: `${team.stats.potential}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500">Custo-Benefício</span>
                    <span className="text-white">{team.stats.costEfficiency}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-yellow-500" 
                      style={{ width: `${team.stats.costEfficiency}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500">Experiência</span>
                    <span className="text-white">{team.stats.experience}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-zinc-600" 
                      style={{ width: `${team.stats.experience}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Pitch Generator */}
          <div className="bg-zinc-900 rounded-xl p-1 border border-zinc-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Bot size={120} className="text-white" />
            </div>
            
            <div className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-950/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-rajdhani font-bold flex items-center gap-3 text-white">
                  <Bot className="text-yellow-500" />
                  Gemini Scout AI
                </h3>
                {!pitch && !loading && (
                   <button 
                   onClick={handleGeneratePitch}
                   className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                 >
                   Gerar Análise
                 </button>
                )}
              </div>

              {loading && (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="animate-pulse text-sm font-bold uppercase tracking-widest">Processando estratégia...</p>
                </div>
              )}

              {pitch && (
                <div className="animate-fade-in bg-zinc-950 rounded border border-zinc-800 p-6 shadow-inner">
                  <div className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-headings:text-white prose-strong:text-yellow-500 prose-li:text-zinc-300">
                     {/* Safe render of markdown-like text */}
                     {pitch.split('\n').map((line, i) => (
                       <p key={i} className="mb-3 text-sm leading-relaxed font-light">
                         {line.replace(/\*\*/g, '').replace(/^- /, '• ')}
                       </p>
                     ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleGeneratePitch} 
                      className="text-xs text-zinc-600 hover:text-yellow-500 transition-colors font-bold uppercase tracking-widest"
                    >
                      Regenerar Análise
                    </button>
                  </div>
                </div>
              )}
              
              {!pitch && !loading && (
                 <p className="text-zinc-500 text-sm font-light border-l border-zinc-800 pl-4">
                   Utilize a Inteligência Artificial para gerar um pitch de venda persuasivo baseado nas métricas e características únicas do {team.name}.
                 </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};