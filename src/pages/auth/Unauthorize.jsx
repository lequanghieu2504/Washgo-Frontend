import { useTranslation } from "react-i18next"; // Import translation hook

export default function Unauthorized() {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 sm:p-10 max-w-md w-full border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {t("unauthorized.title")}
        </h1>
        <p className="text-gray-600 mb-6">{t("unauthorized.message")}</p>
        <a
          href="/"
          className="inline-block bg-[#cc0000] text-white font-medium py-2.5 px-6 rounded-lg shadow hover:bg-[#a30000] focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          {t("unauthorized.go_home")}
        </a>
      </div>
    </div>
  );
}
