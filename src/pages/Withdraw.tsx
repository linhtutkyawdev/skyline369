import { ArrowLeft, Building, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Withdraw = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const { t } = useTranslation();

  const presetAmounts = [50, 100, 500, 1000, 5000];
  const availableBalance = 10000; // Example balance

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <div className="h-screen overflow-y-scroll scrollbar-none pb-20 pt-6 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-8"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-white mb-8"
      >
        Withdraw
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl lg:max-w-md mx-auto glass-effect p-6 rounded-xl"
      >
        <div className="mb-4 flex justify-between items-center">
          <span className="text-casino-silver">Available Balance</span>
          <span className="text-casino-gold font-bold">
            ${availableBalance.toLocaleString()}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:flex flex-col gap-4 pb-6"
        >
          <div className="space-y-4">
            <label className="text-casino-silver block">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
              placeholder="Enter amount"
            />

            <div className="grid grid-cols-2 gap-2 mt-4">
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

            <div className="hidden col-span-2 p-3 bg-blue-900 bg-opacity-30 rounded-lg lg:flex items-start gap-3 mb-6">
              <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-blue-100 text-sm">
                Deposits will typically be process within 24-48 hours. Minimum
                deposit amount is $50.
              </p>
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

            <div className="lg:hidden col-span-2 p-3 bg-blue-900 bg-opacity-30 rounded-lg flex items-start gap-3 mb-6">
              <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-blue-100 text-sm">
                Withdrawal will typically be process within 24-48 hours. Minimum
                deposit amount is $50.
              </p>
            </div>
          </div>

          <button className="w-full col-span-2 py-4 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all">
            Request Withdrawal
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Withdraw;
