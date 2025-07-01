import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProductSchedule from "./ProductSchedule";
import BookingDetailModal from "./BookingDetailModal";

const ProductInfo = ({ carwashProfile }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clientID, setClientID] = useState(null);
  const carwashId = carwashProfile?.id || null;

  const accessToken = localStorage.getItem("accessToken");

  // Get client ID from JWT
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setClientID(payload.userId ?? null);
    } catch {
      setClientID(null);
    }
  }, []);

  // Fetch products for carwash
  useEffect(() => {
    if (!carwashId) {
      setError("Carwash ID is missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const fetchProducts = async () => {
      let data = null;
      try {
        const res = await fetch(
          `http://localhost:8080/api/carwashes/${carwashId}/products`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const module = await import("@/data/dummyData.js");
          data = module.productsByCarwash;
        } else {
          data = await res.json();
        }
      } catch (err) {
        const module = await import("@/data/dummyData.js");
        data = module.productsByCarwash;
      } finally {
        setProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [carwashId, accessToken]);

  const selectedProduct = products.find(
    (p) => p.id?.toString() === selectedProductId
  );

  const handleBooking = () => {
    if (!selectedProduct) {
      alert("Please select a service first.");
      return;
    }
    if (!selectedSlot) {
      alert("Please choose a time slot first.");
      return;
    }
    setShowModal(true);
    console.log("Booking details:", {
      product: selectedProduct,
      slot: selectedSlot,
      carwashProfile,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 my-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center border-b pb-3">
        Services Offered
      </h1>

      {isLoading && (
        <div className="text-center py-10 text-gray-500">
          <i className="fas fa-spinner fa-spin text-2xl text-[#cc0000]"></i>
          <p className="mt-2">Loading services...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="my-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Product selector */}
          <div className="mb-8">
            <label
              htmlFor="product-selector"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose a Service:
            </label>
            <select
              id="product-selector"
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#cc0000] transition duration-150 ease-in-out shadow-sm"
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setSelectedSlot(null);
              }}
            >
              <option value="" disabled>
                -- Select a Service --
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product details & schedule */}
          {selectedProduct ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-inner">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  <strong>Price:</strong>{" "}
                  {selectedProduct.pricing
                    ? `${selectedProduct.pricing.price} ${selectedProduct.pricing.currency}`
                    : "N/A"}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
                Availability
              </h3>
              <ProductSchedule
                schedules={selectedProduct.schedules || []}
                onSlotClick={(slotDateTime) => setSelectedSlot(slotDateTime)}
              />

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBooking}
                  className="inline-flex items-center bg-[#cc0000] text-white px-6 py-2.5 rounded-md font-semibold text-sm shadow-md hover:bg-[#a30000] focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                  <i className="fas fa-calendar-check mr-2"></i>
                  Book Now
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10 p-6 bg-gray-50 rounded-lg border-dashed border-gray-300">
              <i className="fas fa-arrow-up mr-2"></i>
              Please select a service above to see details and availability.
            </div>
          )}
        </>
      )}

      {/* Modal Booking Detail */}
      {showModal && selectedProduct && selectedSlot && carwashProfile && (
        <BookingDetailModal
          carwashProfile={carwashProfile}
          product={selectedProduct}
          slot={selectedSlot}
          pricing={selectedProduct.pricing}
          clientId={clientID}
          onConfirm={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

ProductInfo.propTypes = {
  carwashId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default ProductInfo;
