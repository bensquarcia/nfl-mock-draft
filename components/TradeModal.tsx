"use client";
import { DraftSlot } from '@/types/draft';
import { useState } from 'react';

// Logic Model: Jimmy Johnson Draft Value Chart (Classic 3000pt Scale)
const getPickValue = (pick: DraftSlot) => {
  if ((pick as any).isCustomPlayer) return (pick as any).value || 0;

  if (pick.year && pick.year > 2025) {
    const futureRoundValues = [0, 600, 200, 75, 40, 20, 10, 5];
    return futureRoundValues[pick.round] || 0;
  }
  
  const slot = pick.slot_number;
  if (slot <= 1) return 3000;
  if (slot <= 5) return 1700;
  if (slot <= 10) return 1300;
  if (slot <= 20) return 850;
  if (slot <= 32) return 600;
  if (pick.round === 2) return 350;
  if (pick.round === 3) return 150;
  if (pick.round === 4) return 60;
  if (pick.round === 5) return 30;
  if (pick.round === 6) return 15;
  return 5;
};

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

  const [showBuilder, setShowBuilder] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPos, setCustomPos] = useState("WR");
  const [customVal, setCustomVal] = useState(600);
  const [customTarget, setCustomTarget] = useState<"USER" | "CPU">("USER");

  const userValue = userSelectedPicks.reduce((sum, p) => sum + getPickValue(p), 0);
  const cpuValue = cpuSelectedPicks.reduce((sum, p) => sum + getPickValue(p), 0);
  
  const fairnessRatio = userValue > 0 ? cpuValue / userValue : 0;
  const isFair = fairnessRatio >= 0.85 && fairnessRatio <= 1.25;

  const teams = Array.from(new Set(allPicks.map(p => p.current_team_name))).filter(t => t !== userTeam).sort();
  const userPicks = allPicks.filter(p => p.current_team_name === userTeam && (p.year || 2025) === activeYear);
  const cpuPicks = allPicks.filter(p => p.current_team_name === selectedCpuTeam && (p.year || 2025) === activeYear);

  const getPickId = (pick: DraftSlot) => {
    if ((pick as any).isCustomPlayer) return `custom-${(pick as any).customId}`;
    return `${pick.year || 2025}-${pick.round}-${pick.slot_number}`;
  };

  const handleAddCustomPlayer = () => {
    if (!customName) return;
    const newPlayer = {
      id: Math.random(),
      customId: Math.random(),
      isCustomPlayer: true,
      value: customVal,
      current_team_name: customTarget === "USER" ? userTeam : selectedCpuTeam,
      year: activeYear, 
      round: 0,
      slot_number: 0,
      team_name: customName, 
      team_abbr: customPos,   
    } as any;

    if (customTarget === "USER") {
      setUserSelectedPicks([...userSelectedPicks, newPlayer]);
    } else {
      setCpuSelectedPicks([...cpuSelectedPicks, newPlayer]);
    }
    setCustomName("");
    setShowBuilder(false);
  };

  const togglePick = (pick: DraftSlot, isUser: boolean) => {
    const selected = isUser ? userSelectedPicks : cpuSelectedPicks;
    const setter = isUser ? setUserSelectedPicks : setCpuSelectedPicks;
    const pickId = getPickId(pick);

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
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden relative">
          
          {/* BUILDER OVERLAY */}
          {showBuilder && (
            <div className="absolute inset-0 z-[110] bg-white/95 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
              <div className="w-full max-w-lg bg-white border border-slate-200 p-6 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 my-auto shrink-0">
                <div className="text-center shrink-0">
                  <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">Asset Injection</p>
                  <h3 className="font-black uppercase text-2xl italic text-slate-900">Add Player to {customTarget === "USER" ? userTeam : selectedCpuTeam}</h3>
                </div>

                <div className="space-y-4 shrink-0">
                  <input 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter Player Name..."
                    className="w-full border-2 border-slate-100 rounded-2xl p-5 font-bold text-slate-900 outline-none focus:border-blue-500 text-lg shadow-sm"
                  />
                  <select 
                    value={customPos}
                    onChange={(e) => setCustomPos(e.target.value)}
                    className="w-full border-2 border-slate-100 rounded-2xl p-5 font-black outline-none bg-slate-50 text-slate-900 uppercase"
                  >
                    {["QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-6 py-4 shrink-0">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Jimmy Johnson Value</label>
                    <span className="text-blue-600 font-black text-3xl italic tracking-tighter">{customVal} PTS</span>
                  </div>
                  <input 
                    type="range" min="5" max="3000" step="10"
                    value={customVal}
                    onChange={(e) => setCustomVal(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  
                  <div className="flex justify-between items-start gap-4 px-1">
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-slate-900 uppercase">500 Pts</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic leading-tight">Solid Starter</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-[11px] font-black text-slate-900 uppercase">1500 Pts</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic leading-tight">Pro Bowl Talent</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-[11px] font-black text-slate-900 uppercase">2500+ Pts</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic leading-tight">Cornerstone</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 pt-2 shrink-0">
                  <button onClick={() => setShowBuilder(false)} className="order-2 md:order-1 flex-1 font-black uppercase text-xs py-5 text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                  <button onClick={handleAddCustomPlayer} className="order-1 md:order-2 flex-[2] bg-blue-600 text-white font-black uppercase text-xs py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all tracking-widest">Inject Asset</button>
                </div>
              </div>
            </div>
          )}

          {/* User Side */}
          <div className="bg-white p-6 overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <div className="flex flex-col">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Managing Team</p>
                  <h3 className="font-black text-lg uppercase text-slate-900 truncate">{userTeam}</h3>
               </div>
               <button 
                  onClick={() => { setCustomTarget("USER"); setShowBuilder(true); }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                >
                  + Add Player
                </button>
            </div>
            <div className="space-y-2">
              {userSelectedPicks.filter(p => (p as any).isCustomPlayer && (p as any).year === activeYear).map(pick => (
                <div key={getPickId(pick)} onClick={() => togglePick(pick, true)} className="p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center bg-emerald-600 border-emerald-600 shadow-md">
                   <div>
                      <p className="font-black text-xs uppercase text-white">{(pick as any).team_abbr} | {(pick as any).team_name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-100 italic">Custom Player • {(pick as any).value} Pts</p>
                   </div>
                </div>
              ))}
              {userPicks.map(pick => (
                <div 
                  key={getPickId(pick)}
                  onClick={() => togglePick(pick, true)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${userSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'bg-blue-600 border-blue-600 shadow-md text-white' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                >
                  <div>
                    <p className={`font-black text-xs uppercase`}>Round {pick.round}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-tight opacity-70`}>
                      {pick.year && pick.year > 2025 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Side */}
          <div className="bg-slate-50/30 p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-6 space-y-4">
               <div className="flex flex-col">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trade Partner</p>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 mt-1 font-black text-xs uppercase text-slate-900 outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm"
                    value={selectedCpuTeam}
                    onChange={(e) => { setSelectedCpuTeam(e.target.value); setCpuSelectedPicks([]); }}
                  >
                    <option value="">Select Team</option>
                    {teams.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               {selectedCpuTeam && (
                <button 
                  onClick={() => { setCustomTarget("CPU"); setShowBuilder(true); }}
                  className="w-full bg-slate-900 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                >
                  + Add Player to {selectedCpuTeam}
                </button>
               )}
            </div>
            
            <div className="space-y-2">
              {selectedCpuTeam ? (
                <>
                  {cpuSelectedPicks.filter(p => (p as any).isCustomPlayer && (p as any).year === activeYear).map(pick => (
                    <div key={getPickId(pick)} onClick={() => togglePick(pick, false)} className="p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center bg-emerald-600 border-emerald-600 shadow-md">
                      <div>
                          <p className="font-black text-xs uppercase text-white">{(pick as any).team_abbr} | {(pick as any).team_name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-100 italic">Custom Player • {(pick as any).value} Pts</p>
                      </div>
                    </div>
                  ))}
                  {cpuPicks.map(pick => (
                    <div 
                      key={getPickId(pick)}
                      onClick={() => togglePick(pick, false)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${cpuSelectedPicks.some(p => getPickId(p) === getPickId(pick)) ? 'bg-blue-600 border-blue-600 shadow-md text-white' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                      <div>
                        <p className={`font-black text-xs uppercase`}>Round {pick.round}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-tight opacity-70`}>
                          {pick.year && pick.year > 2025 ? `${pick.year} Future Pick` : `Pick #${pick.slot_number}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl mt-2 bg-white/50">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic text-center px-10">Select a partner</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-6 shrink-0">
          <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trade Fairness Meter</p>
              <p className={`text-[10px] font-black uppercase tracking-tighter ${isFair ? 'text-green-600' : 'text-slate-400'}`}>
                {userValue === 0 && cpuValue === 0 ? "Pending Selection" : isFair ? "Fair Exchange" : fairnessRatio < 0.85 ? "Insufficient Value" : "Overpayment"}
              </p>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${isFair ? 'bg-green-500' : 'bg-amber-400'}`}
                style={{ width: `${Math.min(fairnessRatio * 50, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1 text-center md:text-left">Value Analysis</p>
              <div className="text-slate-900 text-xs font-black uppercase flex items-center gap-2">
                <span className="text-blue-600">{userValue} Pts Out</span>
                <span className="text-slate-200">|</span> 
                <span className="text-blue-600">{cpuValue} Pts In</span>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                type="button"
                disabled={!selectedCpuTeam || (userSelectedPicks.length === 0 && cpuSelectedPicks.length === 0)}
                onClick={() => onConfirmTrade([...userSelectedPicks], [...cpuSelectedPicks], selectedCpuTeam)}
                className="flex-1 md:w-48 bg-blue-600 hover:bg-blue-700 disabled:opacity-20 text-white font-black px-6 py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
              >
                Force Trade
              </button>
              <button 
                type="button"
                disabled={!selectedCpuTeam || !isFair}
                onClick={() => onConfirmTrade([...userSelectedPicks], [...cpuSelectedPicks], selectedCpuTeam)}
                className="flex-1 md:w-48 bg-slate-900 hover:bg-slate-800 disabled:opacity-10 text-white font-black px-6 py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 border-b-4 border-slate-700"
              >
                Accept Trade
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}