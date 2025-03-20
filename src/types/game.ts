// import { AxiosError, AxiosResponse } from "axios";

export type Game = {
  id: 2163;
  gameType: string;
  gameName: string;
  tcgGameCode: string;
  productCode: string;
  productType: number;
  sort: number;
  on_line: string;
  img: string;
  m_img: string;
  fs_ratio: number;
  technology: string;
  has_lobby: string; // "0"
  is_mobile: string; // "0"
  has_freespins: string; // "0"
  created_at: Date;
  updated_at: Date;
  is_show: boolean;
  is_rec: boolean;
  is_zzh: boolean;
  id_no_pay: number;
  is_outopen: boolean;
  is_ios_outopen: boolean;
  view_count: number | null;
  category: number;
};
