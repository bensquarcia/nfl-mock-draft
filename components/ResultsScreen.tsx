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

  // 1. Identify User Controlled Teams 
  // We strictly look for slots marked with 'isUser'
  const controlledTeamNames = Array.from(
    new Set(draftOrder.filter(slot => slot.isUser).map(slot => slot.current_team_name))
  );
  
  const isSingleTeamDraft = controlledTeamNames.length === 1;

  // 2. Map players to their specific slots
  const allPicksWithPlayers = draftOrder.slice(0, draftedPlayers.length).map((slot, index) => ({
    ...slot,
    player: draftedPlayers[index]
  }));

  // Logic for Single Team View: Strictly filter for picks where isUser is true
  const userPicks = allPicksWithPlayers.filter(pick => pick.isUser);

  const teamName = controlledTeamNames[0] || "User Team";
  const teamLogo = userPicks[0]?.team_logo_url;

  // Logic for Multi-Team Grid View (Shows everything)
  const playersInView = allPicksWithPlayers.filter(pick => pick.round === viewRound);

  // --- RENDER OPTION A: SINGLE TEAM RECAP ---
  if (isSingleTeamDraft) {
    return (
      <main className="h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl w-full flex flex-col gap-6">
          
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border-b-8 border-blue-600 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 relative bg-slate-50 p-2 rounded-2xl flex items-center justify-center">
                <img src={teamLogo} alt={teamName} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  {teamName}
                </h1>
                <p className="text-blue-600 font-black uppercase tracking-widest text-[10px] md:text-sm mt-1">
                  Draft Class Recap
                </p>
              </div>
            </div>
            <button onClick={onReset} className="bg-slate-900 text-white px-4 md:px-6 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              New Draft
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[60vh]">
            {userPicks.map((pick) => (
              <div key={pick.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all">
                <div className="flex flex-col items-center border-r border-slate-100 pr-4 w-14">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Pick</span>
                  <span className="text-xl font-black italic text-slate-900">#{pick.pick_number}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-md font-black text-slate-900 uppercase leading-none">{pick.player?.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">{pick.player?.position}</span>
                    <span className="text-slate-400 text-[9px] font-bold uppercase italic truncate max-w-[120px]">{pick.player?.college}</span>
                  </div>
                </div>
                {pick.player?.college_logo_url && (
                  <img src={pick.player.college_logo_url} alt="college" className="w-8 h-8 object-contain opacity-40" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 flex justify-between items-center shadow-2xl">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Capture your haul</span>
            <span className="text-[10px] font-black text-blue-500 uppercase italic">UpNextDraft.com</span>
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER OPTION B: ORIGINAL BOARD (2+ TEAMS) ---
  return (
    <main className="h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden text-slate-900">
      <div className="max-w-[1200px] w-full h-full max-h-[900px] flex flex-col gap-4">
        
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

        <div className="flex-grow bg-white rounded-2xl border-[6px] border-slate-900 shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 py-3 px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Full Round Summary</span>
            </div>
            <span className="text-slate-400 text-[9px] font-black uppercase italic">DraftCentral Engine</span>
          </div>

          <div className="flex-grow p-4 bg-slate-50 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 h-full content-start">
              {playersInView.map((pick) => (
                <div 
                  key={pick.id} 
                  className="bg-white border border-slate-300 rounded-lg p-2.5 flex items-center gap-3 shadow-sm hover:border-blue-500 transition-all"
                >
                  <div className="text-[11px] font-black text-slate-900 italic w-7 shrink-0 border-r border-slate-100">
                    #{pick.pick_number}
                  </div>

                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <img 
                      src={pick.team_logo_url} 
                      className="w-full h-full object-contain" 
                      alt={pick.team_abbr} 
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase truncate leading-tight tracking-tight">
                      {pick.player?.name}
                    </h3>
                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
                      {pick.player?.position} <span className="text-slate-300 mx-0.5">|</span> {pick.player?.college}
                    </p>
                  </div>

                  <div className="text-[10px] font-black text-slate-600 uppercase italic bg-slate-100 px-1.5 py-0.5 rounded">
                    {pick.team_abbr}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
                <p className="text-[9px] font-black text-white uppercase tracking-widest">Mock Draft Completed</p>
                <div className="h-4 w-[1px] bg-slate-700"></div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Share on Social</p>
             </div>
             <p className="text-[10px] font-black text-blue-500 uppercase italic">UpNextDraft.com</p>
          </div>
        </div>

        <p className="text-center text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] shrink-0">
           Capture this screen to share your full round results
        </p>
      </div>
    </main>
  );
}