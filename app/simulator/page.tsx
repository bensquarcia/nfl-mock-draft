"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDraftLogic } from '@/hooks/useDraftLogic';
import StartScreen from '@/components/StartScreen';
import ResultsScreen from '@/components/ResultsScreen';
import PlayerRow from '@/components/PlayerRow';
import DraftResults from '@/components/DraftResults';
import TradeModal from '@/components/TradeModal';
import PlayerProfile from '@/components/PlayerProfile'; 
import { Player } from '@/types/draft';
import { House } from 'lucide-react'; // Professional Home Icon

export default function Home() {
  const {
    gameState, loading, maxRounds, players, draftOrder, draftedPlayers,
    isTradeModalOpen, setIsTradeModalOpen, userTeam, selectedPosition,
    setSelectedPosition, startDraft, resetDraft, handleDraftPlayer,
    handleUndo, handleConfirmTrade
  } = useDraftLogic();

  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      if (viewingPlayer) setViewingPlayer(null);
      if (isTradeModalOpen) setIsTradeModalOpen(false);
    };
    if (viewingPlayer || isTradeModalOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener('popstate', handlePopState);
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewingPlayer, isTradeModalOpen]);

  // Loading State
  if (loading) return (
    <main className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">Resuming Draft...</p>
      </div>
    </main>
  );

  if (gameState === "START") return <StartScreen onStart={startDraft} />;
  if (gameState === "RESULTS") return <ResultsScreen draftedPlayers={draftedPlayers} draftOrder={draftOrder} maxRounds={maxRounds} onReset={resetDraft} />;

  const currentPick = draftOrder.filter(p => !p.year || p.year === 2025)[draftedPlayers.length];
  const currentNeeds = (currentPick?.needs || []) as string[];
  const filteredPlayers = selectedPosition === "ALL" ? players : players.filter(p => p.position === selectedPosition);
  const tradeablePicks = draftOrder.filter((pick, index) => !((!pick.year || pick.year === 2025) && index < draftedPlayers.length));

  return (
    <main className="h-screen bg-slate-50 text-slate-900 p-8 flex flex-col overflow-hidden">
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-6">
          {/* Professional Home Button */}
          <Link 
            href="/" 
            className="bg-white hover:bg-slate-100 p-3 rounded-xl transition-all border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 flex items-center justify-center"
          >
            <House size={20} strokeWidth={2.5} />
          </Link>
          
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain" 
            />
            {/* New Professional Title */}
            <h1 className="text-3xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 tracking-tighter">
              NFL Mock Draft <span className="text-slate-900">Simulator</span>
            </h1>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={resetDraft} className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">Reset</button>
          <button onClick={handleUndo} disabled={draftedPlayers.length === 0} className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm">Undo</button>
          <button onClick={() => setIsTradeModalOpen(true)} className="bg-blue-600 px-6 py-3 rounded-xl font-black uppercase text-xs text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Trade Machine</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden pb-4">
        {/* Draft Results Sidebar */}
        <div className="lg:col-span-5 h-full overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-1">
          <DraftResults 
            draftOrder={draftOrder.filter(p => p.round <= maxRounds && (!p.year || p.year === 2025))} 
            draftedPlayers={draftedPlayers} 
            onSelectTeam={() => {}} 
          />
        </div>

        {/* Main Selection Area */}
        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar shrink-0">
            {["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "K", "P", "LS"].map(pos => (
              <button 
                key={pos} 
                onClick={() => setSelectedPosition(pos)} 
                className={`px-4 py-2 rounded-lg text-[10px] font-black border relative transition-all ${selectedPosition === pos ? "bg-blue-600 border-blue-500 text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-blue-400"}`}
              >
                {pos}
                {currentNeeds.includes(pos) && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse border-2 border-white"></span>}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {/* On The Clock Banner */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl mb-2 flex justify-between items-center shadow-sm">
               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                 On the Clock: <span className="text-slate-900 ml-2 uppercase font-black">{currentPick?.current_team_name || "Draft Complete"}</span>
               </p>
               <span className="text-[10px] font-bold text-slate-400 uppercase italic font-black">
                 Round {currentPick?.round} | Pick {currentPick?.slot_number}
               </span>
            </div>

            {/* Players List */}
            {filteredPlayers.map((player, index) => (
              <PlayerRow 
                key={player.id} 
                player={player} 
                rank={index + 1} 
                onDraft={handleDraftPlayer} 
                onViewInfo={() => setViewingPlayer(player)} 
                isTeamNeed={currentNeeds.includes(player.position)} 
              />
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      {viewingPlayer && (
        <PlayerProfile 
          player={viewingPlayer} 
          onClose={() => window.history.back()} 
        />
      )}

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