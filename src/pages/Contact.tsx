import { ArrowLeft, Mail, Phone, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-y-scroll pb-20 pt-6 px-6">
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
        Contact Us
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 max-w-md mx-auto"
      >
        <p className="text-casino-silver text-center mb-8">
          Our support team is available 24/7. Choose your preferred method of
          contact below.
        </p>

        <div className="space-y-4">
          <a
            href="mailto:support@skyline369.com"
            className="w-full py-4 px-5 rounded-lg bg-casino-light-blue flex items-center gap-4 transition-all hover:bg-opacity-80"
          >
            <div className="w-10 h-10 rounded-full gold-badge flex items-center justify-center">
              <Mail className="w-5 h-5 text-casino-deep-blue" />
            </div>
            <div>
              <h3 className="text-white font-medium">Email Support</h3>
              <p className="text-casino-silver text-sm">
                support@skyline369.com
              </p>
            </div>
          </a>

          <a
            href="tel:+959123456789"
            className="w-full py-4 px-5 rounded-lg bg-casino-light-blue flex items-center gap-4 transition-all hover:bg-opacity-80"
          >
            <div className="w-10 h-10 rounded-full gold-badge flex items-center justify-center">
              <Phone className="w-5 h-5 text-casino-deep-blue" />
            </div>
            <div>
              <h3 className="text-white font-medium">Phone Support</h3>
              <p className="text-casino-silver text-sm">+95 9 123 456 789</p>
            </div>
          </a>

          <a
            href="#"
            className="w-full py-4 px-5 rounded-lg bg-casino-light-blue flex items-center gap-4 transition-all hover:bg-opacity-80"
          >
            <div className="w-10 h-10 rounded-full gold-badge flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-casino-deep-blue" />
            </div>
            <div>
              <h3 className="text-white font-medium">Live Chat</h3>
              <p className="text-casino-silver text-sm">Available 24/7</p>
            </div>
          </a>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-casino-deep-blue">
          <h3 className="text-casino-gold font-medium mb-2">Office Hours</h3>
          <p className="text-white text-sm">
            Our customer support team is available 24 hours a day, 7 days a
            week.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
