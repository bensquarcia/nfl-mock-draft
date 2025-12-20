"use client";
import { DraftSlot } from '@/types/draft';
import { useState } from 'react';

interface TradeModalProps {
  userTeam: string;
  allPicks: DraftSlot[];
  onClose: () => void;
  onConfirmTrade: (userPicks: DraftSlot[], cpuPicks: DraftSlot[], cpuTeam: string) => void;
}

export default function TradeModal({ userTeam, allPicks, onClose, onConfirmTrade }: TradeModalProps) {
  const [selectedCpuTeam, setSelectedCpuTeam] = useState('');
  const [userSelectedPicks, setUserSelectedPicks] = useState<DraftSlot[]>([]);
  const [cpuSelectedPicks, setCpuSelectedPicks] = useState<DraftSlot[]>([]);
  const [activeYear, setActiveYear] = useState<number>(2025);

  const teams = Array.from(new Set(allPicks.map(p => p.current_team_name))).filter(t => t !== userTeam).sort();
  
  const userPicks = allPicks.filter(p => p.current_team_name === userTeam && (p.year || 2025) === activeYear);
  const cpuPicks = allPicks.filter(p => p.current_team_name === selectedCpuTeam && (p.year || 2025) === activeYear);

  const togglePick = (pick: DraftSlot, isUser: boolean) => {
    const selected = isUser ? userSelectedPicks : cpuSelectedPicks;
    const setter = isUser ? setUserSelectedPicks : setCpuSelectedPicks;
    
    if (selected.some(p => p.slot_number === pick.slot_number)) {
      setter(selected.filter(p => p.slot_number !== pick.slot_number));
    } else {
      // Force a fresh object reference to ensure React tracks it correctly
      setter([...selected, { ...pick }]); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col h-[85vh] shadow-2xl">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black italic uppercase text-blue-500">Trade Machine</h2>
              <span className="bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">
                Clock Active
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              {[2025, 2026, 2027].map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeYear === year ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  {year} Assets
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">CANCEL</button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-px bg-slate-800 overflow-hidden">
          <div className="bg-slate-900 p-6 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col mb-4">
               <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Managing</p>
               <h3 className="font-black text-lg uppercase text-white truncate">{userTeam}</h3>
            </div>
            <div className="space-y-2">
              {userPicks.length > 0 ? (
                userPicks.map(pick => (
                  <div 
                    key={`${pick.slot_number}-${pick.current_team_name}`}
                    onClick={() => togglePick(pick, true)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${userSelectedPicks.some(p => p.slot_number === pick.slot_number) ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div>
                      <p className="font-black text-xs text-white uppercase">Round {pick.round}</p>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">
                        {pick.year && pick.year > 2025 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}
                      </p>
                    </div>
                    {userSelectedPicks.some(p => p.slot_number === pick.slot_number) && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-[10px] font-bold uppercase italic opacity-50 py-10 text-center border-2 border-dashed border-slate-800 rounded-2xl">No remaining assets for {activeYear}</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-6 overflow-y-auto border-l border-slate-800 custom-scrollbar">
            <div className="mb-4">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Trade Partner</p>
               <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-black text-xs uppercase tracking-widest outline-none text-blue-400 focus:border-blue-500 transition-all cursor-pointer shadow-inner"
                value={selectedCpuTeam}
                onChange={(e) => { setSelectedCpuTeam(e.target.value); setCpuSelectedPicks([]); }}
               >
                <option value="">Select Team</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            
            <div className="space-y-2">
              {selectedCpuTeam ? (
                cpuPicks.map(pick => (
                  <div 
                    key={`${pick.slot_number}-${pick.current_team_name}`}
                    onClick={() => togglePick(pick, false)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${cpuSelectedPicks.some(p => p.slot_number === pick.slot_number) ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div>
                      <p className="font-black text-xs text-white uppercase">Round {pick.round}</p>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">
                        {pick.year && pick.year > 2025 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}
                      </p>
                    </div>
                    {cpuSelectedPicks.some(p => p.slot_number === pick.slot_number) && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl mt-2 opacity-30 grayscale">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic text-center px-10">Choose a partner to view their {activeYear} picks</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Proposed Exchange</p>
            <div className="text-white text-xs font-black uppercase flex items-center gap-2">
              <span className={userSelectedPicks.length > 0 ? "text-blue-400" : ""}>{userSelectedPicks.length} Away</span>
              <span className="text-slate-700">|</span> 
              <span className={cpuSelectedPicks.length > 0 ? "text-blue-400" : ""}>{cpuSelectedPicks.length} Return</span>
            </div>
          </div>
          <button 
            type="button"
            disabled={!selectedCpuTeam || (userSelectedPicks.length === 0 && cpuSelectedPicks.length === 0)}
            onClick={() => onConfirmTrade([...userSelectedPicks], [...cpuSelectedPicks], selectedCpuTeam)}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-10 text-white font-black px-12 py-4 rounded-2xl uppercase text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95"
          >
            Confirm Trade
          </button>
        </div>
      </div>
    </div>
  );
}