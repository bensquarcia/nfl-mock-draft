// src/components/ResultsScreen.tsx
import { Player, DraftSlot } from '@/types/draft';

interface ResultsScreenProps {
  draftedPlayers: Player[];
  draftOrder: DraftSlot[];
  maxRounds: number;
  onReset: () => void;
}

export default function ResultsScreen({ draftedPlayers, draftOrder, maxRounds, onReset }: ResultsScreenProps) {
  return (
    <main className="h-screen bg-[#0f172a] p-12 overflow-y-auto custom-scrollbar text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-5xl font-black italic uppercase text-blue-500">Draft Recap</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">{maxRounds} Round Simulation Complete</p>
          </div>
          <button onClick={onReset} className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all shadow-lg">
            Start New Draft
          </button>
        </header>
        <div className="grid gap-4">
          {draftedPlayers.map((player, idx) => {
            const pickInfo = draftOrder[idx];
            return (
              <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-black text-slate-700 w-12 italic">#{idx + 1}</span>
                  <div className="w-14 h-14 bg-white rounded-lg p-2 flex items-center justify-center shrink-0 shadow-md">
                    <img src={pickInfo?.team_logo_url} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{player.name}</h3>
                    <p className="text-sm text-slate-500 uppercase font-bold">{player.position} | {player.college}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-500 font-black italic text-xl uppercase">{pickInfo?.team_abbr}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase">Pick {pickInfo?.slot_number}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}