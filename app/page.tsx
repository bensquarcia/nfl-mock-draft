"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, LayoutList, ChevronRight } from 'lucide-react';

// List of all NFL abbreviations for the background grid
const TEAM_ABBRS = [
  "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE",
  "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC",
  "LV", "LAC", "LAR", "MIA", "MIN", "NE", "NO", "NYG",
  "NYJ", "PHI", "PIT", "SF", "SEA", "TB", "TEN", "WAS"
];

export default function HomePage() {
  const tools = [
    {
      title: "Draft Simulator",
      description: "Run a full 7-round mock draft with real-time trades and team needs.",
      link: "/simulator",
      icon: <Trophy className="w-8 h-8" />,
      status: "Active",
      color: "blue"
    },
    {
      title: "Big Board Creator",
      description: "Rank your top prospects and build your own custom scouting board.",
      link: "/big-board",
      icon: <LayoutList className="w-8 h-8" />,
      status: "Active",
      color: "indigo"
    }
  ];

  // Logic to shuffle the teams so every row is completely different
  const getShuffledRow = (seed: number) => {
    return [...TEAM_ABBRS].sort(() => Math.sin(seed) - 0.5);
  };

  const TeamBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden flex flex-col gap-10 py-12">
      {[...Array(12)].map((_, rowIndex) => {
        // Create a unique team order for this specific row
        const rowTeams = [...getShuffledRow(rowIndex * 555), ...getShuffledRow(rowIndex * 999)];
        
        return (
          <div 
            key={rowIndex} 
            className={`flex gap-14 whitespace-nowrap ${
              rowIndex % 2 === 0 ? 'translate-x-[-40px]' : 'translate-x-[20px]'
            }`}
          >
            {rowTeams.map((abbr, i) => (
              <img
                key={`${abbr}-${rowIndex}-${i}`}
                src={`https://a.espncdn.com/i/teamlogos/nfl/500/${abbr.toLowerCase()}.png`}
                alt=""
                className="w-14 h-14 grayscale opacity-[0.12] object-contain shrink-0"
              />
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Randomized Team Logo Background */}
      <TeamBackground />

      {/* Social Links - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
        <Link 
          href="https://x.com/UpNext_Draft" 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-black hover:text-white hover:shadow-lg transition-all duration-300 group"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Link>
        
        <Link 
          href="https://www.reddit.com/user/UpNext_Draft_Network/" 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-[#FF4500] hover:text-white hover:shadow-lg transition-all duration-300"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.282.063.551.063.847 0 2.87-3.406 5.2-7.647 5.2-4.241 0-7.647-2.33-7.647-5.2 0-.303.026-.584.073-.873a1.74 1.74 0 0 1-.992-1.571c0-.968.786-1.754 1.754-1.754.463 0 .884.18 1.189.468 1.185-.843 2.825-1.396 4.632-1.485l.842-3.953a.26.26 0 0 1 .316-.201l2.96.623a1.248 1.248 0 0 1 1.018-.519zm-8.214 7.647c-.61 0-1.108.497-1.108 1.107 0 .61.498 1.108 1.108 1.108.61 0 1.107-.498 1.107-1.108 0-.61-.497-1.107-1.107-1.107zm6.403 0c-.61 0-1.109.497-1.109 1.107 0 .61.498 1.108 1.109 1.108.61 0 1.107-.498 1.107-1.108 0-.61-.497-1.107-1.107-1.107zm-7.054 3.75a.25.25 0 0 0-.251.274 3.978 3.978 0 0 0 3.737 3.66 3.978 3.978 0 0 0 3.738-3.66.25.25 0 0 0-.44-.19 3.483 3.483 0 0 1-3.298 3.09 3.483 3.483 0 0 1-3.296-3.09.25.25 0 0 0-.19-.084z"/>
          </svg>
        </Link>
      </div>

      {/* Subtle Blue/Indigo Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none z-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none z-1" />

      {/* CLEAN BRANDED HEADER */}
      <header className="text-center mb-20 relative z-10 flex flex-col items-center">
        <div className="inline-block px-4 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
          Professional Scouting Tools
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 relative">
            <Image 
              src="/logo.png" 
              alt="Draft Network Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              Draft <span className="text-blue-600">Network</span>
            </h1>
            <p className="text-slate-400 mt-4 font-black uppercase tracking-[0.5em] text-[11px] ml-[0.5em]">
              The Ultimate Scouting Toolkit
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10 px-4">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            href={tool.link}
            className="group relative p-10 rounded-[3rem] border bg-white/90 backdrop-blur-sm transition-all shadow-sm flex flex-col hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 active:scale-[0.98] border-slate-200"
          >
            <div className="mb-8 p-5 rounded-[1.5rem] inline-block self-start transition-all duration-300 bg-blue-50 text-blue-600 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 shadow-sm">
              {tool.icon}
            </div>
            
            <h2 className="text-2xl font-black uppercase italic mb-3 text-slate-900">
              {tool.title}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-900 border-slate-200">
                {tool.status}
              </span>
              
              <div className="flex items-center gap-1 text-blue-600 font-black text-xs uppercase tracking-tighter group-hover:gap-2 transition-all">
                Launch Tool <ChevronRight size={14} strokeWidth={3} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-24 flex flex-col items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-slate-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <div className="h-px w-8 bg-slate-200" />
        </div>
        <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.4em]">
          Copyright © 2026 Draft Network • Premium Scouting v2.0
        </p>
      </footer>
    </main>
  );
}