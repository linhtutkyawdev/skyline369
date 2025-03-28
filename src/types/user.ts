export type User = {
  balance: number;
  bank_balance: number;
  email: string;
  gender: number;
  headimage: string;
  id: number;
  level: 1;
  name: string;
  nameTxt: null;
  phone: string;
  register_at: string;
  token: string;
  userInfo: UserInfo | null;
};

export type UserInfo = {
  name: string;
  email: string;
  balance: number;
  game_balance: number;
  bank_name: string;
  bank_card: string;
  bank_username: string;
  bank_branch_name: string;
};
