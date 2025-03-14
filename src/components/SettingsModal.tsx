import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Volume2, VolumeX, Bell, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal";
import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";

const SettingsModal = () => {
  const { activeModal, setActiveModal } = useModalStore();
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal();
    };

    if (activeModal === "settings") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal]);

  return (
    <AnimatePresence>
      {activeModal === "settings" && (
        <motion.div
          className="fixed inset-0 bg-main z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/30 w-full max-w-md rounded-lg border border-casino-light-blue p-6 modal-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center mb-6"
            >
              <h2 className="text-xl font-semibold text-casino-silver">
                Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal()}
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="text-casino-silver" />
                  ) : (
                    <Sun className="text-casino-gold" />
                  )}
                  <span className="text-white">Dark Mode</span>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-casino-gold"
                />
              </div>

              <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="text-casino-silver" />
                  ) : (
                    <VolumeX className="text-casino-silver" />
                  )}
                  <span className="text-white">
                    {t("settings.sound_effects")}
                  </span>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  className="data-[state=checked]:bg-casino-gold"
                />
              </div>

              <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Bell className="text-casino-silver" />
                  <span className="text-white">Notifications</span>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-casino-gold"
                />
              </div>

              <div className="pt-4 border-t border-casino-light-blue">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Languages className="text-casino-silver" />
                    <span className="text-white">Language</span>
                  </div>

                  {/* <Select
                    defaultValue={i18n.language}
                    onValueChange={i18n.changeLanguage}
                  >
                    <SelectTrigger className="bg-casino-deep-blue text-white border border-casino-light-blue rounded-md px-3 py-1 max-w-40">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent className="bg-casino-deep-blue text-white border border-casino-light-blue rounded-md p-1">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="my">Myanmar</SelectItem>
                    </SelectContent>
                  </Select> */}

                  <button
                    onClick={() =>
                      i18n.changeLanguage(i18n.language == "en" ? "my" : "en")
                    }
                    className="bg-casino-deep-blue text-white border border-casino-light-blue rounded-md px-3 py-1 max-w-40"
                  >
                    {i18n.language == "en" ? "English" : "Myanmar"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
