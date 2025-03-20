export type APIResponse<T> = {
  status: {
    errorCode: number;
    msg: string;
    mess: string;
  };
  data: T;
};
