import { Share, MessageSquare, User, Settings, Fullscreen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full p-4 z-50 flex justify-between items-center lg:glass-effect animate-fade-in">
      <div className="flex items-center gap-2 lg:gap-4 ml-4">
        <div
          onClick={() => navigate("/profile")}
          className="w-10 h-10 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-casino-gold flex items-center justify-center cursor-pointer transition-all hover:border-4 hover:scale-105"
        >
          <div className="bg-casino-light-blue w-full h-full flex items-center justify-center">
            <User className="w-6 h-6 lg:w-10 lg:h-10 text-casino-silver" />
          </div>
        </div>
        <span className="text-casino-silver uppercase tracking-wider text-sm">
          Guest User
        </span>
      </div>

      <div className="flex items-center gap-3 mr-2 lg:gap-8 lg:mr-4">
        <div className="nav-icon group" onClick={() => navigate("/share")}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
            <Share className="w-5 h-5 lg:w-6 lg:h-6 text-casino-deep-blue" />
          </div>
          <span className="text-casino-silver text-xs">Share</span>
        </div>

        <div className="nav-icon group" onClick={() => navigate("/contact")}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
            <span className="text-casino-deep-blue font-bold text-sm">US</span>
          </div>
          <span className="text-casino-silver text-xs">Contact us</span>
        </div>

        <div className="nav-icon group" onClick={() => navigate("/messages")}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
            <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-casino-deep-blue" />
          </div>
          <span className="text-casino-silver text-xs">Messages</span>
        </div>

        <div className="nav-icon group" onClick={() => navigate("/settings")}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full metal-badge flex items-center justify-center lg:mb-1 group-hover:animate-pulse-glow">
            <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-casino-deep-blue" />
          </div>
          <span className="text-casino-silver text-xs">Settings</span>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
