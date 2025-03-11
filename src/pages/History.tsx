import { ArrowLeft, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const historyData = [
  { id: 1, game: "Baccarat", date: "2023-05-15", amount: 350, status: "win" },
  { id: 2, game: "Poker", date: "2023-05-14", amount: -120, status: "loss" },
  { id: 3, game: "Slots", date: "2023-05-14", amount: 75, status: "win" },
  {
    id: 4,
    game: "Blackjack",
    date: "2023-05-13",
    amount: -200,
    status: "loss",
  },
  { id: 5, game: "Roulette", date: "2023-05-12", amount: 500, status: "win" },
  { id: 6, game: "Baccarat", date: "2023-05-11", amount: -150, status: "loss" },
  { id: 7, game: "Slots", date: "2023-05-10", amount: 220, status: "win" },
  { id: 8, game: "Poker", date: "2023-05-09", amount: 180, status: "win" },
  { id: 9, game: "Blackjack", date: "2023-05-08", amount: -80, status: "loss" },
  {
    id: 10,
    game: "Roulette",
    date: "2023-05-07",
    amount: -250,
    status: "loss",
  },
];

const History = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredHistory =
    selectedFilter === "all"
      ? historyData
      : historyData.filter((item) => item.status === selectedFilter);

  return (
    <div className="h-screen overflow-y-scroll pb-28 pt-28 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-8 absolute top-6 left-6"
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
        Game History
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilter === "all"
                  ? "bg-casino-gold text-casino-deep-blue"
                  : "bg-casino-deep-blue text-casino-silver"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("win")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilter === "win"
                  ? "bg-casino-gold text-casino-deep-blue"
                  : "bg-casino-deep-blue text-casino-silver"
              }`}
            >
              Wins
            </button>
            <button
              onClick={() => setSelectedFilter("loss")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilter === "loss"
                  ? "bg-casino-gold text-casino-deep-blue"
                  : "bg-casino-deep-blue text-casino-silver"
              }`}
            >
              Losses
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-casino-deep-blue flex items-center justify-center text-casino-silver">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-casino-deep-blue flex items-center justify-center text-casino-silver">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-effect rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-white font-medium">{item.game}</h3>
                <p className="text-casino-silver text-sm">{item.date}</p>
              </div>

              <div
                className={`font-bold ${
                  item.amount > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.amount > 0 ? "+" : ""}
                {item.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default History;
