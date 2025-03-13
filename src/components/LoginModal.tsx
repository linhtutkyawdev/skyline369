import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useModalStore } from "@/store/modal";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const { activeModal, setActiveModal } = useModalStore();
  const { toast } = useToast();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal();
      if (e.key === "Enter") handleLogin();
    };

    if (activeModal === "login") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, email, password]);

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields!",
      });
      return;
    }

    // Handle login logic here
    toast({
      title: "Login successful",
      description: "Welcome back to Skyline369 🎉",
    });
    setActiveModal();
  };

  const handleForgotPassword = () => {
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter your email address!",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address!",
      });
      return;
    }

    // Handle password reset logic here
    toast({
      title: "Reset email sent",
      description: "Check your inbox for password reset instructions!",
    });
    setResetSent(true);
  };

  const renderForgotPasswordForm = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {resetSent ? (
        <div className="text-center space-y-4">
          <div className="text-casino-silver">
            <h3 className="text-lg font-medium mb-2">Email Sent!</h3>
            <p className="text-sm">
              We've sent instructions to reset your password to {resetEmail}
            </p>
          </div>
          <Button
            className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
            onClick={() => {
              setIsForgotPassword(false);
              setResetSent(false);
              setResetEmail("");
            }}
          >
            Back to Login
          </Button>
        </div>
      ) : (
        <>
          <div className="text-casino-silver text-sm mb-4">
            Enter your email address and we'll send you instructions to reset
            your password.
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
            <Input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
            onClick={handleForgotPassword}
          >
            Send Reset Instructions
          </Button>
          <Button
            variant="ghost"
            className="w-full text-casino-silver flex items-center justify-center gap-2"
            onClick={() => setIsForgotPassword(false)}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Button>
        </>
      )}
    </motion.div>
  );

  const renderLoginForm = () => (
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button
        className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
        onClick={handleLogin}
      >
        Login <LogIn className="ml-2 h-4 w-4" />
      </Button>
      <div className="text-center mt-4 space-y-2">
        <button
          className="text-casino-silver hover:text-casino-gold text-sm"
          onClick={() => setIsForgotPassword(true)}
        >
          Forgot Password?
        </button>
        <div className="flex items-center justify-center gap-2">
          <span className="text-casino-silver text-sm">
            Don't have an account?
          </span>
          <button
            className="text-casino-gold hover:text-casino-gold/80 text-sm font-medium"
            onClick={() => {
              setActiveModal("register");
            }}
          >
            Register
          </button>
        </div>
      </div>
    </motion.div>
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
                {isForgotPassword ? "Reset Password" : "Login"}
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

            {isForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
