import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal";

const ContactUsModal = () => {
  const { activeModal, setActiveModal } = useModalStore();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal();
    };

    if (activeModal === "contact_us") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal]);

  return (
    <AnimatePresence>
      {activeModal === "contact_us" && (
        <motion.div
          className="fixed inset-0 bg-main z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/30 w-full max-w-md rounded-lg border border-casino-light-blue p-6 modal-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center mb-6"
            >
              <h2 className="text-xl font-semibold text-casino-silver">
                Contact Us
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal()}
                className="text-casino-silver"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-casino-silver text-center mb-8">
                Our support team is available 24/7. Choose your preferred method
                of contact below.
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
                    <p className="text-casino-silver text-sm">
                      +95 9 123 456 789
                    </p>
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
                <h3 className="text-casino-gold font-medium mb-2">
                  Office Hours
                </h3>
                <p className="text-white text-sm">
                  Our customer support team is available 24 hours a day, 7 days
                  a week.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactUsModal;
