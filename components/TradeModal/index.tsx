"use client";
import { DraftSlot } from '@/types/draft';
import { useState } from 'react';
import AssetBuilder from './AssetBuilder';
import TeamColumn from './TeamColumn';
import FairnessMeter from './FairnessMeter';
import TradeFinder from './TradeFinder';

const getPickValue = (pick: DraftSlot) => {
  if ((pick as any).isCustomPlayer) return (pick as any).value || 0;
  if (pick.year && pick.year > 2026) {
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

const getValueLabel = (val: number) => {
    if (val >= 2500) return "Generational Cornerstone";
    if (val >= 1000) return "Elite Star Player";
    if (val >= 500) return "High-Impact Starter";
    if (val >= 100) return "Solid Starter";
    return "Depth/Developmental";
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
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [showBuilder, setShowBuilder] = useState(false);
  const [customTarget, setCustomTarget] = useState<"USER" | "CPU">("USER");

  const userValue = userSelectedPicks.reduce((sum, p) => sum + getPickValue(p), 0);
  const cpuValue = cpuSelectedPicks.reduce((sum, p) => sum + getPickValue(p), 0);
  const fairnessRatio = userValue > 0 ? cpuValue / userValue : 0;
  const isFair = fairnessRatio >= 0.85 && fairnessRatio <= 1.25;

  const teams = Array.from(new Set(allPicks.map(p => p.current_team_name)))
    .filter(t => t !== userTeam)
    .sort();

  const getPicksForTeam = (teamName: string, year: number) => {
    const existing = allPicks.filter(p => 
      p.current_team_name === teamName && 
      (p.year === year || (!p.year && year === 2026)) &&
      p.slot_number < 1000 
    );

    if (existing.length > 0 || year === 2026) return existing;

    return [1, 2, 3, 4, 5, 6, 7].map(round => ({
        id: `gen-${teamName}-${year}-${round}`,
        year: year,
        round: round,
        slot_number: 0,
        current_team_name: teamName,
        team_name: teamName,
        team_abbr: "",
        team_id: 0,
        is_locked: false
    } as unknown as DraftSlot));
  };

  const getPickId = (pick: DraftSlot) => {
    if ((pick as any).isCustomPlayer) return `custom-${(pick as any).customId}`;
    return `${pick.year || 2026}-${pick.round}-${pick.slot_number || 0}-${pick.id}`;
  };

  const handleTogglePick = (pick: DraftSlot, isUser: boolean) => {
    const selected = isUser ? userSelectedPicks : cpuSelectedPicks;
    const setter = isUser ? setUserSelectedPicks : setCpuSelectedPicks;
    const pickId = getPickId(pick);

    if (selected.some(p => getPickId(p) === pickId)) {
      setter(selected.filter(p => getPickId(p) !== pickId));
    } else {
      setter([...selected, { ...pick }]); 
    }
  };

  const handleInjectAsset = (name: string, pos: string, val: number) => {
    const newPlayer = {
      id: Math.random(),
      customId: Math.random(),
      isCustomPlayer: true,
      value: val,
      current_team_name: customTarget === "USER" ? userTeam : selectedCpuTeam,
      year: activeYear, 
      round: 0,
      slot_number: 0,
      team_name: name, 
      team_abbr: pos,   
    } as any;

    if (customTarget === "USER") setUserSelectedPicks([...userSelectedPicks, newPlayer]);
    else setCpuSelectedPicks([...cpuSelectedPicks, newPlayer]);
    setShowBuilder(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 text-slate-900">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-[2.5rem] overflow-hidden flex flex-col h-[90vh] md:h-[85vh] shadow-2xl">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
              Trade <span className="text-blue-600">Machine</span>
            </h2>
            <div className="flex gap-1.5 mt-3">
              {[2026, 2027, 2028].map(year => (
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

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden relative">
          {showBuilder && (
            <AssetBuilder 
              teamName={customTarget === "USER" ? userTeam : selectedCpuTeam}
              onClose={() => setShowBuilder(false)}
              onInject={handleInjectAsset}
              getValueLabel={getValueLabel}
            />
          )}

          <TeamColumn 
            key={`user-${activeYear}`}
            teamName={userTeam}
            picks={getPicksForTeam(userTeam, activeYear)}
            selectedPicks={userSelectedPicks}
            activeYear={activeYear}
            onTogglePick={(p) => handleTogglePick(p, true)}
            onAddCustom={() => { setCustomTarget("USER"); setShowBuilder(true); }}
            getPickId={getPickId}
            getValueLabel={getValueLabel}
            isUserColumn={true}
          />

          <TeamColumn 
            key={`cpu-${selectedCpuTeam}-${activeYear}`}
            teamName={selectedCpuTeam}
            picks={getPicksForTeam(selectedCpuTeam, activeYear)}
            selectedPicks={cpuSelectedPicks}
            activeYear={activeYear}
            onTogglePick={(p) => handleTogglePick(p, false)}
            onAddCustom={() => { setCustomTarget("CPU"); setShowBuilder(true); }}
            getPickId={getPickId}
            getValueLabel={getValueLabel}
            isUserColumn={false}
            teams={teams}
            onTeamChange={(val) => { setSelectedCpuTeam(val); setCpuSelectedPicks([]); }}
          >
            {/* Trade Finder Integrated Here */}
            <TradeFinder 
              userSelectedPicks={userSelectedPicks}
              userValue={userValue}
              allPicks={allPicks}
              userTeam={userTeam}
              getPickValue={getPickValue}
              onSelectTrade={(team, picks) => {
                setSelectedCpuTeam(team);
                setCpuSelectedPicks(picks);
              }}
            />
          </TeamColumn>
        </div>

        <FairnessMeter 
          userValue={userValue}
          cpuValue={cpuValue}
          isFair={isFair}
          fairnessRatio={fairnessRatio}
          onConfirm={(force) => onConfirmTrade([...userSelectedPicks], [...cpuSelectedPicks], selectedCpuTeam)}
          canAccept={!!selectedCpuTeam && isFair}
          canForce={!!selectedCpuTeam && (userSelectedPicks.length > 0 || cpuSelectedPicks.length > 0)}
        />
      </div>
    </div>
  );
}