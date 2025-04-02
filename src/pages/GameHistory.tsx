import { ArrowLeft, Calendar as CalendarIcon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useStateStore } from "@/store/state";
import {
  GameHistoryRecord,
  GameHistoryInfo,
  ProcessedGameHistoryRecord,
} from "@/types/game_history"; // Import new types
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api_response";
import { useUserStore } from "@/store/user";
import { ApiError } from "@/types/api_error";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const GameHistory = () => {
  // Global state and navigation
  const { loading, setLoading, error, setError } = useStateStore();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  // Component state
  const [gameHistory, setGameHistory] = useState<ProcessedGameHistoryRecord[]>(
    []
  ); // Use processed type
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 20; // Define page size for the API

  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMountRef = useRef(true); // Ref to track initial mount

  // Memoized function to load game history
  const loadGameHistory = useCallback(
    async (
      page: number,
      startDate?: Date,
      endDate?: Date,
      isLoadMore = false
    ) => {
      // Set loading state
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        if (loading || isLoadingMore) return;
        setIsLoadingMore(true);
      }

      const start_at = format(
        startDate ?? date?.from ?? new Date(),
        "yyyy-MM-dd 00:00:00"
      );
      const end_at = format(
        endDate ?? date?.to ?? new Date(),
        "yyyy-MM-dd 23:59:59"
      );

      try {
        const responses = await axiosInstance.post<
          ApiResponse<GameHistoryInfo> // Updated response type structure
        >("/player_bet_logs", {
          // Updated endpoint
          token: user.token,
          start_at: start_at,
          end_at: end_at,
          page_size: pageSize.toString(), // Added page_size
          page: page.toString(), // Ensure page is string
        });

        if (
          responses.data.status.errorCode != 0 &&
          responses.data.status.errorCode != 200
        ) {
          throw new ApiError(
            "API Error",
            responses.data.status.errorCode,
            responses.data.status.mess
          );
        }

        // Access data directly as per API response structure
        const newGameHistory = responses.data.data
          ? responses.data.data.data
          : [];

        // --- Revised Logic: Combine adjacent bet/win records ---
        const processedHistory: ProcessedGameHistoryRecord[] = [];
        // Sort raw data by time (ascending) to increase chance of adjacency for pairing
        // Note: This assumes bet_time is reliable for ordering.
        const sortedRawData = [...newGameHistory].sort(
          (a, b) =>
            new Date(a.bet_time).getTime() - new Date(b.bet_time).getTime()
        );

        for (let i = 0; i < sortedRawData.length; i++) {
          const record1 = sortedRawData[i];
          const record2 = sortedRawData[i + 1]; // Look ahead
          console.log(record1, record2);

          // Check if record1 is 'bet' and record2 is 'win' and they seem related
          if (
            record2 &&
            record1.bet_type.toLowerCase() === "bet" &&
            record2.bet_type.toLowerCase() === "win" &&
            record1.game_name == record2.game_name && // Sanity check: same game
            record1.game_provider == record2.game_provider // Sanity check: same provider
            // Optional: Add a time difference check if needed:
            // Math.abs(new Date(record2.bet_time).getTime() - new Date(record1.bet_time).getTime()) < 5000 // e.g., within 5 seconds
          ) {
            const betAmount = record1.amount;
            const winAmount = record2.amount; // Payout amount
            const netAmount = winAmount - betAmount;
            let finalStatus: "win" | "loss" | "push";
            if (netAmount > 0) {
              finalStatus = "win";
            } else if (netAmount < 0) {
              finalStatus = "loss";
            } else {
              finalStatus = "push";
            }

            processedHistory.push({
              game_name: record1.game_name,
              game_provider: record1.game_provider,
              // Use bet_id from the 'bet' record. Displaying both might be confusing.
              bet_id: record1.bet_id,
              bet_time: record1.bet_time, // Use bet time as the primary time
              currency: record1.currency,
              bet_amount: betAmount,
              win_amount: winAmount,
              net_amount: netAmount,
              final_status: finalStatus,
              bet_type: record1.bet_type, // Preserve original bet_type from 'bet' record
              freespin_id: record1.freespin_id, // Preserve freespin_id from 'bet' record
            });

            i++; // IMPORTANT: Increment i again because we processed two records (record1 and record2)
          } else {
            // Handle potential unpaired records or different ordering (e.g., win then bet)
            // Current logic: Skip records that don't fit the bet -> win pattern.
            // console.warn("Skipping potentially unpaired record or unexpected order:", record1);
          }
        }
        // --- End of revised combining logic ---

        // Sort the final processed history by time (descending) for display
        processedHistory.sort(
          (a, b) =>
            new Date(b.bet_time).getTime() - new Date(a.bet_time).getTime()
        );

        setGameHistory((prev) =>
          page === 1 ? processedHistory : [...prev, ...processedHistory]
        );
        // Base 'hasMore' on the *raw* data count, as processing halves the count roughly.
        setHasMore(newGameHistory.length === pageSize);
        if (isLoadMore) {
          setCurrentPage(page);
        }
      } catch (err) {
        console.error("Error loading game history:", err);
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError("Network Error", 500, "Failed to fetch data.");

        if (apiError.statusCode === 401) {
          setUser(null);
        }
        if (!isLoadMore) {
          setError(apiError);
          setGameHistory([]);
        }
        setHasMore(false);
      } finally {
        if (!isLoadMore) {
          setLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [user.token, date, setLoading, setError, setUser, loading, isLoadingMore] // Dependencies
  );

  // Apply local search filter AFTER data fetching
  const filteredHistory =
    gameHistory.length > 0
      ? gameHistory.filter((record: ProcessedGameHistoryRecord) => {
          // Use processed type
          const searchTermLower = searchTerm.toLowerCase();
          // Adjust filter fields based on the ProcessedGameHistoryRecord structure
          return (
            record.game_name.toLowerCase().includes(searchTermLower) ||
            record.game_provider.toLowerCase().includes(searchTermLower) ||
            record.bet_id.toLowerCase().includes(searchTermLower) ||
            record.bet_amount.toString().includes(searchTermLower) || // Search bet amount
            record.win_amount.toString().includes(searchTermLower) || // Search win amount
            record.net_amount.toString().includes(searchTermLower) // Search net amount
          );
        })
      : [];

  // Effect for initial load
  useEffect(() => {
    setGameHistory([]);
    setCurrentPage(1);
    setHasMore(true);
    loadGameHistory(1, date?.from, date?.to).finally(() => {
      isInitialMountRef.current = false; // Mark initial mount as complete
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mount-only

  // Effect for date filter changes -> Reset and load page 1
  useEffect(() => {
    // Only run on date changes *after* the initial mount
    if (!isInitialMountRef.current) {
      setGameHistory([]);
      setCurrentPage(1);
      setHasMore(true);
      loadGameHistory(1, date?.from, date?.to); // No need for finally here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]); // Rerun only when date changes

  // Effect for infinite scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (scrollBottom < 150 && hasMore && !loading && !isLoadingMore) {
        loadGameHistory(currentPage + 1, date?.from, date?.to, true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, isLoadingMore, hasMore, currentPage, date, loadGameHistory]);

  return (
    <div className="h-screen pb-8 pt-12 lg:pt-16 px-6">
      {/* Back Button & Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between w-full absolute top-0 left-0 px-6 xl:px-16 xl:pt-6 pt-4"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-white lg:mb-8"
        >
          Game History {/* Updated Title */}
        </motion.h1>
        <div className="w-20" /> {/* Spacer */}
      </motion.div>

      {/* Filters and Content Area */}
      <div className="xl:max-w-5xl 2xl:max-w-7xl max-w-3xl mx-auto space-y-4 lg:space-y-4 mt-6">
        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-end gap-4" // Justify end as type filters are removed
        >
          {/* Date and Search Filters */}
          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal h-10 rounded-full bg-casino-deep-blue text-casino-silver hover:bg-casino-deep-blue/80 hover:text-white pr-8 w-auto min-w-[150px]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "MM/dd/yy")} -{" "}
                        {format(date.to, "MM/dd/yy")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-casino-deep-blue border-casino-black"
                align="end"
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                  className="text-white [&>div>table>tbody>tr>td>button]:text-white [&>div>table>tbody>tr>td>button:hover]:bg-casino-gold [&>div>table>tbody>tr>td>button:hover]:text-casino-deep-blue [&>div>div>button]:text-white [&>div>div>button:hover]:bg-casino-gold [&>div>div>button:hover]:text-casino-deep-blue [&>div>table>tbody>tr>td>button[aria-selected=true]]:bg-casino-gold [&>div>table>tbody>tr>td>button[aria-selected=true]]:text-casino-deep-blue"
                />
              </PopoverContent>
            </Popover>

            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 max-w-[12rem] rounded-full bg-casino-deep-blue text-casino-silver pl-10 pr-4 focus:ring-casino-gold focus:border-casino-gold"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-casino-silver" />
            </div>
          </div>
        </motion.div>

        {/* Game History List */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          ref={scrollContainerRef}
          className="space-y-4 overflow-y-scroll scrollbar-none max-h-[calc(100vh-9.5rem)]"
        >
          {/* Initial Loading Indicator */}
          {loading && currentPage === 1 && (
            <p className="text-center text-casino-silver py-4">Loading...</p>
          )}

          {/* Error Message */}
          {error && !loading && (
            <p className="text-center text-red-500 py-4">
              {error.name}: {error.message}
            </p>
          )}

          {/* Game History Items */}
          {!loading &&
            !error &&
            filteredHistory.length > 0 &&
            filteredHistory.map(
              (
                record: ProcessedGameHistoryRecord,
                i: number // Use processed type
              ) => (
                <div
                  key={record.bet_id + i} // Use bet_id as key, index fallback if needed
                  className="glass-effect rounded-lg p-4 flex justify-between items-center"
                >
                  {/* Left Side: Game Info */}
                  <div>
                    <h3 className="text-casino-gold font-medium">
                      {record.game_name}
                    </h3>
                    <p className="text-casino-silver text-sm">
                      {record.game_provider}
                    </p>
                    <p className="text-casino-silver text-xs mt-1">
                      Bet: {record.bet_amount.toFixed(2)} {record.currency}
                    </p>
                    <p className="text-casino-silver text-xs mt-1">
                      Win: {record.win_amount.toFixed(2)} {record.currency}
                    </p>
                  </div>

                  {/* Right Side: Result and Time */}
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        // Increased font size
                        record.final_status === "win"
                          ? "text-green-400"
                          : record.final_status === "loss"
                          ? "text-red-400"
                          : "text-amber-500" // Color for 'push' or 'draw'
                      }`}
                    >
                      {/* Display Net Amount */}
                      {record.net_amount >= 0 ? "+" : ""}
                      {record.net_amount.toFixed(2)} {record.currency}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        // Status text
                        record.final_status === "win"
                          ? "text-green-400"
                          : record.final_status === "loss"
                          ? "text-red-400"
                          : "text-amber-500"
                      }`}
                    >
                      {record.final_status.toUpperCase()}
                    </p>
                    <p className="text-casino-silver text-xs mt-1">
                      {record.bet_time}
                    </p>
                  </div>
                </div>
              )
            )}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <p className="text-center text-casino-silver py-4">
              Loading more...
            </p>
          )}

          {/* No Results Message */}
          {!loading &&
            !isLoadingMore &&
            !error &&
            gameHistory.length > 0 &&
            filteredHistory.length === 0 && (
              <p className="text-center text-casino-silver py-4">
                No game history matches your search term.
              </p>
            )}
          {!loading && !isLoadingMore && !error && gameHistory.length === 0 && (
            <p className="text-center text-casino-silver py-4">
              No game history found for the selected criteria.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GameHistory;
