"use client";
import { useEffect, useState, useMemo } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, LayoutList, ChevronRight, Info, Zap } from 'lucide-react';
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
    handleUndo, handleConfirmTrade,
    isPaused, togglePause,
    controlledTeams,
    draftSpeed, cycleSpeed 
  } = useDraftLogic();

  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  const isControllingAllTeams = controlledTeams.length === 32;

  const masterBoardMap = useMemo(() => {
    if (loading) return new Map();
    const allPlayers = [...players, ...draftedPlayers].sort((a, b) => a.rank - b.rank);
    const rankMap = new Map();
    allPlayers.forEach((player, index) => {
      rankMap.set(player.id, index + 1);
    });
    return rankMap;
  }, [loading]);

  const getStaticWholeRank = (player: Player) => {
    return masterBoardMap.get(player.id) || 0;
  };

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

  const getSpeedLabel = () => {
    if (draftSpeed === 600) return "Normal";
    if (draftSpeed === 300) return "Fast";
    return "Turbo";
  };

  if (loading) return (
    <main className="h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">Loading Draft Engine...</p>
      </div>
    </main>
  );

  if (gameState === "START") return <StartScreen onStart={startDraft} />;

  const currentPick = draftOrder.filter(p => !p.year || p.year === 2025)[draftedPlayers.length];
  const currentNeeds = (currentPick?.needs || []) as string[];
  const tradeablePicks = draftOrder.filter((p, index) => !((!p.year || p.year === 2025) && index < draftedPlayers.length));

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {gameState !== "RESULTS" && (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              href="/" 
              className="bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
            <div className="h-6 md:h-8 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 relative">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <h2 className="text-[10px] md:text-sm font-black italic uppercase tracking-tighter leading-none text-slate-900">
                Mock Draft <span className="text-blue-600">Simulator</span>
              </h2>
            </div>
          </div>

          <div className="flex gap-1.5 md:gap-3">
            {/* ONLY SHOW SPEED AND PAUSE IF NOT CONTROLLING ALL TEAMS */}
            {!isControllingAllTeams && (
              <>
                <button 
                  onClick={cycleSpeed}
                  className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg md:rounded-xl font-black uppercase text-[9px] hover:bg-white hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Zap size={10} className={draftSpeed < 600 ? "text-amber-500 fill-amber-500" : ""} />
                  <span>Speed: {getSpeedLabel()}</span>
                </button>

                <button 
                  onClick={togglePause}
                  className={`px-3 py-1.5 rounded-lg md:rounded-xl font-black uppercase text-[9px] transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                    isPaused 
                      ? "bg-emerald-500 text-white animate-pulse" 
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
              </>
            )}

            <button 
              onClick={() => handleUndo()} 
              disabled={draftedPlayers.length === 0} 
              className="hidden lg:block bg-slate-900 text-white border border-black px-4 py-1.5 rounded-xl font-black uppercase text-[10px] hover:bg-blue-600 disabled:opacity-20 transition-all shadow-md active:scale-95"
            >
              Undo
            </button>
            <button onClick={() => setIsTradeModalOpen(true)} className="bg-blue-600 px-3 py-1.5 rounded-lg md:rounded-xl font-black uppercase text-[9px] text-white hover:bg-blue-700 transition-all shadow-md active:scale-95">Trade Machine</button>
            <button onClick={resetDraft} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg md:rounded-xl font-black uppercase text-[9px] hover:bg-red-600 hover:text-white transition-all active:scale-95">Reset</button>
          </div>
        </nav>
      )}

      {gameState === "RESULTS" ? (
        <div className="min-h-screen bg-slate-50 pt-0 overflow-y-auto">
          <ResultsScreen draftedPlayers={draftedPlayers} draftOrder={draftOrder} maxRounds={maxRounds} onReset={resetDraft} />
        </div>
      ) : (
        <main className="flex-grow pt-20 md:pt-24 px-4 md:px-8 pb-4 md:pb-8 overflow-y-auto lg:overflow-hidden">
          <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            <div className="lg:col-span-5 h-[300px] lg:h-full overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col shrink-0">
               <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                  <h3 className="font-black italic uppercase text-xs md:text-sm tracking-tighter text-slate-700">Draft Log</h3>
                  <span className="text-[9px] md:text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">LIVE</span>
               </div>
               <div className="flex-grow overflow-hidden">
                  <DraftResults 
                    draftOrder={draftOrder.filter(p => p.round <= maxRounds && (!p.year || p.year === 2025))} 
                    draftedPlayers={draftedPlayers} 
                    onSelectTeam={() => {}} 
                  />
               </div>
            </div>

            <section className="lg:col-span-7 flex flex-col h-full overflow-visible lg:overflow-hidden">
              <div className="space-y-3 md:space-y-4 mb-4 shrink-0">
                <div className="relative">
                  <input 
                    placeholder="SEARCH PROSPECTS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-2xl shadow-sm outline-none font-black italic uppercase text-xs md:text-sm focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-slate-500 text-slate-900"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar shrink-0">
                  {["ALL", "QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "K", "P", "LS"].map(pos => (
                    <button 
                      key={pos} 
                      onClick={() => setSelectedPosition(pos)} 
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black border transition-all shrink-0 ${selectedPosition === pos ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" : "bg-white border-slate-200 text-slate-500 hover:border-blue-400"}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-grow overflow-y-auto pr-1 md:pr-2 space-y-2.5 md:space-y-3 custom-scrollbar pb-10 lg:pb-0">
                <div className="p-3 md:p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm sticky top-0 z-10">
                   <div className="flex items-center gap-2 md:gap-3">
                     <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${(!isControllingAllTeams && isPaused) ? 'bg-amber-500' : 'bg-blue-600 animate-pulse'}`} />
                     <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-widest truncate max-w-[120px] md:max-w-none">
                       {(!isControllingAllTeams && isPaused) ? "Draft Paused: " : "On the Clock: "} 
                       <span className={`${(!isControllingAllTeams && isPaused) ? 'text-amber-600' : 'text-blue-600'} ml-1 italic`}>
                         {currentPick?.current_team_name || "Complete"}
                       </span>
                     </p>
                   </div>
                   {(!isControllingAllTeams && isPaused) && (
                     <span className="text-[8px] font-black text-amber-500 animate-pulse">Waiting for action</span>
                   )}
                </div>

                {players.map((player) => (
                  <PlayerRow 
                    key={player.id} 
                    player={player} 
                    rank={getStaticWholeRank(player)} 
                    onDraft={handleDraftPlayer} 
                    onViewInfo={() => setViewingPlayer(player)} 
                    isTeamNeed={currentNeeds.includes(player.position)} 
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      {viewingPlayer && (
        <PlayerProfile 
          player={viewingPlayer} 
          staticRank={getStaticWholeRank(viewingPlayer)}
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