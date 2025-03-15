import { ArrowLeft, CreditCard, Building, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const presetAmounts = [50, 100, 500, 1000, 5000];

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
        Deposit
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto glass-effect p-6 rounded-xl"
      >
        <div className="mb-6">
          <label className="text-casino-silver block mb-2">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white text-xl focus:outline-none focus:ring-2 focus:ring-casino-gold"
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

        <div className="space-y-4 mb-6">
          <h3 className="text-white font-medium mb-3">Select Payment Method</h3>

          <button className="w-full flex items-center gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 hover:bg-opacity-80 transition-all">
            <CreditCard className="text-casino-gold w-6 h-6" />
            <span className="text-white">Credit/Debit Card</span>
          </button>

          <button className="w-full flex items-center gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 hover:bg-opacity-80 transition-all">
            <Building className="text-casino-gold w-6 h-6" />
            <span className="text-white">Bank Transfer</span>
          </button>

          <button className="w-full flex items-center gap-4 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 hover:bg-opacity-80 transition-all">
            <Smartphone className="text-casino-gold w-6 h-6" />
            <span className="text-white">Mobile Payment</span>
          </button>
        </div>

        <button className="w-full py-4 bg-casino-gold text-casino-deep-blue rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all">
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
};

export default Deposit;
