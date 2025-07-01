import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/hooks/useUserStore";

function Home() {
  const { t } = useTranslation();
  const [carwashes, setCarwashes] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const { user, loading: authLoading } = useUserStore();
  const username = user?.username || "Guest";

  const navigate = useNavigate();

  // Cute quotes that change every 2 minutes
  const cuteQuotes = [
    "✨ Your car deserves to shine as bright as you do!",
    "🚗 A clean car is a happy car!",
    "💎 Sparkle and shine, it's car wash time!",
    "🌟 Life's too short for a dirty car!",
    "🎉 Ready to make your ride pristine?",
    "🌈 Every wash brings back that new car feeling!",
    "☀️ Let your car glow like the sunshine!",
  ];

  // Change quote every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % cuteQuotes.length);
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  // Add dummy coordinates to dummy data for map functionality
  const generateDummyData = () => {
    const dummyData = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      carwash_name: `Shiny Wash ${index + 1}`,
      location: `Location ${index + 1}`,
      description: `Description for Carwash ${index + 1}`,
      average_rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
      rating_count: Math.floor(Math.random() * 100) + 10,
      user_id: `User${index + 1}`,
      image_url: `https://via.placeholder.com/200x150/cccccc/808080?text=Wash+${
        index + 1
      }`,
      latitude: `${10.76 + (Math.random() - 0.5) * 0.1}`,
      longitude: `${106.66 + (Math.random() - 0.5) * 0.1}`,
    }));
    setCarwashes(dummyData);
  };

  useEffect(() => {
    generateDummyData();
  }, []);

  const navigateToSearch = (param) => {
    navigate(`/search?q=${param}`);
  };

  const quickActions = [
    {
      icon: "🔍",
      label: "Find Nearby",
      action: () => navigate("/map"),
    },
    {
      icon: "📅",
      label: "Book Now",
      action: () => navigate("/booking"),
    },
    {
      icon: "⭐",
      label: "Best Rated",
      action: () => navigateToSearch("best rated"),
    },
    {
      icon: "💰",
      label: "Offers",
      action: () => navigate("/offers"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Greeting */}
      <section className="bg-white px-4 pt-6 pb-8">
        {/* Content */}
        <div>
          {/* Greeting */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Hi {username}! 👋
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              {cuteQuotes[currentQuoteIndex]}
            </p>
          </div>

          {/* Quick Actions Section */}
          <div className="flex justify-between space-x-4 max-w-sm mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center justify-ceWnter w-16 h-20 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-red-100 hover:border-red-200"
              >
                <span className="text-2xl mb-1">{action.icon}</span>
                <span className="text-xs text-gray-700 font-medium text-center leading-tight px-1">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="px-4">
        {/* Banner Section */}
        <section className="mb-8">
          <div className="relative h-32 w-full rounded-xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80"
              alt="Car Wash Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-transparent flex items-center">
              <div className="text-white px-6">
                <h3 className="text-xl font-bold mb-1">Special Offer</h3>
                <p className="text-lg font-semibold">20% OFF</p>
                <p className="text-sm opacity-90">First service booking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Nearby Stations Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Nearby Stations
            </h3>
            <button
              onClick={() => navigateToSearch("nearby")}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition duration-150"
            >
              See All
            </button>
          </div>
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {carwashes.slice(0, 8).map((carwash) => (
                <div
                  key={carwash.id}
                  className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 w-60 flex-shrink-0 snap-start hover:shadow-md transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/carwash/${carwash.id}`)}
                >
                  <img
                    src={carwash.image_url || "https://via.placeholder.com/100"}
                    alt={carwash.carwash_name}
                    className="w-full h-32 rounded-lg object-cover mb-3 bg-gray-200"
                  />
                  <h4 className="text-md font-semibold text-gray-900 truncate">
                    {carwash.carwash_name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {carwash.location}
                  </p>
                  <div className="flex items-center mt-1">
                    <i className="fas fa-star text-yellow-400 mr-1 text-xs"></i>
                    <span className="text-sm font-medium text-gray-700">
                      {carwash.average_rating}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({carwash.rating_count} reviews)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Rated Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Best Rated</h3>
            <button
              onClick={() => navigateToSearch("best rated")}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition duration-150"
            >
              See All
            </button>
          </div>
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {[...carwashes]
                .sort((a, b) => b.average_rating - a.average_rating)
                .slice(0, 8)
                .map((carwash) => (
                  <div
                    key={carwash.id}
                    className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 w-60 flex-shrink-0 snap-start hover:shadow-md transition duration-200 cursor-pointer"
                    onClick={() => navigate(`/carwash/${carwash.id}`)}
                  >
                    <img
                      src={
                        carwash.image_url || "https://via.placeholder.com/100"
                      }
                      alt={carwash.carwash_name}
                      className="w-full h-32 rounded-lg object-cover mb-3 bg-gray-200"
                    />
                    <h4 className="text-md font-semibold text-gray-900 truncate">
                      {carwash.carwash_name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      {carwash.location}
                    </p>
                    <div className="flex items-center mt-1">
                      <i className="fas fa-star text-yellow-400 mr-1 text-xs"></i>
                      <span className="text-sm font-medium text-gray-700">
                        {carwash.average_rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({carwash.rating_count} reviews)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Chat Head/Button */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end">
        <button
          className="mb-2 shadow-lg rounded-full w-16 h-16 flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition focus:outline-none"
          onClick={() => setShowChat((prev) => !prev)}
          aria-label={showChat ? "Close Chat" : "Open Chat"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L3 21l1.07-3.21A7.963 7.963 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
            />
          </svg>
        </button>
        {showChat && (
          <div className="mt-2">
            <Chat currentUser={user?.sub} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
