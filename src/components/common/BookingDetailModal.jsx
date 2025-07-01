import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingDetailModal({
  carwashProfile,
  product,
  slot,
  pricing,
  clientId,
  onConfirm,
  onClose,
}) {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Login/OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Format slot for display
  const slotDate = new Date(slot.availableFrom);
  const formattedSlot =
    slotDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " – " +
    slotDate.toLocaleDateString("vi-VN");

  // Display price from pricing prop
  const displayPrice = pricing ? `${pricing.price} ${pricing.currency}` : "N/A";

  const accessToken = localStorage.getItem("accessToken");

  // Fetch coupons for client
  useEffect(() => {
    if (!clientId || !accessToken) return;
    setLoadingCoupons(true);
    setCouponError(null);
    fetch(
      `http://localhost:8080/api/coupon/getAllCouponByClientId/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch coupons");
        return res.json();
      })
      .then((data) => {
        setCoupons(Array.isArray(data) ? data : []);
        setLoadingCoupons(false);
      })
      .catch((err) => {
        setCouponError(err.message || "Could not load coupons.");
        setCoupons([]);
        setLoadingCoupons(false);
      });
  }, [clientId, accessToken]);

  // OTP handlers
  const handleSendOtp = async () => {
    setOtpError("");
    setOtpLoading(true);
    try {
      // Replace with your backend OTP send endpoint
      const res = await fetch("http://localhost:8080/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setOtpSent(true);
    } catch (err) {
      setOtpError("Could not send OTP. Please try again.");
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setOtpLoading(true);
    try {
      // Replace with your backend OTP verify endpoint
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      if (!res.ok) throw new Error("OTP incorrect or expired");
      // Simulate login: you should get and store accessToken here
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setOtpVerified(true);
        setOtpError("");
        window.location.reload(); // reload to re-trigger parent logic
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (err) {
      setOtpError("OTP incorrect or expired.");
    }
    setOtpLoading(false);
  };

  // Send booking to backend
  const handleConfirm = async () => {
    const bookingPayload = {
      productId: product.id,
      carwashId: carwashProfile.id,
      scheduleId: slot.id,
      clientId: clientId,
      notes: "My first booking!",
      couponId: selectedCouponId || null,
    };

    try {
      const res = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.status);
      }

      const created = await res.json();
      const bookingId = created.bookingId;

      alert("Booking successful! ID: " + bookingId);
      navigate("/payment", {
        state: {
          clientId,
          bookingId,
          carWashName: carwashProfile.carwashName,
          product: product.name,
          price: displayPrice,
          slot: formattedSlot,
          carwashId: carwashProfile.id,
        },
      });

      onConfirm?.(bookingId, clientId);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold">Confirm Your Booking</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <div>
            <strong>Carwash:</strong> {carwashProfile.carwashName}
          </div>
          <div>
            <strong>Location:</strong> {carwashProfile.location}
          </div>
          <div>
            <strong>Description:</strong> {carwashProfile.description}
          </div>
          <div className="flex items-center">
            <strong style={{ marginRight: 8 }}>Rating: </strong>
            <span className="flex items-center">
              {Number(carwashProfile.averageRating).toFixed(1)}
              <i className="fas fa-star text-yellow-500 ml-1"></i>
            </span>
            <span className="text-gray-500 ml-2">
              ({carwashProfile.rating_count}
              {carwashProfile.rating_count === 1 ? " review" : " reviews"})
            </span>
          </div>
          <hr className="my-2 border-gray-200" />

          <div>
            <strong>Service:</strong> {product.name}
          </div>
          <div>
            <strong>Price:</strong> {displayPrice}
          </div>
          <div>
            <strong>Time Slot:</strong> {formattedSlot}
          </div>

          {/* Coupon selection */}
          {accessToken && (
            <div>
              <strong>Coupon:</strong>
              {loadingCoupons ? (
                <span className="ml-2 text-gray-500">Loading coupons...</span>
              ) : couponError ? (
                <span className="ml-2 text-red-500">{couponError}</span>
              ) : coupons.length === 0 ? (
                <span className="ml-2 text-gray-400">No available coupons</span>
              ) : (
                <select
                  className="ml-2 border rounded px-2 py-1"
                  value={selectedCouponId || ""}
                  onChange={(e) =>
                    setSelectedCouponId(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">-- No Coupon --</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.name}
                      {coupon.discountType === "PERCENT"
                        ? ` - ${coupon.discount_value}%`
                        : coupon.discountType === "FREE_SERVICE"
                        ? " - Free Service"
                        : coupon.discountType === "AMOUNT"
                        ? ` - ${coupon.discount_value} ${coupon.currency || ""}`
                        : ""}
                      {coupon.carwas?.carwashName
                        ? ` (for ${coupon.carwas.carwashName})`
                        : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Phone/OTP fields if not logged in */}
          {!accessToken && (
            <div className="space-y-2">
              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="border rounded px-3 py-2 w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  disabled={otpSent}
                />
              </div>
              <div>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleSendOtp}
                  disabled={otpSent || otpLoading || !phone}
                >
                  {otpLoading
                    ? "Sending OTP..."
                    : otpSent
                    ? "OTP Sent"
                    : "Send OTP"}
                </button>
              </div>
              {otpSent && (
                <>
                  <div>
                    <label className="block font-medium mb-1">OTP</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                      onClick={handleVerifyOtp}
                      disabled={otpVerified || otpLoading || otp.length !== 6}
                    >
                      {otpLoading
                        ? "Verifying..."
                        : otpVerified
                        ? "Verified"
                        : "Verify OTP"}
                    </button>
                  </div>
                  {otpError && (
                    <div className="text-red-500 text-sm">{otpError}</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            disabled={
              !accessToken && !otpVerified // Only enable if logged in or OTP verified
            }
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
