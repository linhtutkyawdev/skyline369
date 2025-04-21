import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailInput,
  emailSchema,
  LoginInputs,
  loginSchema,
} from "@/types/validations";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslation } from "react-i18next";
import { User } from "@/types/user";
import { useUserStore } from "@/store/user";
import { useStateStore } from "@/store/state";

const LoginModal = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { activeModal, setActiveModal } = useStateStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setUser } = useUserStore();

  const {
    register: registerLoginForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLoginForm,
    watch,
  } = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerForgotPasswordForm,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
    reset: resetForgotPasswordForm,
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
  });
  const onLoginSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await axiosInstance.post<{
        status: {
          errorCode: number;
          msg: string;
          mess: string;
        };
        data: Promise<User>;
      }>("/login", {
        name: data.email,
        password: data.password,
      });

      if (res.data.status.mess)
        toast({
          title: res.data.status.mess,
          description: t(res.data.status.mess),
          variant: res.data.status.errorCode === 1 ? "destructive" : "default",
        });

      if (res.data.data) {
        const response = await res.data.data;
        setUser(response);
        resetLoginForm();
        setActiveModal(null);
      }
    } catch (error) {
      if (error)
        toast({
          title: t("loginErrorTitle"),
          description: t("loginErrorDescription"),
          variant: "destructive",
        });
    }
  };
  const onForgotPasswordSubmit: SubmitHandler<EmailInput> = (data) => {
    toast({
      title: t("request_successful"),
      description: t("weve_sent", { email: data.email }),
    });

    setResetSent(true);
    resetForgotPasswordForm();
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };

    if (activeModal === "login") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal]);

  const renderForgotPasswordForm = () => (
    <motion.form
      onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {resetSent ? (
        <div className="text-center space-y-4">
          <div className="text-casino-silver">
            <h3 className="text-lg font-medium mb-2">{t("email_sent")}</h3>
            <p className="text-sm">
              {t("weve_sent", { email: watch("email") })}
            </p>
          </div>
          <Button
            className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue "
            onClick={() => setIsForgotPassword(false) ?? setResetSent(false)}
          >
            <ArrowLeft className="h-4 w-4" /> {t("back_to_login")}
          </Button>
        </div>
      ) : (
        <>
          <div className="text-casino-silver text-sm mb-4">
            {t("enter_your_email")}
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
            <Input
              type="email"
              placeholder={t("email")}
              className="pl-10"
              {...registerForgotPasswordForm("email")}
              required
            />
            {forgotPasswordErrors.email && (
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-5 ml-4 text-red-500 text-xs"
              >
                {forgotPasswordErrors.email.message}
              </motion.p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleForgotPasswordSubmit(onForgotPasswordSubmit)}
            className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
          >
            {t("send_reset_instructions")}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-casino-silver flex items-center justify-center gap-2"
            onClick={() => setIsForgotPassword(false)}
          >
            <ArrowLeft className="h-4 w-4" /> {t("back_to_login")}
          </Button>
        </>
      )}
    </motion.form>
  );

  const renderLoginForm = () => (
    <motion.form
      onSubmit={handleLoginSubmit(onLoginSubmit)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
        <Input
          type="email"
          placeholder={t("email")}
          className="pl-10"
          {...registerLoginForm("email")}
          required
        />
        {loginErrors.email && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 ml-4 text-red-500 text-xs"
          >
            {loginErrors.email.message}
          </motion.p>
        )}
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
        <Input
          type="password"
          placeholder={t("password")}
          className="pl-10"
          {...registerLoginForm("password")}
          required
        />
        {loginErrors.password && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 ml-4 text-red-500 text-xs"
          >
            {loginErrors.password.message}
          </motion.p>
        )}
      </div>
      <Button
        className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
        disabled={isLoginSubmitting}
        type="submit"
      >
        {t("login") + " "}
        {isLoginSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
      </Button>
      <div className="text-center mt-4 space-y-2">
        <button
          className="text-casino-silver hover:text-casino-gold text-sm"
          onClick={() => setIsForgotPassword(true)}
          type="button"
        >
          {t("forgot_password")}
        </button>
        <div className="flex items-center justify-center gap-2">
          <span className="text-casino-silver text-sm">
            {t("dont_have_an_account")}
          </span>
          <button
            className="text-casino-gold hover:text-casino-gold/80 text-sm font-medium"
            onClick={() => {
              resetLoginForm();
              setIsForgotPassword(false);
              setActiveModal("register");
            }}
            type="button"
          >
            {t("register")}
          </button>
        </div>
      </div>
    </motion.form>
  );

  return (
    <AnimatePresence>
      {activeModal === "login" && (
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
                {isForgotPassword ? t("reset_password") : t("login")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  resetLoginForm() ??
                  setIsForgotPassword(false) ??
                  setActiveModal(null)
                }
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>

            {isForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
