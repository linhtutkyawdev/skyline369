import {
  ArrowLeft,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  Languages,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { t, i18n } = useTranslation();

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

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-white mb-8"
      >
        {t("settings")}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 max-w-md mx-auto"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="text-casino-silver" />
              ) : (
                <Sun className="text-casino-gold" />
              )}
              <span className="text-white">{t("darkMode")}</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-casino-gold"
            />
          </div>

          <div className="flex items-center justify-between">
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-casino-silver" />
              <span className="text-white">{t("notifications")}</span>
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
                <span className="text-white">{t("language")}</span>
              </div>

              {/* <Select
                defaultValue={i18n.language}
                onValueChange={i18n.changeLanguage}
              >
                <SelectTrigger className="bg-casino-deep-blue text-white border border-casino-light-blue rounded-md px-3 py-1 max-w-40">
                  <SelectValue placeholder={t("languagePlaceholder")} />
                </SelectTrigger>
                <SelectContent className="bg-casino-deep-blue text-white border border-casino-light-blue rounded-md p-1">
                  <SelectItem value="en">{t("en")}</SelectItem>
                  <SelectItem value="my">{t("my")}</SelectItem>
                </SelectContent>
              </Select> */}

              <button
                onClick={() =>
                  i18n.changeLanguage(i18n.language == "en" ? "my" : "en")
                }
                className="bg-casino-deep-blue text-white border border-casino-light-blue rounded-md px-3 py-1 max-w-40"
              >
                {i18n.language == "en" ? t("en") : t("my")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
