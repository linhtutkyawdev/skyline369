import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GameCategoryProps {
  title: string;
  icon: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isAdjacent?: boolean;
  isLive?: boolean;
}

const GameCategory = ({
  title,
  icon,
  bgColor = "bg-casino-light-blue",
  onClick,
  isSelected = false,
  isAdjacent = false,
  isLive = false,
}: GameCategoryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "game-card flex flex-col items-center justify-center p-4 sm:p-6 relative my-5",
        isSelected
          ? "h-[11.5rem] lg:h-56 w-full scale-105 z-10"
          : isAdjacent
          ? "h-[10.5rem] lg:h-52 w-full scale-103 z-5"
          : "h-[9.5rem] lg:h-48 w-full"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-casino-deep-blue opacity-50 z-0"></div>

      {isLive && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
            LIVE
          </div>
        </div>
      )}

      <div className="z-10 flex flex-col items-center">
        <div
          className={cn(
            "mb-4",
            isSelected && "scale-110",
            isAdjacent && "scale-105"
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            "uppercase tracking-widest text-white font-medium text-center",
            isSelected ? "text-xl" : isAdjacent ? "text-lg" : "text-base"
          )}
        >
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export default GameCategory;
