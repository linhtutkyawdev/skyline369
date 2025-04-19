import React, { useEffect, useState } from "react"; // Import useState
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Volume2,
  VolumeX,
  Languages,
  Lock,
  Mail,
  // KeyRound, // Removed unused icon
  Loader2,
  ArrowLeft,
  Edit, // Import ArrowLeft for back button
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input
import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";
import { SupportedLanguages } from "@/i18n";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"; // Ensure ToggleGroup is imported
// Remove RadioGroup and Label imports if they exist from previous attempts
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
import { useStateStore } from "@/store/state";
import { useSettingsStore } from "@/store/settings";
import { useUserStore } from "@/store/user"; // Import user store
import { useForm, SubmitHandler } from "react-hook-form"; // Import react-hook-form
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { PasswordResetInputs, passwordResetSchema } from "@/types/validations"; // Import validation schema/type
import axiosInstance from "@/lib/axiosInstance"; // Import axios
import { useToast } from "@/hooks/use-toast"; // Import useToast

const SettingsModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { user } = useUserStore(); // Get user data for email
  const { toast } = useToast(); // Initialize toast
  const {
    // soundEnabled, // Removed soundEnabled as it seems unused now
    // setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    // notificationsEnabled, // Removed notification state
    // setNotificationsEnabled,
  } = useSettingsStore();
  const { t, i18n } = useTranslation();
  const [showPasswordReset, setShowPasswordReset] = useState(false); // State for form visibility

  // Setup react-hook-form for password reset
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue, // To set the email value
  } = useForm<PasswordResetInputs>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: user?.email || "", // Pre-fill email from user store
      // token: "", // Removed token from default values
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Update email in form if user data changes
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  // Password Reset Submit Handler
  const onPasswordResetSubmit: SubmitHandler<PasswordResetInputs> = async (
    data
  ) => {
    try {
      const response = await axiosInstance.post("/reset_pass", {
        token: user?.token || "", // Use token from user store
        type: "email", // As specified in the API requirements
        email: data.email,
        password: data.newPassword, // Map form field to API field
      });

      if (response.data.status.errorCode === 0) {
        toast({
          title: t("passwordResetSuccessTitle"),
          description: t("passwordResetSuccessDesc"),
        });
        reset(); // Reset form on success
        setActiveModal(null); // Close modal on success
      } else {
        toast({
          title: t("errorTitle"), // Use a generic error title
          description:
            t("" + response.data.status.mess) || t("passwordResetErrorDesc"), // Use API message or fallback
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: t("errorTitle"),
        description: t("passwordResetErrorDesc"), // Fallback error description
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setShowPasswordReset(false); // Reset state on Escape
        reset(); // Reset form as well
      }
    };

    if (activeModal === "settings") {
      window.addEventListener("keydown", handleEscKey);
    } else {
      // Reset state if modal becomes inactive for any reason
      setShowPasswordReset(false);
      reset();
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, setActiveModal, reset]); // Added dependencies

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
            // ref={modalContainerRef} // Remove ref attachment
            className="bg-casino-deep-blue/80 w-full max-w-md max-h-[90%] overflow-y-auto rounded-lg border border-casino-light-blue p-6 modal-container" // Reverted to max-w-md, can adjust if needed
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
                  setShowPasswordReset(false); // Reset state on close button click
                  reset(); // Reset form as well
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
              className="space-y-4 pr-2" // Added max-height, scroll, and right padding for scrollbar
            >
              {!showPasswordReset ? (
                // Main Settings View
                <>
                  {/* Background Music Switch */}
                  <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {musicEnabled ? (
                        <Volume2 className="text-casino-silver" />
                      ) : (
                        <VolumeX className="text-casino-silver" />
                      )}
                      <span className="text-white">{t("sound_effects")}</span>
                    </div>
                    <Switch
                      checked={musicEnabled}
                      onCheckedChange={setMusicEnabled}
                      className="data-[state=checked]:bg-casino-gold"
                    />
                  </div>

                  {/* Reset Password Button */}
                  <div className="flex items-center justify-between bg-casino-deep-blue rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Lock className="text-casino-silver" />
                      <span className="text-white">{t("reset_password")}</span>
                    </div>
                    <Button
                      // Use default variant, apply custom styles
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
                      className="bg-casino-deep-blue rounded-lg p-2 grid grid-cols-2 gap-2" // Use grid with 2 columns and gap
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
                          className="data-[state=on]:bg-casino-gold data-[state=on]:text-casino-deep-blue text-casino-silver px-3 py-1 text-xs rounded-md border border-casino-light-blue hover:border-casino-gold transition-colors duration-200" // Adjusted styling
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
                  className="space-y-6 pt-4" // Removed px-8
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }} // Faster delay
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

                  {/* Token Input Field Removed */}

                  {/* New Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                    <Input
                      type="password"
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
                      type="button" // Prevent form submission
                      variant="secondary"
                      onClick={() => {
                        setShowPasswordReset(false);
                        reset();
                      }}
                      className="flex-1 bg-casino-accent hover:bg-casino-accent/90 text-casino-deep-blue"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("back")}
                    </Button>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
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
