import React, { useState } from 'react';
import { TeamData, Player } from '../types';
import { Save, X, Plus, Trash2, User } from 'lucide-react';

interface TeamBuilderProps {
  onSave: (team: TeamData) => void;
  onCancel: () => void;
}

export const TeamBuilder: React.FC<TeamBuilderProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  // Initialize with 5 empty players as requested
  const [players, setPlayers] = useState<Player[]>([
    { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }
  ]);
  const [characteristics, setCharacteristics] = useState<string[]>(['']);
  
  // Default stats
  const [stats, setStats] = useState({
    potential: 50,
    aggression: 50,
    experience: 50,
    costEfficiency: 50,
    readiness: 50
  });

  const handlePlayerChange = (index: number, val: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name: val };
    setPlayers(newPlayers);
  };

  const handleCharChange = (index: number, val: string) => {
    const newChars = [...characteristics];
    newChars[index] = val;
    setCharacteristics(newChars);
  };

  const addChar = () => setCharacteristics([...characteristics, '']);
  const removeChar = (index: number) => {
    if (characteristics.length === 1) return;
    setCharacteristics(characteristics.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name) {
      alert("O nome do projeto é obrigatório");
      return;
    }

    const newTeam: TeamData = {
      id: `custom-${Date.now()}`,
      name: name.toUpperCase(),
      summary: summary || 'Projeto Personalizado',
      themeColor: '#3b82f6', // Default Blue for custom teams
      roster: players.filter(p => p.name.trim() !== ''),
      characteristics: characteristics.filter(c => c.trim() !== ''),
      stats
    };

    onSave(newTeam);
  };

  return (
    <div className="animate-fade-in pb-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-rajdhani font-bold text-white uppercase">Novo Projeto</h2>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-md text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Save size={16} />
            Salvar Projeto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Basic Info & Roster */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-300 mb-4 border-b border-zinc-800 pb-2">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Nome do Projeto</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="EX: PROJECT VENOM"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors font-rajdhani font-bold text-lg"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Resumo / Slogan</label>
                <input 
                  type="text" 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Ex: Time agressivo focado em..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-zinc-300 focus:border-yellow-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-300 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
              <User size={18} /> Lineup (Máx 5)
            </h3>
            <div className="space-y-3">
              {players.map((player, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-zinc-500 font-rajdhani font-bold w-6">{idx + 1}.</span>
                  <input 
                    type="text" 
                    value={player.name}
                    onChange={(e) => handlePlayerChange(idx, e.target.value)}
                    placeholder={`Nome do Jogador ${idx + 1}`}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Characteristics & Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-bold text-zinc-300">Características</h3>
              <button onClick={addChar} className="text-xs flex items-center gap-1 text-yellow-500 hover:text-yellow-400 font-bold uppercase">
                <Plus size={12} /> Adicionar
              </button>
            </div>
            <div className="space-y-3">
              {characteristics.map((char, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" 
                    value={char}
                    onChange={(e) => handleCharChange(idx, e.target.value)}
                    placeholder="Ex: Alta experiência..."
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-300 focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                  <button 
                    onClick={() => removeChar(idx)}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    disabled={characteristics.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-300 mb-4 border-b border-zinc-800 pb-2">Estatísticas do Time (0-100)</h3>
            <div className="space-y-4">
              {[
                { label: 'Potencial', key: 'potential' as const },
                { label: 'Agressividade', key: 'aggression' as const },
                { label: 'Experiência', key: 'experience' as const },
                { label: 'Custo-Benefício', key: 'costEfficiency' as const },
                { label: 'Prontidão', key: 'readiness' as const },
              ].map((stat) => (
                <div key={stat.key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs uppercase font-bold text-zinc-500">{stat.label}</label>
                    <span className="text-xs font-bold text-yellow-500">{stats[stat.key]}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={stats[stat.key]}
                    onChange={(e) => setStats({...stats, [stat.key]: parseInt(e.target.value)})}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};