import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MessageSquare, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStateStore } from "@/store/state";
import { useTranslation } from "react-i18next";

// --- Define Viber Icon Component (Outside the main component for clarity) ---
const ViberIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="w-6 h-6" // Default size, can be overridden by props
    viewBox="0 0 52 52"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props} // Spread any additional props like className
  >
    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="Color-"
        transform="translate(-598.000000, -758.000000)"
        className="fill-casino-deep-blue"
      >
        <path
          d="M624,810 C638.359403,810 650,798.359403 650,784 C650,769.640597 638.359403,758 624,758 C609.640597,758 598,769.640597 598,784 C598,798.359403 609.640597,810 624,810 Z M625.557163,799.409207 C627.325063,799.188564 628.753733,798.762672 630.321233,797.998094 C631.862939,797.243741 632.849644,796.530492 634.155019,795.232271 C635.37816,794.005859 636.056551,793.077041 636.776002,791.635145 C637.778174,789.623608 638.348632,787.232396 638.446219,784.599993 C638.482254,783.702032 638.456556,783.50185 638.25094,783.245321 C637.86039,782.747507 637.002091,782.829703 636.709224,783.388976 C636.616662,783.573725 636.590964,783.732729 636.560135,784.451177 C636.508729,785.554433 636.431719,786.267682 636.27751,787.119522 C635.671103,790.460024 634.067654,793.128369 631.508319,795.042409 C629.375578,796.643375 627.170843,797.423387 624.282692,797.592702 C623.306228,797.649143 623.136647,797.685029 622.915679,797.854391 C622.504456,798.177682 622.483974,798.9371 622.879644,799.291164 C623.121199,799.511855 623.290771,799.542627 624.128492,799.516968 C624.565327,799.501582 625.207683,799.450263 625.557163,799.409207 L625.557163,799.409207 Z M613.809012,798.854999 C613.98892,798.793445 614.266425,798.649789 614.425756,798.547142 C615.402134,797.900559 618.120799,794.426647 619.009917,792.692195 C619.518641,791.70186 619.688213,790.968064 619.528978,790.424129 C619.364432,789.839149 619.092143,789.531244 617.874123,788.551135 C617.385891,788.156063 616.928478,787.750671 616.856589,787.642901 C616.67156,787.376051 616.522471,786.852663 616.522471,786.483204 C616.527687,785.626251 617.082688,784.071435 617.812475,782.875805 C618.377717,781.947024 619.39013,780.756602 620.392302,779.84316 C621.569167,778.765517 622.607278,778.031815 623.779022,777.4519 C625.284788,776.702756 626.204735,776.512894 626.877996,776.825864 C627.047567,776.902853 627.227389,777.0055 627.284002,777.051621 C627.335313,777.097836 627.731079,777.580217 628.162784,778.113821 C628.995289,779.160683 629.185438,779.329998 629.755896,779.524982 C630.480563,779.771285 631.220592,779.704618 631.965742,779.324885 C632.531079,779.032366 633.76447,778.267798 634.561026,777.713628 C635.609379,776.979831 637.850063,775.153043 638.153362,774.788658 C638.687784,774.13185 638.780346,773.290379 638.42053,772.361503 C638.040222,771.381489 636.560154,769.54439 635.527163,768.759265 C634.591855,768.051128 633.92893,767.779251 633.05526,767.738158 C632.335809,767.702263 632.037726,767.763817 631.117779,768.14355 C623.902394,771.11464 618.141368,775.548114 613.567447,781.639157 C611.177779,784.820617 609.358473,788.120102 608.114745,791.542752 C607.390173,793.538846 607.354224,794.406072 607.950294,795.427217 C608.207307,795.858231 609.301946,796.925592 610.098502,797.520807 C611.424455,798.506067 612.035983,798.870414 612.524215,798.973014 C612.858247,799.04487 613.438945,798.988429 613.809012,798.854999 L613.809012,798.854999 Z M625.911773,795.688935 C629.031324,795.232271 631.446691,793.785177 633.029562,791.43501 C633.91868,790.111111 634.47368,788.556295 634.663839,786.888605 C634.730607,786.277956 634.730607,785.164427 634.658718,784.979678 C634.591855,784.80525 634.376007,784.569173 634.190969,784.471724 C633.990569,784.369076 633.564079,784.379302 633.327644,784.502496 C632.931879,784.702593 632.813714,785.020771 632.813714,785.882837 C632.813714,787.211849 632.469355,788.612736 631.873285,789.700606 C631.194894,790.942404 630.208198,791.968672 629.005635,792.681969 C627.972644,793.297732 626.4463,793.754405 625.053579,793.867278 C624.549889,793.908372 624.272384,794.010981 624.082235,794.231625 C623.789368,794.56519 623.758454,795.01675 624.00513,795.391313 C624.272375,795.806969 624.683502,795.873684 625.911773,795.688935 L625.911773,795.688935 Z M627.006411,791.814743 C628.018825,791.599213 628.794898,791.214367 629.457823,790.593454 C630.310906,789.787877 630.778646,788.812881 630.984157,787.411993 C631.122909,786.498599 631.066382,786.139423 630.742601,785.841791 C630.439407,785.564706 629.879286,785.554433 629.540048,785.816132 C629.293372,786.00088 629.216267,786.195864 629.15974,786.724365 C629.092972,787.427389 628.969591,787.919995 628.758949,788.376716 C628.306657,789.346542 627.510101,789.849431 626.163665,790.013633 C625.531464,790.090622 625.341315,790.162449 625.135794,790.403592 C624.760607,790.850039 624.90448,791.573563 625.423541,791.840412 C625.618906,791.9379 625.701131,791.948173 626.132751,791.922513 C626.400005,791.907118 626.79577,791.860949 627.006411,791.814743 L627.006411,791.814743 Z"
          id="Viber"
          transform="translate(624.000000, 784.000000) scale(1, -1) translate(-624.000000, -784.000000) "
        ></path>
      </g>
    </g>
  </svg>
);

const ContactUsModal = () => {
  const { activeModal, setActiveModal, platformConfig } = useStateStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };

    if (activeModal === "contact_us") {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [activeModal, setActiveModal]);

  // --- Helper function to get icon and href prefix based on type ---
  const getContactDetails = (type: string, link: string) => {
    const lowerType = type.toLowerCase();
    let IconComponent: React.ElementType = LinkIcon; // Default icon is LinkIcon
    let hrefPrefix = "";
    let displayType = type; // Default display type is the raw type

    // --- Map known types to specific icons and details ---
    if (lowerType.includes("email") || lowerType.includes("mail")) {
      IconComponent = Mail;
      hrefPrefix = "mailto:";
      displayType = t("email_support", "Email Support");
    } else if (lowerType.includes("phone") || lowerType.includes("tel")) {
      IconComponent = Phone;
      hrefPrefix = "tel:";
      displayType = t("phone_support", "Phone Support");
    } else if (lowerType.includes("viber")) {
      IconComponent = ViberIcon;
      hrefPrefix = `viber://add?number=`;
      displayType = t("viber", "Viber");
    } else {
      // --- Fallback for unknown types ---
      IconComponent = LinkIcon;
      // Make it a clickable link, adding // if protocol seems missing
      hrefPrefix = link.startsWith("http") || link.startsWith("//") ? "" : "//";
      displayType = type;
    }

    return { IconComponent, href: `${hrefPrefix}${link}`, displayType };
  };

  // --- Prepare services array from platformConfig ---
  const services = [];
  if (platformConfig) {
    if (platformConfig.service_link && platformConfig.service_link_type) {
      services.push({
        type: platformConfig.service_link_type,
        link: platformConfig.service_link,
      });
    }
    if (platformConfig.service_link_1 && platformConfig.service_link_type_1) {
      services.push({
        type: platformConfig.service_link_type_1,
        link: platformConfig.service_link_1,
      });
    }
    if (platformConfig.service_link_2 && platformConfig.service_link_type_2) {
      services.push({
        type: platformConfig.service_link_type_2,
        link: platformConfig.service_link_2,
      });
    }
  }

  return (
    <AnimatePresence>
      {activeModal === "contact_us" && (
        <motion.div
          className="fixed inset-0 bg-transparent backdrop-blur-xl z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-casino-deep-blue/80 w-full max-w-3xl max-h-[90vh] rounded-lg border border-casino-light-blue p-6 modal-container overflow-y-auto [@media (max-height: 480px) and (orientation: landscape)] :max-h-auto"
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
                {t("contact_us")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal(null)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                {services.length > 0 ? (
                  services.map((service, index) => {
                    const { IconComponent, href, displayType } =
                      getContactDetails(service.type, service.link);
                    return (
                      <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-5 rounded-lg bg-casino-light-blue flex items-center gap-4 transition-all hover:bg-opacity-80"
                      >
                        <div className="w-10 h-10 rounded-full gold-badge flex items-center justify-center flex-shrink-0">
                          {" "}
                          <IconComponent className="w-5 h-5 text-casino-deep-blue" />
                        </div>
                        <div className="overflow-hidden">
                          {" "}
                          <h3 className="text-white font-medium truncate">
                            {" "}
                            {displayType}
                          </h3>
                          <p className="text-casino-silver text-sm truncate">
                            {" "}
                            {service.link}
                          </p>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  // Optional: Show a message if no services are configured
                  <p className="text-casino-silver col-span-1 md:col-span-2 text-center">
                    {t("noContactMethods", "Contact methods not available.")}
                  </p>
                )}
                {/* <a
                  href="#" // Replace with actual live chat link or function call
                  onClick={(e) => {
                    e.preventDefault();
                    // Add your live chat opening logic here
                    // Example: window.open('your-live-chat-url', '_blank');
                    // Or trigger a function: openLiveChatWidget();
                  }}
                  className="w-full py-4 px-5 rounded-lg bg-casino-light-blue flex items-center gap-4 transition-all hover:bg-opacity-80"
                >
                  <div className="w-10 h-10 rounded-full gold-badge flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-casino-deep-blue" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-white font-medium truncate">
                      {t("live_chat", "Live Chat")}
                    </h3>
                    <p className="text-casino-silver text-sm truncate">
                      {t("available247", "Available 24/7")}
                    </p>
                  </div>
                </a> */}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-casino-deep-blue">
                <h3 className="text-casino-gold font-medium mb-2">
                  {t("office_hours", "Office Hours")}
                </h3>
                <p className="text-white text-sm">
                  {t("office_hours_value", "Mon - Fri, 9 AM - 6 PM")}
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
