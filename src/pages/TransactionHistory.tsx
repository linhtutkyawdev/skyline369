import { ArrowLeft, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStateStore } from "@/store/state";
import { DepositInfo, DepositRecord } from "@/types/deposit_info";
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api_response";
import { useUserStore } from "@/store/user";
import { ApiError } from "@/types/api_error";

const TransationHistory = () => {
  const { loading, setLoading, error, setError } = useStateStore();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [depositInfo, setDepositInfo] = useState<DepositInfo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "deposit" | "withdraw"
  >("all");
  const filteredHistory = depositInfo?.data;
  // selectedFilter === "all"
  //   ? depositInfo?.data
  //   : depositInfo?.data.filter((depositRecord) => depositRecord === selectedFilter);

  const loadDepositListing = async () => {
    setLoading(true);
    try {
      if (!depositInfo) {
        const responses = await axiosInstance.post<ApiResponse<DepositInfo>>(
          "/player_deposit_listing",
          {
            token: user.token,
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

        console.log(responses.data.data);
        setDepositInfo(responses.data.data);
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  //   const loadWithdrawalListing = async () => {
  //     setLoading(true);
  //     try {
  //       if (!depositInfo) {
  //         const responses = await axiosInstance.post<ApiResponse<DepositInfo>>(
  //           "/player_deposit_listing",
  //           {
  //             token: user.token,
  //           }
  //         );

  //         if (
  //           responses.data.status.errorCode != 0 &&
  //           responses.data.status.errorCode != 200
  //         )
  //           throw new ApiError(
  //             "An error has occured!",
  //             responses.data.status.errorCode,
  //             responses.data.status.mess
  //           );

  //         console.log(responses.data.data);
  //         setDepositInfo(responses.data.data);
  //       }
  //     } catch (error) {
  //       if (error instanceof ApiError && error.statusCode === 401) {
  //         setUser(null);
  //         setError(error);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    (async () => loadDepositListing())();
  }, []);

  return (
    <div className="h-screen pb-8 pt-12 lg:pt-16 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-4 absolute top-6 left-6"
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
        className="text-3xl font-bold text-center text-white lg:mb-8"
      >
        Transaction History
      </motion.h1>

      <div className="max-w-3xl mx-auto space-y-4 lg:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
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
              onClick={() => setSelectedFilter("deposit")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilter === "deposit"
                  ? "bg-casino-gold text-casino-deep-blue"
                  : "bg-casino-deep-blue text-casino-silver"
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setSelectedFilter("withdraw")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilter === "withdraw"
                  ? "bg-casino-gold text-casino-deep-blue"
                  : "bg-casino-deep-blue text-casino-silver"
              }`}
            >
              Withdrawals
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 overflow-y-scroll scrollbar-none max-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-13.5rem)]"
        >
          {depositInfo &&
            depositInfo.data.map((d, i) => (
              <div
                key={d.user_id + i}
                className="glass-effect rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-white font-medium">
                    Deposit - ${d.money * 1}
                  </h3>
                  <p className="text-casino-silver text-sm">{d.name}</p>
                </div>

                <div
                  className={`font-bold ${
                    d.confirm_at ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {d.status == 1 ? "Requested - " : "Transfered - "}
                  {d.status == 1
                    ? d.created_at
                    : d.confirm_at && d.confirm_at.toLocaleString()}
                </div>
              </div>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TransationHistory;
