"use client";
import { DraftSlot } from '@/types/draft';

interface TeamColumnProps {
  teamName: string;
  picks: DraftSlot[];
  selectedPicks: DraftSlot[];
  activeYear: number;
  onTogglePick: (pick: DraftSlot) => void;
  onAddCustom: () => void;
  getPickId: (pick: DraftSlot) => string;
  getValueLabel: (val: number) => string;
  isUserColumn?: boolean;
  teams?: string[];
  onTeamChange?: (val: string) => void;
}

export default function TeamColumn({ teamName, picks, selectedPicks, activeYear, onTogglePick, onAddCustom, getPickId, getValueLabel, isUserColumn, teams, onTeamChange }: TeamColumnProps) {
  return (
    <div className={`p-6 overflow-y-auto custom-scrollbar ${isUserColumn ? 'bg-white border-r border-slate-100' : 'bg-slate-50/30'}`}>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isUserColumn ? "Managing Team" : "Trade Partner"}</p>
          {isUserColumn ? (
            <h3 className="font-black text-lg uppercase truncate mt-1">{teamName}</h3>
          ) : (
            <select 
              className="w-full bg-white border border-slate-200 rounded-xl p-3 mt-1 font-black text-xs uppercase outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm"
              value={teamName}
              onChange={(e) => onTeamChange?.(e.target.value)}
            >
              <option value="">Select Team</option>
              {teams?.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>
        {teamName && (
          <button onClick={onAddCustom} className="w-full md:w-auto bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md">
            + Add Player
          </button>
        )}
      </div>

      <div className="space-y-2">
        {teamName ? (
          <>
            {selectedPicks.filter(p => (p as any).isCustomPlayer && (p as any).year === activeYear).map(pick => (
              <div key={getPickId(pick)} onClick={() => onTogglePick(pick)} className="p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center bg-emerald-600 border-emerald-600 shadow-md text-white">
                <div>
                  <p className="font-black text-xs uppercase">{(pick as any).team_abbr} | {(pick as any).team_name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-100 italic">{getValueLabel((pick as any).value)}</p>
                </div>
              </div>
            ))}
            {picks.map(pick => (
              <div key={getPickId(pick)} onClick={() => onTogglePick(pick)} className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${selectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'bg-blue-600 border-blue-600 shadow-md text-white' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <div className="flex flex-col">
                  <p className="font-black text-xs uppercase">Round {pick.round}</p>
                  <p className="text-[10px] font-bold uppercase tracking-tight opacity-70">{pick.year && pick.year > 2026 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic text-center px-10">Select a partner</p>
          </div>
        )}
      </div>
    </div>
  );
}