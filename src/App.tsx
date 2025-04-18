import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useFullscreen, useToggle } from "react-use";
import { isMobile } from "react-device-detect";
import { Fullscreen } from "lucide-react";

import useScreenOrientation from "./hooks/use-screen-orientation";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Share from "./pages/Share";
import Messages from "./pages/Messages";
import MessageDetail from "./pages/MessageDetail"; // Import the new component
import Category from "./pages/Category";
import ModalContainer from "./components/ModalContainer";
import Game from "./pages/Game";
import { useUserStore } from "./store/user";
import { DepositChannel } from "./types/deposit_channel";
import { ApiResponse } from "./types/api_response";
import { useStateStore, PlatformConfig } from "./store/state"; // Import PlatformConfig type
import { useToast } from "./hooks/use-toast";
import { ApiError } from "./types/api_error";
import axiosInstance from "./lib/axiosInstance";
import GameHistory from "./pages/GameHistory";
import TransationHistory from "./pages/TransactionHistory";
import { User, UserInfo } from "./types/user";
import { useSettingsStore } from "./store/settings"; // Import settings store
import { set } from "date-fns";
import { u } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";

// List of background music files in the public folder
const bgMusicFiles = [
  "/bg_music_1.mp3",
  "/bg_music_2.mp3",
  "/bg_music_3.mp3",
  "/bg_music_4.mp3",
];

const queryClient = new QueryClient();

const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null); // Ref for the audio element
  const { musicEnabled } = useSettingsStore(); // Get music setting state
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null
  ); // Keep track of the current song
  const [hasInteracted, setHasInteracted] = useState(false); // State to track user interaction
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
    setDepositChannels,
    setLoading,
    setError,
    error,
    platformConfig, // Get platformConfig state
    setPlatformConfig, // Get setter for platformConfig
  } = useStateStore();

  const { toast } = useToast();
  const { t } = useTranslation();

  // Effect to detect first user interaction for audio playback
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        console.log("User interacted, enabling audio playback.");
        setHasInteracted(true);
        // Remove listeners after first interaction
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
      }
    };

    // Add listeners only if interaction hasn't happened yet
    if (!hasInteracted) {
      document.addEventListener("click", handleInteraction);
      document.addEventListener("keydown", handleInteraction);
      document.addEventListener("touchstart", handleInteraction);
    }

    // Cleanup function to remove listeners if component unmounts before interaction
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted]); // Dependency array includes hasInteracted

  const loadDepositChannels = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const responses = await axiosInstance.post<ApiResponse<DepositChannel[]>>(
        "/deposit_channel_list",
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

      setDepositChannels(responses.data.data);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const transferBalance = async (amount: number) => {
    if (!user) return;
    setLoading(true);
    try {
      const responses = await axiosInstance.post<
        ApiResponse<{ balance: string; game_balance: string }>
      >("/transfer_to_game", {
        token: user.token,
        amount,
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

  const loadUserInfo = async () => {
    if (!user) return;
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

      if (responses.data.data && responses.data.data.balance > 0) {
        await transferBalance(responses.data.data.balance);
        setUser({
          ...user,
          balance: 0,
          userInfo: {
            ...responses.data.data,
            balance: 0,
            game_balance:
              parseFloat(responses.data.data.game_balance + "") +
              parseFloat(responses.data.data.balance + ""),
          },
        });
        return;
      }
      setUser({
        ...user,
        balance: responses.data.data.balance,
        userInfo: responses.data.data,
      });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPlatformConfig = async () => {
    // Check for user and token since it's required for the POST request
    if (!user || !user.token) {
      console.log("User or token missing, skipping platform config load.");
      setPlatformConfig(null); // Ensure config is cleared if no user
      return; // Exit if no user/token
    }

    setLoading(true); // Use global loading state
    try {
      const response = await axiosInstance.post<ApiResponse<PlatformConfig>>(
        "/platform_config",
        { token: user.token } // Add token to the POST body
      );

      if (
        response.data.status.errorCode !== 0 &&
        response.data.status.errorCode !== 200
      ) {
        throw new ApiError(
          t("apiErrorTitle"), // Use translation
          response.data.status.errorCode,
          response.data.status.mess
        );
      }

      setPlatformConfig(response.data.data);
    } catch (err) {
      console.error("Error loading platform config:", err);
      // Handle specific errors if needed, e.g., network error
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(
              t("networkErrorTitle"), // Use translation
              500,
              t("fetchDataFailedDesc") // Use translation
            );
      setError(apiError); // Set global error state
      setPlatformConfig(null); // Clear config on error
    } finally {
      setLoading(false); // Ensure loading is set to false
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

  // Consolidated useEffect for initial data loading based on user token
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user || !user.token) {
        // Clear data on logout or if no token
        setDepositChannels([]);
        setPlatformConfig(null);
        // setUser(null) is handled elsewhere based on 401 errors
        return;
      }

      setLoading(true); // Set loading true at the start
      setError(null); // Clear previous errors

      try {
        await loadPlatformConfig();
        if (!error) {
          await Promise.all([loadDepositChannels(), loadUserInfo()]);
        }
      } catch (err) {
        console.error("Error during initial data load sequence:", err);
      } finally {
        setLoading(false); // Set loading false at the end
      }
    };

    loadInitialData();
  }, [
    user?.token,
    setDepositChannels,
    setPlatformConfig,
    setLoading,
    setError,
  ]); // Use optional chaining for safety

  useEffect(() => {
    if (!activeModal) loadUserInfo();
  }, [activeModal]);
  return (
    <div className="bg-main w-screen h-screen relative" ref={ref}>
      {platformConfig?.is_maintain === "yes" && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-8 bg-casino-deep-blue/90 rounded-lg shadow-xl border border-casino-black">
            <h2 className="text-2xl font-bold text-casino-gold mb-4">
              {t("maintenanceTitle", "Under Maintenance")}
            </h2>
            <p className="text-casino-silver">
              {platformConfig.maintain_desc ||
                t("maintenanceDefaultDesc", "We will be back shortly.")}
            </p>
          </div>
        </div>
      )}
      {/* check orientation */}
      {(orientation === "portrait-primary" ||
        orientation === "portrait-secondary") && (
        <div className="fixed top-0 z-[110] w-screen h-screen cursor-pointer bg-zinc-950/60 glass-effect">
          <div className="flex w-full h-full items-center justify-center">
            <div className="flex mx-4 text-center flex-col w-full h-full items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8 m-4 text-casino-silver"
                fill="currentColor"
              >
                <path d="m9 1h-6a2 2 0 0 0 -2 2v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-13a2 2 0 0 0 -2-2m0 14h-6v-12h6zm12-2h-8v2h8v6h-12v-1h-3v1a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6a2 2 0 0 0 -2-2m2-3-4-2 1.91-.91c-1.17-2.78-3.91-4.59-6.91-4.59v-1.5a9 9 0 0 1 9 9z" />
              </svg>
              {t("rotateDevicePrompt")}
            </div>
          </div>
        </div>
      )}
      {/* check fullscreen  */}
      {!fullscreen && isMobile && (
        <div
          onClick={() => toggle()}
          className="fixed bottom-0 right-0 z-[100] cursor-pointer"
        >
          <Fullscreen className="w-6 h-6 m-4 text-white animate-pulse" />
        </div>
      )}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent
              audioRef={audioRef}
              musicEnabled={musicEnabled}
              hasInteracted={hasInteracted}
              currentTrackIndex={currentTrackIndex}
              setCurrentTrackIndex={setCurrentTrackIndex}
              bgMusicFiles={bgMusicFiles}
              user={user}
              loadUserInfo={loadUserInfo}
            />
          </BrowserRouter>
        </TooltipProvider>{" "}
        {/* Remove duplicate closing tag */}
        {/* Add the audio element, hidden from view, just before the main div closes */}
        <audio ref={audioRef} loop={false}></audio>
      </QueryClientProvider>
    </div>
  );
};

// New component to handle routing and music playback logic
interface AppContentProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  musicEnabled: boolean;
  hasInteracted: boolean;
  currentTrackIndex: number | null;
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number | null>>;
  bgMusicFiles: string[];
  user: User | null; // Assuming UserInfo is the correct type for user
  loadUserInfo: () => Promise<void>;
}

const AppContent: React.FC<AppContentProps> = ({
  audioRef,
  musicEnabled,
  hasInteracted,
  currentTrackIndex,
  setCurrentTrackIndex,
  bgMusicFiles,
  user,
  loadUserInfo,
}) => {
  const location = useLocation(); // Now used within Router context
  // Effect to handle background music playback
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const isGamePage = location.pathname.startsWith("/game/"); // Check if on game page

    const playRandomTrack = () => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * bgMusicFiles.length);
      } while (nextIndex === currentTrackIndex && bgMusicFiles.length > 1); // Avoid repeating the same track if possible

      setCurrentTrackIndex(nextIndex);
      audioElement.src = bgMusicFiles[nextIndex];
      audioElement
        .play()
        .catch((error) => console.error("Audio play failed:", error)); // Handle potential play errors
    };

    // Add event listener for when a track ends
    const handleTrackEnd = () => {
      playRandomTrack();
    };

    // Play only if music is enabled, user has interacted, AND not on a game page
    if (musicEnabled && hasInteracted && !isGamePage) {
      audioElement.volume = 0.3; // Set a default volume (adjust as needed)
      if (audioElement.paused || audioElement.src === "") {
        playRandomTrack(); // Start playing if enabled and not already playing
      } else {
        // If already playing (e.g., navigated back), ensure it continues
        audioElement
          .play()
          .catch((error) => console.error("Audio play failed:", error));
      }
      audioElement.addEventListener("ended", handleTrackEnd);
    } else {
      // Pause if music is disabled, user hasn't interacted, OR is on a game page
      audioElement.pause();
      // audioElement.currentTime = 0; // Optional: Reset track position
      // audioElement.src = ""; // Optional: Clear source
      // Don't reset currentTrackIndex when pausing due to game page, keep it for resume
      if (!musicEnabled || !hasInteracted) {
        setCurrentTrackIndex(null); // Reset track index only if music is off or no interaction
      }
      audioElement.removeEventListener("ended", handleTrackEnd);
    }

    // Cleanup listener on component unmount or when dependencies change
    return () => {
      if (audioElement) {
        // Check if audioElement exists before removing listener
        audioElement.removeEventListener("ended", handleTrackEnd);
      }
    };
  }, [
    musicEnabled,
    hasInteracted,
    currentTrackIndex,
    location.pathname,
    audioRef,
    bgMusicFiles,
    setCurrentTrackIndex,
  ]); // Added missing dependencies

  useEffect(() => {
    loadUserInfo();
  }, [location.pathname]);

  return (
    <>
      {user && user.token && (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/type/:gameType" element={<Category />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/history/game" element={<GameHistory />} />
          <Route path="/history/transaction" element={<TransationHistory />} />
          <Route path="/share" element={<Share />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:messageId" element={<MessageDetail />} />{" "}
          {/* Add route for message detail */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      <ModalContainer />
    </>
  );
};

export default App;
