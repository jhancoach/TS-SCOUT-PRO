import React from 'react';
import { TeamData } from '../types';
import { Users, TrendingUp, DollarSign, Crosshair, ChevronRight } from 'lucide-react';

interface TeamCardProps {
  team: TeamData;
  onClick: (team: TeamData) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <div 
      onClick={() => onClick(team)}
      className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 transition-all duration-200 cursor-pointer hover:shadow-2xl hover:shadow-yellow-900/10 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] active:border-yellow-500 h-full flex flex-col selection:bg-none"
    >
      {/* Header Color Strip - Keeping team identity but thinner */}
      <div 
        className="h-1 w-full absolute top-0 left-0 transition-all group-hover:h-1.5" 
        style={{ backgroundColor: team.themeColor }}
      />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-bold font-rajdhani tracking-wide text-white group-hover:text-yellow-500 transition-colors">
            {team.name}
          </h3>
          <span 
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:border-yellow-500/30 transition-colors"
          >
            OPÇÃO {team.id.replace('team', '')}
          </span>
        </div>

        <p className="text-zinc-400 mb-8 text-sm h-10 line-clamp-2 border-l-2 border-zinc-800 pl-3 group-hover:border-yellow-500/50 transition-colors">
          {team.summary}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-zinc-950 p-3 border border-zinc-800/50 rounded flex items-center gap-3 group-hover:border-zinc-700 transition-colors">
             <div className="text-yellow-500">
               <TrendingUp size={18} />
             </div>
             <div>
               <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Potencial</p>
               <p className="font-bold text-white text-lg font-rajdhani">{team.stats.potential}%</p>
             </div>
          </div>
          <div className="bg-zinc-950 p-3 border border-zinc-800/50 rounded flex items-center gap-3 group-hover:border-zinc-700 transition-colors">
             <div className="text-zinc-400 group-hover:text-white transition-colors">
               <Crosshair size={18} />
             </div>
             <div>
               <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Prontidão</p>
               <p className="font-bold text-white text-lg font-rajdhani">{team.stats.readiness}%</p>
             </div>
          </div>
        </div>

        {/* Roster Preview */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
             <Users size={12} className="text-zinc-500" />
             <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Lineup</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {team.roster.map((player, idx) => (
              <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-1 rounded-sm group-hover:border-zinc-600 transition-colors">
                {player.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hover Effect Footer */}
      <div className="bg-zinc-950 p-4 flex justify-between items-center text-xs text-zinc-500 group-hover:text-yellow-500 transition-colors border-t border-zinc-800 group-hover:border-zinc-700">
        <span className="uppercase tracking-widest font-bold">Análise Tática</span>
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};