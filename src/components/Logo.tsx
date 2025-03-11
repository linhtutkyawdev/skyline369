import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center mb-4 mt-8 lg:my-20"
    >
      <motion.h1
        className="text-4xl lg:text-6xl font-bold text-white logo-text"
        animate={{
          textShadow: [
            "0 0 10px rgba(212, 175, 55, 0.7)",
            "0 0 20px rgba(212, 175, 55, 0.9)",
            "0 0 10px rgba(212, 175, 55, 0.7)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        SKYLINE<span className="text-casino-gold">369</span>
      </motion.h1>
      <motion.div
        className="mt-1 px-4 lg:px-6 lg:py-1 rounded-full bg-gradient-to-r from-casino-gold to-casino-silver text-casino-deep-blue text-xs uppercase tracking-wider font-medium"
        whileHover={{ scale: 1.05 }}
      >
        Sport Betting Casino Online
      </motion.div>
    </motion.div>
  );
};

export default Logo;
