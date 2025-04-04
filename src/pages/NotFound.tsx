import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation(); // Get translation function
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="h-screen overflow-y-scroll flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">{t("notFoundOops")}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t("returnToHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
