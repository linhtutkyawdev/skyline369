import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  AlertCircle,
  CheckIcon,
  Copy,
  Image,
  Upload,
  QrCode,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useStateStore } from "@/store/state";
import { useCopyToClipboard } from "react-use";
import { DepositChannel } from "@/types/deposit_channel";
import { useUserStore } from "@/store/user";
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api_response";
import { ApiError } from "@/types/api_error";
import { Order } from "@/types/order";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";

// Simple Modal for Image Preview
const ReceiptPreviewModal = ({ isOpen, onClose, imageUrl, altText }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        className="relative bg-casino-deep-blue p-4 rounded-lg max-w-full h-full"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 text-casino-silver hover:text-white z-10"
        >
          <X className="h-6 w-6" />
        </Button>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-[calc(100vh-4rem)] object-contain rounded mx-auto" // Adjust max-h based on padding
        />
      </motion.div>
    </motion.div>
  );
};

type Step = "amount" | "detail" | "confirm" | "success" | "failed" | "QR";

const DepositModal = () => {
  const { activeModal, setActiveModal } = useStateStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedDepositChannel, setSelectedDepositChannel] =
    useState<DepositChannel | null>(null);

  const [step, setStep] = useState<Step>("amount");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { depositChannels, loading, setLoading } = useStateStore();
  const { user, setUser } = useUserStore();

  const [{ value }, copy] = useCopyToClipboard();
  const navigate = useNavigate();

  const resetState = () => {
    setSelectedDepositChannel(null);
    setAmount(0);
    setSenderName("");
    setTransactionId("");
    setReceiptImage(null);
    setPreviewUrl(null);
    setStep("amount");
    setOrder(null); // Ensure order is also reset
    setIsReceiptModalOpen(false);
    setActiveModal(null);
  };

  const handlePresetAmount = (value: number) => {
    setAmount(value);
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setReceiptImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      // Cleanup will be handled by useEffect below
    } else {
      // Clear image and preview if no file is selected (e.g., user cancels selection)
      setReceiptImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Revoke previous URL if clearing
      }
      setPreviewUrl(null);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const makeDepositRequest = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const responses = await axiosInstance.post<ApiResponse<Order>>(
        "/player_deposit",
        {
          qr_code: receiptImage,
          token: user.token,
          card_id: selectedDepositChannel.card_id,
          payer_acc: user.name,
          payer_name: senderName,
          bank_name: selectedDepositChannel.card_bank_name,
          amount,
          trans_id: transactionId,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        responses.data.status.errorCode != 0 &&
        responses.data.status.errorCode != 200
      )
        throw new ApiError(
          t("apiErrorOccurred"),
          responses.data.status.errorCode,
          responses.data.status.mess
        );
      setOrder(responses.data.data);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false); // Ensure loading is stopped on error
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setUser(null); // Log out user on authentication error
          toast({
            variant: "destructive",
            title: t("authenticationErrorTitle"),
            description: t("pleaseLoginAgain"),
          });
        } else {
          // Handle other specific API errors
          toast({
            variant: "destructive",
            title: t("apiErrorOccurred"),
            description: error.message || t("pleaseTryAgain"),
          });
        }
      } else {
        // Handle network errors or other unexpected errors
        console.error("Deposit request failed:", error); // Log the error for debugging
        toast({
          variant: "destructive",
          title: t("networkErrorTitle"),
          description: t("networkErrorDesc"),
        });
      }
      return false; // Indicate failure
    }
    // Dependencies: setLoading, user, selectedDepositChannel, senderName, amount, transactionId, receiptImage, t, setUser, setOrder, toast
  }, [
    setLoading,
    user,
    selectedDepositChannel,
    senderName,
    amount,
    transactionId,
    receiptImage,
    t,
    setUser,
    setOrder,
    toast,
  ]);

  const handleDeposit = useCallback(async () => {
    switch (step) {
      case "amount":
        if (!selectedDepositChannel) {
          toast({
            variant: "destructive",
            title: t("invalidPaymentMethodTitle"),
            description: t("invalidPaymentMethodDesc"),
          });
          break;
        }
        if (!amount || amount < selectedDepositChannel.single_min) {
          toast({
            variant: "destructive",
            title: t("invalidAmountTitle"),
            description: t("minDepositAmountDesc", {
              amount: selectedDepositChannel.single_min * 1,
            }),
          });
          break;
        }
        if (amount && amount > selectedDepositChannel.single_max) {
          toast({
            variant: "destructive",
            title: t("invalidAmountTitle"),
            description: t("maxDepositAmountDesc", {
              amount: selectedDepositChannel.single_max * 1,
            }),
          });
          break;
        }
        setStep("detail");
        break;
      case "detail":
        if (!transactionId || !/^\d+$/.test(transactionId)) {
          toast({
            variant: "destructive",
            title: t("invalidTxIdTitle"),
            description: t("invalidTxIdDesc"),
          });
          break;
        }
        if (!senderName) {
          toast({
            variant: "destructive",
            title: t("invalidSenderNameTitle"),
            description: t("invalidSenderNameDesc"),
          });
          break;
        }
        if (!receiptImage) {
          toast({
            variant: "destructive",
            title: t("invalidReceiptImageTitle"),
            description: t("invalidReceiptImageDesc"),
          });
          break;
        }
        setStep("confirm");
        break;
      case "confirm": {
        if (!user || !amount || !selectedDepositChannel) {
          toast({
            variant: "destructive",
            title: t("loginErrorTitle"),
            description: t("pleaseTryAgain"),
          });
          break;
        }
        (await makeDepositRequest()) ? setStep("success") : setStep("failed");
        break;
      }
      default:
        resetState();
        break;
    }
  }, [
    step,
    selectedDepositChannel,
    amount,
    transactionId,
    senderName,
    receiptImage,
    user,
    toast,
    t,
    makeDepositRequest,
    resetState,
    setStep,
  ]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetState(); // Also reset state on Escape
        setActiveModal(null);
      }
      // Prevent Enter submission if loading or if not on a submittable step
      if (
        e.key === "Enter" &&
        !loading &&
        (step === "amount" || step === "detail" || step === "confirm")
      ) {
        handleDeposit();
      }
    };

    if (activeModal === "deposit") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
    // Dependencies: activeModal, handleDeposit, setActiveModal, resetState, loading, step
  }, [activeModal, handleDeposit, setActiveModal, resetState, loading, step]);

  // Effect to clean up object URL
  useEffect(() => {
    // This function will be called when the component unmounts or before the effect runs again
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]); // Dependency array ensures this runs only when previewUrl changes

  return (
    <AnimatePresence>
      {activeModal === "deposit" && (
        <motion.div
          key="deposit-modal-content" // Added unique key
          className="fixed inset-0 bg-transparent backdrop-blur-xl z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/80 w-full max-w-3xl max-h-[calc(100vh-1rem)] rounded-lg border border-casino-light-blue p-4 sm:p-6 modal-container overflow-y-auto" // Added overflow-y-auto
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center mb-1 sm:mb-2"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-casino-silver">
                {t("deposit")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  resetState();
                }}
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
            {step === "amount" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-2 sm:gap-4 pb-4 sm:pb-6"
              >
                <label className="text-casino-silver block">
                  {t("selectPaymentMethod")}
                </label>
                {selectedDepositChannel ? (
                  <label className="text-casino-silver block">
                    {t("amountLabel")}
                  </label>
                ) : (
                  <div></div>
                )}

                {depositChannels.length > 0 &&
                  depositChannels.map(
                    (c) =>
                      (!selectedDepositChannel ||
                        selectedDepositChannel.card_bank_name ===
                          c.card_bank_name) && (
                        <div key={c.card_id}>
                          <button
                            onClick={() =>
                              setSelectedDepositChannel(
                                selectedDepositChannel &&
                                  selectedDepositChannel.card_id === c.card_id
                                  ? null
                                  : c
                              )
                            }
                            className="w-full flex flex-col relative bg-casino-deep-blue border border-casino-light-blue rounded-lg p-3 sm:p-5 hover:bg-opacity-80 transition-all"
                          >
                            <div className="flex w-full items-center justify-between gap-4">
                              <span className="text-white flex items-center">
                                {c.card_bank_name}
                                {selectedDepositChannel?.card_id ===
                                  c.card_id && (
                                  <CheckIcon className="text-casino-gold w-4 h-4 mx-2" />
                                )}
                              </span>
                              <CreditCard className="text-casino-gold w-6 h-6" />
                            </div>
                            {selectedDepositChannel?.card_id === c.card_id && (
                              <div className="flex flex-col items-start mt-1 sm:mt-2">
                                <span className="text-white text-xs sm:text-sm">
                                  {t("receiverLabel", {
                                    name: c.card_username,
                                  })}
                                </span>
                                <span className="text-white text-xs sm:text-sm">
                                  {t("cardNumberLabel", {
                                    number: c.card_number,
                                  })}
                                </span>
                                <span className="text-white text-xs sm:text-sm hidden md:block">
                                  {t("oneTimeLimitLabel", {
                                    min: c.single_min,
                                    max: c.single_max,
                                  })}
                                </span>
                                {(c.disable_starttime == "00:00" &&
                                  c.disable_endtime == "00:00") ||
                                (!c.disable_starttime && !c.disable_endtime) ? (
                                  <span className="text-white text-xs sm:text-sm hidden md:block">
                                    {t("available24hLabel")}
                                  </span>
                                ) : (
                                  <span className="text-white text-xs sm:text-sm hidden md:block">
                                    {t("availableTimeLabel", {
                                      start: c.disable_endtime,
                                      end: c.disable_starttime,
                                    })}
                                  </span>
                                )}
                              </div>
                            )}
                            {/* <span className="text-white">{c.card_number}</span> */}
                            {/* <span className="text-white">{c.card_type}</span> */}
                            {/* <span className="text-white">{c.card_username}</span> */}
                            {/* <span className="text-white">{c.single_min}</span> */}
                            {/* <span className="text-white">{c.single_max}</span> */}
                          </button>
                          {selectedDepositChannel &&
                            selectedDepositChannel.card_bank_name ===
                              c.card_bank_name && (
                              <div className="flex gap-1 sm:gap-2 sm:mt-2 md:mt-4">
                                <button
                                  className="flex w-1/2 items-center justify-center bg-casino-light-blue text-white py-1 sm:py-2 rounded-md hover:bg-opacity-80 transition-all"
                                  onClick={() => {
                                    copy(c.card_number);
                                    setTimeout(() => copy(""), 2000);
                                  }}
                                >
                                  {value == c.card_number ? (
                                    <>
                                      {t("copied")}
                                      <CheckIcon className="w-4 h-4 mx-2" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="hidden md:inline">
                                        {t("copyNumber")}{" "}
                                        {/* Changed translation key for shorter label */}
                                      </span>
                                      <Copy className="w-5 h-5 mx-2" />
                                    </>
                                  )}
                                </button>
                                <button
                                  className="flex w-1/2 items-center justify-center bg-casino-light-blue text-white py-1 sm:py-2 rounded-md hover:bg-opacity-80 transition-all"
                                  onClick={() => {
                                    setStep("QR");
                                  }}
                                >
                                  <span className="hidden md:inline">
                                    {t("showQr")}{" "}
                                  </span>
                                  <QrCode className="w-5 h-5 mx-2" />
                                </button>
                              </div>
                            )}
                        </div>
                      )
                  )}

                {selectedDepositChannel && (
                  <>
                    <div className="space-y-2 sm:space-y-4">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-2 sm:p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                        placeholder={t("enterAmountPlaceholder")}
                      />

                      <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-2 sm:mt-4">
                        {[1, 2, 5, 10, 20, 30].map((multiplier, index) => {
                          const presetValue =
                            selectedDepositChannel.single_min * multiplier;
                          // Apply hidden class for multipliers 20 and 30 on smaller screens
                          const buttonClass = `bg-casino-light-blue text-white py-1 sm:py-2 rounded-md hover:bg-opacity-80 transition-all ${
                            index >= 4 ? "hidden md:block" : ""
                          }`;
                          return (
                            <button
                              key={multiplier}
                              onClick={() => handlePresetAmount(presetValue)}
                              className={buttonClass}
                            >
                              ${presetValue}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDepositChannel(null);
                        setAmount(0);
                      }}
                      className="w-full py-1 sm:py-2 bg-casino-accent text-silver-deep-blue rounded-lg font-bold text-base sm:text-lg hover:bg-opacity-90 transition-all"
                    >
                      {t("goBack")}
                    </button>
                    <button
                      onClick={handleDeposit}
                      className="w-full py-1 sm:py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-base sm:text-lg hover:bg-opacity-90 transition-all"
                    >
                      {t("proceedToPayment")}
                    </button>
                  </>
                )}
              </motion.div>
            )}
            {step === "QR" && selectedDepositChannel && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4 pb-6"
              >
                <label className="text-casino-silver block">
                  {t("scanOrSaveQr")}
                </label>

                <img
                  src={selectedDepositChannel.img}
                  alt={t("qrCodeAlt")}
                  className="h-40 md:h-52 mx-auto w-auto col-span-2"
                />

                <button
                  onClick={() => {
                    setStep("amount");
                  }}
                  className="w-full py-2 bg-casino-accent text-silver-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("goBack")}
                </button>
                <button
                  onClick={() => {
                    // Create anchor link
                    const element = document.createElement("a");
                    element.href = selectedDepositChannel.img;
                    element.download = selectedDepositChannel.img.slice(
                      selectedDepositChannel.img.lastIndexOf("/") + 1
                    );

                    document.body.appendChild(element); // Required for Firefox
                    element.click();
                    document.body.removeChild(element); // Clean up
                  }}
                  className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("downloadQr")}
                </button>
              </motion.div>
            )}
            {step === "detail" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-2 sm:gap-4 pb-4 sm:pb-6"
              >
                <div>
                  <label className="text-casino-silver block mb-1 md:mb-2">
                    {t("provideTransactionInformation")}
                  </label>
                  <div className="w-full flex flex-col relative bg-casino-deep-blue border border-casino-light-blue rounded-lg p-3 md:p-4 hover:bg-opacity-80 transition-all">
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-white flex items-center">
                        {selectedDepositChannel.card_bank_name}
                        <CheckIcon className="text-casino-gold w-4 h-4 mx-2" />
                      </span>
                      <CreditCard className="text-casino-gold w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 items-start mt-2">
                      <span className="text-white text-sm hidden md:block">
                        {t("receiver")}
                      </span>
                      <span className="text-white text-sm hidden md:block">
                        : {selectedDepositChannel.card_username}
                      </span>
                      <span className="text-white text-sm">
                        {t("cardNumber")}
                      </span>
                      <span className="text-white text-sm">
                        : {selectedDepositChannel.card_number}
                      </span>
                      <span className="text-white text-sm">
                        {t("amountToTransfer")}
                      </span>
                      <span className="text-white text-sm">: ${amount}</span>
                    </div>
                  </div>
                  <div className="mt-1 space-y-1 md:mt-2 md:space-y-2">
                    <input
                      type="text"
                      name="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-2 md:p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                      placeholder={t("enterTxIdPlaceholder")}
                    />
                    <input
                      type="text"
                      name="name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-2 md:p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                      placeholder={t("enterYourNamePlaceholder")}
                    />
                  </div>
                </div>
                {/* Receipt Image Upload */}
                <div>
                  <label className="text-casino-silver block mb-1 md:mb-2">
                    {t("txReceiptImageLabel")}
                  </label>
                  <div
                    className={`h-[11.35rem] md:h-[14.6rem] border-2 border-dashed rounded-lg p-2 md:p-6 text-center ${
                      previewUrl ? "border-casino-gold" : "border-white/20"
                    }`}
                    onDrop={handleImageDrop}
                    onDragOver={handleDragOver}
                  >
                    {previewUrl ? (
                      <div className="space-y-1 md:space-y-3">
                        <div className="relative flex items-center justify-center mx-auto w-full max-w-xs overflow-hidden rounded-lg">
                          <img
                            src={previewUrl}
                            alt={t("receiptPreviewAlt")}
                            className="h-28 md:h-[8.5rem] w-auto object-contain"
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            className="py-1 text-white bg-casino-blue hover:bg-casino-light-blue hover:text-casino-silver"
                            onClick={() => {
                              setReceiptImage(null);
                              setPreviewUrl(null);
                            }}
                          >
                            {t("changeImage")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 md:space-y-3">
                        <div className="mx-auto flex h-10 md:h-16 w-10 md:w-16 items-center justify-center rounded-full bg-casino-deep-blue">
                          <Image className="h-6 w-6 md:h-10 md:w-10 text-casino-silver" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-casino-silver">
                            {t("dragDropReceiptPrompt")}
                          </p>
                          <p className="text-xs text-casino-silver">
                            {t("imageUploadHint")}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="py-1 px-3 text-xs relative text-casino-silver bg-casino-blue hover:bg-casino-light-blue hover:text-casino-silver"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {t("uploadReceipt")}
                          <input
                            type="file"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSenderName("");
                    setTransactionId("");
                    setReceiptImage(null);
                    setPreviewUrl(null);
                    setStep("amount");
                  }}
                  className="w-full py-1 sm:py-2 bg-casino-accent text-silver-deep-blue rounded-lg font-bold text-base sm:text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("goBack")}
                </button>
                <button
                  onClick={handleDeposit}
                  className="w-full py-1 sm:py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-base sm:text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("proceedToPayment")}
                </button>
              </motion.div>
            )}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2 md:space-y-4"
              >
                <div className="text-casino-silver text-sm mb-2 md:mb-4">
                  {t("confirmDepositDetailsPrompt")}
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("bankLabel")}</span>
                    <span className="text-casino-gold">
                      {selectedDepositChannel.card_bank_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">
                      {t("amountLabelColon")}
                    </span>
                    <span className="text-casino-gold">${amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("fromLabel")}</span>
                    <span className="text-casino-gold">{senderName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("toLabel")}</span>
                    <span className="text-casino-gold">
                      {selectedDepositChannel.card_username} (
                      {selectedDepositChannel.card_number})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("txIdLabel")}</span>
                    <span className="text-casino-gold">{transactionId}</span>
                  </div>
                </div>
                {/* Image Preview */}
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="h-44 w-full border border-casino-light-blue rounded-lg p-2 flex items-center justify-center hover:border-casino-gold transition-colors"
                  >
                    <img
                      src={previewUrl}
                      alt={t("receiptPreviewAlt")}
                      className="h-36 w-auto object-contain"
                    />
                  </button>
                )}
                <div className="p-2 md:p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-100 text-sm">
                    <span className="font-semibold">{t("importantLabel")}</span>{" "}
                    {t("ensureDetailsCorrectPrompt")}
                  </p>
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-1 md:py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("confirmDeposit")}{" "}
                  {loading && <Loader2 className="ml-2 animate-spin w-6 h-6" />}
                </button>
              </motion.div>
            )}
            {step === "success" && order && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="text-casino-silver text-sm mb-4">
                  {t("depositSuccessTitle")}
                </div>

                <div className="rounded-full p-4 bg-blue-900 bg-opacity-30 w-20 h-20 mx-auto">
                  <CheckIcon className="text-casino-gold w-full h-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">
                      {t("orderNumberLabel")}
                    </span>
                    <span className="text-casino-gold">{order.order_no}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">
                      {t("amountLabelColon")}
                    </span>
                    <span className="text-casino-gold">${order.money}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("fromLabel")}</span>
                    <span className="text-casino-gold">{order.payer_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("toLabel")}</span>
                    <span className="text-casino-gold">{order.account}</span>
                  </div>
                </div>

                {!isMobile && (
                  <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm">
                      {t("depositProcessingInfo")}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedDepositChannel(null);
                    setAmount(0);
                    setSenderName("");
                    setTransactionId("");
                    setReceiptImage(null);
                    setPreviewUrl(null);
                    setStep("amount");
                    setActiveModal(null);
                    navigate("/history/transaction");
                  }}
                  className="w-full py-1 sm:py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-base sm:text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("checkDepositRequests")}
                </button>
              </motion.div>
            )}
            {step === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="rounded-full p-4 bg-red-900 bg-opacity-30 w-20 h-20 mx-auto">
                  <X className="text-red-500 w-full h-full" />
                </div>
                <div className="text-casino-silver text-sm mb-4">
                  {t("depositFailedTitle")}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">{t("bankLabel")}</span>
                    <span className="text-casino-gold">
                      {selectedDepositChannel.card_bank_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">
                      {t("amountLabelColon")}
                    </span>
                    <span className="text-casino-gold">${amount}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeposit()}
                  className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  {t("tryAgain")}
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        key="receipt-preview-modal" // Added unique key
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        imageUrl={previewUrl}
        altText={t("receiptPreviewAlt")}
      />
    </AnimatePresence>
  );
};

export default DepositModal;
