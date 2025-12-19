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
  // --- NEW FIELDS ---
  slug?: string;         // Unique URL-friendly name (e.g., 'travis-hunter')
  bio?: string;          // Full scouting report text
  comparisons?: string;  // NFL pro comparison
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
  selection?: Player; // Stores the drafted player result
};