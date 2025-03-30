import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Building,
  AlertCircle,
  CheckIcon,
  Copy,
  Image,
  Upload,
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

type Step = "amount" | "detail" | "confirm" | "success" | "failed";

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

  const { depositChannels } = useStateStore();
  const { user, setUser } = useUserStore();

  const [{ value }, copy] = useCopyToClipboard();
  const navigate = useNavigate();

  const handlePresetAmount = (value: number) => {
    setAmount(value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setReceiptImage(file);

      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setReceiptImage(file);

      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const makeDepositRequest = async (): Promise<boolean> => {
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
          "An error has occured!",
          responses.data.status.errorCode,
          responses.data.status.mess
        );
      setOrder(responses.data.data);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        // setError(error);
        return false;
      }
    }
    return false;
  };

  const handleDeposit = async () => {
    switch (step) {
      case "amount":
        if (!selectedDepositChannel) {
          toast({
            variant: "destructive",
            title: "Invalid payment method",
            description: "Please select a payment method.",
          });
          break;
        }
        if (!amount || amount < selectedDepositChannel.single_min) {
          toast({
            variant: "destructive",
            title: "Invalid amount",
            description: `Minimun deposit amount is $${
              selectedDepositChannel.single_min * 1
            }.`,
          });
          break;
        }
        if (amount && amount > selectedDepositChannel.single_max) {
          toast({
            variant: "destructive",
            title: "Invalid amount",
            description: `Maximun deposit amount is $${
              selectedDepositChannel.single_max * 1
            }.`,
          });
          break;
        }
        setStep("detail");
        break;
      case "detail":
        if (!transactionId) {
          toast({
            variant: "destructive",
            title: "Invalid transaction ID",
            description: "Please enter your transaction ID.",
          });
          break;
        }
        if (!senderName) {
          toast({
            variant: "destructive",
            title: "Invalid sender name",
            description: "Please enter your name.",
          });
          break;
        }
        if (!receiptImage) {
          toast({
            variant: "destructive",
            title: "Invalid receipt image",
            description: "Please upload a receipt image.",
          });
          break;
        }
        setStep("confirm");
        break;
      case "confirm": {
        if (!user || !amount || !selectedDepositChannel) {
          toast({
            variant: "destructive",
            title: "Something went wrong!",
            description: "Please try again.",
          });
          break;
        }
        (await makeDepositRequest()) ? setStep("success") : setStep("failed");
        break;
      }
      default:
        setSelectedDepositChannel(null);
        setAmount(0);
        setSenderName("");
        setTransactionId("");
        setReceiptImage(null);
        setPreviewUrl(null);
        setStep("amount");
        break;
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
      if (e.key === "Enter") handleDeposit();
    };

    if (activeModal === "deposit") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, amount]);

  return (
    <AnimatePresence>
      {activeModal === "deposit" && (
        <motion.div
          className="fixed inset-0 bg-main z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/50 w-full max-w-3xl max-h-[calc(100vh-1rem)] rounded-lg border border-casino-light-blue p-6 modal-container"
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
                {t("deposit")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedDepositChannel(null);
                  setAmount(0);
                  setSenderName("");
                  setTransactionId("");
                  setReceiptImage(null);
                  setPreviewUrl(null);
                  setStep("amount");
                  setActiveModal(null);
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
                className="grid grid-cols-2 gap-4 pb-6"
              >
                <label className="text-casino-silver block">
                  Select Payment Method
                </label>
                {selectedDepositChannel ? (
                  <label className="text-casino-silver block">Amount</label>
                ) : (
                  <div></div>
                )}

                {depositChannels.length > 0 &&
                  depositChannels.map((c) => (
                    <div key={c.card_id}>
                      <button
                        onClick={() =>
                          setSelectedDepositChannel(
                            selectedDepositChannel &&
                              selectedDepositChannel.card_bank_name ===
                                c.card_bank_name
                              ? null
                              : c
                          )
                        }
                        className="w-full flex flex-col relative bg-casino-deep-blue border border-casino-light-blue rounded-lg p-5 hover:bg-opacity-80 transition-all"
                      >
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-white flex items-center">
                            {c.card_bank_name}
                            {selectedDepositChannel &&
                              selectedDepositChannel.card_bank_name ===
                                c.card_bank_name && (
                                <CheckIcon className="text-casino-gold w-4 h-4 mx-2" />
                              )}
                          </span>
                          <CreditCard className="text-casino-gold w-6 h-6" />
                        </div>
                        {selectedDepositChannel &&
                          selectedDepositChannel.card_bank_name ===
                            c.card_bank_name && (
                            <div className="flex flex-col items-start mt-4">
                              <span className="text-white text-sm">
                                Receiver: {c.card_username}
                              </span>
                              <span className="text-white text-sm">
                                Card Number: {c.card_number}
                              </span>
                              <span className="text-white text-sm">
                                One Time Limit: {c.single_min} - {c.single_max}
                              </span>
                              <span className="text-white text-sm">
                                Availabe Time: {c.disable_starttime} -{" "}
                                {c.disable_endtime}
                              </span>
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
                          <button
                            className="w-full flex items-center justify-center mt-2 bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                            onClick={() => {
                              copy(c.card_number);
                              setTimeout(() => copy(""), 2000);
                            }}
                          >
                            {value == c.card_number ? (
                              <>
                                Coppied : {c.card_number}
                                <CheckIcon className="w-4 h-4 mx-2" />
                              </>
                            ) : (
                              <>
                                Copy Card Number to Clipboard{" "}
                                <Copy className="w-4 h-4 mx-2" />
                              </>
                            )}
                          </button>
                        )}
                    </div>
                  ))}
                {!selectedDepositChannel && (
                  <>
                    <button className="w-full flex items-center justify-between gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-5 hover:bg-opacity-80 transition-all">
                      <span className="text-white">KBZ Pay</span>
                      <Building className="text-casino-gold w-6 h-6" />
                    </button>
                    <button className="w-full flex items-center justify-between gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-5 hover:bg-opacity-80 transition-all">
                      <span className="text-white">AYA Pay</span>
                      <Building className="text-casino-gold w-6 h-6" />
                    </button>
                    <button className="w-full flex items-center justify-between gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-5 hover:bg-opacity-80 transition-all">
                      <span className="text-white">Bank 2</span>
                      <Building className="text-casino-gold w-6 h-6" />
                      {/* <span className="text-white">MR. Test Receiver 2</span> */}
                    </button>
                    <button className="w-full flex items-center justify-between gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-5 hover:bg-opacity-80 transition-all">
                      <span className="text-white">Bank 3</span>
                      <Building className="text-casino-gold w-6 h-6" />
                    </button>
                    <button className="w-full flex items-center justify-between gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-5 hover:bg-opacity-80 transition-all">
                      <span className="text-white">Bank 4</span>
                      <Building className="text-casino-gold w-6 h-6" />
                    </button>
                  </>
                )}

                {selectedDepositChannel && (
                  <>
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                        placeholder="Enter amount"
                      />

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <>
                          <button
                            onClick={() =>
                              handlePresetAmount(
                                selectedDepositChannel.single_min * 1
                              )
                            }
                            className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                          >
                            ${selectedDepositChannel.single_min * 1}
                          </button>

                          <button
                            onClick={() =>
                              handlePresetAmount(
                                selectedDepositChannel.single_min * 2
                              )
                            }
                            className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                          >
                            ${selectedDepositChannel.single_min * 2}
                          </button>

                          <button
                            onClick={() =>
                              handlePresetAmount(
                                selectedDepositChannel.single_min * 5
                              )
                            }
                            className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                          >
                            ${selectedDepositChannel.single_min * 5}
                          </button>
                          <button
                            onClick={() =>
                              handlePresetAmount(
                                selectedDepositChannel.single_min * 10
                              )
                            }
                            className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                          >
                            ${selectedDepositChannel.single_min * 10}
                          </button>
                          <button
                            onClick={() =>
                              handlePresetAmount(
                                selectedDepositChannel.single_min * 20
                              )
                            }
                            className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                          >
                            ${selectedDepositChannel.single_min * 20}
                          </button>
                          <button
                            onClick={() =>
                              handlePresetAmount(
                                selectedDepositChannel.single_min * 30
                              )
                            }
                            className="bg-casino-light-blue text-white py-2 rounded-md hover:bg-opacity-80 transition-all"
                          >
                            ${selectedDepositChannel.single_min * 30}
                          </button>
                        </>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDepositChannel(null);
                        setAmount(0);
                      }}
                      className="w-full py-2 bg-casino-accent text-silver-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleDeposit}
                      className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                    >
                      Proceed to Payment
                    </button>
                  </>
                )}
              </motion.div>
            )}
            {step === "detail" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4 pb-6"
              >
                <div className="space-y-2">
                  <label className="text-casino-silver block mb-2">
                    Select Payment Method
                  </label>
                  <div className="w-full flex flex-col relative bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 hover:bg-opacity-80 transition-all">
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-white flex items-center">
                        {selectedDepositChannel.card_bank_name}
                        <CheckIcon className="text-casino-gold w-4 h-4 mx-2" />
                      </span>
                      <CreditCard className="text-casino-gold w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 items-start mt-2">
                      <span className="text-white text-sm">Receiver</span>
                      <span className="text-white text-sm">
                        : {selectedDepositChannel.card_username}
                      </span>
                      <span className="text-white text-sm">Card Number</span>
                      <span className="text-white text-sm">
                        : {selectedDepositChannel.card_number}
                      </span>
                      <span className="text-white text-sm">
                        Ammount to transfer
                      </span>
                      <span className="text-white text-sm">: ${amount}</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    placeholder="Enter Transaction ID"
                  />
                  <input
                    type="text"
                    name="name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                    placeholder="Enter Your Name"
                  />
                </div>
                {/* Receipt Image Upload */}
                <div>
                  <label className="text-casino-silver block mb-2">
                    Transaction Receipt Image
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      previewUrl ? "border-casino-gold" : "border-white/20"
                    }`}
                    onDrop={handleImageDrop}
                    onDragOver={handleDragOver}
                  >
                    {previewUrl ? (
                      <div className="space-y-3">
                        <div className="relative flex items-center justify-center mx-auto w-full max-w-xs overflow-hidden rounded-lg">
                          <img
                            src={previewUrl}
                            alt="Receipt preview"
                            className="h-32 w-auto object-cover"
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            className="text-white bg-casino-blue hover:bg-casino-light-blue hover:text-casino-silver"
                            onClick={() => {
                              setReceiptImage(null);
                              setPreviewUrl(null);
                            }}
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-casino-deep-blue">
                          <Image className="h-10 w-10 text-casino-silver" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-casino-silver">
                            Drag and drop your receipt image here, or click to
                            select
                          </p>
                          <p className="text-xs text-casino-silver">
                            JPG, PNG or GIF up to 10MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="relative text-casino-silver bg-casino-blue hover:bg-casino-light-blue hover:text-casino-silver"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Receipt
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
                  className="w-full py-2 bg-casino-accent text-silver-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleDeposit}
                  className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Proceed to Payment
                </button>
              </motion.div>
            )}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="text-casino-silver text-sm mb-4">
                  Please confirm your deposit details.
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Bank:</span>
                    <span className="text-casino-gold">
                      {selectedDepositChannel.card_bank_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Amount:</span>
                    <span className="text-casino-gold">${amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">From:</span>
                    <span className="text-casino-gold">{senderName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">To:</span>
                    <span className="text-casino-gold">
                      {selectedDepositChannel.card_username} (
                      {selectedDepositChannel.card_number})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Transaction ID:</span>
                    <span className="text-casino-gold">{transactionId}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-100 text-sm">
                    <span className="font-semibold">Important:</span> Please
                    ensure the details above are correct before proceeding.
                  </p>
                </div>
                <button
                  onClick={handleDeposit}
                  className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Confirm Deposit
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
                  Deposit requested successfully!
                </div>

                <div className="rounded-full p-4 bg-blue-900 bg-opacity-30 w-20 h-20 mx-auto">
                  <CheckIcon className="text-casino-gold w-full h-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Order Number:</span>
                    <span className="text-casino-gold">{order.order_no}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Amount:</span>
                    <span className="text-casino-gold">${order.money}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">From:</span>
                    <span className="text-casino-gold">{order.payer_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">To:</span>
                    <span className="text-casino-gold">{order.account}</span>
                  </div>
                </div>

                {!isMobile && (
                  <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm">
                      The deposit will be processed within 24 hours. If you have
                      any questions, please contact our support team.
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
                  className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Check your deposit requests
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
                  Deposit failed!
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Bank:</span>
                    <span className="text-casino-gold">
                      {selectedDepositChannel.card_bank_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-casino-silver">Amount:</span>
                    <span className="text-casino-gold">${amount}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeposit()}
                  className="w-full py-2 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositModal;
