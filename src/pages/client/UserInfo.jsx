import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/hooks/useUserStore";
import Footer from "@/layouts/components/UserFooter";
import {
  FaEdit,
  FaHistory,
  FaTicketAlt,
  FaStar,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaHeadset,
} from "react-icons/fa";

// Hàm giải mã userId từ accessToken (JWT, base64url)
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload.userId || payload.sub || null;
  } catch {
    return null;
  }
}

export default function UserInfo() {
  const navigate = useNavigate();
  const { user, loading } = useUserStore();
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  const userId = getUserIdFromToken(accessToken);

  useEffect(() => {
    if (loading || !userId) return;
    fetch(`http://localhost:8080/api/user/ClientInformation?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        console.log("id:", data.id);
        console.log("userName:", data.userName);
        console.log("gmail:", data.gmail);
        console.log("phonenumber:", data.phonenumber);
        console.log("gender:", data.gender);
        console.log("birthDay:", data.birthDay);
        setFormData(data);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [loading, userId, accessToken]);

  const onLogoutClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setFormData({});
    navigate("/logout");
  };

  const handleToggleEdit = (e) => {
    e.preventDefault();
    setIsEditMode(!isEditMode);
  };

  const bookingDetails = [
    { label: "Booked", icon: <FaClipboardList size={25} /> },
    { label: "History", icon: <FaHistory size={25} /> },
    { label: "Voucher", icon: <FaTicketAlt size={25} /> },
    { label: "Rating", icon: <FaStar size={25} /> },
  ];

  return (
    <div className="fixed inset-0 pb-16 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#cc0000] text-white py-3 flex items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 flex-1 space-y-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full bg-gray-300 shadow-md cursor-pointer hover:ring-2 hover:ring-[#cc0000] transition"
            onClick={() => navigate("/userProfile")}
            title="View & Edit Profile"
          ></div>
          <div className="flex flex-col">
            <p className="font-medium text-gray-900 flex items-center gap-2">
              {formData.userName || "[Username]"}
              <button
                onClick={() => navigate("/userProfile")}
                className="text-gray-500 hover:text-[#cc0000]"
                title="Edit username"
              >
                <FaEdit size={18} />
              </button>
            </p>
            <p className="text-sm text-gray-500">{formData.gmail || "Gmail"}</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Your Current Area</p>
          <p className="text-base font-medium text-gray-800">
            {formData.location || "Location"}
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">Booking Details</p>
            <a href="#" className="text-red-600 text-sm font-medium">
              See All
            </a>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {bookingDetails.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full">
                  {item.icon}
                </div>
                <p
                  className="mt-2 font-semibold text-black text-[12px] uppercase tracking-wide"
                  style={{ minHeight: 18, lineHeight: "18px" }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10" />
        {/* Contact Support */}
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-800 flex items-center gap-2">
            <FaHeadset className="text-gray-400" size={18} />
            Contact Support
          </label>
        </div>

        {/* Notification toggle */}
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-800 flex items-center gap-2">
            <FaBell className="text-gray-400" size={18} />
            Allow Notifications
          </label>
          <button
            type="button"
            aria-pressed={formData.allowNotification}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                allowNotification: !prev.allowNotification,
              }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              formData.allowNotification ? "bg-[#cc0000]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                formData.allowNotification ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Sign out */}
        <div className="mt-15" />
        <button
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#cc0000] hover:bg-red-700 text-white font-semibold text-base shadow-sm transition cursor-pointer"
          onClick={onLogoutClick}
        >
          <FaSignOutAlt className="text-lg" />
          Sign Out
        </button>

        {/* Success message */}
        {successMessage && (
          <div className="text-sm text-center text-green-600">
            {successMessage}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-inner">
        <Footer />
      </div>  
    </div>
  );
}   