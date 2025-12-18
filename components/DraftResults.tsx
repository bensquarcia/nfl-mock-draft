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

  useEffect(() => {
    const currentPick = draftOrder[draftedPlayers.length];
    if (currentPick && currentPick.round !== activeRound) {
      setActiveRound(currentPick.round);
    }
  }, [draftedPlayers.length, draftOrder, activeRound]);

  // AUTO-SCROLL LOGIC
  useEffect(() => {
    if (currentPickRef.current) {
      currentPickRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // CHANGED: 'nearest' prevents the whole page from jumping
      });
    }
  }, [draftedPlayers.length]);

  const roundPicks = draftOrder.filter(p => p.round === activeRound);

  const getTeamLogo = (teamName: string) => {
    const teamData = draftOrder.find(d => d.team_name === teamName);
    return teamData?.team_logo_url || '';
  };

  return (
    <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-black text-slate-400 uppercase italic">Draft Order</h2>
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[1, 2, 3, 4, 5, 6, 7].map(r => (
            <button key={r} onClick={() => setActiveRound(r)} className={`px-3 py-1 rounded text-[10px] font-black transition-all ${activeRound === r ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
              R{r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar scroll-smooth space-y-3">
        {roundPicks.map((slot) => {
          const globalIndex = draftOrder.findIndex(p => p.slot_number === slot.slot_number);
          const isCurrent = draftedPlayers.length === globalIndex;
          const playerPicked = draftedPlayers[globalIndex];

          return (
            <div 
              key={slot.slot_number} 
              ref={isCurrent ? currentPickRef : null}
              className={`p-4 rounded-xl border-l-4 transition-all duration-300 ${isCurrent ? "bg-blue-600/20 border-blue-500 scale-[1.02]" : "bg-slate-800/30 border-slate-700 opacity-80"}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={getTeamLogo(slot.current_team_name)} className="w-10 h-10 object-contain" alt="" />
                  <div>
                    <span className={`text-[10px] font-black uppercase ${isCurrent ? "text-blue-400" : "text-slate-500"}`}>Pick {slot.slot_number}</span>
                    <p className="font-bold text-slate-100 leading-tight">{slot.current_team_name}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {slot.needs?.map((need) => (
                        <span key={need} className="text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase">{need}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {playerPicked && (
                  <div className="text-right">
                    <p className="text-blue-400 font-black text-sm uppercase leading-none mb-1">{playerPicked.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{playerPicked.position} | {playerPicked.college}</p>
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