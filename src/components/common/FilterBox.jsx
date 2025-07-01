import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "@/hooks/useLocation";
import { useFilterCarwash } from "@/hooks/useFilterCarwash";

const FilterBox = ({ onResults, onClose, className = "" }) => {
  const {
    latitude,
    longitude,
    error: locationError,
    isLoading: isLocationLoading,
    getCurrentLocation,
  } = useLocation();

  const [filters, setFilters] = useState({
    category: "",
    requestedTime: "",
  });
  const [error, setError] = useState(null);

  const filterMutation = useFilterCarwash();

  const categories = [
    "Standard Wash category",
    "Premium Wash",
    "Deluxe Wash",
    "Express Wash",
    "Full Service",
  ];

  // Set default time
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const defaultTime = now.toISOString().slice(0, 16);
    setFilters((prev) => ({
      ...prev,
      requestedTime: defaultTime,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!latitude || !longitude) {
      setError("Location is required. Please enable location access.");
      return false;
    }
    if (!filters.category) {
      setError("Category is required");
      return false;
    }
    if (!filters.requestedTime) {
      setError("Requested time is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError(null);

    // Prepare request with location from hook
    const requestData = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      category: filters.category,
      requestedTime: filters.requestedTime,
    };

    try {
      const results = await filterMutation.mutateAsync(requestData);

      if (onResults) {
        onResults(results);
      }

      // Close the filter after successful search
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Filter error:", error);
      setError("Search failed. Please try again.");
    }
  };

  return (
    <div className={`bg-white rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-800">
          Find Car Wash Services
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Compact Single Row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Location Status */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Location
            </label>
            <div className="flex items-center gap-1">
              <div className="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                {isLocationLoading ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-1"></i>
                    Getting...
                  </span>
                ) : latitude && longitude ? (
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-1 text-green-500"></i>
                    Located
                  </span>
                ) : (
                  <span className="flex items-center">
                    <i className="fas fa-exclamation-triangle mr-1 text-red-500"></i>
                    No location
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLocationLoading}
                className="px-2 py-1.5 bg-gray-100 text-gray-600 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none transition-colors text-xs disabled:opacity-50"
                title="Refresh location"
              >
                <i
                  className={`fas ${
                    isLocationLoading ? "fa-spinner fa-spin" : "fa-sync-alt"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="sm:col-span-1">
            <label
              htmlFor="category"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Service Type
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#cc0000] focus:border-transparent"
              required
            >
              <option value="">Select service</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Time */}
          <div className="sm:col-span-1">
            <label
              htmlFor="requestedTime"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              When
            </label>
            <input
              type="datetime-local"
              id="requestedTime"
              name="requestedTime"
              value={filters.requestedTime}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#cc0000] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {(error || locationError || filterMutation.error) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs text-red-600 flex items-center">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              {error || locationError || filterMutation.error?.message}
            </p>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          disabled={
            filterMutation.isLoading ||
            isLocationLoading ||
            !latitude ||
            !longitude
          }
          className="w-full bg-[#cc0000] text-white px-4 py-2 rounded hover:bg-[#aa0000] focus:outline-none focus:ring-1 focus:ring-[#cc0000] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {filterMutation.isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-1"></i>
              Searching...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <i className="fas fa-search mr-1"></i>
              Search Nearby Car Washes
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

FilterBox.propTypes = {
  onResults: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default FilterBox;
