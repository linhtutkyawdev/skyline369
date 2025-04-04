import { ArrowLeft, Calendar as CalendarIcon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useStateStore } from "@/store/state";
import { TransactionInfo, TrabsactionRecord } from "@/types/deposit_info";
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
import { useTranslation } from "react-i18next"; // Import useTranslation
const TransationHistory = () => {
  // Global state and navigation
  const { loading, setLoading, error, setError } = useStateStore();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Get translation function
  // Component state
  const [transactions, setTransactions] = useState<TrabsactionRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Deposit" | "Withdrawal"
  >("All");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Memoized function to load transactions
  const loadTransactionListing = useCallback(
    async (
      page: number,
      startDate?: Date,
      endDate?: Date,
      isLoadMore = false
    ) => {
      // Set loading state based on whether it's an initial load or loading more
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        // Avoid setting main loading state if already loading more
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
          ApiResponse<TransactionInfo>
        >("/transaction_listing", {
          token: user.token,
          start_at: start_at,
          end_at: end_at,
          page: page,
        });

        if (
          responses.data.status.errorCode != 0 &&
          responses.data.status.errorCode != 200
        ) {
          throw new ApiError(
            t("apiErrorTitle"),
            responses.data.status.errorCode,
            responses.data.status.mess
          );
        }

        const newTransactions = responses.data.data?.data ?? [];

        setTransactions((prev) =>
          page === 1 ? newTransactions : [...prev, ...newTransactions]
        );
        // Determine if there are more pages based on whether the API returned results
        // A more robust check might involve comparing results length to a page size limit
        setHasMore(newTransactions.length > 0);
        if (isLoadMore) {
          setCurrentPage(page); // Update current page only when loading more succeeds
        }
      } catch (err) {
        console.error("Error loading transaction history:", err);
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                t("networkErrorTitle"),
                500,
                t("fetchDataFailedDesc")
              );

        if (apiError.statusCode === 401) {
          setUser(null); // Logout on auth error
        }
        // Set error only on initial load failure or if it's a new error
        if (!isLoadMore) {
          setError(apiError);
          setTransactions([]); // Clear data on initial load error
        }
        setHasMore(false); // Stop pagination on any error
      } finally {
        // Reset loading states
        if (!isLoadMore) {
          setLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
      // IMPORTANT: Include all state setters used inside useCallback in the dependency array
      // if their identity could change, although state setters from useState are stable.
      // Include external dependencies like `user.token`, `date`.
    },
    [user.token, date, setLoading, setError, setUser, loading, isLoadingMore]
  ); // Added loading states to prevent concurrent loads

  // Apply local filters (type and search) AFTER data fetching
  const typeFilteredHistory =
    selectedFilter === "All"
      ? transactions
      : transactions.filter((record) => record.type === selectedFilter);

  const filteredHistory = (typeFilteredHistory ?? []).filter(
    (record: TrabsactionRecord) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        record.transaction_id.toLowerCase().includes(searchTermLower) ||
        record.status.toLowerCase().includes(searchTermLower) ||
        record.money.toString().includes(searchTermLower)
      );
    }
  );

  // Effect for filter changes (date or type) -> Reset and load page 1
  useEffect(() => {
    // Reset pagination and load page 1 whenever date or selectedFilter changes.
    // This now runs *every* time these dependencies change, including after initial mount.
    setTransactions([]);
    setCurrentPage(1);
    setHasMore(true); // Crucially reset hasMore to true
    loadTransactionListing(1, date?.from, date?.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, selectedFilter]); // Rerun when date or selectedFilter changes

  // Effect for infinite scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      // Trigger load more if near bottom, has more data, and not currently loading
      if (scrollBottom < 150 && hasMore && !loading && !isLoadingMore) {
        loadTransactionListing(currentPage + 1, date?.from, date?.to, true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    loading,
    isLoadingMore,
    hasMore,
    currentPage,
    date,
    loadTransactionListing,
  ]); // Dependencies

  return (
    <div className="h-screen pb-8 pt-12 lg:pt-16 px-6">
      {/* Back Button */}
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
          <span>{t("back")}</span>
        </button>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-white lg:mb-8"
        >
          {t("transactionHistoryTitle")}
        </motion.h1>
        <div className="w-20" />
      </motion.div>

      {/* Filters and Content Area */}
      <div className="xl:max-w-5xl 2xl:max-w-7xl max-w-3xl mx-auto space-y-4 lg:space-y-4 mt-6">
        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4" // Added flex-wrap and gap
        >
          {/* Type Filters */}
          <div className="flex gap-2">
            {(["All", "Deposit", "Withdrawal"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setSelectedFilter(filterType)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedFilter === filterType
                    ? "bg-casino-gold text-casino-deep-blue"
                    : "bg-casino-deep-blue text-casino-silver"
                }`}
              >
                {t(`filter${filterType}`)}
              </button>
            ))}
          </div>

          {/* Date and Search Filters */}
          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal h-10 rounded-full bg-casino-deep-blue text-casino-silver hover:bg-casino-deep-blue/80 hover:text-white pr-8 w-auto min-w-[150px]", // Adjusted width
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
                    <span>{t("pickDateRange")}</span>
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
                placeholder={t("searchPlaceholderDots")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 max-w-[12rem] rounded-full bg-casino-deep-blue text-casino-silver pl-10 pr-4 focus:ring-casino-gold focus:border-casino-gold"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-casino-silver" />
            </div>
          </div>
        </motion.div>

        {/* Transaction List */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          ref={scrollContainerRef}
          className="space-y-4 overflow-y-scroll scrollbar-none max-h-[calc(100vh-9.5rem)]" // Adjusted height calculation
        >
          {/* Initial Loading Indicator */}
          {loading && currentPage === 1 && (
            <p className="text-center text-casino-silver py-4">
              {t("loadingDots")}
            </p>
          )}

          {/* Error Message */}
          {error &&
            !loading && ( // Show error only if not loading
              <p className="text-center text-red-500 py-4">
                {error.name}: {error.message}
              </p>
            )}

          {/* Transaction Items */}
          {!loading &&
            !error &&
            filteredHistory.length > 0 &&
            filteredHistory.map((d: TrabsactionRecord, i: number) => (
              <div
                key={d.transaction_id + i}
                className="glass-effect rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-casino-gold font-medium">
                    {d.type === "Deposit" ? "+" : "-"} ${d.money}
                  </h3>
                  <p className="text-casino-silver text-sm">{d.type}</p>
                  <p className="text-casino-silver text-xs mt-1">
                    {t("userIdLabel", { id: d.transaction_id })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      d.status.toLowerCase().includes("pending") ||
                      d.status.toLowerCase().includes("unconfirmed")
                        ? "text-amber-500"
                        : d.status.toLowerCase().includes("success") ||
                          d.status.toLowerCase().includes("approved")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {d.status}
                  </p>
                  <p className="text-casino-silver text-xs mt-1">
                    {d.created_at}
                  </p>
                </div>
              </div>
            ))}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <p className="text-center text-casino-silver py-4">
              {t("loadingMoreDots")}
            </p>
          )}
          {/* No Results Message (when search/filter yields nothing from existing data) */}
          {!loading &&
            !isLoadingMore &&
            !error &&
            transactions.length > 0 && // We have *some* data loaded
            filteredHistory.length === 0 && ( // But the current filter shows none
              <p className="text-center text-casino-silver py-4">
                {t("noTransactionsMatchFilter")}
              </p>
            )}

          {/* No Results Message (when fetch returned nothing initially) */}
          {!loading &&
            !isLoadingMore &&
            !error &&
            transactions.length === 0 && (
              <p className="text-center text-casino-silver py-4">
                {t("noTransactionsFound")}
              </p>
            )}

          {/* End of List Indicator */}
          {!loading &&
            !isLoadingMore &&
            !hasMore &&
            transactions.length > 0 && (
              <p className="text-center text-casino-silver/70 text-sm py-4">
                {t("endOfHistory")}
              </p>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default TransationHistory;
