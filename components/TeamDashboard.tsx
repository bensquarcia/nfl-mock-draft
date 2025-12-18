// components/TeamDashboard.tsx
import { Player, DraftSlot } from '@/types/draft';

interface TeamDashboardProps {
  teamName: string | null;
  draftedPlayers: Player[];
  draftOrder: DraftSlot[];
  onClose: () => void;
}

export default function TeamDashboard({ teamName, draftedPlayers, draftOrder, onClose }: TeamDashboardProps) {
  if (!teamName) return null;

  // Find all picks belonging to this team and match them with drafted players
  const teamPicks = draftOrder
    .map((slot, index) => ({ slot, player: draftedPlayers[index] }))
    .filter(item => item.slot.team_name === teamName);

  const teamLogo = teamPicks[0]?.slot.team_logo_url;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-6 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-4">
            {teamLogo && <img src={teamLogo} className="w-16 h-16 object-contain" alt="team logo" />}
            <div>
              <h2 className="text-2xl font-black italic uppercase text-white">{teamName}</h2>
              <p className="text-blue-500 font-bold text-xs uppercase tracking-widest">2026 Draft Class</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-black text-xl px-4 py-2">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {teamPicks.length === 0 ? (
            <p className="text-slate-500 italic text-center py-10">No picks made yet.</p>
          ) : (
            <div className="space-y-4">
              {teamPicks.map((pick, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 font-black text-xs uppercase">Pick {pick.slot.pick_number}</span>
                    {pick.player ? (
                      <div className="flex items-center gap-3">
                        <img src={pick.player.headshot_url} className="w-10 h-10 rounded-full border border-slate-700" alt="" />
                        <div>
                          <p className="font-bold text-slate-100">{pick.player.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">{pick.player.position} | {pick.player.college}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 italic text-sm">On the clock...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}