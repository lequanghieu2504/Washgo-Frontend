import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "@/components/common/ProductInfo";
import { FeedbackDisplay } from "@/components/common/FeebackDisplay";
import Stamp from "@/components/common/Stamp";

import { useTranslation } from "react-i18next";
import ErrorBox from "@/components/ui/ErrorBox";
import { useUserStore } from "@/hooks/useUserStore";

function CarwashProfile() {
  const { t } = useTranslation();
  const { id: carwashId } = useParams();
  const { user, loading: authLoading } = useUserStore();
  const [carwashDetails, setCarwashDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // For Stamp dropdown
  const [showStamps, setShowStamps] = useState(false);
  const stampAnchorRef = useRef();

  // Fetch Carwash Details based on ID
  useEffect(() => {
    if (!carwashId) {
      setError(t("carwash_profile.no_carwash_id"));
      setIsLoading(false);
      return;
    }

    const fetchCarwashDetails = async () => {
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");

      let data = null;
      try {
        const res = await fetch(
          `http://localhost:8080/api/carwashes/${carwashId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const module = await import("@/data/dummyData.js");
          data = module.carwashes.find((obj) => obj.id === parseInt(carwashId));
        } else {
          data = await res.json();
        }
      } catch (err) {
        const module = await import("@/data/dummyData.js");
        data = module.carwashes.find((obj) => obj.id === parseInt(carwashId));
      } finally {
        setCarwashDetails(data);
        setIsLoading(false);
      }
    };

    fetchCarwashDetails();
  }, [carwashId, t]);

  const clientId = user?.userId;

  // --- Render Logic ---
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <i className="fas fa-spinner fa-spin mr-3 text-2xl text-[#cc0000]"></i>
        {t("carwash_profile.loading")}
      </div>
    );
  }

  if (error) {
    return <ErrorBox message={t("carwash_profile.error")} detail={error} />;
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {carwashDetails ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center border-b pb-3">
            {carwashDetails.carwashName || t("carwash_profile.default_name")}
          </h1>

          <div className="space-y-3 text-gray-700 text-sm sm:text-base">
            <div className="flex items-start">
              <i className="fas fa-map-marker-alt w-5 text-center text-gray-400 mr-3 pt-1"></i>
              <span>
                {carwashDetails.location || t("carwash_profile.no_location")}
              </span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-info-circle w-5 text-center text-gray-400 mr-3 pt-1"></i>
              <span>
                {carwashDetails.description ||
                  t("carwash_profile.no_description")}
              </span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-star w-5 text-center text-yellow-400 mr-3 pt-1"></i>
              <span>
                {carwashDetails.averageRating
                  ? `${parseFloat(carwashDetails.averageRating).toFixed(
                      1
                    )} / 5.0`
                  : t("carwash_profile.not_rated")}
                {carwashDetails.ratingCount > 0 &&
                  ` (${carwashDetails.ratingCount} ${t(
                    "carwash_profile.reviews"
                  )})`}
              </span>
            </div>

            {/* FeedbackDisplay always visible */}
            <FeedbackDisplay carwashId={carwashId} />

            {clientId && carwashId ? (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  {t("carwash_profile.loyalty_stamps")}
                </h2>
                <button
                  ref={stampAnchorRef}
                  className="mb-2 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => setShowStamps((prev) => !prev)}
                >
                  {t("carwash_profile.loyalty_stamps")}
                </button>
                <Stamp
                  clientId={clientId}
                  carwashId={carwashId}
                  open={showStamps}
                  onClose={() => setShowStamps(false)}
                  anchorRef={stampAnchorRef}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4">
                {t("carwash_profile.login_to_see_stamps")}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          {t("carwash_profile.not_found")}
        </p>
      )}

      {carwashId && (
        <ProductInfo carwashId={carwashId} carwashProfile={carwashDetails} />
      )}
    </div>
  );
}

CarwashProfile.propTypes = {};

export default CarwashProfile;
