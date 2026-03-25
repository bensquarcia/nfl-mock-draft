// src/components/ResultsScreen.tsx
import { Player, DraftSlot } from '@/types/draft';
import { useState } from 'react';
import Image from 'next/image';

interface ResultsScreenProps {
  draftedPlayers: Player[];
  draftOrder: DraftSlot[];
  maxRounds: number;
  onReset: () => void;
}

export default function ResultsScreen({ draftedPlayers, draftOrder, maxRounds, onReset }: ResultsScreenProps) {
  const [viewRound, setViewRound] = useState(1);

  // 1. Identify User Controlled Teams 
  const controlledTeamNames = Array.from(
    new Set(draftOrder.filter(slot => slot.isUser).map(slot => slot.current_team_name))
  );
  
  const isSingleTeamDraft = controlledTeamNames.length === 1;

  // 2. Map players to their specific slots
  const allPicksWithPlayers = draftOrder.slice(0, draftedPlayers.length).map((slot, index) => ({
    ...slot,
    player: draftedPlayers[index]
  }));

  const userPicks = allPicksWithPlayers.filter(pick => pick.isUser);
  const teamName = controlledTeamNames[0] || "User Team";
  const teamLogo = userPicks[0]?.team_logo_url;

  const playersInView = allPicksWithPlayers.filter(pick => pick.round === viewRound);

  // --- RENDER OPTION A: SINGLE TEAM RECAP ---
  if (isSingleTeamDraft) {
    return (
      <main className="h-screen bg-white p-2 md:p-6 flex items-center justify-center overflow-hidden font-sans">
        <div className="w-full max-w-5xl h-full flex flex-col border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl bg-white">
          
          {/* HEADER: NFL TEAM BRANDING */}
          <div className="bg-white p-4 md:p-8 flex justify-between items-center border-b-2 border-slate-100 shrink-0">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="w-14 h-14 md:w-28 md:h-28 relative flex items-center justify-center">
                <img src={teamLogo} alt={teamName} className="max-w-full max-h-full object-contain drop-shadow-md" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  {teamName}
                </h1>
                <p className="text-blue-600 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-sm mt-1 md:mt-2">
                  OFFICIAL DRAFT CLASS RECAP
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="text-slate-900 font-black text-sm md:text-2xl italic uppercase leading-none tracking-tighter">UpNextSports</p>
                <button onClick={onReset} className="mt-1 md:mt-2 text-slate-400 font-bold uppercase text-[8px] md:text-[10px] hover:text-blue-600 transition-all">Reset Draft</button>
            </div>
          </div>

          {/* LIST: SCROLLABLE ONLY IF MORE THAN 14 PICKS (7 ROWS) */}
          <div className={`flex-grow grid grid-cols-1 md:grid-cols-2 bg-white ${userPicks.length > 14 ? 'overflow-y-auto no-scrollbar' : 'overflow-hidden'}`}>
            {userPicks.map((pick) => (
              <div key={pick.id} className="flex items-center px-4 md:px-8 py-2 md:py-3.5 gap-3 md:gap-6 border-b border-r border-slate-50">
                <div className="flex flex-col items-center justify-center w-10 md:w-14 shrink-0 border-r border-slate-100 pr-2 md:pr-4">
                  <span className="text-[7px] md:text-[10px] font-black text-blue-600 uppercase">RD {pick.round}</span>
                  <span className="text-lg md:text-3xl font-black italic text-slate-900">#{pick.pick_number}</span>
                </div>
                
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm md:text-2xl font-black text-slate-900 uppercase leading-none tracking-tighter mb-0.5 md:mb-1 truncate">
                    {pick.player?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-blue-600 text-[9px] md:text-lg font-black uppercase italic">{pick.player?.position}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 text-[9px] md:text-lg font-bold uppercase truncate">{pick.player?.college}</span>
                  </div>
                </div>

                {pick.player?.college_logo_url && (
                  <div className="w-6 h-6 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                    <img src={pick.player.college_logo_url} alt="college" className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform hover:scale-110" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="p-4 md:p-6 flex flex-wrap justify-between items-center shrink-0 border-t border-slate-100 gap-4">
            <div className="flex items-center gap-4">
              <p className="text-slate-900 text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none">UpNextSports</p>
              <button onClick={onReset} className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">New Simulation</button>
            </div>
            <p className="text-blue-600 text-sm md:text-xl font-black uppercase italic tracking-tighter leading-none">UPNEXTDRAFT.COM</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-white p-2 md:p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1600px] h-full flex flex-col">
        
        <header className="flex justify-between items-center shrink-0 px-4 py-2 md:py-4">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="w-10 h-10 md:w-14 md:h-14 relative shrink-0">
              <Image src="/logo.png" alt="UpNextSports Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              DRAFT <span className="text-blue-600">RECAP</span>
            </h1>
            <div className="h-6 md:h-10 w-[2px] bg-slate-200 hidden md:block"></div>
            <span className="text-slate-400 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hidden md:block">Round {viewRound} Board</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            {maxRounds > 1 && (
              <div className="flex gap-1 bg-slate-50 p-0.5 md:p-1 rounded-lg border border-slate-100">
                {Array.from({ length: maxRounds }, (_, i) => i + 1).map(r => (
                  <button 
                    key={r} 
                    onClick={() => setViewRound(r)} 
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[9px] md:text-xs font-black transition-all ${
                      viewRound === r ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    R{r}
                  </button>
                ))}
              </div>
            )}
            <button onClick={onReset} className="text-slate-900 font-black uppercase text-[9px] md:text-xs border-2 border-slate-900 px-3 md:px-4 py-1 md:py-2 rounded-full hover:bg-slate-900 hover:text-white transition-all">
              Reset
            </button>
          </div>
        </header>

        <div className="flex-grow flex flex-col overflow-hidden border-y border-slate-100">
          {/* UPDATED: Configured grid for 2 columns / 16 rows on mobile and 4 columns / 8 rows on desktop */}
          <div className="flex-grow grid grid-flow-col grid-cols-2 grid-rows-16 md:grid-cols-4 md:grid-rows-8 h-full bg-white">
            {playersInView.slice(0, 32).map((pick) => (
              <div 
                key={pick.id} 
                className="border-b border-r border-slate-50 p-1 md:p-3 flex items-center gap-1.5 md:gap-3 overflow-hidden"
              >
                <div className="w-5 md:w-8 text-xs md:text-xl font-black text-slate-900 italic shrink-0">#{pick.pick_number}</div>
                
                <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                  <img 
                    src={pick.team_logo_url} 
                    className="w-full h-full object-contain" 
                    alt={pick.team_abbr} 
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-[10px] md:text-[15px] font-black text-slate-900 uppercase truncate leading-none mb-0.5">
                    {pick.player?.name}
                  </h3>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <span className="text-[8px] md:text-[11px] font-bold text-blue-600 uppercase italic leading-none">{pick.player?.position}</span>
                    <span className="text-slate-300 text-[8px] md:text-[10px]">|</span>
                    <span className="text-[8px] md:text-[11px] font-bold text-slate-400 uppercase truncate leading-none">{pick.player?.college}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="py-3 md:py-6 px-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <p className="text-slate-900 text-lg md:text-3xl font-black italic uppercase tracking-tighter leading-none">UpNextSports</p>
            <span className="text-slate-200 text-sm md:text-2xl font-light">/</span>
            <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mt-0.5">DRAFT MEDIA</p>
          </div>
          <div className="text-right">
            <p className="text-blue-600 text-sm md:text-2xl font-black uppercase tracking-tighter italic">UPNEXTDRAFT.COM</p>
          </div>
        </footer>
      </div>
    </main>
  );
}