import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

// Re-use the dummy data structure and data from Messages.tsx for now
// In a real app, this data would likely be fetched or come from a store
interface Message {
  id: number;
  type: "global" | "personal" | "support";
  sender: string;
  timestamp: string;
  title: string;
  content: string;
  read: boolean;
}

const dummyMessages: Message[] = [
  {
    id: 1,
    type: "global",
    sender: "System",
    timestamp: "2024-04-10 10:00",
    title: "Welcome Bonus!",
    content:
      "Claim your welcome bonus now! Visit the promotions page for more details.",
    read: false,
  },
  {
    id: 2,
    type: "personal",
    sender: "Admin",
    timestamp: "2024-04-09 15:30",
    title: "Account Verification",
    content:
      "Your account has been successfully verified. You can now access all features.",
    read: true,
  },
  {
    id: 3,
    type: "support",
    sender: "Support Team",
    timestamp: "2024-04-08 11:00",
    title: "Re: Withdrawal Issue",
    content:
      "We have investigated your withdrawal issue (Ref: #12345) and it has been resolved. The funds should reflect in your account shortly.",
    read: true,
  },
  {
    id: 4,
    type: "global",
    sender: "System",
    timestamp: "2024-04-07 09:00",
    title: "New Game Added",
    content:
      "Exciting news! We've just added the thrilling 'Dragon's Fortune' slot game to our collection. Give it a spin!",
    read: false,
  },
  {
    id: 5,
    type: "personal",
    sender: "Promotions",
    timestamp: "2024-04-06 14:00",
    title: "Special Offer Just For You",
    content:
      "As a valued player, enjoy 50 free spins on your next deposit of $50 or more. Use code: SPIN50",
    read: false,
  },
  {
    id: 6,
    type: "global",
    sender: "System",
    timestamp: "2024-04-05 12:00",
    title: "Scheduled Maintenance",
    content:
      "Please be advised that we will be performing scheduled system maintenance tonight from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.",
    read: true,
  },
];

const MessageDetail = () => {
  const navigate = useNavigate();
  const { messageId } = useParams<{ messageId: string }>();
  const { t } = useTranslation();
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Find the message by ID from the dummy data
    const foundMessage = dummyMessages.find(
      (msg) => msg.id.toString() === messageId
    );
    setMessage(foundMessage || null);
    // In a real app, you might fetch data here:
    // fetchMessageDetail(messageId).then(setMessage);

    // Mark message as read (simulation)
    if (foundMessage && !foundMessage.read) {
      // In a real app, you'd send an API request to mark as read
      console.log(`Simulating marking message ${messageId} as read`);
      // Update local dummy data state (won't persist)
      const updatedMessages = dummyMessages.map((msg) =>
        msg.id.toString() === messageId ? { ...msg, read: true } : msg
      );
      // Note: This update is local to this component instance and won't
      // reflect back in the main Messages list without state management (like Zustand/Redux)
      // or refetching data on the Messages page.
    }
  }, [messageId]);

  if (!message) {
    // Handle message not found state
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-casino-primary text-casino-silver p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center mb-4 absolute top-6 left-6 z-20"
        >
          <button
            onClick={() => navigate("/messages")} // Navigate back to messages list
            className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t("back")}</span>
          </button>
        </motion.div>
        <p>{t("messageNotFound") || "Message not found."}</p>{" "}
        {/* Add translation key */}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-casino-primary text-white pt-16">
      {" "}
      {/* Removed p-6 */}
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-4 absolute top-6 left-6 z-20"
      >
        <button
          onClick={() => navigate("/messages")} // Navigate back to messages list
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("back")}</span>
        </button>
      </motion.div>
      {/* Centering Container */}
      <div className="xl:max-w-5xl 2xl:max-w-7xl max-w-3xl mx-auto w-full flex flex-col flex-grow px-6 pb-6">
        {" "}
        {/* Added container */}
        {/* Message Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 border-b border-casino-secondary pb-4"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-casino-gold mb-2">
            {message.title}
          </h1>
          <div className="flex justify-between items-center text-sm text-casino-silver">
            <span>
              {t("sender")}: {message.sender}
            </span>
            <span>{message.timestamp}</span>
          </div>
        </motion.div>
        {/* Message Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-casino-gold scrollbar-track-casino-secondary pr-2"
        >
          <p className="text-casino-silver whitespace-pre-wrap">
            {message.content}
          </p>
        </motion.div>
      </div>{" "}
      {/* Close Centering Container */}
    </div>
  );
};

export default MessageDetail;
