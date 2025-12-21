// src/types/draft.ts

export type Player = {
  id: number;
  name: string;
  college: string;
  position: string;
  college_logo_url?: string;
  headshot_url?: string;
  ht?: string;
  wt?: string;
  cls?: string;
  rank?: number;
  hs_stars?: number;     // Now matches your star rating logic
  // --- SCOUTING FIELDS ---
  slug?: string;         
  bio?: string;          
  pro_comp?: string;     
  status?: string;       // Added to support the .eq('status', 'active') filter
};

export type DraftSlot = {
  id: number;
  pick_number: number;
  slot_number: number;
  team_name: string;
  team_abbr: string;
  team_logo_url?: string;
  original_team_name: string;
  current_team_name: string;
  round: number;
  needs: string[];
  selection?: Player;    
  // --- TRADE MACHINE FIELDS ---
  year?: number;         
  is_consumed?: boolean; 
};