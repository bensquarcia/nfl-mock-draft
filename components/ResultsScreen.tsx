// src/components/ResultsScreen.tsx
import { Player, DraftSlot } from '@/types/draft';
import { useState } from 'react';

interface ResultsScreenProps {
  draftedPlayers: Player[];
  draftOrder: DraftSlot[];
  maxRounds: number;
  onReset: () => void;
}

export default function ResultsScreen({ draftedPlayers, draftOrder, maxRounds, onReset }: ResultsScreenProps) {
  const [viewRound, setViewRound] = useState(1);

  const playersInView = draftedPlayers.filter((_, idx) => {
    const pick = draftOrder[idx];
    return pick?.round === viewRound;
  });

  return (
    /* FIXED ON DESKTOP (lg:h-screen lg:overflow-hidden) | SCROLLABLE ON MOBILE (h-auto overflow-y-auto) */
    <main className="min-h-screen lg:h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center justify-start lg:justify-center overflow-y-auto lg:overflow-hidden text-slate-900">
      <div className="max-w-[1200px] w-full h-full lg:max-h-[900px] flex flex-col gap-4">
        
        {/* Header Section - responsive padding and layout */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 bg-white/50 p-4 rounded-2xl lg:bg-transparent lg:p-0">
          <div>
            <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              MOCK DRAFT <span className="text-blue-600">RESULTS</span>
            </h1>
            <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-1">
               2026 Simulation • Round {viewRound}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {maxRounds > 1 && (
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                {Array.from({ length: maxRounds }, (_, i) => i + 1).map(r => (
                  <button 
                    key={r} 
                    onClick={() => setViewRound(r)} 
                    className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all ${
                      viewRound === r ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    R{r}
                  </button>
                ))}
              </div>
            )}
            <button onClick={onReset} className="flex-grow sm:flex-grow-0 bg-slate-900 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              New Draft
            </button>
          </div>
        </header>

        {/* THE GRAPHIC BOARD - Stays fixed on desktop, expands on mobile */}
        <div className="flex-grow bg-white rounded-2xl border-[4px] md:border-[6px] border-slate-900 shadow-2xl flex flex-col lg:overflow-hidden">
          
          <div className="bg-slate-900 py-3 px-4 md:px-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Full Round Summary</span>
            </div>
            <span className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase italic">UpNext Engine</span>
          </div>

          {/* GRID AREA: Scrollable list on mobile, fixed grid on desktop */}
          <div className="flex-grow p-3 md:p-4 bg-slate-50 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 content-start">
              {playersInView.map((player) => {
                const globalIdx = draftedPlayers.findIndex(p => p.id === player.id);
                const pickInfo = draftOrder[globalIdx];

                return (
                  <div 
                    key={player.id} 
                    className="bg-white border border-slate-300 rounded-lg p-2 md:p-2.5 flex items-center gap-3 shadow-sm hover:border-blue-500 transition-all"
                  >
                    <div className="text-[10px] md:text-[11px] font-black text-slate-900 italic w-6 md:w-7 shrink-0 border-r border-slate-100">
                      #{pickInfo?.slot_number}
                    </div>

                    <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
                      <img 
                        src={pickInfo?.team_logo_url} 
                        className="w-full h-full object-contain" 
                        alt={pickInfo?.team_abbr} 
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase truncate leading-tight tracking-tight">
                        {player.name}
                      </h3>
                      <p className="text-[8px] md:text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
                        {player.position} <span className="text-slate-300 mx-0.5">|</span> {player.college}
                      </p>
                    </div>

                    <div className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase italic bg-slate-100 px-1.5 py-0.5 rounded">
                      {pickInfo?.team_abbr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer - Social stuff */}
          <div className="bg-slate-900 p-3 md:p-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 shrink-0">
             <div className="flex items-center gap-3 md:gap-4">
                <p className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">Mock Draft Completed</p>
                <div className="hidden md:block h-4 w-[1px] bg-slate-700"></div>
                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Share @UpNextDraft</p>
             </div>
             <p className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase italic">UpNextDraft.com</p>
          </div>
        </div>

        <p className="hidden md:block text-center text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] shrink-0 mt-2">
           Capture this screen to share your full round results
        </p>
      </div>
    </main>
  );
}