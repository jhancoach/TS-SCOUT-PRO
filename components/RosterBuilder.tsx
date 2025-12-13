import React, { useState, useRef, useEffect } from 'react';
import { User, Target, Bomb, Crosshair, Crown, Plus, Trash2, MonitorPlay, Download, FilePlus, LayoutGrid, List, RectangleHorizontal, RectangleVertical, ArrowDown, Camera, Upload, Copy, Save, Image as ImageIcon, X, ChevronRight, Undo, Redo, HelpCircle, Info, MousePointerClick, Move } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

interface RosterSlot {
  id: number;
  type: 'PLAYER' | 'COACH';
  label: string;
  assignedName: string | null;
  assignedRole: string | null;
  assignedImage: string | null;
}

interface SavedRoster {
  id: string;
  name: string;
  timestamp: number;
  slots: RosterSlot[];
  teamLogo: string | null;
}

const ROLES = [
  { id: 'rush1', label: 'RUSH 1', icon: <Target size={14} />, color: 'bg-red-500/20 border-red-500 text-red-500' },
  { id: 'rush2', label: 'RUSH 2', icon: <Target size={14} />, color: 'bg-red-500/20 border-red-500 text-red-500' },
  { id: 'cpt', label: 'CPT', icon: <Crown size={14} />, color: 'bg-yellow-500/20 border-yellow-500 text-yellow-500' },
  { id: 'bomba', label: 'BOMBA', icon: <Bomb size={14} />, color: 'bg-orange-500/20 border-orange-500 text-orange-500' },
  { id: 'sniper', label: 'SNIPER', icon: <Crosshair size={14} />, color: 'bg-cyan-500/20 border-cyan-500 text-cyan-500' },
  { id: 'coach', label: 'COACH', icon: <MonitorPlay size={14} />, color: 'bg-purple-500/20 border-purple-500 text-purple-500' },
];

const INITIAL_SLOTS: RosterSlot[] = [
    // Coach
    { id: 0, type: 'COACH', label: 'COACH', assignedName: null, assignedRole: 'COACH', assignedImage: null },
    
    // Main Lineup (Reduced to 4)
    { id: 1, type: 'PLAYER', label: 'JOGADOR 1', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 2, type: 'PLAYER', label: 'JOGADOR 2', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 3, type: 'PLAYER', label: 'JOGADOR 3', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 4, type: 'PLAYER', label: 'JOGADOR 4', assignedName: null, assignedRole: null, assignedImage: null },
    
    // Secondary Lineup / Reserves
    { id: 6, type: 'PLAYER', label: 'OPÇÃO 1', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 7, type: 'PLAYER', label: 'OPÇÃO 2', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 8, type: 'PLAYER', label: 'OPÇÃO 3', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 9, type: 'PLAYER', label: 'OPÇÃO 4', assignedName: null, assignedRole: null, assignedImage: null },
    { id: 10, type: 'PLAYER', label: 'OPÇÃO 5', assignedName: null, assignedRole: null, assignedImage: null },
];

export const RosterBuilder: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [rosterName, setRosterName] = useState('NOME DO ELENCO');
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'LIST' | 'CARDS'>('LIST');
  const [slotStyle, setSlotStyle] = useState<'PORTRAIT' | 'LANDSCAPE'>('LANDSCAPE');
  const [showHelp, setShowHelp] = useState(false);
  
  // Mobile/Click Selection State
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);

  // Persistence for Saved Rosters
  const [savedRosters, setSavedRosters] = useState<SavedRoster[]>(() => {
    const saved = localStorage.getItem('ts_saved_rosters');
    return saved ? JSON.parse(saved) : [];
  });

  const [availablePlayers, setAvailablePlayers] = useState<string[]>([
    'BLACK', 'FNX', 'GUIME', 'ERICKING', 'PROZIN', 
    'JUCA', 'THEUS7', 'PITBULL', 'NANDO9', 'BYTE33', 
    'HONEY', 'WLIU', 'LOST', 'CAUAN', 'MOTOVEA',
    'COACH BRN', 'COACH PUTSGRILO'
  ]);
  
  // Slots State & History
  const [slots, setSlots] = useState<RosterSlot[]>(INITIAL_SLOTS);
  const [history, setHistory] = useState<RosterSlot[][]>([INITIAL_SLOTS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Save to LocalStorage whenever savedRosters changes
  useEffect(() => {
    localStorage.setItem('ts_saved_rosters', JSON.stringify(savedRosters));
  }, [savedRosters]);

  const updateBoardState = (newSlots: RosterSlot[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSlots);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSlots(newSlots);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setSlots(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setSlots(history[newIndex]);
    }
  };

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
    assignDataToSlot(slotId, data.type, data.value);
  };

  const assignDataToSlot = (slotId: number, type: 'NAME' | 'ROLE', value: string) => {
    const newSlots = slots.map(slot => {
      if (slot.id === slotId) {
        if (type === 'NAME') {
          return { ...slot, assignedName: value };
        } else if (type === 'ROLE') {
          return { ...slot, assignedRole: value };
        }
      }
      return slot;
    });
    updateBoardState(newSlots);
  };

  // Click Handler for Mobile/Desktop Modal Selection
  const handleSlotClick = (slotId: number) => {
    setActiveSlotId(slotId);
  };

  const handleSelectionFromModal = (type: 'NAME' | 'ROLE', value: string) => {
    if (activeSlotId !== null) {
        assignDataToSlot(activeSlotId, type, value);
        if(type === 'NAME') setActiveSlotId(null);
    }
  };

  const handleImageUpload = (slotId: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlots = slots.map(slot => 
        slot.id === slotId ? { ...slot, assignedImage: reader.result as string } : slot
      );
      updateBoardState(newSlots);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setTeamLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const clearSlot = (slotId: number) => {
    const newSlots = slots.map(s => s.id === slotId ? { 
        ...s, 
        assignedName: null, 
        assignedRole: s.type === 'COACH' ? 'COACH' : null,
        assignedImage: null
    } : s);
    updateBoardState(newSlots);
  };

  const duplicateSlot = (sourceId: number) => {
    const sourceSlot = slots.find(s => s.id === sourceId);
    if (!sourceSlot || !sourceSlot.assignedName) return;

    // Find first empty slot of same type (or just any empty player slot if it's a player)
    const targetSlot = slots.find(s => 
        s.id !== sourceId && 
        s.type === sourceSlot.type && 
        s.assignedName === null
    );

    if (targetSlot) {
        const newSlots = slots.map(s => s.id === targetSlot.id ? {
            ...s,
            assignedName: sourceSlot.assignedName,
            assignedRole: sourceSlot.assignedRole,
            assignedImage: sourceSlot.assignedImage
        } : s);
        updateBoardState(newSlots);
    } else {
        alert("Não há slots vazios disponíveis para duplicar.");
    }
  };

  const saveCurrentRoster = () => {
     const newSave: SavedRoster = {
         id: Date.now().toString(),
         name: rosterName,
         timestamp: Date.now(),
         slots: slots,
         teamLogo: teamLogo
     };
     setSavedRosters([newSave, ...savedRosters]);
  };

  const loadRoster = (saved: SavedRoster) => {
     if (window.confirm(`Carregar o elenco "${saved.name}"? As alterações atuais serão perdidas.`)) {
         updateBoardState(saved.slots);
         setRosterName(saved.name);
         setTeamLogo(saved.teamLogo);
     }
  };

  const deleteSavedRoster = (id: string) => {
      if (window.confirm("Apagar este elenco salvo?")) {
        setSavedRosters(savedRosters.filter(r => r.id !== id));
      }
  };

  const resetBoard = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o elenco?')) {
        const newSlots = slots.map(s => ({ 
            ...s, 
            assignedName: null, 
            assignedRole: s.type === 'COACH' ? 'COACH' : null,
            assignedImage: null
        }));
        updateBoardState(newSlots);
        setRosterName('NOME DO ELENCO');
        setTeamLogo(null);
    }
  };

  const handleSavePNG = async () => {
    if (boardRef.current) {
        setIsCapturing(true);
        try {
            const canvas = await html2canvas(boardRef.current, {
                backgroundColor: '#09090b', // Zinc-950 background
                scale: 2, // High resolution
                logging: false,
                useCORS: true,
                ignoreElements: (element: Element) => {
                   return element.classList.contains('no-print');
                }
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `TS-SCOUT-${rosterName.replace(/\s+/g, '-')}-${Date.now()}.png`;
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
      
      {/* Sidebar Controls - Hidden on print */}
      <div className="lg:col-span-1 space-y-6 no-print">
        
        {/* Name Input */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl relative group">
          <div className="absolute -top-3 left-4 bg-zinc-900 px-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
             <Info size={10} /> Passo 1
          </div>
          <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
            <Plus size={14} /> Adicionar Jogador
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="DIGITE O NICK"
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm focus:border-yellow-500 focus:outline-none font-rajdhani font-bold uppercase"
            />
            <button 
              onClick={handleAddPlayer}
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded transition-colors"
              title="Adicionar à lista"
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 italic">Adicione o nome para o banco de reservas abaixo.</p>
        </div>

        {/* Saved Rosters */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                    <Save size={14} /> Elencos Salvos
                 </h3>
                 <button 
                    onClick={saveCurrentRoster}
                    className="text-xs bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-1 rounded font-bold uppercase"
                 >
                    Salvar Atual
                 </button>
            </div>
            
            <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                {savedRosters.length === 0 && <p className="text-zinc-600 text-xs italic">Nenhum elenco salvo.</p>}
                {savedRosters.map(saved => (
                    <div key={saved.id} className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-800 hover:border-zinc-600 group">
                        <div onClick={() => loadRoster(saved)} className="cursor-pointer flex-1">
                            <p className="text-white text-xs font-bold font-rajdhani uppercase truncate w-32">{saved.name}</p>
                            <p className="text-[10px] text-zinc-500">{new Date(saved.timestamp).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => deleteSavedRoster(saved.id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Available Players List */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-1 flex flex-col min-h-[300px] relative">
          <div className="absolute -top-3 left-4 bg-zinc-900 px-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
             <Info size={10} /> Passo 2
          </div>
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
              <p className="text-zinc-600 text-xs italic text-center py-4">Sem jogadores disponíveis. Adicione no campo acima.</p>
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
          <p className="text-[10px] text-zinc-600 mt-2 text-center border-t border-zinc-800 pt-2">
            Arraste para os slots ou clique no slot para selecionar
          </p>
        </div>

        {/* Roles Palette */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl relative">
          <div className="absolute -top-3 left-4 bg-zinc-900 px-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
             <Info size={10} /> Passo 3
          </div>
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
        className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-8 relative overflow-hidden flex flex-col items-center justify-start min-h-[600px]"
      >
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none"></div>

        {/* Toolbar - Improved responsiveness */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap justify-end gap-2 no-print" data-html2canvas-ignore>
             {/* Help Button */}
             <button 
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-yellow-500 hover:text-yellow-500 text-zinc-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all mr-2"
                title="Como usar"
             >
                <HelpCircle size={14} /> <span className="hidden sm:inline">Ajuda</span>
             </button>

             {/* Undo/Redo Controls */}
             <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-700 mr-2">
                <button 
                    onClick={handleUndo} 
                    disabled={historyIndex === 0}
                    className={`p-1.5 rounded-md transition-all ${historyIndex === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Desfazer"
                >
                    <Undo size={14} />
                </button>
                <button 
                    onClick={handleRedo} 
                    disabled={historyIndex === history.length - 1}
                    className={`p-1.5 rounded-md transition-all ${historyIndex === history.length - 1 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Refazer"
                >
                    <Redo size={14} />
                </button>
             </div>

             {/* Style Toggle */}
             <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-700">
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

             <div className="flex gap-2">
                <button 
                    onClick={resetBoard} 
                    className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:text-red-500 text-zinc-400 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
                >
                    <FilePlus size={14} /> <span className="hidden sm:inline">Novo</span>
                </button>
                <button 
                    onClick={handleSavePNG} 
                    disabled={isCapturing}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                    <Download size={14} /> {isCapturing ? '...' : 'PNG'}
                </button>
             </div>
        </div>

        {/* Header Area with Editable Title and Logo Upload */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center md:justify-start mb-8 border-b border-zinc-800 pb-6 mt-12 md:mt-0">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-4xl px-4">
                
                {/* Logo Uploader */}
                <div 
                    className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl border-2 border-dashed border-zinc-700 hover:border-yellow-500 bg-zinc-950 flex items-center justify-center cursor-pointer group overflow-hidden transition-all"
                    onClick={() => logoInputRef.current?.click()}
                    title="Clique para adicionar o Logo do Time"
                >
                    <input 
                        type="file" 
                        ref={logoInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                    />
                    {teamLogo ? (
                        <>
                            <img src={teamLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={20} className="text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-zinc-600 group-hover:text-yellow-500 transition-colors">
                            <ImageIcon size={24} />
                            <span className="text-[8px] uppercase font-bold">Logo</span>
                        </div>
                    )}
                </div>

                {/* Editable Title - Responsive Text Size */}
                <div className="flex-1 text-center md:text-left w-full">
                    <input 
                        type="text"
                        value={rosterName}
                        onChange={(e) => setRosterName(e.target.value.toUpperCase())}
                        className="w-full bg-transparent text-2xl sm:text-3xl md:text-5xl font-black font-rajdhani text-white uppercase tracking-tight focus:outline-none focus:border-b focus:border-yellow-500 placeholder-zinc-700 text-center md:text-left"
                        placeholder="NOME DO ELENCO"
                        title="Clique para editar o nome do elenco"
                    />
                    <p className="text-zinc-500 text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase mt-1">
                        TS SCOUT PRO // ROSTER BUILDER
                    </p>
                </div>
            </div>
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
            
            {/* Coach Slot */}
            <div className="flex justify-center w-full mb-4">
                {slots.filter(s => s.type === 'COACH').map(slot => (
                     <SlotComponent 
                        key={slot.id} 
                        slot={slot} 
                        style={slotStyle} 
                        onDrop={onDrop} 
                        onClear={clearSlot} 
                        onImageUpload={handleImageUpload} 
                        onDuplicate={duplicateSlot}
                        onSlotClick={handleSlotClick} 
                    />
                ))}
            </div>

            {/* Players Slots - ROW 1 (MAIN - NOW ONLY 4) */}
            <div className="w-full flex flex-col gap-2 items-center">
                <div className="w-full flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Lineup Principal</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                </div>
                <div className={`flex flex-wrap justify-center w-full ${slotStyle === 'PORTRAIT' ? 'gap-6 md:gap-10' : 'gap-4'}`}>
                    {slots.filter(s => s.type === 'PLAYER' && s.id <= 4).map(slot => (
                        <SlotComponent 
                            key={slot.id} 
                            slot={slot} 
                            style={slotStyle} 
                            onDrop={onDrop} 
                            onClear={clearSlot} 
                            onImageUpload={handleImageUpload} 
                            onDuplicate={duplicateSlot}
                            onSlotClick={handleSlotClick}
                        />
                    ))}
                </div>
            </div>

            {/* Players Slots - ROW 2 (OPTION 2 / RESERVES) */}
            <div className="w-full flex flex-col gap-2 items-center mt-4">
                 <div className="w-full flex items-center gap-4 mb-2 opacity-50">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                        <ArrowDown size={10} /> Opção 2 / Reservas
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                </div>
                <div className={`flex flex-wrap justify-center w-full opacity-80 hover:opacity-100 transition-opacity ${slotStyle === 'PORTRAIT' ? 'gap-6 md:gap-10' : 'gap-4'}`}>
                    {slots.filter(s => s.type === 'PLAYER' && s.id > 4).map(slot => (
                        <SlotComponent 
                            key={slot.id} 
                            slot={slot} 
                            style={slotStyle} 
                            onDrop={onDrop} 
                            onClear={clearSlot} 
                            onImageUpload={handleImageUpload} 
                            onDuplicate={duplicateSlot}
                            onSlotClick={handleSlotClick}
                        />
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* HELP GUIDE MODAL */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowHelp(false)}>
            <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <h3 className="font-rajdhani font-bold text-2xl text-white uppercase flex items-center gap-3">
                        <HelpCircle className="text-yellow-500" /> Guia Rápido
                    </h3>
                    <button onClick={() => setShowHelp(false)} className="text-zinc-500 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0 font-bold">1</div>
                            <div>
                                <h4 className="text-white font-bold uppercase mb-1">Adicione Jogadores</h4>
                                <p className="text-zinc-400 text-sm">Digite o nickname na barra lateral esquerda e clique em <strong>+</strong> para adicionar ao Banco de Reservas.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0 font-bold">2</div>
                            <div>
                                <h4 className="text-white font-bold uppercase mb-1">Preencha o Elenco</h4>
                                <p className="text-zinc-400 text-sm">
                                    <span className="flex items-center gap-1 mb-1"><Move size={12}/> <strong>PC:</strong> Arraste o nome e a função para o slot.</span>
                                    <span className="flex items-center gap-1"><MousePointerClick size={12}/> <strong>Mobile:</strong> Toque no slot para abrir o menu de seleção rápida.</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0 font-bold">3</div>
                            <div>
                                <h4 className="text-white font-bold uppercase mb-1">Personalize</h4>
                                <p className="text-zinc-400 text-sm">
                                    Clique no <strong>ícone do boneco</strong> dentro do card para fazer upload da foto do jogador.
                                    Clique na área do <strong>Logo</strong> no topo para adicionar o escudo do time.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                             <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Atalhos e Ícones</h4>
                             <ul className="space-y-2 text-sm text-zinc-300">
                                <li className="flex items-center gap-2"><Copy size={14} className="text-zinc-500" /> <strong>Duplicar:</strong> Copia o jogador para o próximo slot vazio.</li>
                                <li className="flex items-center gap-2"><Trash2 size={14} className="text-zinc-500" /> <strong>Limpar:</strong> Remove nome, foto e função do slot.</li>
                                <li className="flex items-center gap-2"><Undo size={14} className="text-zinc-500" /> <strong>Desfazer:</strong> Reverte a última ação.</li>
                                <li className="flex items-center gap-2"><Download size={14} className="text-yellow-500" /> <strong>PNG:</strong> Baixa a imagem em alta qualidade.</li>
                             </ul>
                        </div>
                        
                        <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                            <p className="text-yellow-500 text-xs font-bold uppercase text-center">
                                Dica Pro: Use o botão "Salvar Atual" para guardar diferentes variações de elenco e carregar depois.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
                    <button 
                        onClick={() => setShowHelp(false)}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold uppercase text-sm transition-colors"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* SELECTION MODAL (MOBILE/DESKTOP) */}
      {activeSlotId !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
            <div className="bg-zinc-900 w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-zinc-800 shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
                    <h3 className="font-rajdhani font-bold text-xl text-white uppercase flex items-center gap-2">
                        <Target size={18} className="text-yellow-500" /> Editar Slot
                    </h3>
                    <button 
                        onClick={() => setActiveSlotId(null)}
                        className="text-zinc-500 hover:text-white p-1"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Players Section */}
                    <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Selecione o Jogador</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {availablePlayers.map((player, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectionFromModal('NAME', player)}
                                    className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/50 p-2 rounded text-sm font-bold font-rajdhani text-white text-left transition-all"
                                >
                                    {player}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Roles Section */}
                    <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Selecione a Função</h4>
                        <div className="grid grid-cols-2 gap-2">
                             {ROLES.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleSelectionFromModal('ROLE', role.label)}
                                    className={`p-2 rounded border flex items-center gap-2 transition-all text-xs font-bold ${role.color.replace('bg-', 'bg-opacity-10 bg-')}`}
                                >
                                    {role.icon} {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                 <div className="p-4 bg-zinc-950 border-t border-zinc-800 rounded-b-2xl">
                    <button 
                        onClick={() => setActiveSlotId(null)}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded font-rajdhani uppercase tracking-wider"
                    >
                        Concluir
                    </button>
                 </div>
            </div>
        </div>
      )}

    </div>
  );
};

const SlotComponent: React.FC<{ 
    slot: RosterSlot; 
    style: 'PORTRAIT' | 'LANDSCAPE';
    onDrop: (e: React.DragEvent, id: number) => void;
    onClear: (id: number) => void;
    onImageUpload: (id: number, file: File) => void;
    onDuplicate: (id: number) => void;
    onSlotClick: (id: number) => void;
}> = ({ slot, style, onDrop, onClear, onImageUpload, onDuplicate, onSlotClick }) => {
    
    // Find role color
    const roleConfig = ROLES.find(r => r.label === slot.assignedRole);
    const borderColor = roleConfig ? roleConfig.color.split(' ')[1] : 'border-zinc-800'; // Extract border-color class or default
    const bgColor = roleConfig ? roleConfig.color.split(' ')[0] : 'bg-zinc-900';
    const textColor = roleConfig ? roleConfig.color.split(' ')[2] : 'text-zinc-500';

    // Font size logic based on name length
    const nameLength = slot.assignedName?.length || 0;
    const textSizeClass = nameLength > 12 ? 'text-sm' : 'text-xl';

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(slot.id, file);
        }
    };

    const triggerFileInput = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the name select modal
        fileInputRef.current?.click();
    };

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
                 {/* Left: Icon / Image Area */}
                 <div 
                    onClick={triggerFileInput}
                    className={`
                        w-20 h-full flex items-center justify-center border-r transition-colors overflow-hidden relative cursor-pointer group/icon shrink-0
                        ${slot.assignedName ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/50'}
                    `}
                    title="Clique para adicionar foto"
                 >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                    
                    {slot.assignedImage ? (
                        <img src={slot.assignedImage} alt="Player" className="w-full h-full object-cover" />
                    ) : (
                        slot.type === 'COACH' ? 
                            <MonitorPlay size={32} className={slot.assignedName ? "text-yellow-500" : "text-zinc-700"} /> : 
                            <User size={40} className={slot.assignedName ? "text-yellow-500" : "text-zinc-700"} />
                    )}

                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                        <Camera size={18} className="text-white" />
                    </div>
                 </div>

                 {/* Right: Info Area (Clickable for Modal) */}
                 <div 
                    onClick={() => onSlotClick(slot.id)}
                    className="flex-1 h-full flex flex-col justify-center px-4 relative overflow-hidden cursor-pointer hover:bg-zinc-900/50 transition-colors"
                    title="Clique para editar nome/função"
                 >
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
                            
                            {/* Actions Group (No Print) */}
                            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all no-print" data-html2canvas-ignore>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDuplicate(slot.id); }}
                                    className="text-zinc-500 hover:text-white p-1 rounded-full bg-zinc-900 border border-zinc-700"
                                    title="Duplicar para próximo slot vazio"
                                >
                                    <Copy size={10} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onClear(slot.id); }}
                                    className="text-zinc-500 hover:text-red-500 p-1 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-900"
                                    title="Limpar slot"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider">
                            Toque para Editar
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
            {/* Role Badge (Top) - Clickable to open modal */}
            <div 
                onClick={() => onSlotClick(slot.id)}
                className={`
                    absolute -top-3 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg cursor-pointer
                    ${slot.assignedRole ? `${bgColor} ${borderColor} ${textColor} border-opacity-50` : 'bg-zinc-950 border-zinc-800 text-zinc-600'}
                `}
                title="Clique para alterar função"
            >
                {slot.assignedRole || 'FUNÇÃO'}
            </div>

            {/* Main Character Body (Visual Representation) */}
            <div className={`
                w-full h-full rounded-2xl border-2 flex flex-col items-center justify-end overflow-hidden relative group bg-zinc-950
                ${slot.assignedName ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-zinc-800 border-dashed'}
            `}>
                {/* Silhouette / Icon / Image Area */}
                <div 
                    onClick={triggerFileInput}
                    className="absolute inset-0 flex items-center justify-center text-zinc-800 group-hover:text-zinc-700 transition-colors cursor-pointer group/icon bg-zinc-950/50"
                    title="Clique para adicionar foto"
                >
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />

                    {slot.assignedImage ? (
                        <img src={slot.assignedImage} alt="Player" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        slot.type === 'COACH' ? <MonitorPlay size={64} strokeWidth={1} /> : <User size={80} strokeWidth={1} />
                    )}

                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                        <Upload size={24} className="text-white drop-shadow-md" />
                    </div>
                </div>

                {/* Name Tag (Bottom) - Clickable for Modal */}
                <div 
                    onClick={() => onSlotClick(slot.id)}
                    className={`
                        w-full py-4 min-h-[64px] flex items-center justify-center text-center z-10 border-t transition-colors cursor-pointer hover:bg-zinc-900
                        ${slot.assignedName ? 'bg-zinc-900/90 border-yellow-500/50' : 'bg-zinc-950/90 border-zinc-800'}
                    `}
                    title="Clique para editar nome"
                >
                    {slot.assignedName ? (
                        <div className="group/name relative w-full px-2">
                             <span className={`font-rajdhani font-bold text-white block leading-tight break-words ${textSizeClass}`}>
                                {slot.assignedName}
                            </span>
                            
                             {/* Actions Group (No Print) */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 flex flex-col gap-1 opacity-0 group-hover/name:opacity-100 transition-all no-print bg-zinc-900/80 p-1 rounded-l-md" data-html2canvas-ignore>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDuplicate(slot.id); }}
                                    className="text-zinc-400 hover:text-white p-1"
                                    title="Duplicar"
                                >
                                    <Copy size={12} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onClear(slot.id); }}
                                    className="text-zinc-400 hover:text-red-500 p-1"
                                    title="Limpar"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider pointer-events-none">
                            Toque para Editar
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};