"use client";
import React from 'react';
import { Player } from '@/types/draft';

interface PlayerRowProps {
  player: Player;
  rank: number;
  onDraft: (player: Player) => void;
  onViewInfo: (player: Player) => void;
  isTeamNeed?: boolean;
  draftButtonText?: string;
}

export default function PlayerRow({ 
  player, 
  rank, 
  onDraft, 
  onViewInfo, 
  isTeamNeed = false,
  draftButtonText = "DRAFT" 
}: PlayerRowProps) {
  
  return (
    <div className="group relative flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all cursor-default touch-action-manipulation">
      
      {/* Rank & Logo */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <span className="w-6 md:w-8 text-sm md:text-lg font-black italic text-slate-400 group-hover:text-blue-600 transition-colors">
          {rank}
        </span>
        <div className="w-10 h-10 md:w-12 md:h-12 relative shrink-0 bg-slate-50 rounded-lg p-1">
          {player.college_logo_url && (
            <img 
              src={player.college_logo_url} 
              alt={player.college} 
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Clickable Player Info: Clicking here shows the profile */}
      <div 
        className="flex-grow min-w-0 cursor-pointer hover:opacity-70 transition-opacity" 
        onClick={() => onViewInfo(player)}
        title="View Player Profile"
      >
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-black uppercase text-xs md:text-sm italic leading-none text-slate-900 truncate">
            {player.name}
          </p>
          {isTeamNeed && (
            <span className="bg-blue-600 text-white text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
              NEED
            </span>
          )}
        </div>
        <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase truncate">
          {player.position} <span className="text-slate-300 mx-1">|</span> {player.college}
        </p>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-1 md:gap-3 shrink-0">
        {/* Info Icon - ONLY VISIBLE ON MOBILE (Hiddon on md screens and up) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewInfo(player);
          }}
          className="md:hidden p-2 text-slate-300 active:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        </button>

        {/* Separate Draft Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering onViewInfo
            onDraft(player);
          }}
          className="min-h-[44px] md:min-h-0 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black uppercase text-[10px] md:text-[11px] shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer touch-manipulation"
        >
          {draftButtonText}
        </button>
      </div>
    </div>
  );
}