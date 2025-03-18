import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/store/modal";

const FooterNav = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { activeModal, setActiveModal } = useModalStore();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-0 w-full py-4 lg:glass-effect flex justify-center items-center gap-8 lg:gap-12"
    >
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setActiveModal("deposit")}
      >
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full gold-badge flex items-center justify-center lg:mb-1">
          <span className="text-casino-deep-blue font-bold">$</span>
        </div>
        <span className="text-casino-silver text-xs lg:text-base mt-1">
          {t("deposit")}
        </span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/withdraw")}
      >
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full gold-badge flex items-center justify-center lg:mb-1">
          <span className="text-casino-deep-blue font-bold">$</span>
        </div>
        <span className="text-casino-silver text-xs lg:text-base mt-1">
          {t("withdraw")}
        </span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/history")}
      >
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full gold-badge flex items-center justify-center lg:mb-1">
          <span className="text-casino-deep-blue font-bold">H</span>
        </div>
        <span className="text-casino-silver text-xs lg:text-base mt-1">
          {t("history")}
        </span>
      </div>
    </motion.footer>
  );
};

export default FooterNav;
