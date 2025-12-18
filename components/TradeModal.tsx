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

  const teams = Array.from(new Set(allPicks.map(p => p.current_team_name))).filter(t => t !== userTeam);
  
  const userPicks = allPicks.filter(p => p.current_team_name === userTeam);
  const cpuPicks = allPicks.filter(p => p.current_team_name === selectedCpuTeam);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
          <h2 className="text-2xl font-black italic uppercase text-blue-500">Trade Machine</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white font-bold">CANCEL</button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-px bg-slate-800 overflow-hidden">
          {/* User Side */}
          <div className="bg-slate-900 p-6 overflow-y-auto">
            <h3 className="font-black text-sm uppercase text-slate-500 mb-4">{userTeam} Assets</h3>
            <div className="space-y-2">
              {userPicks.map(pick => (
                <div 
                  key={pick.slot_number}
                  onClick={() => setUserSelectedPicks(prev => prev.includes(pick) ? prev.filter(p => p !== pick) : [...prev, pick])}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${userSelectedPicks.includes(pick) ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700'}`}
                >
                  <p className="font-bold text-xs text-white">Round {pick.round}, Pick {pick.pick_number}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CPU Side */}
          <div className="bg-slate-900 p-6 overflow-y-auto border-l border-slate-800">
            <select 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 mb-4 font-bold text-sm outline-none"
              onChange={(e) => { setSelectedCpuTeam(e.target.value); setCpuSelectedPicks([]); }}
            >
              <option value="">Select Team to Trade With</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <div className="space-y-2">
              {cpuPicks.map(pick => (
                <div 
                  key={pick.slot_number}
                  onClick={() => setCpuSelectedPicks(prev => prev.includes(pick) ? prev.filter(p => p !== pick) : [...prev, pick])}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${cpuSelectedPicks.includes(pick) ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700'}`}
                >
                  <p className="font-bold text-xs text-white">Round {pick.round}, Pick {pick.pick_number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Trading {userSelectedPicks.length} picks for {cpuSelectedPicks.length} picks
          </div>
          <button 
            disabled={!selectedCpuTeam || (userSelectedPicks.length === 0 && cpuSelectedPicks.length === 0)}
            onClick={() => onConfirmTrade(userSelectedPicks, cpuSelectedPicks, selectedCpuTeam)}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black px-10 py-3 rounded-xl uppercase transition-all shadow-lg"
          >
            Execute Trade
          </button>
        </div>
      </div>
    </div>
  );
}