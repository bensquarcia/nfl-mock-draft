"use client";
import Link from 'next/link';
import { Trophy, LayoutList, Database, ChevronRight } from 'lucide-react';

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
      link: "/big-board", // Updated link
      icon: <LayoutList className="w-8 h-8" />,
      status: "Active",
      color: "indigo"
    },
    {
      title: "Prospect Database",
      description: "Deep dive into player stats, college tape, and scouting reports.",
      link: "#",
      icon: <Database className="w-8 h-8" />,
      status: "Coming Soon",
      color: "slate"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-8">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-100/50 blur-[120px] pointer-events-none" />

      <header className="text-center mb-16 relative z-10">
        <h1 className="text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800">
          Draft Central <span className="text-slate-200">2026</span>
        </h1>
        <p className="text-slate-400 mt-4 font-black uppercase tracking-[0.4em] text-sm">The Ultimate Scouting Toolkit</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            href={tool.link}
            className={`group relative p-10 rounded-[2.5rem] border bg-white transition-all shadow-sm ${
              tool.status === "Coming Soon" 
                ? "opacity-60 cursor-not-allowed border-slate-100" 
                : "hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-95 border-slate-200"
            }`}
          >
            <div className={`mb-8 p-4 rounded-2xl inline-block transition-colors ${
              tool.status === "Active" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-slate-50 text-slate-400"
            }`}>
              {tool.icon}
            </div>
            
            <h2 className="text-2xl font-black uppercase italic mb-3 transition-colors">
              {tool.title}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                tool.status === "Active" 
                  ? "bg-blue-50 text-blue-600 border-blue-100" 
                  : "bg-slate-50 text-slate-400 border-slate-100"
              }`}>
                {tool.status}
              </span>
              
              {tool.status === "Active" && (
                <div className="flex items-center gap-1 text-blue-600 font-black text-xs uppercase tracking-tighter">
                  Launch <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-24 flex flex-col items-center gap-4">
        <div className="h-px w-12 bg-slate-200" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
          Powered by Draft Engine v2.0
        </p>
      </footer>
    </main>
  );
}