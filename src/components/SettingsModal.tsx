import { useEffect, useState } from "react"; // Import useState
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Volume2,
  VolumeX,
  Languages,
  Lock,
  Mail,
  Loader2,
  ArrowLeft,
  Edit,
  Music4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { SupportedLanguages } from "@/i18n";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useStateStore } from "@/store/state";
import { useSettingsStore } from "@/store/settings";
import { useUserStore } from "@/store/user";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordResetInputs, passwordResetSchema } from "@/types/validations";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";

const SettingsModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const {
    backgroundMusicEnabled,
    setBackgroundMusicEnabled,
    volume,
    setVolume,
  } = useSettingsStore();
  const { t, i18n } = useTranslation();
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<PasswordResetInputs>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: user?.email || "", // Pre-fill email from user store
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onPasswordResetSubmit: SubmitHandler<PasswordResetInputs> = async (
    data
  ) => {
    try {
      const response = await axiosInstance.post("/reset_pass", {
        token: user?.token || "",
        type: "email",
        email: data.email,
        password: data.newPassword,
      });

      if (response.data.status.errorCode === 0) {
        toast({
          title: t("passwordResetSuccessTitle"),
          description: t("passwordResetSuccessDesc"),
        });
        reset();
        setActiveModal(null);
      } else {
        toast({
          title: t("errorTitle"),
          description:
            t("" + response.data.status.mess) || t("passwordResetErrorDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: t("passwordResetErrorDesc"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setShowPasswordReset(false);
        reset();
      }
    };

    if (activeModal === "settings") {
      window.addEventListener("keydown", handleEscKey);
    } else {
      setShowPasswordReset(false);
      reset();
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, setActiveModal, reset]);

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
            className="bg-casino-deep-blue/80 w-full max-w-md max-h-[90%] overflow-y-auto rounded-lg border border-casino-light-blue p-6 modal-container"
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
                {showPasswordReset ? t("reset_password") : t("settings")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setActiveModal(null);
                  setShowPasswordReset(false);
                  reset();
                }}
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 pr-2"
            >
              {!showPasswordReset ? (
                // Main Settings View
                <>
                  {/* Background Music Toggle */}
                  <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Music4 className="text-casino-silver" />
                      <span className="text-white">
                        {t("background_music_toggle")}
                      </span>
                    </div>
                    <Switch
                      checked={backgroundMusicEnabled}
                      onCheckedChange={setBackgroundMusicEnabled}
                      className="data-[state=checked]:bg-casino-gold"
                    />
                  </div>

                  {/* Background Music Slider */}
                  <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                    <div className="flex items-center gap-3 w-full">
                      {backgroundMusicEnabled && volume > 0 ? (
                        <Volume2 className="text-casino-silver" />
                      ) : (
                        <VolumeX className="text-casino-silver" />
                      )}
                      <span className="text-white">{t("volume")}</span>
                    </div>
                    <Slider
                      value={[volume]}
                      max={100}
                      step={5}
                      onValueChange={(val) => setVolume(val[0])}
                      className="w-full"
                    />
                  </div>

                  {/* Reset Password Button */}
                  <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Lock className="text-casino-silver" />
                      <span className="text-white">{t("reset_password")}</span>
                    </div>
                    <Button
                      className="bg-casino-deep-blue text-casino-gold border border-casino-light-blue hover:bg-casino-gold hover:text-casino-deep-blue px-4 py-1 text-sm rounded-md"
                      onClick={() => setShowPasswordReset(true)}
                    >
                      <Edit />
                    </Button>
                  </div>

                  {/* Language Selection */}
                  <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Languages className="text-casino-silver" />
                      <span className="text-white">{t("language")}</span>
                    </div>
                    <ToggleGroup
                      type="single"
                      className="bg-casino-deep-blue rounded-lg p-2 grid grid-cols-2 gap-2"
                      defaultValue={i18n.language}
                      onValueChange={(lang) => {
                        if (lang) {
                          i18n.changeLanguage(lang);
                          localStorage.setItem("i18nextLng", lang);
                        }
                      }}
                    >
                      {SupportedLanguages.map((lang) => (
                        <ToggleGroupItem
                          value={lang}
                          key={lang}
                          className="data-[state=on]:bg-casino-gold data-[state=on]:text-casino-deep-blue text-casino-silver px-3 py-1 text-xs rounded-md border border-casino-light-blue hover:border-casino-gold transition-colors duration-200"
                        >
                          {t(lang)}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </>
              ) : (
                // Password Reset Form View
                <motion.form
                  onSubmit={handleSubmit(onPasswordResetSubmit)}
                  className="space-y-6 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Email Input (Read Only) */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                    <Input
                      type="email"
                      placeholder={t("email")}
                      className="pl-10 bg-gray-700/50 text-gray-400 cursor-not-allowed"
                      {...register("email")}
                      readOnly
                    />
                  </div>

                  {/* New Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                    <Input
                      type="password"
                      name="newPassword"
                      placeholder={t("newPassword")}
                      className="pl-10"
                      {...register("newPassword")}
                      required
                    />
                    {errors.newPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-5 ml-4 text-red-500 text-xs"
                      >
                        {errors.newPassword.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm New Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                    <Input
                      type="password"
                      name="confirmNewPassword"
                      placeholder={t("confirmNewPassword")}
                      className="pl-10"
                      {...register("confirmNewPassword")}
                      required
                    />
                    {errors.confirmNewPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-5 ml-4 text-red-500 text-xs"
                      >
                        {errors.confirmNewPassword.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex gap-4 mt-6">
                    {/* Back Button */}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowPasswordReset(false);
                        reset();
                      }}
                      className="flex-1 bg-casino-accent text-white font-bold hover:bg-casino-accent/90 "
                    >
                      <ArrowLeft className="mr-2 -ml-4 h-4 w-4" />
                      {t("back")}
                    </Button>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-casino-gold font-bold hover:bg-casino-gold/90 text-casino-deep-blue"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        t("updatePassword")
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
