"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Player, DraftSlot } from '@/types/draft';
import PlayerRow from '@/components/PlayerRow';
import DraftResults from '@/components/DraftResults';
import TradeModal from '@/components/TradeModal';

type GameState = "START" | "DRAFT" | "RESULTS";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [maxRounds, setMaxRounds] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [draftOrder, setDraftOrder] = useState<DraftSlot[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [userTeam, setUserTeam] = useState("NY Giants");
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [history, setHistory] = useState<{drafted: Player[], pool: Player[]}[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: pData } = await supabase.from('players').select('*').order('id');
      const { data: dData } = await supabase.from('draft_order').select('*').order('slot_number');
      if (pData) setPlayers(pData);
      if (dData) setDraftOrder(dData);
    }
    fetchData();
  }, []);

  const startDraft = (rounds: number) => {
    setMaxRounds(rounds);
    setGameState("DRAFT");
  };

  const totalPicksInMode = draftOrder.filter(p => p.round <= maxRounds).length;

  const handleDraftPlayer = (player: Player) => {
    if (draftedPlayers.length < totalPicksInMode) {
      const nextDrafted = [...draftedPlayers, player];
      setHistory([...history, { drafted: draftedPlayers, pool: players }]);
      setDraftedPlayers(nextDrafted);
      setPlayers(players.filter(p => p.id !== player.id));

      if (nextDrafted.length === totalPicksInMode) {
        setTimeout(() => setGameState("RESULTS"), 800);
      }
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setDraftedPlayers(lastState.drafted);
      setPlayers(lastState.pool);
      setHistory(history.slice(0, -1));
    }
  };

  /**
   * FIXED TRADE LOGIC: 
   * Performs a clean swap where team names AND their needs travel with the pick.
   */
  const handleConfirmTrade = (userPicks: DraftSlot[], cpuPicks: DraftSlot[], cpuTeam: string) => {
    // 1. Capture current team needs to ensure they follow the team
    const userTeamNeeds = draftOrder.find(p => p.current_team_name === userTeam)?.needs || [];
    const cpuTeamNeeds = draftOrder.find(p => p.current_team_name === cpuTeam)?.needs || [];

    // 2. Map through the draft order to perform a clean swap
    const updatedOrder = draftOrder.map(pick => {
      const isUserGivingThisAway = userPicks.some(p => p.slot_number === pick.slot_number);
      const isCpuGivingThisAway = cpuPicks.some(p => p.slot_number === pick.slot_number);

      if (isUserGivingThisAway) {
        // Reassign User's pick to CPU only
        return { 
          ...pick, 
          current_team_name: cpuTeam,
          needs: cpuTeamNeeds 
        };
      } 
      
      if (isCpuGivingThisAway) {
        // Reassign CPU's pick to User only
        return { 
          ...pick, 
          current_team_name: userTeam,
          needs: userTeamNeeds 
        };
      }

      return pick; // Unchanged pick
    });

    setDraftOrder(updatedOrder);
    setIsTradeModalOpen(false);
  };

  const currentPick = draftOrder[draftedPlayers.length];
  const currentNeeds = (currentPick?.needs || []) as string[];
  
  const positions = ["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "K", "P", "LS"];
  const filteredPlayers = selectedPosition === "ALL" 
    ? players 
    : players.filter(p => p.position === selectedPosition);

  // START SCREEN
  if (gameState === "START") {
    return (
      <main className="h-screen bg-[#0f172a] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8 bg-slate-900/50 p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl text-white">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Mock Draft <span className="text-white/20">2026</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select Draft Length</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 7].map(r => (
              <button
                key={r}
                onClick={() => startDraft(r)}
                className="bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 py-4 rounded-xl font-black text-xl transition-all active:scale-95"
              >
                {r === 7 ? "Full" : r}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 italic uppercase font-bold tracking-widest">Select number of rounds</p>
        </div>
      </main>
    );
  }

  // RESULTS SCREEN
  if (gameState === "RESULTS") {
    return (
      <main className="h-screen bg-[#0f172a] p-12 overflow-y-auto custom-scrollbar text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex justify-between items-end border-b border-slate-800 pb-8">
            <div>
              <h1 className="text-5xl font-black italic uppercase text-blue-500">Draft Recap</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">{maxRounds} Round Simulation Complete</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all shadow-lg"
            >
              Start New Draft
            </button>
          </header>
          
          <div className="grid gap-4">
            {draftedPlayers.map((player, idx) => {
              const pickInfo = draftOrder[idx];
              return (
                <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-slate-700 w-12 italic">#{idx + 1}</span>
                    <div className="w-14 h-14 bg-white rounded-lg p-2 flex items-center justify-center shrink-0 shadow-md">
                      <img src={pickInfo?.team_logo_url} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">{player.name}</h3>
                      <p className="text-sm text-slate-500 uppercase font-bold">{player.position} | {player.college}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-500 font-black italic text-xl uppercase">{pickInfo?.team_abbr}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase">Pick {pickInfo?.slot_number}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ACTIVE DRAFT SCREEN
  return (
    <main className="h-screen bg-[#0f172a] text-white p-8 flex flex-col overflow-hidden">
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center mb-8 shrink-0">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          Draft Engine <span className="text-white/20">2026</span>
        </h1>
        <div className="flex gap-4">
          <button onClick={handleUndo} disabled={history.length === 0} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-red-500/20 disabled:opacity-20 transition-all">
            Undo
          </button>
          <button onClick={() => setIsTradeModalOpen(true)} className="bg-blue-600 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">
            Trade Machine
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden pb-4">
        <div className="lg:col-span-5 h-full overflow-hidden">
          <DraftResults 
            draftOrder={draftOrder.filter(p => p.round <= maxRounds)} 
            draftedPlayers={draftedPlayers} 
            onSelectTeam={() => {}} 
          />
        </div>

        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar shrink-0">
            {positions.map(pos => (
              <button key={pos} onClick={() => setSelectedPosition(pos)} className={`px-4 py-2 rounded-lg text-[10px] font-black border relative whitespace-nowrap ${selectedPosition === pos ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 transition-all"}`}>
                {pos}
                {currentNeeds.includes(pos) && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse border-2 border-[#0f172a]"></span>}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-2 flex justify-between items-center">
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                 On the Clock: <span className="text-white ml-2 uppercase">{currentPick?.current_team_name || "Draft Complete"}</span>
               </p>
               <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                 Round {currentPick?.round} | Pick {currentPick?.slot_number}
               </span>
            </div>
            {filteredPlayers.map((player, index) => {
              const match = currentNeeds.includes(player.position);
              return (
                <PlayerRow 
                  key={player.id} 
                  player={player} 
                  rank={index + 1} 
                  onDraft={handleDraftPlayer} 
                  isTeamNeed={match} 
                />
              );
            })}
          </div>
        </section>
      </div>

      {isTradeModalOpen && (
        <TradeModal userTeam={userTeam} allPicks={draftOrder} onClose={() => setIsTradeModalOpen(false)} onConfirmTrade={handleConfirmTrade} />
      )}
    </main>
  );
}