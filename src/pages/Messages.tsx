import {
  ArrowLeft,
  MessageSquare,
  Search,
  Send,
  Smile,
  Pin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Sample data for direct messages
const messagesData = [
  {
    id: 1,
    user: "Casino Support",
    avatar: "",
    messages: [
      {
        id: 1,
        text: "Welcome to our casino! How can we help you today?",
        time: "10:30 AM",
        sent: false,
      },
      {
        id: 2,
        text: "I have a question about my deposit.",
        time: "10:32 AM",
        sent: true,
      },
      {
        id: 3,
        text: "Of course! What would you like to know?",
        time: "10:33 AM",
        sent: false,
      },
    ],
  },
  {
    id: 2,
    user: "Bonus Team",
    avatar: "",
    messages: [
      {
        id: 1,
        text: "You've received a new bonus! 100% match up to $500.",
        time: "Yesterday",
        sent: false,
      },
      {
        id: 2,
        text: "Thanks! How do I claim it?",
        time: "Yesterday",
        sent: true,
      },
      {
        id: 3,
        text: "Just make a deposit and it will be automatically applied.",
        time: "Yesterday",
        sent: false,
      },
    ],
  },
  {
    id: 3,
    user: "VIP Manager",
    avatar: "",
    messages: [
      {
        id: 1,
        text: "Congratulations on reaching VIP status!",
        time: "2 days ago",
        sent: false,
      },
      {
        id: 2,
        text: "What benefits do I get?",
        time: "2 days ago",
        sent: true,
      },
      {
        id: 3,
        text: "You now have access to exclusive games, higher withdrawal limits, and a personal account manager.",
        time: "2 days ago",
        sent: false,
      },
    ],
  },
];

// Sample data for global chat
const globalChatData = [
  {
    id: 1,
    username: "JackieWin88",
    avatar: "",
    text: "Just won 500 on roulette! 🎉",
    time: "5 min ago",
    isSticker: false,
  },
  {
    id: 2,
    username: "System",
    avatar: "",
    text: "Welcome to the newest version of our casino app! Check out the new games in the Live Casino section.",
    time: "10 min ago",
    isPinned: true,
    isAnnouncement: true,
  },
  {
    id: 3,
    username: "LuckyLucy",
    avatar: "",
    text: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJvdDlnY241Njk0MzJheHFyenp1NGhwcWZtdTlieDFmYmsxdnJ3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aDahRuDWMufAyZy/giphy.gif",
    time: "15 min ago",
    isSticker: true,
  },
  {
    id: 4,
    username: "VegasKing",
    avatar: "",
    text: "Anyone trying the new poker room?",
    time: "20 min ago",
    isSticker: false,
  },
  {
    id: 5,
    username: "System",
    avatar: "",
    text: "Maintenance scheduled for tomorrow from 3-5 AM. The platform may experience brief downtime.",
    time: "1 hour ago",
    isPinned: true,
    isAnnouncement: true,
  },
  {
    id: 6,
    username: "SlotMaster",
    avatar: "",
    text: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0Z29jMDRmYjk3dG1iYTFpeDYwZm14bWt4ZXhsNmdiN3UzYTMzaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yJFeycRK2DB4c/giphy.gif",
    time: "2 hours ago",
    isSticker: true,
  },
];

// Sample stickers
const stickers = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJvdDlnY241Njk0MzJheHFyenp1NGhwcWZtdTlieDFmYmsxdnJ3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aDahRuDWMufAyZy/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0Z29jMDRmYjk3dG1iYTFpeDYwZm14bWt4ZXhsNmdiN3UzYTMzaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yJFeycRK2DB4c/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWE4MzIzeWVhNXlibGVqOWxta3NyYWZ0ejJzeG9xbWVza3EyYnVpcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmcxanR1Y3p3M2huenJoMnZ1NXg5bndhYXlydW83cHozaDZ5am5oYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g9582DNuQppxC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3FzcGV0MjVyeWI4dWpianZnM214NGJrMGkxZTVib2czbzM2ZjY5dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0EQhAiNw3JDy/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXp6aTBzaG5jb3pkMXNrNjFzYWI3YXNhNDh0ZjRpemdxcWF5MHMydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LdOyjZ7io5Msw/giphy.gif",
];

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState(messagesData[0]);
  const [messageText, setMessageText] = useState("");
  const [viewingList, setViewingList] = useState(true);
  const [showStickers, setShowStickers] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [globalMessages, setGlobalMessages] = useState(globalChatData);
  const globalChatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (globalChatRef.current) {
      globalChatRef.current.scrollTop = globalChatRef.current.scrollHeight;
    }
  }, [globalMessages]);

  const handleSend = () => {
    if (messageText.trim()) {
      if (activeTab === "global") {
        // Add message to global chat
        setGlobalMessages([
          ...globalMessages,
          {
            id: globalMessages.length + 1,
            username: "You",
            avatar: "",
            text: messageText,
            time: "Just now",
            isSticker: false,
          },
        ]);
        toast({
          title: "Message sent",
          description: "Your message has been posted to the global chat.",
        });
      } else {
        // In a real app, you'd send the direct message to a backend
        toast({
          title: "Message sent",
          description: `Your message has been sent to ${activeChat.user}.`,
        });
      }
      setMessageText("");
      setShowStickers(false);
    }
  };

  const sendSticker = (stickerUrl: string) => {
    if (activeTab === "global") {
      setGlobalMessages([
        ...globalMessages,
        {
          id: globalMessages.length + 1,
          username: "You",
          avatar: "",
          text: stickerUrl,
          time: "Just now",
          isSticker: true,
        },
      ]);
    } else {
      // In a real app, you'd send the sticker to the backend
    }
    setShowStickers(false);
    toast({
      title: "Sticker sent",
      description: "Your sticker has been posted.",
    });
  };

  const renderPinnedAnnouncements = () => {
    const pinnedMessages = globalMessages.filter((msg) => msg.isPinned);

    if (pinnedMessages.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-casino-gold text-sm flex items-center gap-2 mb-2">
          <Pin className="w-4 h-4" /> Pinned Announcements
        </h3>
        <div className="space-y-2">
          {pinnedMessages.map((msg) => (
            <div
              key={`pinned-${msg.id}`}
              className="glass-effect rounded-lg p-3 border-l-2 border-casino-gold"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-casino-gold text-xs font-semibold">
                  SYSTEM ANNOUNCEMENT
                </span>
                <span className="text-casino-silver text-xs">{msg.time}</span>
              </div>
              <p className="text-white text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen pb-28 pt-28 px-0 overflow-y-scroll">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center px-6 absolute top-6 left-0"
      >
        <button
          onClick={() => (viewingList ? navigate("/") : setViewingList(true))}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{viewingList ? "Back" : "Messages"}</span>
        </button>
      </motion.div>

      {viewingList ? (
        <>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-white mb-8"
          >
            Messages
          </motion.h1>

          <Tabs
            defaultValue="global"
            className="max-w-2xl mx-auto px-6"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="global">Global Chat</TabsTrigger>
              <TabsTrigger value="direct">Direct Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="pt-2">
              <div className="glass-effect rounded-lg p-4">
                {renderPinnedAnnouncements()}

                <div
                  ref={globalChatRef}
                  className="h-[calc(100vh-400px)] overflow-y-auto mb-4 pr-2 space-y-4"
                >
                  {globalMessages
                    .filter((msg) => !msg.isPinned)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-lg p-3 ${
                          message.isAnnouncement
                            ? "glass-effect border-l-2 border-casino-gold"
                            : "bg-casino-deep-blue"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`${
                              message.isAnnouncement
                                ? "text-casino-gold"
                                : "text-white"
                            } font-medium`}
                          >
                            {message.username}
                          </span>
                          <span className="text-casino-silver text-xs">
                            {message.time}
                          </span>
                        </div>

                        {message.isSticker ? (
                          <img
                            src={message.text}
                            alt="Sticker"
                            className="max-w-[150px] max-h-[150px] rounded-md my-2"
                          />
                        ) : (
                          <p className="text-white text-sm">{message.text}</p>
                        )}
                      </div>
                    ))}
                </div>

                <div className="relative">
                  <div className="flex gap-2 items-center">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => setShowStickers(!showStickers)}
                      className="bg-casino-deep-blue"
                    >
                      <Smile className="w-5 h-5 text-casino-silver" />
                    </Button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                      onClick={handleSend}
                      className="w-12 h-12 bg-casino-gold rounded-full flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 text-casino-deep-blue" />
                    </button>
                  </div>

                  {showStickers && (
                    <div className="absolute bottom-16 left-0 right-0 glass-effect rounded-lg p-4 grid grid-cols-3 gap-3">
                      {stickers.map((stickerUrl, index) => (
                        <div
                          key={index}
                          onClick={() => sendSticker(stickerUrl)}
                          className="hover:bg-casino-light-blue hover:bg-opacity-30 rounded-md p-1 cursor-pointer transition-colors"
                        >
                          <img
                            src={stickerUrl}
                            alt={`Sticker ${index + 1}`}
                            className="w-full h-24 object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="direct">
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-casino-silver w-5 h-5" />
              </div>

              <div className="space-y-4">
                {messagesData.map((chat) => (
                  <div
                    key={chat.id}
                    className="glass-effect rounded-lg p-4 flex items-center cursor-pointer hover:bg-casino-light-blue hover:bg-opacity-30 transition-all"
                    onClick={() => {
                      setActiveChat(chat);
                      setViewingList(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-casino-deep-blue flex items-center justify-center mr-4">
                      <MessageSquare className="w-6 h-6 text-casino-gold" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-white font-medium">{chat.user}</h3>
                        <span className="text-casino-silver text-xs">
                          {chat.messages[chat.messages.length - 1].time}
                        </span>
                      </div>
                      <p className="text-casino-silver text-sm truncate">
                        {chat.messages[chat.messages.length - 1].text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col h-[calc(100vh-150px)] px-6"
        >
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {activeChat.user}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            {activeChat.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] mb-4 ${
                  message.sent ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.sent
                      ? "bg-casino-light-blue text-white"
                      : "glass-effect text-white"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-xs text-casino-silver mt-1 ${
                    message.sent ? "text-right" : "text-left"
                  }`}
                >
                  {message.time}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="flex gap-2 items-center">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setShowStickers(!showStickers)}
                className="bg-casino-deep-blue"
              >
                <Smile className="w-5 h-5 text-casino-silver" />
              </Button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-casino-deep-blue border border-casino-light-blue rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-casino-gold"
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="w-12 h-12 bg-casino-gold rounded-full flex items-center justify-center"
              >
                <Send className="w-5 h-5 text-casino-deep-blue" />
              </button>
            </div>

            {showStickers && (
              <div className="absolute bottom-16 left-0 right-0 glass-effect rounded-lg p-4 grid grid-cols-3 gap-3">
                {stickers.map((stickerUrl, index) => (
                  <div
                    key={index}
                    onClick={() => sendSticker(stickerUrl)}
                    className="hover:bg-casino-light-blue hover:bg-opacity-30 rounded-md p-1 cursor-pointer transition-colors"
                  >
                    <img
                      src={stickerUrl}
                      alt={`Sticker ${index + 1}`}
                      className="w-full h-24 object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Messages;
