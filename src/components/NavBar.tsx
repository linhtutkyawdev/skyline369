import { Share, MessageSquare, User, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/store/modal";
import { useUserStore } from "@/store/user";

const NavBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setActiveModal } = useModalStore();
  const { user } = useUserStore();
  return (
    <>
      <header className="fixed top-0 w-full p-4 z-50 flex justify-between items-center lg:glass-effect animate-fade-in">
        <div className="flex items-center gap-2 lg:gap-4 ml-4">
          <div
            onClick={() => setActiveModal("profile")}
            // navigate("/profile")}
            className="w-10 h-10 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-casino-gold flex items-center justify-center cursor-pointer transition-all hover:border-4 hover:scale-105"
          >
            <div className="bg-casino-light-blue w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 lg:w-10 lg:h-10 text-casino-silver" />
            </div>
          </div>
          {/* Username and Balance  */}

          <div className="flex flex-col items-start">
            <span className="text-casino-silver font-semibold">
              {(user && user.name) || "Guest User"}
            </span>
            <span className="text-casino-gold text-sm">
              ${(user && user.balance) || "10,000.00"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mr-2 lg:gap-8 lg:mr-4">
          <div
            className="nav-icon group"
            onClick={() => setActiveModal("share")}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
              <Share className="w-5 h-5 lg:w-6 lg:h-6 text-casino-silver" />
            </div>
            <span className="text-casino-silver text-xs lg:text-sm">
              {t("header.share")}
            </span>
          </div>

          <div
            className="nav-icon group"
            onClick={() => setActiveModal("contact_us")}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
              <span className="text-[#b3c8e7] font-bold text-sm">US</span>
            </div>
            <span className="text-casino-silver text-xs lg:text-sm">
              {t("header.contact_us")}
            </span>
          </div>

          <div className="nav-icon group" onClick={() => navigate("/messages")}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
              <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-[#b3c8e7]" />
            </div>
            <span className="text-casino-silver text-xs lg:text-sm">
              {t("header.messages")}
            </span>
          </div>

          <div
            className="nav-icon group"
            onClick={() => setActiveModal("settings")}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
              <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-[#b3c8e7]" />
            </div>
            <span className="text-casino-silver text-xs lg:text-sm">
              {t("header.settings")}
            </span>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
