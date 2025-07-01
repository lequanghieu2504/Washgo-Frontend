import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import ErrorBox from "@/components/ui/ErrorBox";
import EmptyDataBox from "@/components/ui/EmptyDataBox";
import Filter from "@/components/common/Filter";

const ITEMS_PER_PAGE = 10;

const CATEGORY_MAP = {
  interior: "interior",
  exterior: "exterior",
  full: "full",
};

const CATEGORY_LABELS = {
  interior: "Interior wash",
  exterior: "Exterior wash",
  full: "Full wash",
};

const fetchCarwash = async ({ pageParam = 0 }) => {
  const accessToken = localStorage.getItem("accessToken");
  let allItems = [];
  try {
    const res = await fetch("http://localhost:8080/api/carwashes", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const module = await import("@/data/dummyData.js");
      allItems = module.carwashes;
    } else {
      allItems = await res.json();
    }
  } catch (err) {
    const module = await import("@/data/dummyData.js");
    allItems = module.carwashes;
  }

  const start = pageParam * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = allItems.slice(start, end);

  return {
    items: pageItems,
    hasMore: end < allItems.length,
    nextPage: pageParam + 1,
  };
};

function Search() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({
    date: "",
    time: "",
    category: "",
  });

  console.log("Filter:", filter);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["carwashes"],
    queryFn: fetchCarwash,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });

  const carwashes = data ? data.pages.flatMap((page) => page.items) : [];

  const handleCarwashClick = (id) => {
    window.location.href = `/carwash/${id}`;
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // For testing: do not filter the carwash list
  const filteredCarwashes = carwashes;

  return (
    <div className="p-6 lg:p-8 min-h-[calc(100vh-theme_header_height)]">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        {t("search.results_title")}
      </h1>

      <Filter onChange={handleFilterChange} category={filter.category} />

      {isLoading && (
        <div className="text-center py-10">
          <i className="fas fa-spinner fa-spin text-3xl text-[#cc0000]"></i>
          <p className="mt-2 text-gray-600">{t("search.loading")}</p>
        </div>
      )}

      {isError && (
        <ErrorBox
          message={t("search.error_title")}
          detail={error?.message || "Error"}
        />
      )}

      {!isLoading && !isError && filteredCarwashes.length > 0 && (
        <>
          <ul className="space-y-3 mb-8">
            {filteredCarwashes.map((item) => (
              <li
                key={item.id}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm cursor-pointer transition duration-150 ease-in-out hover:shadow-md hover:border-[#cc0000] hover:bg-red-50"
                onClick={() => handleCarwashClick(item.id)}
                title={t("search.view_details", { name: item.carwashName })}
              >
                <p className="font-medium text-gray-800">
                  {item.carwashName || t("search.unnamed_carwash")}
                </p>
                {item.location && (
                  <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                )}
                {item.average_rating && (
                  <div className="flex items-center mt-1">
                    <i className="fas fa-star text-yellow-400 mr-1 text-xs"></i>
                    <span className="text-xs font-medium text-gray-600">
                      {item.average_rating}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 rounded bg-[#cc0000] text-white font-semibold hover:bg-[#a30000] transition disabled:opacity-50"
              >
                {isFetchingNextPage
                  ? t("search.loading")
                  : t("search.load_more")}
              </button>
            </div>
          )}
        </>
      )}

      {!isLoading && !isError && filteredCarwashes.length === 0 && (
        <EmptyDataBox
          iconClass="fas fa-search"
          message={t("search.no_results")}
        />
      )}
    </div>
  );
}

export default Search;
