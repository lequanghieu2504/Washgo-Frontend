import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const API = "http://localhost:8080";

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    try {
      const res = await fetch(`${API}/mail/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to send OTP: " + text);
        return;
      }

      alert("OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("An error occurred while sending OTP: " + err.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(
        `${API}/mail/verify-forgot-password?OTP=${encodeURIComponent(otp)}`,
        { method: "GET" }
      );

      if (!res.ok) {
        const text = await res.text();
        alert("Invalid OTP: " + text);
        return;
      }

      alert("OTP is valid. Please set a new password.");
      setStep(3);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert("An error occurred while verifying OTP: " + err.message);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      const res = await fetch(`${API}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const text = await res.text();

      if (!res.ok) {
        alert(`Error: ${text}`);
        return;
      }

      alert("Password has been reset successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("An error occurred while resetting password: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white rounded-2xl border-gray-100 p-6 sm:p-8 mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        {step === 1 && (
          <>
            <div className="relative mb-5">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <button
              onClick={handleRequestOtp}
              className="w-full bg-[#cc0000] hover:bg-[#a30000] text-white py-3 rounded-xl font-semibold transition duration-300"
              
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative mb-5">
              <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="relative mb-5">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-300"
            >
              Reset Password
            </button>
          </>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/userProfile")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
