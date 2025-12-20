// src/app/simulator/page.tsx
"use client";
import Link from 'next/link'; // NEW IMPORT
import { useDraftLogic } from '@/hooks/useDraftLogic';
import StartScreen from '@/components/StartScreen';
import ResultsScreen from '@/components/ResultsScreen';
import PlayerRow from '@/components/PlayerRow';
import DraftResults from '@/components/DraftResults';
import TradeModal from '@/components/TradeModal';

export default function Home() {
  const {
    gameState, loading, maxRounds, players, draftOrder, draftedPlayers,
    isTradeModalOpen, setIsTradeModalOpen, userTeam, selectedPosition,
    setSelectedPosition, startDraft, resetDraft, handleDraftPlayer,
    handleUndo, handleConfirmTrade
  } = useDraftLogic();

  if (loading) return (
    <main className="h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-500 font-black uppercase text-[10px] tracking-[0.3em]">Resuming Draft...</p>
      </div>
    </main>
  );

  if (gameState === "START") return <StartScreen onStart={startDraft} />;

  if (gameState === "RESULTS") return (
    <ResultsScreen 
      draftedPlayers={draftedPlayers} 
      draftOrder={draftOrder} 
      maxRounds={maxRounds} 
      onReset={resetDraft} 
    />
  );

  const currentPick = draftOrder.filter(p => !p.year || p.year === 2025)[draftedPlayers.length];
  const currentNeeds = (currentPick?.needs || []) as string[];
  const filteredPlayers = selectedPosition === "ALL" ? players : players.filter(p => p.position === selectedPosition);
  const tradeablePicks = draftOrder.filter((pick, index) => {
    const isPastPick = (!pick.year || pick.year === 2025) && index < draftedPlayers.length;
    return !isPastPick;
  });

  return (
    <main className="h-screen bg-[#0f172a] text-white p-8 flex flex-col overflow-hidden">
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all border border-slate-700">
            🏠
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Draft Engine <span className="text-white/20">2026</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button onClick={resetDraft} className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl font-black uppercase text-[10px] text-red-500 hover:bg-red-500 hover:text-white transition-all">Reset</button>
          <button onClick={handleUndo} disabled={draftedPlayers.length === 0} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-white/10 disabled:opacity-20 transition-all">Undo</button>
          <button onClick={() => setIsTradeModalOpen(true)} className="bg-blue-600 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">Trade Machine</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden pb-4">
        <div className="lg:col-span-5 h-full overflow-hidden">
          <DraftResults 
            draftOrder={draftOrder.filter(p => p.round <= maxRounds && (!p.year || p.year === 2025))} 
            draftedPlayers={draftedPlayers} 
            onSelectTeam={() => {}} 
          />
        </div>

        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar shrink-0">
            {["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "K", "P", "LS"].map(pos => (
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
            {filteredPlayers.map((player, index) => (
              <PlayerRow 
                key={player.id} 
                player={player} 
                rank={index + 1} 
                onDraft={handleDraftPlayer} 
                isTeamNeed={currentNeeds.includes(player.position)} 
              />
            ))}
          </div>
        </section>
      </div>

      {isTradeModalOpen && (
        <TradeModal 
          userTeam={currentPick?.current_team_name || userTeam} 
          allPicks={tradeablePicks} 
          onClose={() => setIsTradeModalOpen(false)} 
          onConfirmTrade={handleConfirmTrade} 
        />
      )}
    </main>
  );
}