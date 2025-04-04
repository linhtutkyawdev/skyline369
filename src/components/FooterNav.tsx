import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useStateStore } from "@/store/state";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Gamepad2,
} from "lucide-react";

const FooterNav = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setActiveModal } = useStateStore();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-0 w-full py-4 xl:glass-effect flex justify-center items-center gap-8 2xl:gap-12"
    >
      <div
        className="flex flex-col items-center nav-icon group cursor-pointer w-12"
        onClick={() => setActiveModal("deposit")}
      >
        <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full gold-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
          <ArrowDownToLine className="text-casino-deep-blue" size={20} />
        </div>
        <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
          {t("deposit")}
        </span>
      </div>

      <div
        className="flex flex-col items-center nav-icon group cursor-pointer w-12"
        onClick={() => setActiveModal("withdraw")}
      >
        <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full gold-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
          <ArrowUpFromLine className="text-casino-deep-blue" size={20} />
        </div>
        <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
          {t("withdraw")}
        </span>
      </div>

      <div
        className="flex flex-col items-center nav-icon group cursor-pointer w-12"
        onClick={() => navigate("/history/transaction")}
      >
        <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full gold-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
          <History className="text-casino-deep-blue" size={20} />
        </div>
        <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
          {t("transactions")}
        </span>
      </div>

      <div
        className="flex flex-col items-center nav-icon group cursor-pointer w-12"
        onClick={() => navigate("/history/game")}
      >
        <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full gold-badge flex items-center justify-center 2xl:mb-1 group-hover:animate-pulse-glow">
          <Gamepad2 className="text-casino-deep-blue" size={20} />
        </div>
        <span className="text-casino-silver text-[10px] 2xl:text-[13px]">
          {t("gamelogs")}
        </span>
      </div>
    </motion.footer>
  );
};

export default FooterNav;
