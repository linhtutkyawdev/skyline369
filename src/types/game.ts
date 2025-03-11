// import { AxiosError, AxiosResponse } from "axios";

export type Game = {
  uuid: string;
  name: string;
  image: string;
  type: string;
  provider: string;
  api_sub_provider_id: number;
  technology: string;
  has_lobby: boolean;
  is_mobile: boolean;
  has_freespins: boolean;
  freespin_valid_until_full_day: number;
};

// export type User = {
//   name: string;
// };

// export type Notification = {
//   message: string;
//   type?: "info" | "success" | "warning" | "error";
// };

// export type NotiInfo = Notification & {
//   id: number;
//   hasScheduledForDelete: boolean;
// };

// export type Data = {
//   res: AxiosResponse;
//   error: AxiosError;
// };
