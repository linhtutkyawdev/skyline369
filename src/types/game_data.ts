import { Game } from "./game";

export type GameData = {
  current_page: number;
  data: Game[];
  from: number;
  last_page: number;
  next_page_url: string;
  prev_page_url: string;
  path: string;
  per_page: number;
  to: number;
  total: number;
};
