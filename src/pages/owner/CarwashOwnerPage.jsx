import React, { useState, useEffect } from "react";
import Sidebar from "@/layouts/components/Sidebar";
import Table from "@/components/common/Table";
import LazySection from "@/components/common/LazySection";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import FieldEditor from "@/components/common/FieldEditor";
import PopupContainer from "@/components/common/PopupContainer";
import AddComponent from "@/components/common/AddComponent";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
// import { Chat } from "@/components/common/Chat";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { useUserStore } from "@/hooks/useUserStore";

export default function CarwashOwnerPage() {
  const [showChat, setShowChat] = useState(false);
  const [carwashInfo, setCarwashInfo] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [products, setProducts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [booking, setBooking] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(true);

  const [selectedOption, setSelectedOption] = useState("info");
  const navigate = useNavigate();

  const { user, loading } = useUserStore();

  const apiOptions = {
    info: carwashInfo,
    products,
    schedules,
    pricing,
    booking,
    logout: "logout",
  };

  const contextData = {
    carwashes: carwashInfo,
    products,
    schedules,
    pricing,
    booking,
  };

  // Loading Section

  useEffect(() => {
    if (!user || loading) return;
    CarwashService.retrieveAll()
      .then((carwashList) => {
        carwashList.filter((carwash) => {
          if (carwash.username === user.sub) {
            setCarwashInfo(carwash);
            CarwashService.retrieveProducts(carwash.id)
              .then((productList) => {
                setProducts(productList);
                const pricingArr = productList
                  .map((product) => product.pricing)
                  .filter((pricing) => pricing);
                setPricing(pricingArr);
                setSchedules(
                  productList.flatMap((product) => product.schedules)
                );
              })
              .catch((error) =>
                console.error("Error retrieving products:", error)
              );
          }
        });
      })
      .catch((error) => console.error("Error retrieving carwash info:", error))
      .finally(setLoading(false));
  }, [loading, user, trigger]);

  useEffect(() => {
    setTableData(apiOptions[selectedOption]);
  }, [carwashInfo, products, pricing, schedules, trigger]);

  // --- Handlers ---

  const handleOptionClick = (key) => {
    if (key === "logout") {
      navigate("/logout");
      return;
    }
    setPopupData(null);
    setSelectedOption(key);
    setTableData(apiOptions[key]);
  };

  const handleRowClick = (data) => {
    setPopupData(data);
  };

  const handleExpand = (expandedData) => {
    setTableData(expandedData);
    setPopupData(null);
  };

  const handleClose = (change = false) => {
    setPopupData(null);
    if (change) {
      setTrigger((prev) => !prev);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Button
        className="absolute top-4 right-4"
        onClick={() => {
          setShowChat((prev) => !prev);
        }}
      >
        {showChat ? "Close Chat" : "Open Chat"}
      </Button>
      <Sidebar
        Options={apiOptions}
        selectedOption={selectedOption}
        onOptionClick={handleOptionClick}
      />

      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end">
        <button
          className="mb-2 shadow-lg rounded-full w-16 h-16 flex items-center justify-center bg-[#cc0000] text-white hover:bg-[#a30000] transition focus:outline-none"
          onClick={() => setShowChat((prev) => !prev)}
          aria-label={showChat ? "Close Chat" : "Open Chat"}
        >
          {/* Temporary chat bubble SVG icon */}
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
            <Chat currentUser={user.sub} />
          </div>
        )}
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Carwash Owner Dashboard</h1>
        <LazySection
          className="mt-6"
          isLoading={isLoading}
          skeleton={<TableSkeleton />}
        >
          {selectedOption == "info" ? (
            <FieldEditor
              data={carwashInfo}
              onExpand={handleExpand}
              onClose={handleClose}
              selectedOption={selectedOption}
            />
          ) : (
            <>
              <AddComponent
                selectedOption={selectedOption}
                contextData={contextData}
                onClose={handleClose}
              />
              <Table
                data={Array.isArray(tableData) ? tableData : [tableData]}
                onRowClick={handleRowClick}
              />
            </>
          )}
        </LazySection>

        {popupData && (
          <PopupContainer title="Details" onClose={handleClose}>
            <FieldEditor
              data={popupData}
              onExpand={handleExpand}
              onClose={handleClose}
              selectedOption={selectedOption}
              contextData={contextData}
            />
          </PopupContainer>
        )}
      </div>
    </div>
  );
}
