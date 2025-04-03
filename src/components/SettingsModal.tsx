import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Bell, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";
import { SupportedLanguages } from "@/i18n";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useStateStore } from "@/store/state";
import { useSettingsStore } from "@/store/settings"; // Import the settings store

const SettingsModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  // Get settings state and setters from the store
  const {
    soundEnabled, // Keep sound effects state if needed elsewhere, or remove if not
    setSoundEnabled,
    musicEnabled, // Add music state
    setMusicEnabled, // Add music setter
    notificationsEnabled,
    setNotificationsEnabled,
  } = useSettingsStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
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
          className="fixed inset-0 bg-transparent backdrop-blur-xl z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/80 w-full max-w-md rounded-lg border border-casino-light-blue p-6 modal-container"
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
                {t("settings")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal(null)}
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
              {/* <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
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
              </div> */}

              {/* Sound Effects Switch (Optional - keep if separate control is needed) */}
              {/* <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="text-casino-silver" />
                  ) : (
                    <VolumeX className="text-casino-silver" />
                  )}
                  <span className="text-white">{t("sound_effects")}</span>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  className="data-[state=checked]:bg-casino-gold"
                />
              </div> */}

              {/* Background Music Switch */}
              <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {musicEnabled ? (
                    <Volume2 className="text-casino-silver" /> // Use Volume2/VolumeX icons
                  ) : (
                    <VolumeX className="text-casino-silver" />
                  )}
                  <span className="text-white">{t("background_music")}</span>{" "}
                  {/* Change label */}
                </div>
                <Switch
                  checked={musicEnabled} // Use music state from store
                  onCheckedChange={setMusicEnabled} // Use music setter from store
                  className="data-[state=checked]:bg-casino-gold"
                />
              </div>

              <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Bell className="text-casino-silver" />
                  <span className="text-white">{t("notifications")}</span>
                </div>
                <Switch
                  checked={notificationsEnabled} // Use state from store
                  onCheckedChange={setNotificationsEnabled} // Use setter from store
                  className="data-[state=checked]:bg-casino-gold"
                />
              </div>

              <div className="pt-4 border-t border-casino-light-blue">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Languages className="text-casino-silver" />
                    <span className="text-white">{t("language")}</span>
                  </div>

                  <ToggleGroup
                    type="single"
                    className="bg-casino-deep-blue rounded-lg p-1"
                    defaultValue={i18n.language}
                    onValueChange={(lang) => {
                      if (lang) i18n.changeLanguage(lang);
                    }}
                  >
                    {SupportedLanguages.map((lang) => (
                      <ToggleGroupItem value={lang} key={lang}>
                        {t(lang)}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
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
