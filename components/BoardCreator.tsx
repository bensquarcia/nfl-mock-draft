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
  onComplete: () => void;
  onReset: () => void;
}

export default function BoardCreator({ 
  players, 
  rankedPlayers, 
  setRankedPlayers, 
  boardSize, 
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
    <main className="h-[calc(100vh-80px)] bg-transparent text-slate-900 px-8 pb-8 flex flex-col overflow-hidden">
      
      {/* Mini Progress Bar & Controls Area */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-end mb-6 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                Board Progress
             </span>
             <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              {rankedPlayers.length} / {boardSize} Prospects Ranked
            </p>
          </div>
          <div className="h-1.5 w-64 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
              style={{ width: `${(rankedPlayers.length / boardSize) * 100}%` }}
            />
          </div>
        </div>

        <button 
          onClick={onReset} 
          className="px-5 py-2.5 rounded-xl font-black uppercase text-[10px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-100 transition-all active:scale-95"
        >
          Reset Board Size
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
        
        {/* LEFT SIDE: Your Ranked Board */}
        <div className="lg:col-span-5 h-full overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black italic uppercase text-sm tracking-tighter text-slate-700">Official Rankings</h3>
            <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-100 uppercase">TOP {boardSize}</span>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {Array.from({ length: boardSize }).map((_, i) => {
              const player = rankedPlayers[i];
              return (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${player ? 'bg-white border-slate-100 shadow-sm group' : 'bg-slate-50/30 border-dashed border-slate-200 opacity-40'}`}>
                  {/* DARKENED RANK NUMBER */}
                  <span className="w-8 text-xl font-black italic text-slate-600 group-hover:text-blue-600 transition-colors">{i + 1}</span>
                  {player ? (
                    <>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                        {player.college_logo_url && <img src={player.college_logo_url} className="w-full h-full object-contain" alt="" />}
                      </div>
                      <div className="flex-grow text-left">
                        <p className="font-black uppercase text-sm italic leading-none text-slate-800">{player.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{player.position} | {player.college}</p>
                      </div>
                      <button 
                        onClick={() => handleRemove(player.id)} 
                        className="text-slate-400 hover:text-red-500 font-black uppercase text-[9px] tracking-widest px-2 transition-colors"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div className="flex-grow py-3 px-2">
                      <div className="h-1.5 w-20 bg-slate-100 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Filterable Player Pool */}
        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="space-y-4 mb-4 shrink-0">
            <div className="relative">
              <input 
                placeholder="SEARCH PROSPECTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                /* DARKENED TYPING AND PLACEHOLDER */
                className="w-full bg-white border border-slate-200 pl-12 pr-6 py-4 rounded-2xl shadow-sm outline-none font-black italic uppercase text-sm focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all text-slate-900 placeholder:text-slate-500"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            
            {/* Filter Bar */}
            <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
              {positions.map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                    selectedPos === pos 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {filteredPool.map((player, index) => (
              <PlayerRow 
                key={player.id} 
                player={player} 
                rank={index + 1} 
                onDraft={() => handleAdd(player)} 
                onViewInfo={() => setViewingPlayer(player)} 
                isTeamNeed={false}
                draftButtonText="SELECT"
              />
            ))}
            {filteredPool.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="font-black uppercase text-slate-400 italic tracking-widest">No Prospects Found</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {viewingPlayer && <PlayerProfile player={viewingPlayer} onClose={() => setViewingPlayer(null)} />}
    </main>
  );
}