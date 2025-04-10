import { create } from "zustand";
import { Modal } from "@/types/modal";
import { DepositChannel } from "@/types/deposit_channel";
import { ApiError } from "@/types/api_error";

// Define the PlatformConfig type based on the API response
export type PlatformConfig = {
  withdraw_start_limit: string;
  withdraw_end_limit: string;
  withdraw_start_at: string;
  withdraw_end_at: string;
  site_title: string;
  site_name: string;
  service_link: string;
  service_link_type: string;
  service_link_1: string;
  service_link_type_1: string;
  service_link_2: string;
  service_link_type_2: string;
  is_maintain: "yes" | "no";
  maintain_desc: string;
};

interface StateStore {
  // Renamed to StateStore for consistency with filename
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: ApiError | null;
  setError: (error: ApiError | null) => void;
  activeModal: Modal | null; // Use Modal
  setActiveModal: (modal: Modal | null) => void;
  depositChannels: DepositChannel[];
  setDepositChannels: (channels: DepositChannel[]) => void;
  platformConfig: PlatformConfig | null; // Add platformConfig state
  setPlatformConfig: (config: PlatformConfig | null) => void; // Add setter
}

export const useStateStore = create<StateStore>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }), // Simplified setter
  error: null,
  setError: (error) => set({ error }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  depositChannels: [],
  setDepositChannels: (channels) => set({ depositChannels: channels }), // Simplified setter
  platformConfig: null, // Initialize platformConfig
  setPlatformConfig: (config) => set({ platformConfig: config }), // Implement setter
}));
