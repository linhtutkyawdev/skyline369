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

type Step = "email" | "otp" | "details";

const RegisterModal = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { activeModal, setActiveModal } = useModalStore();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address!",
      });
      return;
    }
    toast({
      title: "OTP has been sent",
      description: "Check your inbox for the OTP!",
    });
    setStep("otp");
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP!",
      });
      return;
    }
    toast({
      title: "OTP verified",
      description: "Please fill in your details!",
    });
    setStep("details");
  };

  const handleRegister = () => {
    if (!fullname || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields!",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure both passwords match!",
      });
      return;
    }
    toast({
      title: "Registration successful",
      description: "Welcome to Skyline369 🎉",
    });
    setStep("email");
    // setActiveModal();
    setActiveModal("profile");
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal();
      if (e.key === "Enter")
        switch (step) {
          case "email":
            handleEmailSubmit();
            break;
          case "otp":
            handleOtpSubmit();
            break;
          case "details":
            handleRegister();
            break;
        }
    };

    if (activeModal === "register") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, email, otp, fullname, password, confirmPassword]);

  return (
    <AnimatePresence>
      {activeModal === "register" && (
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                  onClick={handleEmailSubmit}
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
                  Please enter the verification code sent to {email}
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                  }
                  className="text-center tracking-widest"
                  maxLength={6}
                />
                <Button
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                  onClick={handleOtpSubmit}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-casino-silver" />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  className="w-full bg-casino-gold hover:bg-casino-gold/90 text-casino-deep-blue"
                  onClick={handleRegister}
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
