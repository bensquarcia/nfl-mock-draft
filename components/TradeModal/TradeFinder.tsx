"use client";
import { DraftSlot } from '@/types/draft';
import { useState, useMemo } from 'react';

interface TradeFinderProps {
  userSelectedPicks: DraftSlot[];
  userValue: number;
  allPicks: DraftSlot[];
  userTeam: string;
  onSelectTrade: (team: string, picks: DraftSlot[]) => void;
  getPickValue: (pick: DraftSlot) => number;
}

export default function TradeFinder({ userSelectedPicks, userValue, allPicks, userTeam, onSelectTrade, getPickValue }: TradeFinderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const offers = useMemo(() => {
    if (userValue <= 0 || userSelectedPicks.length === 0) return [];

    const results: { team: string; picks: DraftSlot[]; totalValue: number; label: string }[] = [];
    const teams = Array.from(new Set(allPicks.map(p => p.current_team_name))).filter(t => t !== userTeam);
    
    const highestUserPick = [...userSelectedPicks].sort((a, b) => getPickValue(b) - getPickValue(a))[0];
    const isHighValueTrade = userValue > 1000;

    teams.forEach(team => {
      const teamPicks = allPicks.filter(p => p.current_team_name === team && (p.slot_number || 0) > 0 && (p.slot_number || 0) < 1000);
      
      // FIX: Ensure IDs here match the "gen-" format used in index.tsx
      const futurePicks: DraftSlot[] = [1, 2, 3].map(round => ({
        id: `gen-${team}-2027-${round}`, // CRITICAL: Matches index.tsx logic
        year: 2027,
        round: round,
        slot_number: 0,
        current_team_name: team,
        team_name: team,
        team_abbr: "FUT",
        team_id: 0,
        original_team_id: 0,
        is_locked: false,
        is_user_team: false
      } as unknown as DraftSlot));

      const combinedPool = [...teamPicks, ...futurePicks];

      // --- LOGIC A: THE "KING'S RANSOM" ---
      if (isHighValueTrade) {
        for (let i = 0; i < Math.min(teamPicks.length, 6); i++) {
          for (let j = i + 1; j < Math.min(teamPicks.length, 7); j++) {
            const futureBonus = futurePicks[0]; 
            const combo = [teamPicks[i], teamPicks[j], futureBonus];
            const totalVal = combo.reduce((sum, p) => sum + getPickValue(p), 0);
            const ratio = totalVal / userValue;

            if (ratio >= 0.85 && ratio <= 1.20) {
              results.push({ team, picks: combo, totalValue: totalVal, label: "The King's Ransom" });
            }
          }
        }
      }

      // --- LOGIC B: THE "MOVE UP" ---
      combinedPool.forEach(p => {
        const pVal = getPickValue(p);
        if (pVal > getPickValue(highestUserPick) * 1.15) {
          const ratio = pVal / userValue;
          if (ratio >= 0.70 && ratio <= 0.90) { 
            results.push({ team, picks: [p], totalValue: pVal, label: "Aggressive Move-Up" });
          }
        }
      });

      // --- LOGIC C: VALUE DEPTH SWAP ---
      if (!isHighValueTrade) {
        teamPicks.forEach(p => {
            const pVal = getPickValue(p);
            const ratio = pVal / userValue;
            const sweetener = teamPicks.find(s => (s.round || 0) >= 6);
            if (sweetener && ratio >= 0.80 && ratio <= 1.10 && p.round !== highestUserPick.round) {
                results.push({ team, picks: [p, sweetener], totalValue: pVal + getPickValue(sweetener), label: "Value Package" });
            }
        });
      }
    });

    return results
      .sort((a, b) => Math.abs(1 - (a.totalValue / userValue)) - Math.abs(1 - (b.totalValue / userValue)))
      .filter((v, i, a) => a.findIndex(t => t.team === v.team) === i)
      .slice(0, 5);
  }, [userValue, allPicks, userTeam, userSelectedPicks, getPickValue]);

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={userValue === 0}
        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${
          userValue === 0 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        {userValue === 0 ? "Select Picks to Find Trades" : isOpen ? "Close Offers" : "Find Trade Partners"}
      </button>

      {isOpen && userValue > 0 && (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {offers.length === 0 ? (
            <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-[10px] font-bold uppercase italic tracking-tight">No logical hauls found.</p>
            </div>
          ) : (
            offers.map((offer, idx) => (
              <button
                key={idx}
                onClick={() => { onSelectTrade(offer.team, offer.picks); setIsOpen(false); }}
                className="w-full p-3 bg-white border border-slate-200 hover:border-blue-500 rounded-xl flex items-center justify-between group transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <div className="text-left">
                  <span className="block text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">{offer.label}</span>
                  <span className="block font-black text-slate-800 text-xs uppercase">{offer.team}</span>
                </div>
                <div className="text-right">
                  <div className="flex flex-wrap gap-1 justify-end mb-1 max-w-[120px]">
                    {offer.picks.map((p, i) => (
                      <span key={i} className={`px-1.5 py-0.5 text-white text-[7px] font-black rounded uppercase ${(p.year || 0) > 2026 ? 'bg-amber-500 shadow-sm shadow-amber-200' : 'bg-slate-900'}`}>
                        {(p.year || 0) > 2026 ? `'${p.year?.toString().slice(-2)} R${p.round}` : `R${p.round}`}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 tracking-tighter">{Math.round(offer.totalValue)} pts</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}