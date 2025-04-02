// Define the structure for a single game history record based on the API response
export interface GameHistoryRecord {
  game_name: string;
  game_type: string;
  game_provider: string;
  amount: number; // This seems to be the win/loss amount based on the example (0 for a bet?)
  win_loss_status: "win" | "loss" | string; // Allow for other potential statuses
  bet_id: string;
  bet_time: string; // Keep as string for now, format later if needed
  currency: string;
  bet_type: string; // Could be 'bet', 'win', 'freespin', etc.
  freespin_id: string | null;
  quantity: number | null;
}

// Define the structure for the 'data' part of the API response
// Note: The API response example shows 'data' directly as Data[],
// but wrapping it in an object allows for potential future pagination fields.
export interface GameHistoryInfo {
  total_lossAmount: number;
  total_winAmount: number;
  total_netAmount: number;
  data: GameHistoryRecord[];
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  next_page_url: string;
  per_page: number;
  prev_page_url: null | string;
  total: number;
}
