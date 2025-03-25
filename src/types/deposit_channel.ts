export type DepositChannel = {
  card_id: string;
  card_type: string;
  card_username: string;
  card_number: string;
  card_bank_name: string;
  single_min: number;
  single_max: number;
  disable_starttime: string;
  disable_endtime: string;
}[];
