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

  // FIX: Helper to create a unique ID for every single pick across all rounds and years
  const getPickId = (pick: DraftSlot) => `${pick.year || 2025}-${pick.round}-${pick.slot_number}`;

  const togglePick = (pick: DraftSlot, isUser: boolean) => {
    const selected = isUser ? userSelectedPicks : cpuSelectedPicks;
    const setter = isUser ? setUserSelectedPicks : setCpuSelectedPicks;
    
    const pickId = getPickId(pick);

    // Use the Unique ID instead of just slot_number to prevent logo mixing
    if (selected.some(p => getPickId(p) === pickId)) {
      setter(selected.filter(p => getPickId(p) !== pickId));
    } else {
      setter([...selected, { ...pick }]); 
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-[2.5rem] overflow-hidden flex flex-col h-[90vh] md:h-[85vh] shadow-2xl text-slate-900">
        
        {/* Header Section */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Trade <span className="text-blue-600">Machine</span></h2>
              <span className="hidden md:block bg-blue-50 border border-blue-100 px-2 py-1 rounded text-[9px] font-black text-blue-600 uppercase tracking-widest">
                Scouting Toolkit
              </span>
            </div>
            <div className="flex gap-1.5 mt-3">
              {[2025, 2026, 2027].map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-3 md:px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${activeYear === year ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Trade Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* User Side */}
          <div className="bg-white p-6 overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex flex-col mb-4">
               <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Managing Team</p>
               <h3 className="font-black text-lg uppercase text-slate-900 truncate">{userTeam}</h3>
            </div>
            <div className="space-y-2">
              {userPicks.length > 0 ? (
                userPicks.map(pick => (
                  <div 
                    key={getPickId(pick)}
                    onClick={() => togglePick(pick, true)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${userSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'bg-blue-600 border-blue-600 shadow-md' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                  >
                    <div>
                      <p className={`font-black text-xs uppercase ${userSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'text-white' : 'text-slate-900'}`}>Round {pick.round}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-tight ${userSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'text-blue-100' : 'text-slate-400'}`}>
                        {pick.year && pick.year > 2025 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-[10px] font-bold uppercase italic py-12 text-center">No assets for {activeYear}</p>
              )}
            </div>
          </div>

          {/* Partner Side */}
          <div className="bg-slate-50/30 p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-4">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Trade Partner</p>
               <select 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 font-black text-xs uppercase text-slate-900 outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm"
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
                    key={getPickId(pick)}
                    onClick={() => togglePick(pick, false)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${cpuSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'bg-blue-600 border-blue-600 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                    <div>
                      <p className={`font-black text-xs uppercase ${cpuSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'text-white' : 'text-slate-900'}`}>Round {pick.round}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-tight ${cpuSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'text-blue-100' : 'text-slate-400'}`}>
                        {pick.year && pick.year > 2025 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl mt-2 bg-white/50">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic text-center px-10">Select a partner</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex flex-col">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1 text-center md:text-left">Proposed Exchange</p>
            <div className="text-slate-900 text-xs font-black uppercase flex items-center gap-2">
              <span className={userSelectedPicks.length > 0 ? "text-blue-600" : ""}>{userSelectedPicks.length} Giving</span>
              <span className="text-slate-200">|</span> 
              <span className={cpuSelectedPicks.length > 0 ? "text-blue-600" : ""}>{cpuSelectedPicks.length} Receiving</span>
            </div>
          </div>
          <button 
            type="button"
            disabled={!selectedCpuTeam || (userSelectedPicks.length === 0 && cpuSelectedPicks.length === 0)}
            onClick={() => onConfirmTrade([...userSelectedPicks], [...cpuSelectedPicks], selectedCpuTeam)}
            className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 disabled:opacity-20 text-white font-black px-12 py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
          >
            Confirm Trade
          </button>
        </div>
      </div>
    </div>
  );
}