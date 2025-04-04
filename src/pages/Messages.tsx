import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
const filterOptions = ["global", "personal", "support"];

const Messages = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("global");
  const { t } = useTranslation(); // Get translation function
  return (
    <div className="h-screen pb-8 pt-12 lg:pt-16 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-4 absolute top-6 left-6"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("back")}</span>
        </button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-white -mt-8 mb-4"
      >
        {t("messages")}
      </motion.h1>

      <div className="max-w-3xl mx-auto space-y-4 lg:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex bg-casino-deep-blue rounded p-1"
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-casino-gold rounded transition-transform"
            initial={{ x: 0 }}
            animate={{ x: `${filterOptions.indexOf(selectedFilter) * 100}%` }}
            transition={{ duration: 0.0001 }}
            style={{ width: "33.33%" }}
          />
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`relative flex-1 px-4 py-2 text-sm text-center z-10 ${
                selectedFilter === filter
                  ? "text-casino-deep-blue"
                  : "text-casino-silver"
              }`}
            >
              {t(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`)}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 overflow-y-scroll scrollbar-none max-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-13.5rem)]"
        >
          {t("stillInDevelopment")}
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
