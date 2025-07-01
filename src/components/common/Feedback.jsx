import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Feedback() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Destructure state safely
  const {
    bookingId,
    carwashId,
    clientId,
    product,
    carWashName,
    carwashImage = "",
    slot,
    price,
  } = state || {};

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Simulate image upload and return URLs (replace with real upload if needed)
  const uploadImages = async (files) => {
    // In production, upload to your server or cloud and return the URLs
    // Here, just return the preview URLs for demonstration
    return files.map((file) => URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let imageUrls = [];
    if (imageFiles.length > 0) {
      imageUrls = await uploadImages(imageFiles);
    }

    const feedbackDTO = {
      clientID: clientId,
      carwashID: carwashId,
      bookingId,
      rating,
      comment,
      imageUrls,
    };

    console.log("Feedback DTO:", feedbackDTO);

    try {
      const res = await fetch("http://localhost:8080/api/feedbacks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(feedbackDTO),
      });

      if (res.status === 201) {
        const created = await res.json();
        const feedbackId = created.id;
        alert(`Feedback submitted! Feedback ID: ${feedbackId}`);
        navigate(`/carwash/${carwashId}`);
      } else {
        const errText = await res.text();
        throw new Error(errText || res.status);
      }
    } catch (err) {
      alert("Error submitting feedback: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Leave Feedback</h2>

        {/* Booking/Carwash Details */}
        <div className="flex items-center mb-4">
          {carwashImage && (
            <img
              src={carwashImage}
              alt="Carwash Avatar"
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
          )}
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {carWashName}
            </div>
            <div className="text-sm text-gray-600">{product}</div>
            <div className="text-xs text-gray-500 mt-1">
              {slot} {price && <>• {price}</>}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star rating */}
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`text-2xl focus:outline-none transition-colors mr-2 ${
                  num <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHover(num)}
                onMouseLeave={() => setHover(rating)}
                aria-label={`Rate ${num}`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-vertical mb-4"
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          {/* Image upload */}
          <div className="text-center mb-6">
            <label
              htmlFor="fileUpload"
              className="inline-block px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              Upload Images
            </label>
            <input
              id="fileUpload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previews.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preview ${idx}`}
                    className="w-full h-24 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
