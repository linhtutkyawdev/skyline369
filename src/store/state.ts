import { create } from "zustand";
import { Modal } from "@/types/modal";
import { DepositChannel } from "@/types/deposit_channel";
import { ApiError } from "@/types/api_error";

type Store = {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: ApiError | null;
  setError: (error: ApiError) => void;

  activeModal: Modal | null;
  setActiveModal: (activeModal: Modal | null) => void;

  depositChannels: DepositChannel[];
  setDepositChannels: (depositChannels: DepositChannel[]) => void;
};

export const useStateStore = create<Store>()((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),

  error: null,
  setError: (error: ApiError | null) => set((state) => ({ ...state, error })),

  activeModal: null,
  setActiveModal: (activeModal: Modal | null) =>
    set((state) => ({ ...state, activeModal })),

  depositChannels: [],
  setDepositChannels: (depositChannels: DepositChannel[]) =>
    set((state) => ({ ...state, depositChannels })),
}));
