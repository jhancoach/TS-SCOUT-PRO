import React, { useState, useRef } from 'react';
import { User, Target, Bomb, Crosshair, Crown, Plus, Trash2, MonitorPlay, Download, FilePlus, LayoutGrid, List, RectangleHorizontal, RectangleVertical, ArrowDown } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

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
  const [viewType, setViewType] = useState<'LIST' | 'CARDS'>('LIST');
  const [slotStyle, setSlotStyle] = useState<'PORTRAIT' | 'LANDSCAPE'>('LANDSCAPE'); // Default to Landscape (Card) as per request
  
  const [availablePlayers, setAvailablePlayers] = useState<string[]>([
    'BLACK', 'FNX', 'GUIME', 'ERICKING', 'PROZIN', 
    'JUCA', 'THEUS7', 'PITBULL', 'NANDO9', 'BYTE33', 
    'HONEY', 'WLIU', 'LOST', 'CAUAN', 'MOTOVEA',
    'COACH BRN', 'COACH PUTSGRILO'
  ]);
  
  const [slots, setSlots] = useState<RosterSlot[]>([
    // Coach
    { id: 0, type: 'COACH', label: 'COACH', assignedName: null, assignedRole: 'COACH' },
    
    // Main Lineup (Option 1)
    { id: 1, type: 'PLAYER', label: 'JOGADOR 1', assignedName: null, assignedRole: null },
    { id: 2, type: 'PLAYER', label: 'JOGADOR 2', assignedName: null, assignedRole: null },
    { id: 3, type: 'PLAYER', label: 'JOGADOR 3', assignedName: null, assignedRole: null },
    { id: 4, type: 'PLAYER', label: 'JOGADOR 4', assignedName: null, assignedRole: null },
    { id: 5, type: 'PLAYER', label: 'JOGADOR 5', assignedName: null, assignedRole: null },

    // Secondary Lineup (Option 2)
    { id: 6, type: 'PLAYER', label: 'OPÇÃO 1', assignedName: null, assignedRole: null },
    { id: 7, type: 'PLAYER', label: 'OPÇÃO 2', assignedName: null, assignedRole: null },
    { id: 8, type: 'PLAYER', label: 'OPÇÃO 3', assignedName: null, assignedRole: null },
    { id: 9, type: 'PLAYER', label: 'OPÇÃO 4', assignedName: null, assignedRole: null },
    { id: 10, type: 'PLAYER', label: 'OPÇÃO 5', assignedName: null, assignedRole: null },
  ]);

  const boardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const onDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    setSlots(currentSlots => currentSlots.map(slot => {
      if (slot.id === slotId) {
        if (data.type === 'NAME') {
          return { ...slot, assignedName: data.value };
        } else if (data.type === 'ROLE') {
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
    if (window.confirm('Tem certeza que deseja limpar todo o elenco?')) {
        setSlots(slots.map(s => ({ 
            ...s, 
            assignedName: null, 
            assignedRole: s.type === 'COACH' ? 'COACH' : null 
        })));
    }
  };

  const handleSavePNG = async () => {
    if (boardRef.current) {
        setIsCapturing(true);
        try {
            // Wait a moment for any state updates if needed, though usually not required here
            const canvas = await html2canvas(boardRef.current, {
                backgroundColor: '#09090b', // Zinc-950 background
                scale: 2, // High resolution
                logging: false,
                useCORS: true,
                ignoreElements: (element: Element) => {
                   // Ignore elements with class 'no-print'
                   return element.classList.contains('no-print');
                }
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `TS-SCOUT-ROSTER-${Date.now()}.png`;
            link.click();
        } catch (error) {
            console.error("Erro ao gerar imagem:", error);
            alert("Não foi possível gerar a imagem. Tente novamente.");
        } finally {
            setIsCapturing(false);
        }
    }
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
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-1 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Banco de Reservas</h3>
             <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button 
                  onClick={() => setViewType('LIST')}
                  className={`p-1.5 rounded-md transition-all ${viewType === 'LIST' ? 'bg-zinc-800 text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Lista"
                >
                  <List size={14} />
                </button>
                <button 
                  onClick={() => setViewType('CARDS')}
                  className={`p-1.5 rounded-md transition-all ${viewType === 'CARDS' ? 'bg-zinc-800 text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Cards"
                >
                  <LayoutGrid size={14} />
                </button>
             </div>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 flex-1">
            {availablePlayers.length === 0 && (
              <p className="text-zinc-600 text-xs italic text-center py-4">Sem jogadores disponíveis.</p>
            )}

            {viewType === 'LIST' ? (
                // LIST VIEW
                availablePlayers.map((player, idx) => (
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
                ))
            ) : (
                // CARD VIEW
                <div className="grid grid-cols-2 gap-2">
                     {availablePlayers.map((player, idx) => (
                        <div 
                            key={idx}
                            draggable
                            onDragStart={(e) => onDragStart(e, 'NAME', player)}
                            className="group relative flex flex-col items-center justify-center bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/50 p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all aspect-[4/3]"
                        >
                             <User size={20} className="text-zinc-600 group-hover:text-yellow-500 mb-2 transition-colors" />
                             <span className="font-rajdhani font-bold text-white text-xs text-center leading-tight break-words w-full">{player}</span>
                             
                             <button 
                                onClick={() => removeAvailablePlayer(idx)} 
                                className="absolute top-1 right-1 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                             >
                                <Trash2 size={10} />
                             </button>
                        </div>
                     ))}
                </div>
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

      {/* Main Board Container */}
      <div 
        ref={boardRef}
        className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none"></div>

        {/* Toolbar - Marked no-print to hide from image capture if desired, though user might want buttons visible? No, usually not. */}
        <div className="absolute top-6 right-6 z-20 flex gap-3 no-print" data-html2canvas-ignore>
             
             {/* Style Toggle */}
             <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-700 mr-2">
                <button 
                  onClick={() => setSlotStyle('PORTRAIT')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold uppercase tracking-wider ${slotStyle === 'PORTRAIT' ? 'bg-zinc-800 text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Estilo Retrato"
                >
                  <RectangleVertical size={14} /> <span className="hidden sm:inline">Retrato</span>
                </button>
                <button 
                  onClick={() => setSlotStyle('LANDSCAPE')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold uppercase tracking-wider ${slotStyle === 'LANDSCAPE' ? 'bg-zinc-800 text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Estilo Card"
                >
                  <RectangleHorizontal size={14} /> <span className="hidden sm:inline">Card</span>
                </button>
             </div>

             <button 
                onClick={resetBoard} 
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:text-red-500 text-zinc-400 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all"
            >
                <FilePlus size={14} /> Novo
            </button>
            <button 
                onClick={handleSavePNG} 
                disabled={isCapturing}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
                <Download size={14} /> {isCapturing ? '...' : 'PNG'}
            </button>
        </div>

        {/* Title for the export (Visible only in board or always? Let's add a small watermark or title) */}
        <div className="absolute top-6 left-8 z-10 opacity-50">
           <h4 className="font-rajdhani font-bold text-zinc-600 text-sm tracking-[0.2em] uppercase">TS SCOUT PRO // ROSTER BUILDER</h4>
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 mt-8">
            
            {/* Coach Slot */}
            <div className="flex justify-center w-full mb-4">
                {slots.filter(s => s.type === 'COACH').map(slot => (
                     <SlotComponent key={slot.id} slot={slot} style={slotStyle} onDrop={onDrop} onClear={clearSlot} />
                ))}
            </div>

            {/* Players Slots - ROW 1 (MAIN) */}
            <div className="w-full flex flex-col gap-2 items-center">
                <div className="w-full flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Lineup Principal</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                </div>
                <div className={`flex flex-wrap justify-center w-full ${slotStyle === 'PORTRAIT' ? 'gap-6 md:gap-10' : 'gap-4'}`}>
                    {slots.filter(s => s.type === 'PLAYER' && s.id <= 5).map(slot => (
                        <SlotComponent key={slot.id} slot={slot} style={slotStyle} onDrop={onDrop} onClear={clearSlot} />
                    ))}
                </div>
            </div>

            {/* Players Slots - ROW 2 (OPTION 2) */}
            <div className="w-full flex flex-col gap-2 items-center mt-4">
                 <div className="w-full flex items-center gap-4 mb-2 opacity-50">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                        <ArrowDown size={10} /> Opção 2 / Reservas
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                </div>
                <div className={`flex flex-wrap justify-center w-full opacity-80 hover:opacity-100 transition-opacity ${slotStyle === 'PORTRAIT' ? 'gap-6 md:gap-10' : 'gap-4'}`}>
                    {slots.filter(s => s.type === 'PLAYER' && s.id > 5).map(slot => (
                        <SlotComponent key={slot.id} slot={slot} style={slotStyle} onDrop={onDrop} onClear={clearSlot} />
                    ))}
                </div>
            </div>

        </div>
      </div>

    </div>
  );
};

const SlotComponent: React.FC<{ 
    slot: RosterSlot; 
    style: 'PORTRAIT' | 'LANDSCAPE';
    onDrop: (e: React.DragEvent, id: number) => void;
    onClear: (id: number) => void;
}> = ({ slot, style, onDrop, onClear }) => {
    
    // Find role color
    const roleConfig = ROLES.find(r => r.label === slot.assignedRole);
    const borderColor = roleConfig ? roleConfig.color.split(' ')[1] : 'border-zinc-800'; // Extract border-color class or default
    const bgColor = roleConfig ? roleConfig.color.split(' ')[0] : 'bg-zinc-900';
    const textColor = roleConfig ? roleConfig.color.split(' ')[2] : 'text-zinc-500';

    // Font size logic based on name length
    const nameLength = slot.assignedName?.length || 0;
    const textSizeClass = nameLength > 12 ? 'text-sm' : 'text-xl';

    if (style === 'LANDSCAPE') {
        return (
            <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, slot.id)}
                className={`
                    relative w-64 h-24 flex items-center bg-zinc-950 rounded-xl border-2 transition-all duration-300 group
                    ${slot.assignedName ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'border-zinc-800 border-dashed opacity-80 hover:opacity-100'}
                `}
            >
                 {/* Left: Icon Area */}
                 <div className={`
                    w-20 h-full flex items-center justify-center border-r transition-colors
                    ${slot.assignedName ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/50'}
                 `}>
                    {slot.type === 'COACH' ? 
                        <MonitorPlay size={32} className={slot.assignedName ? "text-yellow-500" : "text-zinc-700"} /> : 
                        <User size={40} className={slot.assignedName ? "text-yellow-500" : "text-zinc-700"} />
                    }
                 </div>

                 {/* Right: Info Area */}
                 <div className="flex-1 h-full flex flex-col justify-center px-4 relative overflow-hidden">
                    {/* Role Badge (Top Right absolute) */}
                    <div className={`
                        absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border
                        ${slot.assignedRole ? `${bgColor} ${borderColor} ${textColor} border-opacity-50` : 'bg-zinc-900 border-zinc-700 text-zinc-600'}
                    `}>
                        {slot.assignedRole || 'FUNÇÃO'}
                    </div>

                    {slot.assignedName ? (
                        <>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Player</span>
                            <span className={`font-rajdhani font-bold text-white leading-none ${textSizeClass}`}>
                                {slot.assignedName}
                            </span>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); onClear(slot.id); }}
                                className="absolute bottom-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all no-print"
                                data-html2canvas-ignore
                            >
                                <Trash2 size={12} />
                            </button>
                        </>
                    ) : (
                        <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider">
                            Arraste Nome
                        </span>
                    )}
                 </div>
            </div>
        );
    }

    // Default PORTRAIT Style
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
                                className="absolute top-1/2 -translate-y-1/2 right-0 text-zinc-500 hover:text-red-500 opacity-0 group-hover/name:opacity-100 transition-all bg-zinc-900 p-1 rounded-full no-print"
                                data-html2canvas-ignore
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