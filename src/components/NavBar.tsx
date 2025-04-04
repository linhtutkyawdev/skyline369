import { Share, MessageSquare, User, Settings, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useStateStore } from "@/store/state";
import { useUserStore } from "@/store/user";

const NavBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setActiveModal } = useStateStore();
  const { user } = useUserStore();

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
          {/* Username and Balance  */}

          <div className="flex flex-col items-start">
            <span className="text-casino-silver font-semibold text-sm 2xl:text-lg">
              {(user && user.name) || t("register_login")}
            </span>
            <span className="text-casino-gold text-xs 2xl:text-sm">
              {user && user.userInfo && "$ " + user.userInfo.game_balance}
            </span>
          </div>
          <button className="" onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 text-casino-silver cursor-pointer hover:-rotate-45 hover:scale-110 transition-all" />
          </button>
        </div>

        {gameType && (
          <div className="flex items-center gap-2 xl:gap-4">
            <h3 className="text-casino-silver capitalize font-bold text-lg 2xl:text-2xl">
              {gameType}
            </h3>
          </div>
        )}

        <div className="flex items-center gap-3 mr-2 xl:gap-4 xl-mr-2 2xl:gap-8 2xl:mr-4">
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
      </header>
    </>
  );
};

export default NavBar;
