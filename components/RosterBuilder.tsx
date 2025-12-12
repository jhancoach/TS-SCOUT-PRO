import React, { useState } from 'react';
import { User, Shield, Target, Bomb, Crosshair, Crown, Plus, Trash2, RotateCcw, MonitorPlay } from 'lucide-react';

interface RosterSlot {
  id: number;
  type: 'PLAYER' | 'COACH';
  label: string;
  assignedName: string | null;
  assignedRole: string | null;
}

const ROLES = [
  { id: 'rush1', label: 'RUSH 1', icon: <Target size={14} />, color: 'bg-red-500/20 border-red-500 text-red-500' },
  { id: 'rush2', label: 'RUSH 2', icon: <Target size={14} />, color: 'bg-red-500/20 border-red-500 text-red-500' },
  { id: 'cpt', label: 'CPT', icon: <Crown size={14} />, color: 'bg-yellow-500/20 border-yellow-500 text-yellow-500' },
  { id: 'bomba', label: 'BOMBA', icon: <Bomb size={14} />, color: 'bg-orange-500/20 border-orange-500 text-orange-500' },
  { id: 'sniper', label: 'SNIPER', icon: <Crosshair size={14} />, color: 'bg-cyan-500/20 border-cyan-500 text-cyan-500' },
  { id: 'coach', label: 'COACH', icon: <MonitorPlay size={14} />, color: 'bg-purple-500/20 border-purple-500 text-purple-500' },
];

export const RosterBuilder: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState<string[]>([
    'BLACK', 'FNX', 'GUIME', 'ERICKING', 'PROZIN', 
    'JUCA', 'THEUS7', 'PITBULL', 'NANDO9', 'BYTE33', 
    'HONEY', 'WLIU', 'LOST', 'CAUAN',
    'COACH BRN', 'COACH PUTSGRILO'
  ]);
  
  const [slots, setSlots] = useState<RosterSlot[]>([
    { id: 0, type: 'COACH', label: 'COACH', assignedName: null, assignedRole: 'COACH' },
    { id: 1, type: 'PLAYER', label: 'JOGADOR 1', assignedName: null, assignedRole: null },
    { id: 2, type: 'PLAYER', label: 'JOGADOR 2', assignedName: null, assignedRole: null },
    { id: 3, type: 'PLAYER', label: 'JOGADOR 3', assignedName: null, assignedRole: null },
    { id: 4, type: 'PLAYER', label: 'JOGADOR 4', assignedName: null, assignedRole: null },
    { id: 5, type: 'PLAYER', label: 'JOGADOR 5', assignedName: null, assignedRole: null },
  ]);

  const handleAddPlayer = () => {
    if (newName.trim()) {
      setAvailablePlayers([...availablePlayers, newName.toUpperCase().trim()]);
      setNewName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPlayer();
  };

  const removeAvailablePlayer = (index: number) => {
    const newPlayers = [...availablePlayers];
    newPlayers.splice(index, 1);
    setAvailablePlayers(newPlayers);
  };

  // Drag Handlers
  const onDragStart = (e: React.DragEvent, type: 'NAME' | 'ROLE', value: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, value }));
    e.dataTransfer.effectAllowed = type === 'ROLE' ? 'copy' : 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    setSlots(currentSlots => currentSlots.map(slot => {
      if (slot.id === slotId) {
        if (data.type === 'NAME') {
          return { ...slot, assignedName: data.value };
        } else if (data.type === 'ROLE') {
          // If trying to drop regular roles on Coach slot, or Coach role on Player slot, maybe warn? 
          // But for freedom, let's allow it, except visual feedback might be needed.
          return { ...slot, assignedRole: data.value };
        }
      }
      return slot;
    }));
  };

  const clearSlot = (slotId: number) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, assignedName: null, assignedRole: s.type === 'COACH' ? 'COACH' : null } : s));
  };

  const resetBoard = () => {
    setSlots([
        { id: 0, type: 'COACH', label: 'COACH', assignedName: null, assignedRole: 'COACH' },
        { id: 1, type: 'PLAYER', label: 'JOGADOR 1', assignedName: null, assignedRole: null },
        { id: 2, type: 'PLAYER', label: 'JOGADOR 2', assignedName: null, assignedRole: null },
        { id: 3, type: 'PLAYER', label: 'JOGADOR 3', assignedName: null, assignedRole: null },
        { id: 4, type: 'PLAYER', label: 'JOGADOR 4', assignedName: null, assignedRole: null },
        { id: 5, type: 'PLAYER', label: 'JOGADOR 5', assignedName: null, assignedRole: null },
    ]);
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[calc(100vh-140px)]">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Name Input */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
            <Plus size={14} /> Adicionar Jogador
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="NICKNAME"
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm focus:border-yellow-500 focus:outline-none font-rajdhani font-bold uppercase"
            />
            <button 
              onClick={handleAddPlayer}
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Available Players List */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-1 flex flex-col">
          <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-3">Banco de Reservas</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {availablePlayers.map((player, idx) => (
              <div 
                key={idx}
                draggable
                onDragStart={(e) => onDragStart(e, 'NAME', player)}
                className="group flex justify-between items-center bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 p-2 rounded cursor-grab active:cursor-grabbing transition-all"
              >
                <div className="flex items-center gap-2">
                  <User size={14} className="text-zinc-500 group-hover:text-yellow-500" />
                  <span className="font-rajdhani font-bold text-white">{player}</span>
                </div>
                <button onClick={() => removeAvailablePlayer(idx)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {availablePlayers.length === 0 && (
              <p className="text-zinc-600 text-xs italic text-center py-4">Sem jogadores disponíveis.</p>
            )}
          </div>
        </div>

        {/* Roles Palette */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-3">Funções (Arraste)</h3>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => (
              <div 
                key={role.id}
                draggable
                onDragStart={(e) => onDragStart(e, 'ROLE', role.label)}
                className={`p-2 rounded border flex items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:brightness-125 transition-all text-xs font-bold ${role.color.replace('bg-', 'bg-opacity-10 bg-')}`}
              >
                {role.icon}
                {role.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none"></div>

        <div className="absolute top-6 right-6 z-20">
            <button onClick={resetBoard} className="flex items-center gap-2 text-zinc-500 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors">
                <RotateCcw size={14} /> Resetar
            </button>
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
            
            {/* Coach Slot */}
            <div className="flex justify-center w-full">
                {slots.filter(s => s.type === 'COACH').map(slot => (
                     <SlotComponent key={slot.id} slot={slot} onDrop={onDrop} onClear={clearSlot} />
                ))}
            </div>

            {/* Players Slots */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 w-full">
                {slots.filter(s => s.type === 'PLAYER').map(slot => (
                    <SlotComponent key={slot.id} slot={slot} onDrop={onDrop} onClear={clearSlot} />
                ))}
            </div>

        </div>
      </div>

    </div>
  );
};

const SlotComponent: React.FC<{ 
    slot: RosterSlot; 
    onDrop: (e: React.DragEvent, id: number) => void;
    onClear: (id: number) => void;
}> = ({ slot, onDrop, onClear }) => {
    
    // Find role color
    const roleConfig = ROLES.find(r => r.label === slot.assignedRole);
    const borderColor = roleConfig ? roleConfig.color.split(' ')[1] : 'border-zinc-800'; // Extract border-color class or default
    const bgColor = roleConfig ? roleConfig.color.split(' ')[0] : 'bg-zinc-900';
    const textColor = roleConfig ? roleConfig.color.split(' ')[2] : 'text-zinc-500';

    // Font size logic based on name length
    const nameLength = slot.assignedName?.length || 0;
    const textSizeClass = nameLength > 12 ? 'text-sm' : 'text-xl';

    return (
        <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, slot.id)}
            className={`
                relative w-40 h-56 flex flex-col items-center transition-all duration-300
                ${slot.assignedName ? 'transform scale-105' : 'opacity-80 hover:opacity-100'}
            `}
        >
            {/* Role Badge (Top) */}
            <div className={`
                absolute -top-3 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg
                ${slot.assignedRole ? `${bgColor} ${borderColor} ${textColor} border-opacity-50` : 'bg-zinc-950 border-zinc-800 text-zinc-600'}
            `}>
                {slot.assignedRole || 'ARRASTE A FUNÇÃO'}
            </div>

            {/* Main Character Body (Visual Representation) */}
            <div className={`
                w-full h-full rounded-2xl border-2 flex flex-col items-center justify-end overflow-hidden relative group bg-zinc-950
                ${slot.assignedName ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-zinc-800 border-dashed'}
            `}>
                {/* Silhouette / Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 group-hover:text-zinc-700 transition-colors">
                    {slot.type === 'COACH' ? <MonitorPlay size={64} strokeWidth={1} /> : <User size={80} strokeWidth={1} />}
                </div>

                {/* Name Tag (Bottom) */}
                <div className={`
                    w-full py-4 min-h-[64px] flex items-center justify-center text-center z-10 border-t transition-colors
                    ${slot.assignedName ? 'bg-zinc-900/90 border-yellow-500/50' : 'bg-zinc-950/90 border-zinc-800'}
                `}>
                    {slot.assignedName ? (
                        <div className="group/name relative w-full px-2">
                             <span className={`font-rajdhani font-bold text-white block leading-tight break-words ${textSizeClass}`}>
                                {slot.assignedName}
                            </span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onClear(slot.id); }}
                                className="absolute top-1/2 -translate-y-1/2 right-0 text-zinc-500 hover:text-red-500 opacity-0 group-hover/name:opacity-100 transition-all bg-zinc-900 p-1 rounded-full"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ) : (
                        <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider">
                            Arraste Nome
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
