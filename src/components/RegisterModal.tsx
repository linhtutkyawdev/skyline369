import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  CheckCircle2,
  X,
  ArrowRight,
  User,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useModalStore } from "@/store/modal";
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

type Step = "email" | "otp" | "details";

const RegisterModal = () => {
  const [step, setStep] = useState<Step>("email");
  const [fullname, setFullname] = useState("");
  const { activeModal, setActiveModal } = useModalStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setUser } = useUserStore();

  const {
    register: registerEmailForm,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
    watch: watchEmail,
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerEmailAndOtpForm,
    handleSubmit: handleEmailAndOtpSubmit,
    formState: { errors: emailAndOtpErrors },
    reset: resetEmailAndOtpForm,
    watch: watchOtp,
  } = useForm<EmailAndOtpInput>({
    resolver: zodResolver(emailAndOtpSchema),
  });

  const {
    register: registerFinalForm,
    handleSubmit: handleFinalSubmit,
    formState: { errors: finalErrors },
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
        description: t("responses." + res.data.status.mess),
        variant: res.data.status.errorCode === 1 ? "destructive" : "default",
      });

    if (res.data.data) {
      const response = await res.data.data;
      console.log(response.email);
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
        description: t("responses." + res.data.status.mess),
        variant: res.data.status.errorCode === 1 ? "destructive" : "default",
      });

    if (res.data.data) {
      const response = await res.data.data;
      console.log(response.otp);
      setStep("details");
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const res = await axiosInstance.post("/register_player", {
      type: "email",
      email: data.email,
      otp: data.otp,
      password: data.password,
      confirm_password: data.confirmPassword,
    });

    if (res.data.status.mess)
      toast({
        title: res.data.status.mess,
        description: t("responses." + res.data.status.mess),
        variant: res.data.status.errorCode === 1 ? "destructive" : "default",
      });

    if (res.data.data) {
      const response = await res.data.data;
      setStep("email");
      setUser(response);
      toast({
        title: "Registration successful",
        description: "Welcome to Skyline369 🎉",
      });
      resetEmailForm();
      resetEmailAndOtpForm();
      resetFinalForm();
      setActiveModal();
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal();
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
          className="fixed inset-0 bg-zinc-950/30 backdrop-blur-md z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue w-full max-w-md rounded-lg border border-casino-light-blue p-6 modal-container"
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
                Register
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

            {step === "email" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    type="email"
                    placeholder="Email"
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
                  type="button"
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                  onClick={handleEmailSubmit(onEmailSubmit)}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="text-center mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-casino-silver text-sm">
                      Already have an account?
                    </span>
                    <button
                      className="text-casino-gold hover:text-casino-gold/80 text-sm font-medium"
                      onClick={() => {
                        setActiveModal("login");
                      }}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <p className="text-casino-silver text-sm">
                  Please enter the verification code sent to{" "}
                  {watchEmail("email")}
                </p>
                <input
                  className="hidden"
                  {...registerEmailAndOtpForm("email")}
                  required
                  value={watchEmail("email")}
                />
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="text-center tracking-widest"
                  maxLength={6}
                  {...registerEmailAndOtpForm("otp")}
                  required
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
                <Button
                  type="button"
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                  onClick={handleEmailAndOtpSubmit(onEmailAndOtpSubmit)}
                >
                  Verify <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />

                  <input
                    className="hidden"
                    {...registerFinalForm("email")}
                    required
                    value={watchOtp("email")}
                  />
                  <input
                    className="hidden"
                    {...registerFinalForm("otp")}
                    required
                    value={watchOtp("otp")}
                  />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10"
                    {...registerFinalForm("password")}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="pl-10"
                    {...registerFinalForm("confirmPassword")}
                    required
                  />
                </div>
                <Button
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                  onClick={handleFinalSubmit(onRegisterSubmit)}
                >
                  Register <UserPlus className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
