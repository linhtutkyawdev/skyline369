import { ArrowLeft, Mail } from "lucide-react"; // Added Mail icon
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo } from "react"; // Added useMemo
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge"; // Import Badge for unread status

const filterOptions = ["global", "personal", "support"];

// Dummy message data structure
interface Message {
  id: number;
  type: "global" | "personal" | "support";
  sender: string;
  timestamp: string;
  title: string;
  content: string;
  read: boolean;
}

// Dummy messages
const dummyMessages: Message[] = [
  {
    id: 1,
    type: "global",
    sender: "System",
    timestamp: "2024-04-10 10:00",
    title: "Welcome Bonus!",
    content: "Claim your welcome bonus now!",
    read: false,
  },
  {
    id: 2,
    type: "personal",
    sender: "Admin",
    timestamp: "2024-04-09 15:30",
    title: "Account Verification",
    content: "Your account has been verified.",
    read: true,
  },
  {
    id: 3,
    type: "support",
    sender: "Support Team",
    timestamp: "2024-04-08 11:00",
    title: "Re: Withdrawal Issue",
    content: "Your withdrawal issue has been resolved.",
    read: true,
  },
  {
    id: 4,
    type: "global",
    sender: "System",
    timestamp: "2024-04-07 09:00",
    title: "New Game Added",
    content: "Check out the new 'Dragon's Fortune' slot game!",
    read: false,
  },
  {
    id: 5,
    type: "personal",
    sender: "Promotions",
    timestamp: "2024-04-06 14:00",
    title: "Special Offer Just For You",
    content: "Get 50 free spins on your next deposit.",
    read: false,
  },
  {
    id: 6,
    type: "global",
    sender: "System",
    timestamp: "2024-04-05 12:00",
    title: "Scheduled Maintenance",
    content: "System maintenance scheduled for tonight at 2 AM.",
    read: true,
  },
];

// Simple Message Item Component
const MessageItem = ({ message }: { message: Message }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Add useNavigate hook

  const handleClick = () => {
    navigate(`/messages/${message.id}`); // Navigate to detail page
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-casino-secondary p-4 rounded-lg shadow flex items-start gap-4 hover:bg-casino-secondary/80 transition-colors cursor-pointer"
      onClick={handleClick} // Add onClick handler
    >
      <div
        className={`mt-1 p-2 rounded-full ${
          message.read ? "bg-casino-silver/20" : "bg-casino-gold/30"
        }`}
      >
        <Mail
          className={`w-5 h-5 ${
            message.read ? "text-casino-silver" : "text-casino-gold"
          }`}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`font-semibold ${
              message.read ? "text-casino-silver" : "text-white"
            }`}
          >
            {message.title}
          </span>
          <span className="text-xs text-casino-silver">
            {message.timestamp}
          </span>
        </div>
        <p
          className={`text-sm ${
            message.read ? "text-casino-silver/80" : "text-casino-silver"
          }`}
        >
          {message.content}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-casino-silver">
            {t("sender")}: {message.sender}
          </span>
          {!message.read && (
            <Badge variant="destructive" className="text-xs">
              {t("unread")}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Messages = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<
    "global" | "personal" | "support"
  >("global");
  const { t } = useTranslation();

  // Filter messages based on selected tab
  const filteredMessages = useMemo(() => {
    return dummyMessages.filter((msg) => msg.type === selectedFilter);
  }, [selectedFilter]);

  return (
    // Keep existing outer div and back button structure
    <div className="h-screen pb-8 pt-12 lg:pt-16 px-6 bg-casino-primary">
      {" "}
      {/* Keep outer padding for content below */}
      {/* Header Section - Matches TransactionHistory */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between w-full absolute top-0 left-0 px-6 xl:px-16 xl:pt-6 pt-4" // Use same classes as TransactionHistory header
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("back")}</span>
        </button>
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }} // Keep animation if desired
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-white" // Removed mb-4
        >
          {t("messages")}
        </motion.h1>
        {/* Spacer */}
        <div className="w-20" /> {/* Same spacer as TransactionHistory */}
      </motion.div>
      {/* Content Area - Add margin-top to account for absolute header */}
      <div className="xl:max-w-5xl 2xl:max-w-7xl max-w-3xl mx-auto space-y-4 lg:space-y-4 mt-6">
        {/* Keep existing filter button structure */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex bg-casino-deep-blue rounded p-1 gap-1" // Use gap for spacing
        >
          {/* Removed the animated background div */}
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setSelectedFilter(filter as "global" | "personal" | "support")
              }
              className={`flex-1 px-4 py-2 text-sm text-center rounded transition-colors duration-200 ${
                // Added rounded and adjusted transition
                selectedFilter === filter
                  ? "bg-casino-gold text-casino-deep-blue font-semibold" // Style for active tab
                  : "text-casino-silver hover:bg-casino-white/10" // Style for inactive tabs
              }`}
            >
              {t(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`)}
            </button>
          ))}
        </motion.div>

        {/* Replace placeholder with message list */}
        <motion.div
          initial={{ opacity: 0 }} // Animate opacity for the list container
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-casino-gold scrollbar-track-casino-secondary max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-14rem)] pr-2 scrollbar-none" // Adjusted height, added scrollbar styling & padding-right
        >
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          ) : (
            <motion.div // Added animation for empty state
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-casino-silver py-10"
            >
              {t("noMessagesFound")}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
