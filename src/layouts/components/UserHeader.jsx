import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import WashGoLoGo from "@/layouts/components/WashGoLoGo";
import SearchBar from "@/components/common/SearchBar";
import { Link } from "react-router-dom";

const UserHeader = ({ isDesktop = true }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Check login state (accessToken)
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  return (
    <>
      {/* Header container: No fixed or sticky positioning */}
      <header className="bg-white shadow-sm px-4 h-full flex items-center justify-between border-b border-gray-200">
        {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <WashGoLoGo />
        </div>

        {/* Mid Section: Search Bar (conditionally rendered) */}
        {isDesktop && (
          <div className="flex-grow flex justify-center px-4">
            <SearchBar className="w-full max-w-lg" />
          </div>
        )}

        {/* Right Section: If logged in → show notification; otherwise → show login icon */}
        <div className="relative flex items-center space-x-4 flex-shrink-0">
          {isLoggedIn ? (
            // Logged in: Show notification button
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#cc0000] transition duration-150 ease-in-out"
              aria-label="View notifications"
            >
              <i className="fas fa-bell"></i>
            </button>
          ) : (
            // Not logged in: Show login icon
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#cc0000] transition duration-150 ease-in-out"
              aria-label="Login"
            >
              <Link to="/login" className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-sign-in-alt"></i>
              </Link>
            </button>
          )}
        </div>
      </header>
    </>
  );
};

UserHeader.propTypes = {
  isDesktop: PropTypes.bool,
};

export default UserHeader;
