"use client";
import Link from 'next/link';
import Image from 'next/image';
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
      link: "/big-board",
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
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* NEW CLEAN BRANDED HEADER */}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10 px-4">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            href={tool.link}
            className={`group relative p-10 rounded-[3rem] border bg-white transition-all shadow-sm flex flex-col ${
              tool.status === "Coming Soon" 
                ? "opacity-60 cursor-not-allowed border-slate-100" 
                : "hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 active:scale-[0.98] border-slate-200"
            }`}
          >
            <div className={`mb-8 p-5 rounded-[1.5rem] inline-block self-start transition-all duration-300 ${
              tool.status === "Active" 
                ? "bg-blue-50 text-blue-600 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 shadow-sm" 
                : "bg-slate-50 text-slate-400"
            }`}>
              {tool.icon}
            </div>
            
            <h2 className="text-2xl font-black uppercase italic mb-3 text-slate-900">
              {tool.title}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                tool.status === "Active" 
                  ? "bg-slate-50 text-slate-900 border-slate-200" 
                  : "bg-slate-50 text-slate-400 border-slate-100"
              }`}>
                {tool.status}
              </span>
              
              {tool.status === "Active" && (
                <div className="flex items-center gap-1 text-blue-600 font-black text-xs uppercase tracking-tighter group-hover:gap-2 transition-all">
                  Launch Tool <ChevronRight size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-24 flex flex-col items-center gap-6">
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