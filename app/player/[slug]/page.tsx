import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Next.js 15 requires params to be handled as a Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayerProfile({ params }: PageProps) {
  // 1. Await the params to get the slug
  const { slug } = await params;

  // 2. Fetch the player from Supabase
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('slug', slug)
    .single();

  // 3. If no player is found or there is an error, show 404
  if (!player || error) {
    console.error("Fetch error or player not found:", error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation Header */}
      <nav className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-blue-400 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
            ← Back to Draft Board
          </Link>
          <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            2026 Prospect Profile
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8 lg:p-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
          <div className="w-48 h-48 bg-white rounded-3xl p-6 shadow-2xl shadow-blue-500/10 shrink-0">
            {player.college_logo_url && (
              <img 
                src={player.college_logo_url} 
                alt={player.college} 
                className="w-full h-full object-contain"
              />
            )}
          </div>
          
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              Top Prospect
            </div>
            <h1 className="text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">
              {player.name}
            </h1>
            <p className="text-2xl font-bold text-slate-400 uppercase tracking-tight">
              {player.position} <span className="text-slate-700 mx-2">|</span> {player.college}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Scouting Report */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase italic text-blue-500 mb-6 flex items-center gap-4">
                Scouting Report
                <div className="h-px bg-slate-800 flex-grow"></div>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {player.bio || `${player.name} is a high-upside ${player.position} out of ${player.college}. Known for elite physical tools and game-changing ability, he is projected as a centerpiece for a professional team.`}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase italic text-blue-500 mb-6 flex items-center gap-4">
                Pro Comparison
                <div className="h-px bg-slate-800 flex-grow"></div>
              </h2>
              <p className="text-slate-400 italic text-lg">
                {player.comparisons || "Analyzing tape for comparisons..."}
              </p>
            </section>
          </div>

          {/* Right Column: Physicals & Specs */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Prospect Specs</h3>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Height</p>
                  <p className="text-xl font-bold">{player.ht || "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Weight</p>
                  <p className="text-xl font-bold">{player.wt ? `${player.wt} lbs` : "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Class</p>
                  <p className="text-xl font-bold">{player.cls || "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Draft Grade</p>
                  <p className="text-xl font-bold text-blue-400">1st Round</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-dashed border-slate-800 rounded-3xl text-center">
              <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Stats Module Loading...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}