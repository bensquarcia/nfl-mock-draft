"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDraftLogic } from '@/hooks/useDraftLogic';
import StartScreen from '@/components/StartScreen';
import ResultsScreen from '@/components/ResultsScreen';
import PlayerRow from '@/components/PlayerRow';
import DraftResults from '@/components/DraftResults';
import TradeModal from '@/components/TradeModal';
import PlayerProfile from '@/components/PlayerProfile'; 
import { Player } from '@/types/draft';

export default function Home() {
  const {
    gameState, loading, maxRounds, players, draftOrder, draftedPlayers,
    isTradeModalOpen, setIsTradeModalOpen, userTeam, selectedPosition,
    setSelectedPosition, searchQuery, setSearchQuery, 
    startDraft, resetDraft, handleDraftPlayer,
    handleUndo, handleConfirmTrade
  } = useDraftLogic();

  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (gameState !== "START") {
      resetDraft();
    }
  }, []);

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

  const UnifiedHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </Link>
        <div className="h-8 w-[1px] bg-slate-200 mx-1" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black italic uppercase tracking-tighter leading-none text-slate-900">
              Mock Draft <span className="text-blue-600">Simulator</span>
            </h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Draft Room</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleUndo} disabled={draftedPlayers.length === 0} className="hidden md:block bg-white border border-slate-200 px-4 py-2 rounded-xl font-black uppercase text-[10px] hover:bg-slate-50 disabled:opacity-30 transition-all">Undo</button>
        <button onClick={() => setIsTradeModalOpen(true)} className="bg-blue-600 px-4 py-2 rounded-xl font-black uppercase text-[10px] text-white hover:bg-blue-700 transition-all">Trade Machine</button>
        <button onClick={resetDraft} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">Reset</button>
      </div>
    </div>
  );

  if (loading) return (
    <main className="h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">Loading Draft Engine...</p>
      </div>
    </main>
  );

  if (gameState === "START") return <StartScreen onStart={startDraft} />;
  
  if (gameState === "RESULTS") return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <UnifiedHeader />
      <ResultsScreen draftedPlayers={draftedPlayers} draftOrder={draftOrder} maxRounds={maxRounds} onReset={resetDraft} />
    </div>
  );

  const currentPick = draftOrder.filter(p => !p.year || p.year === 2025)[draftedPlayers.length];
  const currentNeeds = (currentPick?.needs || []) as string[];
  const tradeablePicks = draftOrder.filter((pick, index) => !((!pick.year || pick.year === 2025) && index < draftedPlayers.length));

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <UnifiedHeader />
      
      <main className="flex-grow pt-24 px-8 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
          
          <div className="lg:col-span-5 h-full overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
             <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <h3 className="font-black italic uppercase text-sm tracking-tighter text-slate-700">Draft Log</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">LIVE</span>
             </div>
             <div className="flex-grow overflow-hidden">
                <DraftResults 
                  draftOrder={draftOrder.filter(p => p.round <= maxRounds && (!p.year || p.year === 2025))} 
                  draftedPlayers={draftedPlayers} 
                  onSelectTeam={() => {}} 
                />
             </div>
          </div>

          <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
            <div className="space-y-4 mb-4 shrink-0">
              <div className="relative">
                <input 
                  placeholder="SEARCH PROSPECTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  /* ADDED text-slate-900 FOR VISIBLE TYPING */
                  className="w-full bg-white border border-slate-200 pl-12 pr-6 py-4 rounded-2xl shadow-sm outline-none font-black italic uppercase text-sm focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-slate-500 text-slate-900"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar shrink-0">
                {["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "K", "P", "LS"].map(pos => (
                  <button 
                    key={pos} 
                    onClick={() => setSelectedPosition(pos)} 
                    className={`px-4 py-2 rounded-lg text-[10px] font-black border transition-all shrink-0 ${selectedPosition === pos ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" : "bg-white border-slate-200 text-slate-500 hover:border-blue-400"}`}
                  >
                    {pos}
                    {currentNeeds.includes(pos) && <span className="ml-1 text-blue-400">•</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm sticky top-0 z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                   <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                     On the Clock: <span className="text-blue-600 ml-1">{currentPick?.current_team_name || "Draft Complete"}</span>
                   </p>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                   R{currentPick?.round} | P{currentPick?.slot_number}
                 </span>
              </div>

              {players.map((player, index) => (
                <PlayerRow 
                  key={player.id} 
                  player={player} 
                  rank={index + 1} 
                  onDraft={handleDraftPlayer} 
                  onViewInfo={() => setViewingPlayer(player)} 
                  isTeamNeed={currentNeeds.includes(player.position)} 
                />
              ))}

              {players.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="font-black uppercase text-slate-400 italic tracking-widest">No Prospects Found</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {viewingPlayer && (
        <PlayerProfile 
          player={viewingPlayer} 
          onClose={() => setViewingPlayer(null)} 
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
    </div>
  );
}