import { Share, MessageSquare, Settings, RefreshCcw, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"; // Import the hook
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useStateStore } from "@/store/state";
import { useUserStore } from "@/store/user"; // Import user store
// Removed Dropdown imports
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setActiveModal } = useStateStore();
  const isMobile = useIsMobile(); // Use the hook
  const { user, lastUpdatedAt } = useUserStore(); // Get lastUpdatedAt from store

  const { gameType } = useParams();

  return (
    <>
      <header className="fixed top-0 w-full py-4 px-8 z-50 flex justify-between items-center xl:glass-effect animate-fade-in">
        <div className="flex items-center gap-2 xl:gap-4 w-[13rem]">
          <div
            onClick={() => setActiveModal(user ? "profile" : "login")}
            className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-full overflow-hidden border-2 border-casino-gold flex items-center justify-center cursor-pointer transition-all hover:border-4 hover:scale-105"
          >
            <img
              src="/login_modal_bg.png"
              alt={t("profileAlt")}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-casino-silver font-semibold text-sm 2xl:text-lg">
              {(user && user.name) || t("register_login")}
            </span>
            <span className="text-casino-gold text-xs 2xl:text-sm">
              {user && user.userInfo
                ? "$ " + parseFloat(user.userInfo.game_balance + "").toFixed(2)
                : "loading..."}
            </span>
          </div>
          {isMobile ? (
            <button className="" onClick={() => window.location.reload()}>
              <RefreshCcw className="w-4 h-4 text-casino-silver cursor-pointer active:scale-95 transition-transform" />
            </button>
          ) : (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="" onClick={() => window.location.reload()}>
                    <RefreshCcw className="w-4 h-4 text-casino-silver cursor-pointer hover:-rotate-45 hover:scale-110 transition-all" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {lastUpdatedAt
                      ? `${t("lastUpdated")}: ${new Date(
                          lastUpdatedAt
                        ).toLocaleString()}`
                      : t("userDataNotLoaded")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {gameType && (
          <h3 className="absolute -z-10 inset-0 w-full h-full flex items-center justify-center text-casino-silver capitalize font-bold text-lg 2xl:text-2xl">
            {gameType}
          </h3>
        )}

        {/* Inline icons for md and larger screens */}
        <div className="hidden md:flex items-center gap-3 mr-2 xl:gap-4 xl-mr-2 2xl:gap-8 2xl:mr-4">
          {/* Share Icon */}
          <div
            className="nav-icon group cursor-pointer"
            onClick={() => setActiveModal("share")}
          >
            <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full metal-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
              <Share className="w-5 h-5 2xl:w-6 2xl:h-6 text-casino-silver" />
            </div>
            <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
              {t("share")}
            </span>
          </div>
          {/* Contact Us Icon */}
          <div
            className="nav-icon group cursor-pointer"
            onClick={() => setActiveModal("contact_us")}
          >
            <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full metal-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
              <span className="text-[#b3c8e7] font-bold text-sm">
                {t("usAbbreviation")}
              </span>
            </div>
            <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
              {t("contact_us")}
            </span>
          </div>
          {/* Messages Icon */}
          <div
            className="nav-icon group cursor-pointer"
            onClick={() => navigate("/messages")}
          >
            <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full metal-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
              <MessageSquare className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#b3c8e7]" />
            </div>
            <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
              {t("messages")}
            </span>
          </div>
          {/* Settings Icon */}
          <div
            className="nav-icon group cursor-pointer"
            onClick={() => setActiveModal("settings")}
          >
            <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full metal-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
              <Settings className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#b3c8e7]" />
            </div>
            <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
              {t("settings")}
            </span>
          </div>
        </div>

        {/* Menu Button for sm screens to trigger NavMenuModal */}
        <div className="block md:hidden mx-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-casino-silver hover:text-white hover:bg-casino-light-blue/20"
            onClick={() => setActiveModal("nav_menu")} // Trigger the new modal
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
    </>
  );
};

export default NavBar;
