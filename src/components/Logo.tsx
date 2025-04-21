import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Logo = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center mt-6 md:mt-12 lg:mt-20 2xl:my-20"
    >
      <motion.h1
        className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white logo-text"
        animate={{
          textShadow: [
            "0 0 10px rgba(212, 175, 55, 0.7)",
            "0 0 20px rgba(212, 175, 55, 0.9)",
            "0 0 10px rgba(212, 175, 55, 0.7)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        SKYLINE<span className="text-casino-gold">369</span>
      </motion.h1>
      <motion.div
        className="mt-1 px-4 2xl:px-6 2xl:py-1 rounded-full bg-gradient-to-r from-casino-gold to-casino-silver text-casino-deep-blue text-xs uppercase tracking-wider font-medium"
        whileHover={{ scale: 1.05 }}
      >
        {t("tagline")}
      </motion.div>
    </motion.div>
  );
};

export default Logo;
