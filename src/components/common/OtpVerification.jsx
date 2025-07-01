import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function OtpVerification({ email, onVerified, onResend }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const API = "http://localhost:8080";

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API}/mail/verify-email?otp=${encodeURIComponent(otp)}`
      );
      const text = await response.text();

      if (!response.ok || text.trim() !== "Email verified successfully") {
        alert("Invalid OTP code.");
        return;
      }

      alert("Email verification successful!");
      onVerified(otp);
    } catch (error) {
      alert("Invalid OTP code.");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setTimeLeft(60);
    } catch (error) {
      alert("Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white rounded-2xl border-gray-100 p-6 sm:p-8 mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Verify OTP
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the OTP code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter OTP code"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#cc0000] hover:bg-[#a30000] text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Verify
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {timeLeft > 0 ? (
            <span>Resend OTP in {timeLeft}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-[#cc0000] font-semibold hover:underline"
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

OtpVerification.propTypes = {
  email: PropTypes.string.isRequired,
  onVerified: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
};

export default OtpVerification;
