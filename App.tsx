import React, { useState } from 'react';
import { TEAMS } from './constants';
import { TeamData, ViewMode } from './types';
import { TeamCard } from './components/TeamCard';
import { TeamDetail } from './components/TeamDetail';
import { IntroSlide } from './components/IntroSlide';
import { TeamBuilder } from './components/TeamBuilder';
import { AdminLogin } from './components/AdminLogin';
import { Presentation } from './components/Presentation';
import { LayoutGrid, Target, Zap, Home, Lock, LogOut, BarChart2, Presentation as PresentationIcon } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INTRO);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [customTeams, setCustomTeams] = useState<TeamData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleTeamClick = (team: TeamData) => {
    setSelectedTeam(team);
    setViewMode(ViewMode.DETAIL);
  };

  const handleBack = () => {
    setSelectedTeam(null);
    setViewMode(ViewMode.DASHBOARD);
  };

  const handleStart = () => {
    setViewMode(ViewMode.DASHBOARD);
  };

  const handleSaveCustomTeam = (newTeam: TeamData) => {
    setCustomTeams([...customTeams, newTeam]);
    // Stay in builder or go back? Let's go back to dashboard but keep auth
    setViewMode(ViewMode.DASHBOARD);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setViewMode(ViewMode.BUILDER);
    } else {
      setViewMode(ViewMode.ADMIN_LOGIN);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAuthenticated(true);
    setViewMode(ViewMode.BUILDER);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setViewMode(ViewMode.DASHBOARD);
  };

  // Combine default teams with custom teams
  const allTeams = [...TEAMS, ...customTeams];

  // Render Intro Slide independently
  if (viewMode === ViewMode.INTRO) {
    return <IntroSlide onStart={handleStart} />;
  }

  // Render Full Screen Presentation
  if (viewMode === ViewMode.PRESENTATION) {
    return <Presentation onBack={() => setViewMode(ViewMode.DASHBOARD)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-yellow-500 selection:text-black pb-20 relative">
      
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode(ViewMode.DASHBOARD)}>
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center group-hover:border-yellow-500 transition-colors">
              <Target className="text-yellow-500" size={20} />
            </div>
            <span className="text-2xl font-bold font-rajdhani text-white tracking-widest group-hover:text-yellow-500 transition-colors">
              TS SCOUT <span className="text-zinc-600 group-hover:text-yellow-500/50">PRO</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
             <button 
               onClick={() => setViewMode(ViewMode.INTRO)}
               className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors uppercase font-bold tracking-wider text-xs border border-zinc-800 hover:border-yellow-500/50 px-4 py-2 rounded-sm bg-zinc-900"
             >
               <Home size={14} />
               <span className="hidden sm:inline">Início</span>
             </button>

             {/* Presentation Button */}
             <button 
               onClick={() => setViewMode(ViewMode.PRESENTATION)}
               className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors uppercase font-bold tracking-wider text-xs border border-zinc-800 hover:border-yellow-500/50 px-4 py-2 rounded-sm bg-zinc-900"
             >
               <PresentationIcon size={14} />
               <span className="hidden sm:inline">Apresentação TS</span>
             </button>

             {/* External Link: Stats FF */}
             <a 
               href="https://jhan-stats.vercel.app/"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors uppercase font-bold tracking-wider text-xs border border-zinc-800 hover:border-yellow-500/50 px-4 py-2 rounded-sm bg-zinc-900"
             >
               <BarChart2 size={14} />
               <span className="hidden sm:inline">Stats FF</span>
             </a>

             {/* Admin Button */}
             <button 
               onClick={isAuthenticated ? handleLogout : handleAdminClick}
               className={`flex items-center gap-2 transition-colors uppercase font-bold tracking-wider text-xs border px-4 py-2 rounded-sm ${isAuthenticated ? 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20' : 'text-zinc-500 border-zinc-800 bg-zinc-900 hover:text-white hover:border-zinc-600'}`}
               title={isAuthenticated ? "Sair do modo Admin" : "Acesso Admin"}
             >
               {isAuthenticated ? <LogOut size={14} /> : <Lock size={14} />}
               <span className="hidden sm:inline">{isAuthenticated ? 'Admin Logout' : 'Admin'}</span>
             </button>

             <div className="hidden md:flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
               <Zap size={14} fill="currentColor" />
               <span className="text-xs font-bold tracking-wider">SYSTEM ONLINE</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {viewMode === ViewMode.DASHBOARD && (
          <div className="animate-fade-in">
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-6xl font-bold font-rajdhani text-white mb-4 uppercase tracking-tight">
                Selecione seu <span className="text-yellow-500">Investimento</span>
              </h1>
              <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-light">
                Análise comparativa de elencos disponíveis. Avalie potencial, risco e retorno.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {allTeams.map((team) => (
                <div key={team.id} className="h-full">
                   <TeamCard team={team} onClick={handleTeamClick} />
                </div>
              ))}
            </div>

            {/* Comparison Overview Widget (Bottom) */}
            <div className="mt-20 border-t border-zinc-900 pt-12">
               <div className="flex items-center gap-3 mb-8">
                 <LayoutGrid className="text-yellow-500" />
                 <h2 className="text-3xl font-rajdhani font-bold text-white">Resumo Comparativo</h2>
               </div>
               
               <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 overflow-x-auto shadow-2xl">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="text-zinc-500 text-xs uppercase tracking-[0.15em] border-b border-zinc-800 font-bold">
                       <th className="pb-6 pl-4 font-rajdhani text-sm">Time</th>
                       <th className="pb-6 font-rajdhani text-sm">Foco Principal</th>
                       <th className="pb-6 font-rajdhani text-sm">Potencial</th>
                       <th className="pb-6 font-rajdhani text-sm">Risco</th>
                       <th className="pb-6 font-rajdhani text-sm">Estágio</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {allTeams.map(t => (
                       <tr key={t.id} className="hover:bg-zinc-950 transition-colors border-b border-zinc-800/50 last:border-0 group">
                         <td className="py-5 pl-4 font-bold text-white group-hover:text-yellow-500 transition-colors font-rajdhani text-lg">{t.name}</td>
                         <td className="py-5 text-zinc-400 font-light">{t.summary}</td>
                         <td className="py-5">
                           <div className="flex items-center gap-3">
                             <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                               <div className="h-full bg-white group-hover:bg-yellow-500 transition-colors" style={{ width: `${t.stats.potential}%` }}></div>
                             </div>
                             <span className="text-xs text-zinc-500 font-bold">{t.stats.potential}%</span>
                           </div>
                         </td>
                         <td className="py-5">
                            <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                              t.stats.readiness > 80 ? 'bg-zinc-800 text-zinc-300' :
                              t.stats.readiness > 50 ? 'bg-zinc-800 text-zinc-400' :
                              'bg-zinc-800 text-zinc-500'
                            }`}>
                              {t.stats.readiness > 80 ? 'BAIXO' : t.stats.readiness > 50 ? 'MÉDIO' : 'ALTO'}
                            </span>
                         </td>
                         <td className="py-5 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                           {t.characteristics[0] || '-'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {viewMode === ViewMode.DETAIL && selectedTeam && (
          <TeamDetail team={selectedTeam} onBack={handleBack} />
        )}

        {viewMode === ViewMode.ADMIN_LOGIN && (
          <AdminLogin 
            onLoginSuccess={handleAdminLoginSuccess} 
            onCancel={() => setViewMode(ViewMode.DASHBOARD)} 
          />
        )}

        {viewMode === ViewMode.BUILDER && (
          <TeamBuilder 
            onSave={handleSaveCustomTeam} 
            onCancel={() => setViewMode(ViewMode.DASHBOARD)} 
          />
        )}

      </main>

      {/* Footer Credit */}
      <footer className="absolute bottom-0 w-full py-6 text-center border-t border-zinc-900 bg-zinc-950">
        <p className="text-zinc-600 text-xs font-rajdhani font-bold tracking-[0.2em] uppercase">
          Desenvolvido pela Comissão Técnica da TS
        </p>
      </footer>
    </div>
  );
};

export default App;