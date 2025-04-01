export type DepositRecord = {
  id: number;
  bill_no: string;
  player_id: number;
  name: string;
  money: number;
  usdt_money: number;
  fee: number;
  payment_type: number;
  rechargeconfig_id: number;
  account: string;
  payment_desc: string;
  status: number;
  diff_money: number;
  before_money: number;
  after_money: number;
  fail_reason: string;
  hk_at: string;
  confirm_at: string;
  user_id: number;
  ishz: boolean;
  is_sc: boolean;
  payer_name: string;
  selfcard_id: number;
  img: string;
  created_at: string;
  updated_at: string;
};

export type TrabsactionRecord = {
  id: number;
  type: string;
  transaction_id: string;
  money: number;
  status: string;
  bank_account: string;
  describe: string;
  reason: string;
  created_at: string;
};

export type DepositInfo = {
  current_page: number;
  data: DepositRecord[];
  from: number;
  last_page: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};

export type TransactionInfo = {
  current_page: number;
  data: TrabsactionRecord[];
  from: number;
  last_page: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};
