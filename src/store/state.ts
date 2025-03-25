import { create } from "zustand";
import { Modal } from "@/types/modal";
import { DepositChannel } from "@/types/deposit_channel";

type Store = {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: Error | null;
  setError: (error: Error) => void;

  activeModal: Modal | null;
  setActiveModal: (activeModal?: Modal) => void;

  depositChannels: DepositChannel[];
  setDepositChannels: (depositChannels: DepositChannel[]) => void;
};

export const useStateStore = create<Store>()((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),

  error: null,
  setError: (error: Error) => set((state) => ({ ...state, error })),

  activeModal: null,
  setActiveModal: (activeModal?: Modal) =>
    set((state) => ({ ...state, activeModal })),

  depositChannels: [],
  setDepositChannels: (depositChannels: DepositChannel[]) =>
    set((state) => ({ ...state, depositChannels })),
}));
