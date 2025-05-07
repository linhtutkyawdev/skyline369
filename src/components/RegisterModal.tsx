import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  CheckCircle2,
  X,
  ArrowRight,
  Lock,
  Loader2,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  EmailAndOtpInput,
  emailAndOtpSchema,
  EmailInput,
  emailSchema,
  RegisterInputs,
  registerSchema,
} from "@/types/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/store/user";
import { User } from "@/types/user";
import { useStateStore } from "@/store/state";

type Step = "email" | "otp" | "details";

const RegisterModal = () => {
  const [step, setStep] = useState<Step>("email");
  const { activeModal, setActiveModal } = useStateStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setUser } = useUserStore();

  const {
    register: registerEmailForm,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    reset: resetEmailForm,
    watch: watchEmail,
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerEmailAndOtpForm,
    handleSubmit: handleEmailAndOtpSubmit,
    formState: {
      errors: emailAndOtpErrors,
      isSubmitting: isEmailAndOtpSubmitting,
    },
    reset: resetEmailAndOtpForm,
    watch: watchOtp,
  } = useForm<EmailAndOtpInput>({
    resolver: zodResolver(emailAndOtpSchema),
  });

  const {
    register: registerFinalForm,
    handleSubmit: handleFinalSubmit,
    formState: { errors: finalErrors, isSubmitting: isFinalSubmitting },
    reset: resetFinalForm,
  } = useForm<RegisterInputs>({ resolver: zodResolver(registerSchema) });

  const onEmailSubmit: SubmitHandler<EmailInput> = async (data) => {
    const res = await axiosInstance.post<{
      status: {
        errorCode: number;
        msg: string;
        mess: string;
      };
      data: Promise<EmailInput>;
    }>("/check_register_player", { type: "email", email: data.email });

    if (res.data.status.mess)
      toast({
        title: res.data.status.mess,
        description: t("" + res.data.status.mess),
        variant: res.data.status.errorCode === 1 ? "destructive" : "default",
      });

    if (await res.data.data) {
      setStep("otp");
    }
  };

  const onEmailAndOtpSubmit: SubmitHandler<EmailAndOtpInput> = async (data) => {
    const res = await axiosInstance.post<{
      status: {
        errorCode: number;
        msg: string;
        mess: string;
      };
      data: Promise<EmailAndOtpInput>;
    }>("/check_otp_code", {
      type: "email",
      email: data.email,
      otp: data.otp,
    });

    if (res.data.status.mess)
      toast({
        title: res.data.status.mess,
        description: t("" + res.data.status.mess),
        variant: res.data.status.errorCode === 1 ? "destructive" : "default",
      });

    if (await res.data.data) {
      setStep("details");
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const res = await axiosInstance.post<{
      status: {
        errorCode: number;
        msg: string;
        mess: string;
      };
      data: Promise<User>;
    }>("/register_player", {
      type: "emial",
      otp: data.otp,
      email: data.email,
      password: data.password,
    });

    if (res.data.status.mess)
      toast({
        title: res.data.status.mess,
        description: t("" + res.data.status.mess),
        variant: res.data.status.errorCode === 1 ? "destructive" : "default",
      });

    const userData = await res.data.data;
    if (userData) {
      setStep("email");
      setUser(userData);
      toast({
        title: t("registrationSuccessTitle"),
        description: t("registrationSuccessDesc"),
      });
      resetEmailForm();
      resetEmailAndOtpForm();
      resetFinalForm();
      setActiveModal(null);
    } else {
      if (!res.data.status.mess)
        toast({
          title: t("Something went wrong!"),
          description: "Please try again!",
          variant: "destructive",
        });
      setStep("otp");
      setUser(null);
      resetEmailForm();
      resetEmailAndOtpForm();
      resetFinalForm();
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };

    if (activeModal === "register") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal]);

  return (
    <AnimatePresence>
      {activeModal === "register" && (
        <motion.div
          className="fixed inset-0 bg-main z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src="/login_modal_bg.png"
            className="absolute -top-[5%] sm:-left-[5%] md:left-0 h-[95%] lg:h-[70%] lg:top-[10%] lg:left-[10%] z-[60] object-cover"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
          ></motion.img>
          <motion.div
            className="bg-casino-deep-blue/50 -mr-[15%] lg:mr-0 w-full max-w-md rounded-lg border border-casino-light-blue p-6 modal-container"
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
                {t("register")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  resetEmailForm() ??
                  resetEmailAndOtpForm() ??
                  resetFinalForm() ??
                  setStep("email") ??
                  setActiveModal(null)
                }
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>

            {step === "email" && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
                onSubmit={handleEmailSubmit(onEmailSubmit)}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    className="pl-10"
                    {...registerEmailForm("email")}
                    required
                  />
                  {emailErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-5 ml-4 text-red-500 text-xs"
                    >
                      {emailErrors.email.message}
                    </motion.p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isEmailSubmitting}
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                >
                  {t("continue")}{" "}
                  {isEmailSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                </Button>
                <div className="text-center mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-casino-silver text-sm">
                      {t("alreadyHaveAccount")}
                    </span>
                    <button
                      type="button"
                      className="text-casino-gold hover:text-casino-gold/80 text-sm font-medium"
                      onClick={() =>
                        resetEmailForm() ??
                        resetEmailAndOtpForm() ??
                        resetFinalForm() ??
                        setStep("email") ??
                        setActiveModal("login")
                      }
                    >
                      {t("login")}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 relative"
                onSubmit={handleEmailAndOtpSubmit(onEmailAndOtpSubmit)}
              >
                <div className="relative space-y-2">
                  <p className="text-casino-silver text-sm">
                    {t("enterOtpPrompt")} {watchEmail("email")}
                  </p>
                  <input
                    name="email"
                    className="hidden"
                    {...registerEmailAndOtpForm("email")}
                    required
                    value={watchEmail("email")}
                  />
                  <Input
                    name="otp"
                    type="text"
                    placeholder={t("otpPlaceholder")}
                    className="text-center tracking-[1rem] font-2xl"
                    {...registerEmailAndOtpForm("otp")}
                    required
                    maxLength={6}
                  />
                  {emailAndOtpErrors.otp && (
                    <motion.p
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-5 ml-4 text-red-500 text-xs"
                    >
                      {emailAndOtpErrors.otp.message}
                    </motion.p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isEmailAndOtpSubmitting}
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                >
                  {t("verify")}{" "}
                  {isEmailAndOtpSubmitting ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </motion.form>
            )}

            {step === "details" && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
                onSubmit={handleFinalSubmit(onRegisterSubmit)}
              >
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <input
                    name="email"
                    className="hidden"
                    {...registerFinalForm("email")}
                    required
                    value={watchOtp("email")}
                  />
                  <input
                    name="otp"
                    className="hidden"
                    {...registerFinalForm("otp")}
                    required
                    value={watchOtp("otp")}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    name="password"
                    type="password"
                    placeholder={t("password")}
                    className="pl-10"
                    {...registerFinalForm("password")}
                    required
                  />
                  {finalErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-5 ml-4 text-red-500 text-xs"
                    >
                      {finalErrors.password.message}
                    </motion.p>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder={t("confirmPassword")}
                    className="pl-10"
                    {...registerFinalForm("confirmPassword")}
                    required
                  />
                  {finalErrors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-5 ml-4 text-red-500 text-xs"
                    >
                      {finalErrors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isFinalSubmitting}
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                >
                  {t("register")}{" "}
                  {isFinalSubmitting ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </motion.form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
