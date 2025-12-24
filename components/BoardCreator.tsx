"use client";
import { useState } from 'react';
import PlayerRow from '@/components/PlayerRow';
import PlayerProfile from '@/components/PlayerProfile';
import { Player } from '@/types/draft';

interface BoardCreatorProps {
  players: Player[];
  rankedPlayers: Player[];
  setRankedPlayers: (players: Player[]) => void;
  boardSize: number;
  boardName: string;
  setBoardName: (name: string) => void;
  onComplete: () => void;
  onReset: () => void;
}

export default function BoardCreator({ 
  players, 
  rankedPlayers, 
  setRankedPlayers, 
  boardSize, 
  boardName, 
  setBoardName, 
  onReset 
}: BoardCreatorProps) {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPos, setSelectedPos] = useState("ALL");
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  const positions = ["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "K", "P", "LS"];

  const handleAdd = (player: Player) => {
    if (rankedPlayers.length >= boardSize) return;
    if (rankedPlayers.find(p => p.id === player.id)) return;
    setRankedPlayers([...rankedPlayers, player]);
  };

  const handleRemove = (id: number) => {
    setRankedPlayers(rankedPlayers.filter(p => p.id !== id));
  };

  const filteredPool = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = selectedPos === "ALL" || p.position === selectedPos;
    const notRanked = !rankedPlayers.find(rp => rp.id === p.id);
    return matchesSearch && matchesPos && notRanked;
  });

  return (
    <main className="h-screen bg-slate-50 text-slate-900 p-8 flex flex-col overflow-hidden">
      {/* Header Area */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center mb-6 shrink-0">
        <div className="flex flex-col text-left">
          <input 
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="text-3xl font-black italic uppercase bg-transparent outline-none text-blue-600 focus:border-b-2 border-blue-600"
          />
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Slotting {rankedPlayers.length} / {boardSize} Prospects
            </p>
            <div className="h-1 w-24 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${(rankedPlayers.length / boardSize) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onReset} 
            className="px-6 py-3 rounded-xl font-black uppercase text-[10px] text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all"
          >
            Change Size
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden pb-4">
        
        {/* LEFT SIDE: Your Ranked Board */}
        <div className="lg:col-span-5 h-full overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black italic uppercase text-sm tracking-tighter">Official Rankings</h3>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {Array.from({ length: boardSize }).map((_, i) => {
              const player = rankedPlayers[i];
              return (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${player ? 'bg-white border-slate-100 shadow-sm group' : 'bg-slate-50/30 border-dashed border-slate-200 opacity-40'}`}>
                  <span className="w-8 text-xl font-black italic text-slate-300 group-hover:text-blue-600">{i + 1}</span>
                  {player ? (
                    <>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                        {player.college_logo_url && <img src={player.college_logo_url} className="w-full h-full object-contain" alt="" />}
                      </div>
                      <div className="flex-grow text-left">
                        <p className="font-black uppercase text-sm italic leading-none">{player.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{player.position} | {player.college}</p>
                      </div>
                      <button onClick={() => handleRemove(player.id)} className="text-slate-300 hover:text-red-500 font-black uppercase text-[10px] px-2">Remove</button>
                    </>
                  ) : <div className="flex-grow py-3 px-2"><div className="h-1.5 w-20 bg-slate-200 rounded-full" /></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Filterable Player Pool */}
        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="space-y-4 mb-4 shrink-0">
            <input 
              placeholder="SEARCH PROSPECTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm outline-none font-black italic uppercase text-sm focus:ring-2 ring-blue-500/20"
            />
            {/* Filter Bar */}
            <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
              {positions.map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                    selectedPos === pos ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {filteredPool.map((player, index) => (
              <PlayerRow 
                key={player.id} 
                player={player} 
                rank={index + 1} 
                onDraft={() => handleAdd(player)} 
                onViewInfo={() => setViewingPlayer(player)} 
                isTeamNeed={false}
                draftButtonText="SELECT" // Pass this prop to your PlayerRow component
              />
            ))}
          </div>
        </section>
      </div>

      {viewingPlayer && <PlayerProfile player={viewingPlayer} onClose={() => setViewingPlayer(null)} />}
    </main>
  );
}