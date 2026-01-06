"use client";
import { Player, DraftSlot } from '@/types/draft';
import { useState, useEffect, useRef } from 'react';

interface DraftResultsProps {
  draftOrder: DraftSlot[];
  draftedPlayers: Player[];
  onSelectTeam: (teamName: string) => void;
}

export default function DraftResults({ draftOrder, draftedPlayers, onSelectTeam }: DraftResultsProps) {
  const [manifestTeam, setManifestTeam] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentPickRef = useRef<HTMLDivElement>(null);
  const roundRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const roundsInDraft = Array.from(new Set(draftOrder.filter(p => !p.year || p.year === 2025).map(p => p.round))).sort((a, b) => a - b);

  // AUTO-SCROLL TO CURRENT PICK ON LOAD/DRAFT
  useEffect(() => {
    if (currentPickRef.current) {
      currentPickRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [draftedPlayers.length]);

  // JUMP TO ROUND FUNCTION
  const scrollToRound = (round: number) => {
    const element = roundRefs.current[round];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // MANIFEST DATA
  const teamPicks = draftedPlayers.filter((_, idx) => draftOrder[idx]?.current_team_name === manifestTeam);
  // Fixed Future Picks Filter: Looks for picks belonging to this team in years 2026+
  const futurePicks = draftOrder.filter(p => 
    p.current_team_name === manifestTeam && 
    p.year && 
    p.year > 2025
  );
  const teamLogo = draftOrder.find(p => p.current_team_name === manifestTeam)?.team_logo_url;

  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden relative">
      
      {/* 1. TEAM MANIFEST POPUP */}
      {manifestTeam && (
        <div className="absolute inset-0 z-[200] bg-white p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setManifestTeam(null)} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
              ← Close Manifest
            </button>
            <div className="flex items-center gap-2">
              {teamLogo && <img src={teamLogo} className="w-7 h-7 object-contain" alt="" />}
              <h3 className="font-black uppercase italic text-sm text-slate-900">{manifestTeam}</h3>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-8 custom-scrollbar pb-10">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">2026 Draft Class</p>
              <div className="space-y-2">
                {teamPicks.length > 0 ? teamPicks.map((p, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-black text-xs uppercase text-slate-900 leading-tight">{p.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{p.position} | {p.college}</p>
                  </div>
                )) : <p className="text-center py-6 border-2 border-dashed border-slate-50 rounded-2xl text-[10px] font-bold text-slate-300 uppercase">No selections yet</p>}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Future Assets</p>
              <div className="grid grid-cols-1 gap-2">
                {futurePicks.length > 0 ? futurePicks.map((p, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <p className="font-black text-[10px] text-slate-900 uppercase">{p.year} Draft Pick</p>
                    <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded">RD {p.round}</span>
                  </div>
                )) : <p className="text-center py-6 border-2 border-dashed border-slate-50 rounded-2xl text-[10px] font-bold text-slate-300 uppercase">No future picks found</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIDEBAR HEADER */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-black text-slate-900 uppercase italic">Draft Order</h2>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
          {roundsInDraft.map(r => (
            <button 
              key={r} 
              type="button"
              onClick={() => scrollToRound(r)} 
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer min-w-[35px] bg-white text-slate-400 border border-transparent hover:border-blue-200 hover:text-blue-600 shadow-sm`}
            >
              R{r}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CONTINUOUS SCROLLING LIST */}
      <div 
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto pr-2 custom-scrollbar scroll-smooth space-y-3"
      >
        {draftOrder.filter(p => !p.year || p.year === 2025).map((slot, index) => {
          const isCurrent = draftedPlayers.length === index;
          const playerPicked = draftedPlayers[index];
          
          // Check if this is the first pick of a new round to set a scroll anchor
          const isFirstInRound = index === 0 || draftOrder[index - 1].round !== slot.round;

          return (
            <div 
              key={`${slot.round}-${slot.slot_number}-${index}`} 
              ref={(el) => {
                if (isCurrent) currentPickRef.current = el;
                if (isFirstInRound) roundRefs.current[slot.round] = el;
              }}
              onClick={() => {
                onSelectTeam(slot.current_team_name);
                setManifestTeam(slot.current_team_name);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:shadow-md ${
                isCurrent ? "bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500/10" : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              {isFirstInRound && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Round {slot.round}</span>
                  <div className="h-px bg-slate-100 flex-grow" />
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <img src={slot.team_logo_url} className="w-full h-full object-contain" alt="" />
                  </div>
                  
                  <div className="min-w-0">
                    <span className={`text-[9px] font-black uppercase ${isCurrent ? "text-blue-600" : "text-slate-400"}`}>
                      Pick {slot.slot_number}
                    </span>
                    <p className="font-black text-slate-900 leading-tight uppercase text-xs truncate">
                      {slot.current_team_name}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {slot.needs?.map((need) => (
                        <span key={need} className="text-[7px] font-black bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded uppercase">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {playerPicked && (
                  <div className="text-right">
                    <p className="text-blue-600 font-black text-[11px] uppercase leading-none mb-1 italic">
                      {playerPicked.name}
                    </p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">
                      {playerPicked.position}
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