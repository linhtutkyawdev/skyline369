import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, History, Wallet, Sparkles, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user";
import { useStateStore } from "@/store/state";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api_response";
import { ApiError } from "@/types/api_error";

const ProfileModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { user, setUser } = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };

    if (activeModal === "profile") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal]);

  async function logout() {
    try {
      const res = await axiosInstance.post<ApiResponse<{ token: string }>>(
        "/logout",
        {
          token: user?.token,
        }
      );

      if (res.data.status.errorCode != 0 && res.data.status.errorCode != 200)
        throw new ApiError(
          "An error has occured!",
          res.data.status.errorCode,
          res.data.status.mess
        );
      setActiveModal(null);
      setUser(null);
      toast({
        title: "Logout Success",
        description: "Successfully logged out of your account.",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }

  return (
    <AnimatePresence>
      {activeModal === "profile" && (
        <motion.div
          className="fixed inset-0 bg-transparent backdrop-blur-xl z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/80 w-full max-w-md max-h-[90vh] rounded-lg border border-casino-light-blue p-6 modal-container"
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
                Profile
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
              className="flex flex-col items-center pb-8"
            >
              <div className="w-24 h-24 -mt-8 rounded-full overflow-hidden border-2 border-casino-gold flex items-center justify-center">
                <div className="bg-casino-light-blue w-full h-full"></div>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">
                {user.name}
              </h2>
              <p className="text-casino-silver text-sm">{user.email}</p>
              <div className="space-y-4 w-full">
                <div className="bg-casino-deep-blue rounded-xl p-4 w-full flex justify-between items-center mt-4">
                  <span className="text-casino-silver">Balance</span>
                  <span className="text-casino-gold font-bold text-xl">
                    {user.balance}
                  </span>
                </div>
                <button className="p-3 rounded-lg bg-casino-light-blue w-full flex items-center justify-center gap-3 transition-all hover:bg-opacity-80">
                  <Edit className="w-5 h-5 text-casino-gold" />
                  <span className="text-white">Edit Profile</span>
                </button>
                <button
                  onClick={async () => {
                    await logout();
                  }}
                  className="p-3 rounded-lg bg-red-600/70 w-full flex items-center justify-center gap-3 transition-all hover:bg-red-600/60"
                >
                  <LogOut className="w-5 h-5 text-casino-gold" />
                  <span className="text-white">Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
