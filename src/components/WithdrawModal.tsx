import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useStateStore } from "@/store/state";
import { useUserStore } from "@/store/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WithdrawModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [amount, setAmount] = useState<number>(0);
  const { user, setUser } = useUserStore();
  const [newBankInfo, setNewBankInfo] = useState<{
    bank_name: string;
    bank_branch_name: string;
    bank_username: string;
    bank_card: string;
  }>({
    bank_name: "",
    bank_branch_name: "",
    bank_username: "",
    bank_card: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof newBankInfo
  ) => {
    setNewBankInfo({ ...newBankInfo, [key]: e.target.value });
  };

  const handleUpdateBankInfo = () => {
    // In a real application, you would send this data to your backend API
    console.log("Updating bank info:", newBankInfo);
    // For demonstration purposes, let's update the user store directly
    setUser({
      ...user,
      userInfo: { ...user.userInfo, bank_card: newBankInfo.bank_card },
    });
    toast({
      title: "Bank Information Updated",
      description: "Your bank information has been updated successfully.",
    });
  };

  // const presetAmounts = [50, 100, 500, 1000, 5000];

  const handlePresetAmount = (value: number) => {
    setAmount(value);
  };

  const handleWithdrawSubmit = () => {
    if (!amount || amount < 50)
      return toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Minimum withdrawal amount is $50.",
      });
    toast({
      variant: "default",
      title: "Withdrawal Request Sent",
      description: `Withdrawal request for $${amount} was successful. The amount will shortly be transferred to your account.`,
    });
    setActiveModal(null); // Close the modal after successful request
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
      if (e.key === "Enter" && activeModal === "withdraw")
        handleWithdrawSubmit();
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
          className="fixed inset-0 bg-transparent backdrop-blur-xl z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/80 w-full max-w-3xl max-h-[calc(100vh-1rem)] rounded-lg border border-casino-light-blue p-6 modal-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center mb-2"
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
              className="grid grid-cols-1 gap-4 pb-6"
            >
              {user.userInfo && user.userInfo.bank_card ? (
                // withdraw form
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="amount"
                      className="text-casino-silver block mb-2"
                    >
                      {t("withdraw_amount")}
                    </Label>
                    <Input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                      placeholder="Enter amount"
                    />
                  </div>
                  {/* <div className="flex gap-2 mb-4">
                    {presetAmounts.map((preset) => (
                      <Button
                        key={preset}
                        variant="outline"
                        onClick={() => handlePresetAmount(preset)}
                        className="text-casino-silver border-casino-border hover:bg-casino-button-hover"
                      >
                        ${preset}
                      </Button>
                    ))}
                  </div> */}
                  <div className="mb-2">
                    <h3 className="text-md font-semibold text-casino-silver mb-2">
                      {t("your_bank_details")}
                    </h3>
                    <p className="text-casino-silver/80 text-sm">
                      {t("bank_name")}: {user.userInfo.bank_name || "N/A"}
                    </p>
                    <p className="text-casino-silver/80 text-sm">
                      {t("bank_branch")}:{" "}
                      {user.userInfo.bank_branch_name || "N/A"}
                    </p>
                    <p className="text-casino-silver/80 text-sm">
                      {t("account_holder")}:{" "}
                      {user.userInfo.bank_username || "N/A"}
                    </p>
                    <p className="text-casino-silver/80 text-sm">
                      {t("bank_card_number")}:{" "}
                      {user.userInfo.bank_card || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={handleWithdrawSubmit}
                    className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                  >
                    {t("withdraw")}
                  </button>
                </div>
              ) : (
                // Add bank info form
                <div className="grid grid-cols-2 gap-4">
                  <label className="col-span-2 text-casino-silver block">
                    You need to provide your bank information for withdrawal.
                  </label>
                  <div>
                    <Label
                      htmlFor="bank_name"
                      className="text-casino-silver block mb-2"
                    >
                      {t("bank_name")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_name"
                      value={newBankInfo.bank_name}
                      onChange={(e) => handleInputChange(e, "bank_name")}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bank_branch_name"
                      className="text-casino-silver block mb-2"
                    >
                      {t("bank_branch")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_branch_name"
                      value={newBankInfo.bank_branch_name}
                      onChange={(e) => handleInputChange(e, "bank_branch_name")}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bank_username"
                      className="text-casino-silver block mb-2"
                    >
                      {t("account_holder")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_username"
                      value={newBankInfo.bank_username}
                      onChange={(e) => handleInputChange(e, "bank_username")}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bank_card"
                      className="text-casino-silver block mb-2"
                    >
                      {t("bank_card_number")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_card"
                      value={newBankInfo.bank_card}
                      onChange={(e) => handleInputChange(e, "bank_card")}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>

                  <div className="col-span-2 p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3 mb-2">
                    <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm">
                      {t("withdrawal_processing_time")}
                    </p>
                  </div>

                  <button
                    onClick={handleUpdateBankInfo}
                    className="col-span-2 w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                  >
                    {t("update_bank_info")}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawModal;
