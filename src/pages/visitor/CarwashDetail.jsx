import React, { useState, useEffect, useMemo } from "react";
import { useCarwashProducts } from "@/hooks/useCarwashProduct"; // Adjusted import path
import { useNavigate } from "react-router-dom";

const CarwashDetail = ({ carwash }) => {
  const [showMoreOverviewFeedback, setShowMoreOverviewFeedback] =
    useState(false);
  const [selectedServices, setSelectedServices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [expandedService, setExpandedService] = useState(null);
  const navigate = useNavigate();

  const {
    data: apiProducts,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: serviceError,
  } = useCarwashProducts(carwash?.id);

  // Helper function to parse "HH:MM:SS" timing string to hours
  const parseTimingToHours = (timingStr) => {
    if (!timingStr || typeof timingStr !== "string") return 0;
    const parts = timingStr.split(":");
    if (parts.length !== 3) return 0;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return 0;
    return hours + minutes / 60 + seconds / 3600;
  };

  // Helper function to transform API product data to component's expected structure
  const transformApiProduct = (product) => {
    if (!product) return null;
    return {
      productID: product.id,
      productName: product.name,
      productDescription: product.description,
      productPrice: product.pricing.price.toString(),
      productCurrency: product.pricing.currency,
      productExpectTime: parseTimingToHours(product.timing),
    };
  };

  // Transform API products into the nested structure (main services with subProducts)
  const services = useMemo(() => {
    if (!apiProducts || !Array.isArray(apiProducts)) return [];

    const groupedByMasterId = apiProducts.reduce((acc, product) => {
      const masterId = product.productMasterId;
      if (!acc[masterId]) {
        acc[masterId] = [];
      }
      acc[masterId].push(product);
      return acc;
    }, {});

    const transformedServices = [];
    for (const masterId in groupedByMasterId) {
      const group = groupedByMasterId[masterId];
      // Heuristic: main product is one whose name does not contain "-Sub"
      // This assumes a consistent naming convention from your API example.
      let mainProductApi = group.find((p) => !p.name.includes("-Sub"));

      if (!mainProductApi) {
        // Fallback or error handling if no clear main product is found
        // For example, if all products in a group are named like sub-products
        // or if there are multiple products without "-Sub".
        // You might want to log this or pick the first one as a default.
        if (group.length > 0) {
          // As a simple fallback, consider the first product if no "-Sub" distinction is clear
          // mainProductApi = group[0];
          console.warn(
            `No clear main product identified for masterId ${masterId}. Products:`,
            group
          );
          // If you want to strictly enforce the main/sub structure, you might skip this group:
          continue;
        } else {
          continue;
        }
      }

      const mainService = transformApiProduct(mainProductApi);
      if (!mainService) continue;

      mainService.subProducts = group
        .filter((p) => p.id !== mainProductApi.id && p.name.includes("-Sub")) // Filter for actual sub-products
        .map(transformApiProduct)
        .filter((p) => p !== null); // Ensure no nulls if transformApiProduct can return null

      transformedServices.push(mainService);
    }
    return transformedServices;
  }, [apiProducts]);

  if (!carwash) return null;

  // Mock feedback data
  const mockFeedbacks = [
    {
      id: 1,
      customerName: "John Doe",
      rating: 5,
      serviceName: "rua xe",
      quote:
        "Excellent service! My car looks brand new. Very professional staff and reasonable pricing.",
      images: [
        "https://tearu.vn/wp-content/uploads/2021/10/dung-dich-rua-xe-bot-tuyet-cao-cap-carwash-foam-1-lit-2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/2015_K%C5%82odzko%2C_ul._Dusznicka%2C_myjnia_samochodowa_02.jpg",
      ],
      videos: [],
      date: "2024-01-15",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      rating: 4,
      serviceName: "rua xe + rua noi that xe",
      quote:
        "Good quality wash. Interior cleaning was thorough. Will come back again.",
      images: ["https://via.placeholder.com/100x100?text=Interior"],
      videos: ["https://via.placeholder.com/200x150?text=Video+Thumbnail"],
      date: "2024-01-10",
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      rating: 5,
      serviceName: "rua gam xe",
      quote: "Amazing attention to detail. The rim cleaning was perfect!",
      images: [],
      videos: [],
      date: "2024-01-08",
    },
    {
      id: 4,
      customerName: "Sarah Wilson",
      rating: 4,
      serviceName: "rua xe",
      quote: "Professional service and friendly staff. Car looks great!",
      images: ["https://via.placeholder.com/100x100?text=Clean+Car"],
      videos: [],
      date: "2024-01-05",
    },
  ];

  const mockImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Kb5-7omr0RU_15R7lyr-VOripHdt6SY9wQ&s",
    "https://images.squarespace-cdn.com/content/v1/553feac0e4b0de570354a535/1532283312857-35Q7VC63OMPTCXJ358IA/IQ+Carwash+-11.jpg",
    "https://theragcompany.eu/cdn/shop/articles/DSC08500.jpg?v=1715157054",
  ];

  const overviewText =
    carwash?.description ||
    "Professional car wash service with modern equipment and eco-friendly products. We provide comprehensive cleaning services including exterior wash, interior detailing, and waxing services. Our experienced team ensures your vehicle gets the best care possible.";

  const handleServiceToggle = (productID, price) => {
    setSelectedServices((prev) => {
      const newSelectedServices = { ...prev };
      if (newSelectedServices[productID]) {
        delete newSelectedServices[productID];
      } else {
        newSelectedServices[productID] = parseInt(price); // price is string from transformApiProduct
      }
      return newSelectedServices;
    });
  };

  const handleMainServiceClick = (productID) => {
    setExpandedService(expandedService === productID ? null : productID);
  };

  // Calculate total price
  useEffect(() => {
    const total = Object.values(selectedServices).reduce((sum, price) => {
      return sum + (price || 0); // price is number here
    }, 0);
    setTotalPrice(total);
  }, [selectedServices]);

  // Get selected services count
  const selectedCount = Object.values(selectedServices).filter(Boolean).length;

  // Show feedback based on state: initially 1, then all (3 more)
  const displayedFeedbacks = showMoreOverviewFeedback
    ? mockFeedbacks
    : mockFeedbacks.slice(0, 1);

  return (
    <div className="w-full">
      {/* Header with basic info */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {carwash?.carwashName || "Car Wash Name"}
        </h1>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">4.5 (123 reviews)</span>
        </div>

        {/* Contact info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              📍 {carwash?.location || "123 Main St, Ho Chi Minh City"}
            </p>
            <p className="text-blue-600 text-sm">
              📞 {carwash?.phoneNumber || "+84 123 456 789"}
            </p>
          </div>

          {/* Google Maps button */}
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${
                carwash?.latitude || 10.762622
              },${carwash?.longitude || 106.660172}`;
              window.open(url, "_blank");
            }}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Combined Overview & Feedback Section */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold mb-3">Overview & Feedback</h3>

        {/* Overview */}
        <div className="flex space-x-4 mb-10">
          {/* Image Gallery */}
          <div className="w-32 h-32 flex-shrink-0">
            <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
              {mockImages.length > 0 ? (
                <img
                  src={mockImages[0]}
                  alt="Carwash"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xs">No images</span>
                </div>
              )}
            </div>
            {mockImages.length > 1 && (
              <p className="text-xs text-gray-500 mt-1 text-center leading-tight">
                +{mockImages.length - 1} more photos
              </p>
            )}
          </div>

          {/* Overview Text */}
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              {overviewText}
            </p>
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Customer Feedback</h4>

          {displayedFeedbacks.map((feedback, index) => (
            <div key={feedback.id}>
              {/* Feedback Content */}
              <div className="py-3">
                {/* Feedback Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {feedback.customerName}
                    </p>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3 h-3 fill-current ${
                            star <= feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {feedback.rating}/5
                    </span>
                  </div>
                </div>

                {/* Service Name */}
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Service: {feedback.serviceName}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-700 mb-3 italic">
                  "{feedback.quote}"
                </p>

                {/* Media (Images and Videos) */}
                {(feedback.images.length > 0 || feedback.videos.length > 0) && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {/* Images */}
                    {feedback.images.map((image, index) => (
                      <div key={`img-${index}`} className="flex-shrink-0">
                        <img
                          src={image}
                          alt={`Feedback ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      </div>
                    ))}

                    {/* Videos */}
                    {feedback.videos.map((video, index) => (
                      <div
                        key={`vid-${index}`}
                        className="flex-shrink-0 relative"
                      >
                        <img
                          src={video}
                          alt={`Video ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Separator line (except for last item) */}
              {index < displayedFeedbacks.length - 1 && (
                <div className="border-b border-gray-200"></div>
              )}
            </div>
          ))}

          {/* See More Button */}
          {mockFeedbacks.length > 1 && (
            <button
              onClick={() =>
                setShowMoreOverviewFeedback(!showMoreOverviewFeedback)
              }
              className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
            >
              {showMoreOverviewFeedback
                ? "Show Less"
                : `See More (${mockFeedbacks.length - 1} more feedbacks)`}
            </button>
          )}
        </div>
      </div>

      {/* Services Selection Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-semibold mb-3">Select Services</h3>
        {isLoadingServices && <p>Loading services...</p>}
        {isErrorServices && (
          <p>
            Error loading services: {serviceError?.message || "Unknown error"}
          </p>
        )}
        {!isLoadingServices && !isErrorServices && services.length === 0 && (
          <p>No services available for this carwash.</p>
        )}

        {!isLoadingServices && !isErrorServices && services.length > 0 && (
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.productID}
                className="border border-gray-200 rounded-lg"
              >
                {/* Main Service - Clickable area */}
                <div
                  className="p-3 flex items-start cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleMainServiceClick(service.productID)}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedServices[service.productID]}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent click from bubbling to the div
                      handleServiceToggle(
                        service.productID,
                        service.productPrice
                      );
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {service.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {service.productDescription}
                        </p>
                        <p className="text-xs text-gray-500">
                          ⏱️ {service.productExpectTime.toFixed(1)}h
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-blue-600">
                        {parseInt(service.productPrice).toLocaleString()}{" "}
                        {service.productCurrency}
                      </span>
                    </div>
                  </div>
                  {/* Dropdown Icon */}
                  {service.subProducts && service.subProducts.length > 0 && (
                    <svg
                      className={`w-5 h-5 text-gray-500 ml-2 transform transition-transform duration-200 ${
                        expandedService === service.productID
                          ? "rotate-180"
                          : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  )}
                </div>

                {/* Sub Products - Conditionally rendered */}
                {expandedService === service.productID &&
                  service.subProducts &&
                  service.subProducts.length > 0 && (
                    <div className="mt-0 pt-2 pb-3 px-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Add-ons:
                      </p>
                      <div className="space-y-2 pl-5">
                        {" "}
                        {/* Indent sub-products */}
                        {service.subProducts.map((subProduct) => (
                          <label
                            key={subProduct.productID}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={!!selectedServices[subProduct.productID]}
                              onChange={() =>
                                handleServiceToggle(
                                  subProduct.productID,
                                  subProduct.productPrice
                                )
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-800">
                                    {subProduct.productName}
                                  </h5>
                                  <p className="text-xs text-gray-600">
                                    {subProduct.productDescription}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ⏱️ {subProduct.productExpectTime.toFixed(1)}
                                    h
                                  </p>
                                </div>
                                <span className="text-sm font-semibold text-blue-600">
                                  +
                                  {parseInt(
                                    subProduct.productPrice
                                  ).toLocaleString()}{" "}
                                  {subProduct.productCurrency}
                                </span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Total Price Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">
              Selected services ({selectedCount})
            </span>
            <span className="text-xl font-bold text-gray-900">
              {totalPrice.toLocaleString()} VND
            </span>
          </div>

          {/* Book Now Button */}
          <button
            disabled={totalPrice === 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              totalPrice > 0
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => {
              navigate("/booking-confirmation", {
                state: {
                  bookingID: 1,
                },
              });
            }}
          >
            {totalPrice > 0
              ? `Book Now - ${totalPrice.toLocaleString()} VND`
              : "Select services to book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarwashDetail;
