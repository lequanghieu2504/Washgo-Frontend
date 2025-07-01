import React, { useEffect, useState } from "react";

export const FeedbackTemplate = {
  imageUrls: {
    type: "images",
    label: "Images",
  },
  clientUsername: {
    type: "text",
    label: "Client Username",
  },
  rating: {
    type: "rating",
    label: "Rating",
  },
  comment: {
    type: "textarea",
    label: "Comment",
  },
  createdAt: {
    type: "date",
    label: "Created At",
  },
  carwashName: {
    type: "text",
    label: "Carwash Name",
  },
};

export const ViewSchemaRender = ({ config, value }) => {
  switch (config.type) {
    case "text":
      return <div className="text-gray-700">{value}</div>;
    case "textarea":
      return <div className="text-gray-700 whitespace-pre-wrap">{value}</div>;
    case "date":
      return (
        <div className="text-gray-700">{new Date(value).toLocaleString()}</div>
      );
    case "rating":
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fas fa-star ${
                i < value ? "text-yellow-500" : "text-gray-300"
              }`}
            ></i>
          ))}
        </div>
      );
    case "images":
      return (
        <div className="flex space-x-2">
          {value && value.length > 0 ? (
            value.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Feedback ${i + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
            ))
          ) : (
            <span className="text-gray-400">No images</span>
          )}
        </div>
      );
    default:
      return null;
  }
};

export function FeedbackDisplay({ carwashId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!carwashId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/feedbacks/carwash/${carwashId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        if (res.status === 204) return []; // No Content
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || res.status);
        }
        const text = await res.text();
        if (!text) return [];
        return JSON.parse(text);
      })
      .then((data) => {
        setFeedbacks(Array.isArray(data) ? data : []);
        setLoading(false);
        setPage(1); // Reset to first page on reload
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [carwashId, accessToken]);

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p>Error loading feedbacks: {error.message}</p>;

  // Paging logic
  const totalPages = Math.ceil(feedbacks.length / pageSize);
  const pagedFeedbacks = feedbacks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Feedbacks</h1>
      {feedbacks.length === 0 ? (
        <div className="text-gray-500">No feedbacks yet.</div>
      ) : (
        <>
          {pagedFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white space-y-4"
            >
              {Object.entries(feedback).map(([key, value]) => {
                if (FeedbackTemplate[key]) {
                  return (
                    <div key={key}>
                      <div className="font-medium text-sm text-gray-500 mb-1">
                        {FeedbackTemplate[key].label}
                      </div>
                      <ViewSchemaRender
                        value={value}
                        config={FeedbackTemplate[key]}
                      />
                    </div>
                  );
                } else return null;
              })}
            </div>
          ))}
          {/* Paging controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
