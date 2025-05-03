import { Share, MessageSquare, Settings, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStateStore } from "@/store/state";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const NavMenuModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useStateStore();

  const handleNavigation = (path: string) => {
    setActiveModal(null);
    navigate(path);
  };

  const handleModalOpen = (modalName: string) => {
    setActiveModal(null);
    setTimeout(() => {
      setActiveModal(modalName as any);
    }, 100);
  };

  const isVisible = activeModal === "nav_menu";

  // Animation variants for the container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Delay between each child animation
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1, // Reverse stagger on exit
      },
    },
  };

  // Animation variants for individual items (buttons) - Drop from above
  const itemVariants = {
    hidden: { y: -20, opacity: 0 }, // Start from above
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: { y: 10, opacity: 0 }, // Exit downwards
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-transparent backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          {/* Modal container - basic fade in/out */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} // Slight scale for entry
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }} // Faster transition for container
            className="relative bg-main w-full max-w-xs rounded-lg border border-casino-light-blue p-6 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-casino-silver hover:text-white"
              onClick={() => setActiveModal(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            <h2 className="text-xl font-semibold text-casino-silver text-center mb-3 mt-5">
              {t("navigationMenu")}
            </h2>

            {/* Container for animating buttons */}
            <motion.div
              className="flex flex-col gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Wrap each button in motion.div */}
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-casino-silver glass-effect hover:bg-casino-light-blue/20 hover:text-white focus-visible:bg-casino-light-blue/20 focus-visible:ring-1 focus-visible:ring-casino-light-blue py-3 px-4 rounded-md"
                  onClick={() => handleModalOpen("share")}
                >
                  <Share className="mr-3 h-5 w-5 text-casino-gold" />
                  <span>{t("share")}</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-casino-silver glass-effect hover:bg-casino-light-blue/20 hover:text-white focus-visible:bg-casino-light-blue/20 focus-visible:ring-1 focus-visible:ring-casino-light-blue py-3 px-4 rounded-md"
                  onClick={() => handleModalOpen("contact_us")}
                >
                  <span className="mr-3 h-5 w-5 flex items-center justify-center font-bold text-casino-gold">
                    {t("usAbbreviation")}
                  </span>
                  <span>{t("contact_us")}</span>
                </Button>
              </motion.div>

              {/* <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-casino-silver glass-effect hover:bg-casino-light-blue/20 hover:text-white focus-visible:bg-casino-light-blue/20 focus-visible:ring-1 focus-visible:ring-casino-light-blue py-3 px-4 rounded-md"
                  onClick={() => handleNavigation("/message")}
                >
                  <MessageSquare className="mr-3 h-5 w-5 text-casino-gold" />
                  <span>{t("messages")}</span>
                </Button>
              </motion.div> */}

              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-casino-silver glass-effect hover:bg-casino-light-blue/20 hover:text-white focus-visible:bg-casino-light-blue/20 focus-visible:ring-1 focus-visible:ring-casino-light-blue py-3 px-4 rounded-md"
                  onClick={() => handleModalOpen("settings")}
                >
                  <Settings className="mr-3 h-5 w-5 text-casino-gold" />
                  <span>{t("settings")}</span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMenuModal;
