import React, { useState } from 'react';
import { TeamData } from '../types';
import { StatsChart } from './RadarChart';
import { ArrowLeft, CheckCircle, Shield, Sword, User, Share2, Check } from 'lucide-react';

interface TeamDetailProps {
  team: TeamData;
  onBack: () => void;
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ team, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const textToShare = `TS SCOUT PRO - ANÁLISE\n\nPROJETO: ${team.name}\nRESUMO: ${team.summary}\n\nLINEUP: ${team.roster.map(p => p.name).join(', ')}\n\nSTATS:\n- Potencial: ${team.stats.potential}%\n- Prontidão: ${team.stats.readiness}%\n- Custo-Benefício: ${team.stats.costEfficiency}%`;
    
    navigator.clipboard.writeText(textToShare).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors font-bold uppercase tracking-wider text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Seleção
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-full"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
          {copied ? 'Copiado!' : 'Compartilhar Resumo'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Roster & Identity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl relative overflow-hidden group/card hover:border-zinc-700 transition-colors">
             {/* Decorative Top Border */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
            
            <h1 className="text-5xl font-bold font-rajdhani mb-2 text-white drop-shadow-lg">
              {team.name}
            </h1>
            <p className="text-zinc-400 text-lg mb-8 font-light border-l-2 border-yellow-500/50 pl-4 group-hover/card:border-yellow-500 transition-colors">{team.summary}</p>
            
            <div className="space-y-4">
              <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-[0.2em] mb-4">Lineup Titular</h3>
              {team.roster.map((player, idx) => (
                <div 
                  key={idx} 
                  className="group/player flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/50 hover:border-yellow-500/30 hover:bg-zinc-900/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-900/5 cursor-default relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 transform -translate-x-full group-hover/player:translate-x-0 transition-transform duration-300"></div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 group-hover/player:text-yellow-500 group-hover/player:border-yellow-500/50 transition-colors">
                      <User size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-white block font-rajdhani text-lg group-hover/player:text-yellow-100 transition-colors">{player.name}</span>
                      {player.role && <span className="text-xs text-yellow-500/70 group-hover/player:text-yellow-500 font-bold uppercase tracking-wider transition-colors">{player.role}</span>}
                    </div>
                  </div>
                  {player.notes && (
                    <div className="opacity-0 group-hover/player:opacity-100 transition-opacity text-xs text-zinc-500 text-right max-w-[120px]">
                      {player.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-xl font-rajdhani font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              Características
            </h3>
            <ul className="space-y-4">
              {team.characteristics.map((char, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-300 hover:text-white transition-colors duration-200 hover:translate-x-1 group/item">
                  <CheckCircle size={18} className="text-zinc-600 mt-1 shrink-0 group-hover/item:text-yellow-500 transition-colors" />
                  <span className="text-sm font-medium">{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Visuals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Section */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 h-full">
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
              <div className="flex-1 w-full relative h-64">
                {/* Background Grid Pattern for chart area */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none"></div>
                <StatsChart stats={team.stats} color={team.themeColor} />
              </div>
              <div className="flex-1 space-y-6 w-full pr-4">
                
                {/* Stat Bar Item */}
                <div className="space-y-2 group">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500 group-hover:text-white transition-colors">Potencial</span>
                    <span className="text-white font-rajdhani text-lg leading-none">{team.stats.potential}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-white group-hover:bg-yellow-100 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                      style={{ width: `${team.stats.potential}%` }}
                    />
                  </div>
                </div>

                {/* Stat Bar Item */}
                <div className="space-y-2 group">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500 group-hover:text-yellow-500 transition-colors">Custo-Benefício</span>
                    <span className="text-white font-rajdhani text-lg leading-none">{team.stats.costEfficiency}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-yellow-500 group-hover:bg-yellow-400 group-hover:shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                      style={{ width: `${team.stats.costEfficiency}%` }}
                    />
                  </div>
                </div>

                {/* Stat Bar Item */}
                <div className="space-y-2 group">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Experiência</span>
                    <span className="text-white font-rajdhani text-lg leading-none">{team.stats.experience}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-zinc-600 group-hover:bg-zinc-500" 
                      style={{ width: `${team.stats.experience}%` }}
                    />
                  </div>
                </div>
                
                {/* Stat Bar Item */}
                 <div className="space-y-2 group">
                  <div className="flex justify-between text-sm uppercase font-bold tracking-wider">
                    <span className="text-zinc-500 group-hover:text-red-500 transition-colors">Agressividade</span>
                    <span className="text-white font-rajdhani text-lg leading-none">{team.stats.aggression}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-red-900 group-hover:bg-red-600" 
                      style={{ width: `${team.stats.aggression}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};