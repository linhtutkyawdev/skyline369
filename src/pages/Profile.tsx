import { ArrowLeft, Wallet, Sparkles, History, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Get translation function
  return (
    <div className="h-screen overflow-y-scroll pb-20 pt-6 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-8"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("back")}</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 max-w-md mx-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-casino-gold flex items-center justify-center">
            <div className="bg-casino-light-blue w-full h-full"></div>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">
            {t("guestUser")}
          </h2>
          <p className="text-casino-silver text-sm">
            {t("userIdLabel", { id: "SL369-28401" })}
          </p>
        </div>

        <div className="bg-casino-deep-blue rounded-xl p-4 mb-6 flex justify-between items-center">
          <span className="text-casino-silver">{t("balance")}</span>
          <span className="text-casino-gold font-bold text-xl">$10,000.00</span>
        </div>

        <div className="space-y-4">
          <button className="w-full py-3 px-4 rounded-lg bg-casino-light-blue flex items-center gap-3 transition-all hover:bg-opacity-80">
            <Wallet className="w-5 h-5 text-casino-gold" />
            <span className="text-white">{t("transactions")}</span>
          </button>

          <button className="w-full py-3 px-4 rounded-lg bg-casino-light-blue flex items-center gap-3 transition-all hover:bg-opacity-80">
            <Sparkles className="w-5 h-5 text-casino-gold" />
            <span className="text-white">{t("bonuses")}</span>
          </button>

          <button className="w-full py-3 px-4 rounded-lg bg-casino-light-blue flex items-center gap-3 transition-all hover:bg-opacity-80">
            <History className="w-5 h-5 text-casino-gold" />
            <span className="text-white">{t("game_history")}</span>
          </button>

          <button className="w-full py-3 px-4 rounded-lg bg-casino-light-blue flex items-center gap-3 transition-all hover:bg-opacity-80 mt-8">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-white">{t("log_out")}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
