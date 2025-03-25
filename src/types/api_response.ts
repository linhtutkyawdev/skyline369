export type ApiResponse<T> = {
  status: {
    errorCode: number;
    msg: string;
    mess: string;
  };
  data: T;
};
