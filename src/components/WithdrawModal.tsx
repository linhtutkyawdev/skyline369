import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Building, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useStateStore } from "@/store/state";

const WithdrawModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [amount, setAmount] = useState<number>(0);

  const presetAmounts = [50, 100, 500, 1000, 5000];

  const handlePresetAmount = (value: number) => {
    setAmount(value);
  };

  const handleDeposit = () => {
    if (!amount || amount < 50)
      return toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Minimun withdrawal amount is $50.",
      });
    toast({
      variant: "default",
      title: "Deposit Success",
      description: `Deposit request for $${amount} was successful. The amount will shortly be transfered to your account.`,
    });
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
      if (e.key === "Enter") handleDeposit();
    };

    if (activeModal === "withdraw") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, amount]);

  return (
    <AnimatePresence>
      {activeModal === "withdraw" && (
        <motion.div
          className="fixed inset-0 bg-main z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/50 w-full max-w-3xl max-h-[90vh] rounded-lg border border-casino-light-blue p-6 modal-container"
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
                {t("withdraw")}
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
              className="grid grid-cols-2 gap-4 pb-6"
            >
              <div className="space-y-4">
                <label className="text-casino-silver block">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                  placeholder="Enter amount"
                />

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handlePresetAmount(amt)}
                      className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium mb-2">
                  Select Payment Method
                </h3>

                <button className="w-full flex items-center gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 hover:bg-opacity-80 transition-all">
                  <CreditCard className="text-casino-gold w-6 h-6" />
                  <span className="text-white">KBZ Pay</span>
                </button>

                <button className="w-full flex items-center gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 hover:bg-opacity-80 transition-all">
                  <Building className="text-casino-gold w-6 h-6" />
                  <span className="text-white">Wave Pay</span>
                </button>
              </div>

              <div className="col-span-2 p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3 mb-6">
                <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-blue-100 text-sm">
                  Withdrawals typically process within 24-48 hours. Minimum
                  withdrawal amount is $50.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawModal;
