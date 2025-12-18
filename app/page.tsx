"use client";

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// 1. DATA TYPES
type Player = { 
  id: number; 
  name: string; 
  college: string; 
  position: string; 
  headshot_url?: string; 
  college_logo_url?: string;
  ht?: string; 
  wt?: string; 
  cls?: string; 
};

type DraftSlot = { 
  id: number; 
  pick_number: number; 
  team_name: string; 
  team_abbr: string; 
  team_logo_url?: string;
  round: number;
};

// 2. SUPABASE CONNECTION
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DraftBoard2026() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [draftOrder, setDraftOrder] = useState<DraftSlot[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPos, setSelectedPos] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const positions = ["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S"];

  useEffect(() => {
    async function fetchData() {
      // Fetch players ordered by ID for original Big Board sequence
      const { data: pData } = await supabase
        .from('players')
        .select('*')
        .order('id', { ascending: true });

      // Fetch draft order by pick number
      const { data: oData } = await supabase
        .from('draft_order')
        .select('*')
        .order('pick_number', { ascending: true });
      
      if (pData) setPlayers(pData);
      if (oData) setDraftOrder(oData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDraft = (playerToDraft: Player) => {
    if (draftedPlayers.length >= draftOrder.length) return;
    setPlayers(players.filter(p => p.id !== playerToDraft.id));
    setDraftedPlayers([...draftedPlayers, playerToDraft]);
    setSearchTerm("");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050b1d] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-500 font-black italic tracking-[0.3em] animate-pulse">REBUILDING 2026 BOARD...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050b1d] text-white p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-blue-500 italic uppercase">2026 Mock Draft</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live 2026 Standings & Trade Records</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-700 leading-none">{draftedPlayers.length}</p>
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Picks Logged</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: DRAFT RESULTS */}
        <section className="lg:col-span-5 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-black mb-6 text-slate-400 uppercase italic">Draft Results</h2>
          <div className="space-y-3 h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            {draftOrder.map((slot, index) => {
              const isCurrent = draftedPlayers.length === index;
              const playerPicked = draftedPlayers[index];
              const isNewRound = index === 0 || draftOrder[index - 1].round !== slot.round;

              return (
                <div key={slot.id || index}>
                  {isNewRound && (
                    <div className="flex items-center gap-4 mt-8 mb-4">
                      <div className="h-px flex-1 bg-slate-800"></div>
                      <h3 className="text-blue-500 font-black italic text-xs uppercase tracking-[0.2em] whitespace-nowrap">
                        Round {slot.round}
                      </h3>
                      <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                  )}

                  <div className={`p-4 rounded-xl border-l-4 transition-all duration-300 ${
                    isCurrent ? "bg-blue-600/15 border-blue-500 scale-[1.02] shadow-lg shadow-blue-900/20" : "bg-slate-800/30 border-slate-700 opacity-80"
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {slot.team_logo_url && <img src={slot.team_logo_url} className="w-10 h-10 object-contain" alt="logo" />}
                        <div>
                          <span className={`text-[10px] font-black uppercase ${isCurrent ? "text-blue-400" : "text-slate-500"}`}>Pick {slot.pick_number}</span>
                          <p className="font-bold text-slate-100 leading-tight">{slot.team_name}</p>
                        </div>
                      </div>
                      
                      {playerPicked && (
                        <div className="text-right animate-in fade-in slide-in-from-right-2">
                          <p className="text-blue-400 font-black text-sm uppercase mb-1 leading-none">{playerPicked.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                            {playerPicked.position} | {playerPicked.college}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: BIG BOARD */}
        <section className="lg:col-span-7 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-400 uppercase italic">Big Board</h2>
              <input
                type="text"
                placeholder="Search prospects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all w-48"
              />
            </div>

            {/* POSITION FILTER BAR */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {positions.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap border ${
                    selectedPos === pos 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                      : "bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-600"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 h-[640px] overflow-y-auto pr-2 custom-scrollbar">
            {players
              .filter(p => {
                const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
                const posMatch = selectedPos === "ALL" || p.position === selectedPos;
                return nameMatch && posMatch;
              })
              .map((player, idx) => (
                <div key={player.id} className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/60 border border-transparent hover:border-slate-700 rounded-xl transition-all group">
                  <div className="flex items-center gap-4">
                    {/* FIXED RANKING: idx + 1 ensures it starts at 01 */}
                    <span className="text-[11px] font-black text-slate-700 w-6">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    
                    <img 
                      src={player.headshot_url || "https://i.imgur.com/vHq0E3M.png"} 
                      className="w-12 h-12 rounded-full object-cover border border-slate-700 bg-slate-950 shadow-inner" 
                      alt={player.name}
                    />
                    
                    <div>
                      <p className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{player.name}</p>
                      <div className="flex items-center gap-2">
                        {/* THE LOGO FIX: Direct container check */}
                        {player.college_logo_url && (
                          <div className="bg-white p-0.5 rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <img 
                              src={player.college_logo_url} 
                              className="w-4 h-4 object-contain" 
                              alt="logo" 
                            />
                          </div>
                        )}
                        
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex items-center gap-1.5 leading-none">
                          <span>{player.position}</span>
                          <span className="text-slate-800">|</span>
                          <span>{player.college}</span>
                          {player.cls && <><span className="text-slate-800">|</span><span className="text-blue-500/60 font-black">{player.cls}</span></>}
                          {player.ht && <><span className="text-slate-800">|</span><span className="text-slate-400">{player.ht}</span></>}
                          {/* THE WEIGHT FIX: Restored using same method as ht/cls */}
                          {player.wt && <><span className="text-slate-800">|</span><span className="text-slate-400">{player.wt} lbs</span></>}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDraft(player)}
                    className="text-[10px] font-black bg-blue-600 text-white px-5 py-2.5 rounded-lg uppercase hover:bg-blue-500 transition-all shadow-md active:scale-95"
                  >
                    Draft
                  </button>
                </div>
              ))}
          </div>
        </section>

      </div>
    </main>
  )
}