import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useFullscreen, useToggle } from "react-use";
import { isMobile } from "react-device-detect";
import { Fullscreen } from "lucide-react";

import useScreenOrientation from "./hooks/use-screen-orientation";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import History from "./pages/History";
import Share from "./pages/Share";
import Messages from "./pages/Messages";
import Category from "./pages/Category";
import ModalContainer from "./components/ModalContainer";
import { useUserStore } from "./store/user";
import { DepositChannel } from "./types/deposit_channel";
import { APIResponse } from "./types/api_response";
import axiosInstance from "./lib/axiosInstance";
import { useStateStore } from "./store/state";

const queryClient = new QueryClient();

const App = () => {
  const orientation = useScreenOrientation();
  const ref = useRef<HTMLDivElement>(null);
  const [show, toggle] = useToggle(false);
  const fullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });

  const { user } = useUserStore();
  const {
    setActiveModal,
    depositChannels,
    setDepositChannels,
    setLoading,
    setError,
  } = useStateStore();

  const loadDepositChannels = async () => {
    setLoading(true);

    try {
      if (depositChannels.length == 0) {
        const responses = await axiosInstance.post<
          APIResponse<DepositChannel[]>
        >("/deposit_channel_list", {
          token: user.token,
        });
        setDepositChannels(responses.data.data);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.token) setActiveModal("login");
  }, [user]);

  useEffect(() => {
    (async () => await loadDepositChannels())();
  }, []);

  return (
    <div className="bg-main" ref={ref}>
      {/* check orientation */}
      {(orientation === "portrait-primary" ||
        orientation === "portrait-secondary") && (
        <div className="fixed top-0 z-[110] w-screen h-screen cursor-pointer bg-zinc-950/60 glass-effect">
          <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col w-full h-full items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8 m-4 text-casino-silver"
                fill="currentColor"
              >
                <path d="m9 1h-6a2 2 0 0 0 -2 2v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-13a2 2 0 0 0 -2-2m0 14h-6v-12h6zm12-2h-8v2h8v6h-12v-1h-3v1a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6a2 2 0 0 0 -2-2m2-3-4-2 1.91-.91c-1.17-2.78-3.91-4.59-6.91-4.59v-1.5a9 9 0 0 1 9 9z" />
              </svg>
              For optimal experience, please rotate your device
            </div>
          </div>
        </div>
      )}

      {/* check fullscreen  */}
      {!fullscreen && isMobile && (
        <div
          onClick={() => toggle()}
          className="fixed top-0 z-[100] w-screen h-screen cursor-pointer bg-zinc-950/60 glass-effect"
        >
          <div className="flex flex-col w-full h-full items-center justify-center">
            <Fullscreen className="w-8 h-8 m-4 text-casino-silver" />
            Please click anywhere on the screen to enter fullscreen mode
          </div>
        </div>
      )}

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/type/:gameType" element={<Category />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/history" element={<History />} />
              <Route path="/share" element={<Share />} />
              <Route path="/messages" element={<Messages />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ModalContainer />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
