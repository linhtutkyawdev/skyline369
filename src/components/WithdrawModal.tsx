import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  X,
  CreditCard,
  Loader2,
  XCircle,
  CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useStateStore } from "@/store/state";
import { useUserStore } from "@/store/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api_response";
import { UserInfo } from "@/types/user";
import { ApiError } from "@/types/api_error";
import { useNavigate } from "react-router-dom";

type WithdrawStep = "amount" | "confirm" | "success" | "failed";

const MIN_WITHDRAWAL_AMOUNT = 1000;
const MAX_WITHDRAWAL_AMOUNT = 100000;

const WithdrawModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [amount, setAmount] = useState<number>(0);
  const { user, setUser } = useUserStore();
  const [newBankInfo, setNewBankInfo] = useState({
    bank_name: "",
    bank_branch_name: "",
    bank_username: "",
    bank_card: "",
  });
  const [isBankUpdateLoading, setIsBankUpdateLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>("amount");
  const [oldBankInfo, setOldBankInfo] = useState<UserInfo | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof newBankInfo
  ) => {
    setNewBankInfo({ ...newBankInfo, [key]: e.target.value });
  };

  const handleUpdateBankInfo = async () => {
    if (!user.token) {
      toast({
        variant: "destructive",
        title: t("authErrorTitle"),
        description: t("authTokenNotFoundDesc"),
      });
      return;
    }

    // Basic validation (optional, add more as needed)
    if (
      !newBankInfo.bank_name ||
      !newBankInfo.bank_branch_name ||
      !newBankInfo.bank_username ||
      !newBankInfo.bank_card
    ) {
      toast({
        variant: "destructive",
        title: t("missingInfoTitle"),
        description: t("fillBankDetailsDesc"),
      });
      return;
    }

    setIsBankUpdateLoading(true);
    try {
      const payload = {
        token: user.token,
        ...newBankInfo,
      };
      const response = await axiosInstance.post<ApiResponse<UserInfo>>( // Assuming API returns updated UserInfo
        "/player_update_bank",
        payload
      );

      if (response.data.status.errorCode === 0 && response.data.data) {
        // Update user store with potentially updated info from backend
        setUser({
          ...user,
          userInfo: { ...user.userInfo, ...response.data.data }, // Merge new data
        });
        toast({
          title: t("bankInfoUpdatedTitle"),
          description: t("bankInfoUpdatedDesc"),
        });
        setOldBankInfo(null); // Reset old info on success
        // Optionally close modal or switch view if needed
      } else {
        toast({
          variant: "destructive",
          title: t("updateFailedTitle"),
          description:
            response.data.status.msg || t("updateBankInfoFailedDesc"),
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("updateErrorTitle"),
        description:
          error.response?.data?.status?.msg || t("unexpectedErrorDesc"),
      });
    } finally {
      setIsBankUpdateLoading(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    // Validate amount against limits
    if (
      !amount ||
      amount < MIN_WITHDRAWAL_AMOUNT ||
      amount > MAX_WITHDRAWAL_AMOUNT
    ) {
      toast({
        variant: "destructive",
        title: t("invalidAmountTitle"),
        description: t("withdrawAmountLimitDesc", {
          min: MIN_WITHDRAWAL_AMOUNT,
          max: MAX_WITHDRAWAL_AMOUNT,
          amount: amount.toLocaleString(),
        }),
      });
      return;
    }
    // Validate amount against balance (assuming user.balance exists and is the game balance)
    if (
      user.userInfo?.game_balance === undefined ||
      user.userInfo?.game_balance === null ||
      amount > user.userInfo.game_balance
    ) {
      toast({
        variant: "destructive",
        title: t("insufficientBalanceTitle"),
        description: t("insufficientBalanceDesc", {
          balance: user.userInfo?.game_balance?.toLocaleString() ?? 0,
          amount: amount.toLocaleString(),
        }),
      });
      return;
    }
    // Move to confirmation step
    setWithdrawStep("confirm");
  };

  const makeWithdrawalRequest = async () => {
    if (!user.token || !amount) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("missingRequiredInfoDesc"),
      });
      return false;
    }

    setIsWithdrawLoading(true);
    let transferToMainSuccessful = false;
    const transferAmountStr = amount.toString();

    try {
      // Step 1: Transfer to Main Wallet
      const transferToMainResponse = await axiosInstance.post<ApiResponse<any>>(
        "/transfer_to_main",
        { token: user.token, amount: user.userInfo?.game_balance }
      );

      if (transferToMainResponse.data.status.errorCode !== 0) {
        throw new ApiError(
          t("transferFailedTitle"),
          transferToMainResponse.data.status.errorCode,
          transferToMainResponse.data.status.msg ||
            t("transferToMainFailedDesc")
        );
      }
      transferToMainSuccessful = true;

      // Step 2: Request Withdrawal (Drawing)
      const drawingResponse = await axiosInstance.post<ApiResponse<any>>(
        "/player_drawing",
        { token: user.token, amount: transferAmountStr }
      );

      if (drawingResponse.data.status.errorCode === 0) {
        // TODO: Update user balance state after successful withdrawal
        // Example: Fetch new balance or subtract amount if API doesn't return it
        setUser({ ...user, balance: (user.balance ?? 0) - amount }); // Example local update
        setWithdrawStep("success");
        setIsWithdrawLoading(false); // Success path ends here
        return true;
      } else {
        // Withdrawal failed, need to rollback transfer
        throw new ApiError(
          t("withdrawalFailedTitle"),
          drawingResponse.data.status.errorCode,
          drawingResponse.data.status.msg ||
            t("withdrawalFailedAfterTransferDesc")
        );
      }
    } catch (error: any) {
      const withdrawalErrorMessage =
        error.message ||
        error.response?.data?.status?.msg ||
        "An unexpected error occurred during withdrawal.";

      // Step 3: Rollback Transfer if Step 1 succeeded but Step 2 (or Step 1 itself) failed
      if (transferToMainSuccessful) {
        try {
          await axiosInstance.post<ApiResponse<any>>("/transfer_to_game", {
            token: user.token,
            amount: transferAmountStr,
          });
          // TODO: Consider updating local user balance state if necessary after rollback
        } catch (rollbackError: any) {
          // Notify user or admin about the critical state
          toast({
            variant: "destructive",
            title: t("criticalErrorTitle"),
            description: t("criticalRollbackFailedDesc"),
            duration: 10000, // Show longer
          });
          setWithdrawStep("failed"); // Still show failed state
          setIsWithdrawLoading(false);
          return false; // Prevent further state changes in the outer catch
        }
      }

      // Show the primary error (either transfer or withdrawal failure)
      toast({
        variant: "destructive",
        title:
          error instanceof ApiError
            ? error.name
            : t("withdrawalProcessFailedTitle"),
        description: withdrawalErrorMessage,
      });
      setWithdrawStep("failed");
      setIsWithdrawLoading(false);
      return false;
    }
    // Note: No finally block needed here as loading state is handled within branches
  };

  const resetWithdrawal = () => {
    setAmount(0);
    setWithdrawStep("amount");
    setIsWithdrawLoading(false);
  };

  const closeModalAndReset = () => {
    resetWithdrawal(); // Resets amount and withdrawal step

    // If bank info update was in progress, restore original info
    if (oldBankInfo) {
      setUser({ ...user, userInfo: oldBankInfo });
    }

    // Clear temporary states related to bank update
    setOldBankInfo(null);
    setNewBankInfo({
      bank_name: "",
      bank_branch_name: "",
      bank_username: "",
      bank_card: "",
    });

    setActiveModal(null); // Close the modal
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
      // Enter key handling might need adjustment based on the current step
    };

    if (activeModal === "withdraw") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, amount, withdrawStep]);

  const navigate = useNavigate();

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
            className="bg-casino-deep-blue/80 w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border border-casino-light-blue p-6 shadow-lg modal-container" // Reduced padding and max-height
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center mb-4"
            >
              <h2 className="text-xl font-semibold text-casino-silver">
                {t("withdraw")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModalAndReset}
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 gap-4 pb-4" // Adjusted scroll height and padding
            >
              {user.userInfo && user.userInfo.bank_card ? (
                // --- Withdraw Form (Bank Info Exists) ---
                <>
                  {/* --- Amount Step --- */}
                  {withdrawStep === "amount" && (
                    // Use grid for two columns on medium screens and up
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Column 1: Bank Info */}
                      <div className="bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4">
                        <div className="flex justify-between items-center mb-5">
                          <h3 className="text-md font-semibold text-casino-silver">
                            {user.userInfo.bank_name || "N/A"}
                          </h3>
                          <CreditCard className="text-casino-gold w-6 h-6" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-casino-silver/90">
                            <span className="font-medium text-casino-silver/70 w-28 inline-block">
                              {t("bankBranchLabel")}
                            </span>{" "}
                            {user.userInfo.bank_branch_name || "N/A"}
                          </p>
                          <p className="text-casino-silver/90">
                            <span className="font-medium text-casino-silver/70 w-28 inline-block">
                              {t("accountHolderLabel")}
                            </span>{" "}
                            {user.userInfo.bank_username || "N/A"}
                          </p>
                          <p className="text-casino-silver/90">
                            <span className="font-medium text-casino-silver/70 w-28 inline-block">
                              {t("cardNumberLabelColon")}
                            </span>{" "}
                            {user.userInfo.bank_card || "N/A"}
                          </p>
                        </div>
                      </div>
                      {/* Column 2: Amount Input & Button */}
                      <div className="space-y-4">
                        {/* Withdraw Amount Input */}
                        <div>
                          <Label
                            htmlFor="amount"
                            className="text-casino-silver block mb-2"
                          >
                            {t("withdrawAmountRangeLabel", {
                              min: MIN_WITHDRAWAL_AMOUNT,
                              max: MAX_WITHDRAWAL_AMOUNT,
                            })}
                          </Label>
                          <Input
                            type="number"
                            id="amount"
                            value={amount === 0 ? "" : amount} // Show placeholder if 0
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                            placeholder={t("enterAmountPlaceholder")}
                            min="100"
                            max="10000"
                          />
                        </div>
                        <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3">
                          <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-blue-100 text-sm">
                            {t("depositProcessingInfo")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setOldBankInfo(user.userInfo); // Store old info
                          setUser({
                            ...user,
                            userInfo: {
                              ...user.userInfo,
                              bank_name: "",
                              bank_branch_name: "",
                              bank_username: "",
                              bank_card: "",
                            },
                          });
                        }}
                        disabled={isWithdrawLoading}
                        className="w-full py-2 bg-casino-accent text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {t("updateBankInfo")}
                      </button>
                      <button
                        onClick={handleWithdrawSubmit}
                        disabled={isWithdrawLoading}
                        className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {t("requestWithdrawal")}
                      </button>
                    </div>
                  )}

                  {/* --- Confirmation Step --- */}
                  {withdrawStep === "confirm" && user && user.userInfo && (
                    <div className="space-y-4">
                      <div className="text-casino-silver text-sm mb-4">
                        {t("confirmWithdrawalDetailsPrompt")}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-casino-silver">
                            {t("amountLabelColon")}
                          </span>
                          <span className="text-casino-gold">฿{amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-casino-silver">
                            {t("bankLabel")}
                          </span>
                          <span className="text-casino-gold">
                            {user.userInfo.bank_name} -{" "}
                            {user.userInfo.bank_branch_name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-casino-silver">
                            {t("cardNumberLabelColon")}
                          </span>
                          <span className="text-casino-gold">
                            {user.userInfo.bank_card}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-casino-silver">
                            {t("bankHolderLabel")}
                          </span>
                          <span className="text-casino-gold">
                            {user.userInfo.bank_username}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-100 text-sm">
                          <span className="font-semibold">
                            {t("importantLabel")}
                          </span>{" "}
                          {t("ensureDetailsCorrectPrompt")}
                          proceeding.
                        </p>
                      </div>
                      <button
                        onClick={makeWithdrawalRequest}
                        disabled={isWithdrawLoading}
                        className="w-full flex items-center justify-center py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                      >
                        {t("confirmWithdrawal")}{" "}
                        {isWithdrawLoading && (
                          <Loader2 className="ml-2 animate-spin w-6 h-6" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* --- Success Step --- */}
                  {withdrawStep === "success" && (
                    <div className="text-center">
                      <div className="rounded-full my-3 p-4 bg-blue-900 bg-opacity-30 w-20 h-20 mx-auto">
                        <CheckIcon className="text-casino-gold w-full h-full" />
                      </div>
                      <h3 className="text-xl font-semibold text-casino-silver">
                        {t("withdrawalSuccessTitle")}
                      </h3>
                      <p className="text-casino-silver/80 mt-3 mb-8">
                        {t("withdrawalSuccessDesc", {
                          amount: amount.toLocaleString(),
                        })}
                      </p>
                      <button
                        onClick={() => {
                          closeModalAndReset();
                          navigate("/history/transaction");
                        }}
                        className="w-full flex items-center justify-center py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                      >
                        {t("checkWithdrawals")}
                      </button>
                    </div>
                  )}

                  {/* --- Failed Step --- */}
                  {withdrawStep === "failed" && (
                    <div className="text-center space-y-4 py-6">
                      {" "}
                      {/* Reduced py */}
                      <XCircle className="h-12 w-12 text-red-500 mx-auto" />{" "}
                      {/* Smaller icon */}
                      <h3 className="text-xl font-semibold text-casino-silver">
                        {t("withdrawalRequestFailedTitle")}
                      </h3>
                      <p className="text-casino-silver/80">
                        {t("withdrawalFailedDesc")}
                      </p>
                      <div className="flex gap-4 justify-center mt-4">
                        <Button
                          variant="outline"
                          onClick={closeModalAndReset}
                          className="text-casino-silver border-casino-light-blue hover:bg-casino-light-blue/20"
                        >
                          {t("close")}
                        </Button>
                        <Button
                          onClick={() => setWithdrawStep("amount")} // Go back to amount step
                          className="bg-casino-gold text-casino-deep-blue hover:bg-opacity-90"
                        >
                          {t("tryAgain")}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // --- Add Bank Info Form ---
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="bank_name"
                      className="text-casino-silver block mb-1" // Reduced mb
                    >
                      {t("bankNameLabel")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_name"
                      value={newBankInfo.bank_name}
                      onChange={(e) => handleInputChange(e, "bank_name")}
                      placeholder={oldBankInfo?.bank_name || t("bankNameLabel")}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bank_branch_name"
                      className="text-casino-silver block mb-1" // Reduced mb
                    >
                      {t("bankBranchFormLabel")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_branch_name"
                      value={newBankInfo.bank_branch_name}
                      onChange={(e) => handleInputChange(e, "bank_branch_name")}
                      placeholder={
                        oldBankInfo?.bank_branch_name ||
                        t("bankBranchFormLabel")
                      }
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bank_username"
                      className="text-casino-silver block mb-1" // Reduced mb
                    >
                      {t("accountHolderFormLabel")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_username"
                      value={newBankInfo.bank_username}
                      onChange={(e) => handleInputChange(e, "bank_username")}
                      placeholder={
                        oldBankInfo?.bank_username ||
                        t("accountHolderFormLabel")
                      }
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bank_card"
                      className="text-casino-silver block mb-1" // Reduced mb
                    >
                      {t("bankCardNumberLabel")}
                    </Label>
                    <Input
                      type="text"
                      id="bank_card"
                      value={newBankInfo.bank_card}
                      onChange={(e) => handleInputChange(e, "bank_card")}
                      placeholder={
                        oldBankInfo?.bank_card || t("bankCardNumberLabel")
                      }
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    />
                  </div>
                  <div className="col-span-2 p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3 mb-2">
                    <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm">
                      {t("provideBankInfoPrompt")}
                      {t("bankUpdateLimitInfo")}
                    </p>
                  </div>
                  {/* --- Action Buttons --- */}
                  <div className="col-span-2 flex gap-4 mt-2">
                    {" "}
                    {/* Adjusted mt and added col-span-2 */}
                    <button
                      // Cancel Button - Apply Accent Style
                      onClick={() => {
                        if (oldBankInfo) {
                          setUser({ ...user, userInfo: oldBankInfo }); // Restore old info
                        }
                        setOldBankInfo(null); // Clear the stored old info
                        // Resetting newBankInfo might be good practice too
                        setNewBankInfo({
                          bank_name: "",
                          bank_branch_name: "",
                          bank_username: "",
                          bank_card: "",
                        });
                      }}
                      disabled={isBankUpdateLoading}
                      className="w-full py-2 bg-casino-accent text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      // Update Button - Apply Gold Style
                      onClick={handleUpdateBankInfo}
                      disabled={isBankUpdateLoading}
                      className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {/* Icons removed for consistency as requested */}
                      {t("update")} {/* Keep original text 'update' */}
                    </button>
                  </div>
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
