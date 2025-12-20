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
  hs_stars?: number;
  // --- SCOUTING FIELDS ---
  slug?: string;         // Unique URL-friendly name
  bio?: string;          // Full scouting report text
  pro_comp?: string;     // NFL pro comparison (Matches our SQL update)
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
  selection?: Player;    // Stores the drafted player result
  // --- TRADE MACHINE FIELDS ---
  year?: number;         // Added to support 2026/2027 picks
  is_consumed?: boolean; // Added to hide picks that already happened
};