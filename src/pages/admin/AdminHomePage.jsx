import React, { useEffect, useState } from "react";

import Table from "../common/Table";
import Sidebar from "../common/Sidebar";
import LazySection from "../common/LazySection";
import TableSkeleton from "../skeleton/TableSkeleton";
import AddComponent from "../common/AddComponent";
import { CarwashService } from "@/entities/service";
import { useAuth } from "@/hooks";
import PopupContainer from "../common/PopupContainer";
import FieldEditor from "../common/FieldEditor";
import { serviceProvider } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Chat } from "@/component/common/Chat";

const AdminHomePage = () => {
  const [tableData, setTableData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [products, setProducts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [booking, setBooking] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(true);
  const [register, setRegister] = useState([]);
  const [carwash, setCarwashes] = useState([]);
  const { user, loading } = useAuth();
  const [selectedOption, setSelectedOption] = useState("carwash");
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const apiOptions = {
    register,
    carwash,
    products,
    schedules,
    pricing,
    booking,
    logout: "logout",
  };

  const contextData = {
    carwash,
    products,
    schedules,
    pricing,
    booking,
  };

  useEffect(() => {
    if (!user || loading) return;
    if (
      !["carwash", "products", "pricing", "schedules"].includes(selectedOption)
    ) {
      serviceProvider[selectedOption].retrieveAll
        ? serviceProvider[selectedOption].retrieveAll().then((res) => {
            console.log(res);

            switch (selectedOption) {
              case "booking":
                setBooking(res);
                break;
              case "register":
                setRegister(res);
              default:
                break;
            }
          })
        : null;

      return;
    }
    let productsArr = [];
    let schedulesArr = [];
    let pricingArr = [];
    CarwashService.retrieveAll()
      .then((carwashList) => {
        setCarwashes(carwashList);
        carwashList.forEach((carwash) => {
          CarwashService.retrieveProducts(carwash.id)
            .then((productList) => {
              productsArr = productsArr.concat(productList);
              pricingArr = pricingArr.concat(
                productList.flatMap((product) => product.pricingList)
              );
              schedulesArr = schedulesArr.concat(
                productList.flatMap((product) => product.schedules)
              );
              setProducts(productsArr);
              setSchedules(schedulesArr);
              setPricing(pricingArr);
            })
            .catch((error) =>
              console.error("Error retrieving products:", error)
            );
        });
      })
      .catch((error) => console.error("Error retrieving carwash info:", error))
      .finally(setLoading(false));
  }, [loading, user, trigger, selectedOption]);

  useEffect(() => {
    setTableData(apiOptions[selectedOption]);
  }, [carwash, products, pricing, schedules, trigger, booking, register]);

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
      <Sidebar
        Options={apiOptions}
        selectedOption={selectedOption}
        onOptionClick={handleOptionClick}
      />

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
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
        <h1 className="text-3xl font-bold mb-6">ADMIN Dashboard</h1>
        <LazySection
          className="mt-6"
          isLoading={isLoading}
          skeleton={<TableSkeleton />}
        >
          <AddComponent
            selectedOption={selectedOption}
            contextData={contextData}
            onClose={handleClose}
          />
          <Table
            data={Array.isArray(tableData) ? tableData : [tableData]}
            onRowClick={handleRowClick}
          />
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
};

export default AdminHomePage;
