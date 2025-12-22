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
    <main className="h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden text-slate-900">
      <div className="max-w-[1200px] w-full h-full max-h-[900px] flex flex-col gap-4">
        
        {/* Header Section */}
        <header className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              MOCK DRAFT <span className="text-blue-600">RESULTS</span>
            </h1>
            <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] mt-1">
               2026 Simulation • Round {viewRound}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {maxRounds > 1 && (
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
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
            <button onClick={onReset} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              New Draft
            </button>
          </div>
        </header>

        {/* THE GRAPHIC BOARD */}
        <div className="flex-grow bg-white rounded-2xl border-[6px] border-slate-900 shadow-2xl flex flex-col overflow-hidden">
          
          <div className="bg-slate-900 py-3 px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Full Round Summary</span>
            </div>
            <span className="text-slate-400 text-[9px] font-black uppercase italic">DraftCentral Engine</span>
          </div>

          <div className="flex-grow p-4 bg-slate-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 h-full content-start">
              {playersInView.map((player) => {
                const globalIdx = draftedPlayers.findIndex(p => p.id === player.id);
                const pickInfo = draftOrder[globalIdx];

                return (
                  <div 
                    key={player.id} 
                    className="bg-white border border-slate-300 rounded-lg p-2.5 flex items-center gap-3 shadow-sm hover:border-blue-500 transition-all"
                  >
                    {/* UPDATED: Pick Number - Darker (Slate-900) */}
                    <div className="text-[11px] font-black text-slate-900 italic w-7 shrink-0 border-r border-slate-100">
                      #{pickInfo?.slot_number}
                    </div>

                    {/* NFL Logo */}
                    <div className="w-9 h-9 flex items-center justify-center shrink-0">
                      <img 
                        src={pickInfo?.team_logo_url} 
                        className="w-full h-full object-contain" 
                        alt={pickInfo?.team_abbr} 
                      />
                    </div>

                    {/* Player Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-[11px] font-black text-slate-900 uppercase truncate leading-tight tracking-tight">
                        {player.name}
                      </h3>
                      <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
                        {player.position} <span className="text-slate-300 mx-0.5">|</span> {player.college}
                      </p>
                    </div>

                    {/* UPDATED: Team Abbreviation - Darker (Slate-600) */}
                    <div className="text-[10px] font-black text-slate-600 uppercase italic bg-slate-100 px-1.5 py-0.5 rounded">
                      {pickInfo?.team_abbr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
                <p className="text-[9px] font-black text-white uppercase tracking-widest">Mock Draft Completed</p>
                <div className="h-4 w-[1px] bg-slate-700"></div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Share on Social</p>
             </div>
             <p className="text-[10px] font-black text-blue-500 uppercase italic">Draftcentral.com</p>
          </div>
        </div>

        <p className="text-center text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] shrink-0">
           Capture this screen to share your full round results
        </p>
      </div>
    </main>
  );
}