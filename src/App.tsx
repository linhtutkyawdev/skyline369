import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useFullscreen, useToggle } from "react-use";
import { isMobile } from "react-device-detect";
import { Fullscreen, TriangleAlert } from "lucide-react";

import useScreenOrientation from "./hooks/use-screen-orientation";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Share from "./pages/Share";
import Messages from "./pages/Messages";
import Category from "./pages/Category";
import ModalContainer from "./components/ModalContainer";
import Game from "./pages/Game";
import { useUserStore } from "./store/user";
import { DepositChannel } from "./types/deposit_channel";
import { ApiResponse } from "./types/api_response";
import { useStateStore } from "./store/state";
import { useToast } from "./hooks/use-toast";
import { ApiError } from "./types/api_error";
import axiosInstance from "./lib/axiosInstance";
import GameHistory from "./pages/GameHistory";
import TransationHistory from "./pages/TransactionHistory";
import { userInfo } from "os";
import { UserInfo } from "./types/user";
import { use } from "i18next";

const queryClient = new QueryClient();

const App = () => {
  const orientation = useScreenOrientation();
  const ref = useRef<HTMLDivElement>(null);
  const [show, toggle] = useToggle(false);
  const fullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });

  const { user, setUser } = useUserStore();
  const {
    activeModal,
    setActiveModal,
    depositChannels,
    setDepositChannels,
    setLoading,
    setError,
    error,
  } = useStateStore();

  const { toast } = useToast();

  const loadDepositChannels = async () => {
    setLoading(true);

    try {
      if (depositChannels.length == 0) {
        const responses = await axiosInstance.post<
          ApiResponse<DepositChannel[]>
        >("/deposit_channel_list", {
          token: user.token,
        });

        if (
          responses.data.status.errorCode != 0 &&
          responses.data.status.errorCode != 200
        )
          throw new ApiError(
            "An error has occured!",
            responses.data.status.errorCode,
            responses.data.status.mess
          );

        setDepositChannels(responses.data.data);
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    setLoading(true);
    try {
      const responses = await axiosInstance.post<ApiResponse<UserInfo>>(
        "/player_info",
        {
          token: user.token,
        }
      );

      if (
        responses.data.status.errorCode != 0 &&
        responses.data.status.errorCode != 200
      )
        throw new ApiError(
          "An error has occured!",
          responses.data.status.errorCode,
          responses.data.status.mess
        );

      setUser({ ...user, userInfo: responses.data.data });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const transferBalance = async () => {
    setLoading(true);
    try {
      const responses = await axiosInstance.post<
        ApiResponse<{ balance: string; game_balance: string }>
      >("/transfer_to_game", {
        token: user.token,
        amount: user.userInfo.balance,
      });

      if (
        responses.data.status.errorCode != 0 &&
        responses.data.status.errorCode != 200
      )
        throw new ApiError(
          "An error has occured!",
          responses.data.status.errorCode,
          responses.data.status.mess
        );
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal === "login" || activeModal === "register") return;
    if (!user) setActiveModal("login");
  }, [user, activeModal]);

  useEffect(() => {
    if (error)
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
  }, [error]);

  useEffect(() => {
    if (depositChannels.length === 0 && user && user.token)
      (async () => {
        await loadDepositChannels();
      })();

    if (user && user.userInfo && user.userInfo.balance > 0)
      (async () => {
        await transferBalance();
        setTimeout(async () => await loadUserInfo(), 100);
      })();
  }, [user]);

  useEffect(() => {
    if (user.token) {
      loadUserInfo();
    }
  }, [user.token]);

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
            {user && user.token && (
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/type/:gameType" element={<Category />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/history/game" element={<GameHistory />} />
                <Route
                  path="/history/transaction"
                  element={<TransationHistory />}
                />
                <Route path="/share" element={<Share />} />
                <Route path="/messages" element={<Messages />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
            <ModalContainer />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
