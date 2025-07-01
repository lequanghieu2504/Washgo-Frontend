import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import FilterBox from "./FilterBox";

export default function SearchBar({ className = "" }) {
  const [searchParam, setSearchParam] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedParam = searchParam.trim();
    if (trimmedParam) {
      navigate(`/search?q=${encodeURIComponent(trimmedParam)}`);
      setIsExpanded(false); // Close when searching
      setShowFilter(false); // Close filter when searching
    }
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      const currentQuery = new URLSearchParams(location.search).get("q");
      if (searchParam === currentQuery || !currentQuery) {
        setSearchParam("");
      }
    } else {
      const currentQuery = new URLSearchParams(location.search).get("q");
      if (currentQuery && currentQuery !== searchParam) {
        setSearchParam(currentQuery);
      }
    }
  }, [location.pathname, location.search]);

  const handleClearSearch = () => {
    setSearchParam("");
  };

  const handleBack = () => {
    setSearchParam("");
    setIsExpanded(false);
    setShowFilter(false); // Close filter when going back
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterResults = (results) => {
    setShowFilter(false);
    setIsExpanded(false);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
    setIsExpanded(false);
  };

  const handleOverlayClick = () => {
    setIsExpanded(false);
    setShowFilter(false);
  };

  return (
    <>
      {/* Dim background when expanded */}
      {(isExpanded || showFilter) && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ease-out animate-in fade-in"
          onClick={handleOverlayClick}
        />
      )}

      {/* Search Bar Container */}
      <div
        className={`
          transition-all duration-300 ease-out
          ${
            isExpanded || showFilter
              ? "fixed top-0 left-0 w-full z-[9999] bg-white shadow-lg"
              : "relative flex items-center"
          }
          ${className}
        `}
      >
        {/* Search Form */}
        <div
          className={`
            ${
              isExpanded || showFilter
                ? "flex items-center justify-center px-4"
                : ""
            }
          `}
          style={{ height: isExpanded || showFilter ? "56px" : "auto" }}
        >
          <form
            onSubmit={handleSubmit}
            className={`
              flex items-center bg-gray-100 rounded-full 
              border border-transparent px-4 py-2 h-10
              focus-within:bg-white focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-[#cc0000]
              transition-all duration-300 ease-out
              ${isExpanded || showFilter ? "w-full max-w-2xl" : "w-full"}
            `}
            onFocus={handleInputFocus}
          >
            {/* Back Button - only render when expanded or filter shown */}
            {(isExpanded || showFilter) && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center w-6 h-6 mr-3 text-gray-600 hover:text-[#cc0000] focus:outline-none rounded-full hover:bg-gray-50 transition-all duration-300 animate-in fade-in slide-in-from-left-2"
                aria-label="Back"
              >
                <i className="fas fa-arrow-left text-sm"></i>
              </button>
            )}

            {/* Search Icon Button */}
            <button
              type="submit"
              className="text-gray-500 hover:text-[#cc0000] focus:outline-none pr-2 transition-colors duration-200"
              aria-label="Submit search"
            >
              <i className="fas fa-search"></i>
            </button>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Search car wash services..."
              className={`
                bg-transparent outline-none text-gray-800 w-full placeholder-gray-500 ml-3
                transition-all duration-200
                ${isExpanded || showFilter ? "text-base" : "text-sm"}
              `}
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            />

            {/* Clear Button */}
            {searchParam && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 focus:outline-none pl-2 transition-all duration-200 animate-in fade-in zoom-in-95"
                aria-label="Clear search"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            )}

            {/* Filter Button - only render when expanded or filter shown */}
            {(isExpanded || showFilter) && (
              <button
                type="button"
                onClick={handleFilterClick}
                className={`
                  flex items-center justify-center w-6 h-6 ml-3 focus:outline-none rounded-full hover:bg-gray-50 transition-all duration-300 animate-in fade-in slide-in-from-right-2
                  ${
                    showFilter
                      ? "text-[#cc0000] bg-red-50"
                      : "text-gray-600 hover:text-[#cc0000]"
                  }
                `}
                aria-label="Filter"
              >
                <i className="fas fa-sliders-h text-sm"></i>
              </button>
            )}
          </form>
        </div>

        {/* Filter Box Section */}
        {showFilter && (
          <div className="w-full border-t border-gray-200 bg-white animate-in slide-in-from-top-2 fade-in duration-300">
            <FilterBox
              onResults={handleFilterResults}
              onClose={handleFilterClose}
              className="mx-4 my-6 shadow-none border border-gray-200 max-w-4xl"
            />
          </div>
        )}
      </div>
    </>
  );
}

SearchBar.propTypes = {
  onFilterResults: PropTypes.func,
  className: PropTypes.string,
};
