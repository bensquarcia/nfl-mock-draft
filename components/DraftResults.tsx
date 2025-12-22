// src/components/DraftResults.tsx
import { Player, DraftSlot } from '@/types/draft';
import { useState, useEffect, useRef } from 'react';

interface DraftResultsProps {
  draftOrder: DraftSlot[];
  draftedPlayers: Player[];
  onSelectTeam: (teamName: string) => void;
}

export default function DraftResults({ draftOrder, draftedPlayers, onSelectTeam }: DraftResultsProps) {
  const [activeRound, setActiveRound] = useState(1);
  const currentPickRef = useRef<HTMLDivElement>(null);

  // Sync active round with the current pick
  useEffect(() => {
    const currentPick = draftOrder[draftedPlayers.length];
    if (currentPick && currentPick.round !== activeRound) {
      setActiveRound(currentPick.round);
    }
  }, [draftedPlayers.length, draftOrder, activeRound]);

  // Auto-scroll to the current pick
  useEffect(() => {
    if (currentPickRef.current) {
      currentPickRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [draftedPlayers.length]);

  const roundPicks = draftOrder.filter(p => p.round === activeRound);

  const getTeamLogo = (teamName: string) => {
    const teamData = draftOrder.find(d => d.team_name === teamName);
    return teamData?.team_logo_url || '';
  };

  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-black text-slate-900 uppercase italic">Draft Order</h2>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[1, 2, 3, 4, 5, 6, 7].map(r => (
            <button 
              key={r} 
              onClick={() => setActiveRound(r)} 
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                activeRound === r 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
              }`}
            >
              R{r}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling List of Picks */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar scroll-smooth space-y-3">
        {roundPicks.map((slot) => {
          const globalIndex = draftOrder.findIndex(p => p.slot_number === slot.slot_number);
          const isCurrent = draftedPlayers.length === globalIndex;
          const playerPicked = draftedPlayers[globalIndex];

          return (
            <div 
              key={slot.slot_number} 
              ref={isCurrent ? currentPickRef : null}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isCurrent 
                  ? "bg-blue-50 border-blue-500 shadow-md scale-[1.01]" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Floating Logo (No white box) */}
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <img src={getTeamLogo(slot.current_team_name)} className="w-full h-full object-contain" alt="" />
                  </div>
                  
                  <div>
                    <span className={`text-[10px] font-black uppercase ${isCurrent ? "text-blue-600" : "text-slate-400"}`}>
                      Pick {slot.slot_number}
                    </span>
                    <p className="font-bold text-slate-900 leading-tight">
                      {slot.current_team_name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {slot.needs?.map((need) => (
                        <span 
                          key={need} 
                          className="text-[8px] font-black bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded uppercase"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drafted Player Info */}
                {playerPicked && (
                  <div className="text-right">
                    <p className="text-blue-600 font-black text-sm uppercase leading-none mb-1">
                      {playerPicked.name}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">
                      {playerPicked.position} | {playerPicked.college}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}