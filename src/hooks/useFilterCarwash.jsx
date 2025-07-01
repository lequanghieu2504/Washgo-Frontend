import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { filterCarwashStore } from "@/store/filterCarwashStore";

const generateMockResults = () => {
  return [
    {
      id: 1,
      carwash_name: "WashGo Express",
      latitude: "10.762622",
      longitude: "106.660172",
    },
    {
      id: 2,
      carwash_name: "Premium Auto Spa",
      latitude: "10.765122",
      longitude: "106.658172",
    },
    {
      id: 3,
      carwash_name: "Quick Clean Station",
      latitude: "10.760122",
      longitude: "106.662172",
    },
    {
      id: 4,
      carwash_name: "Deluxe Car Care",
      latitude: "10.764622",
      longitude: "106.658972",
    },
    {
      id: 5,
      carwash_name: "Eco Wash Center",
      latitude: "10.761322",
      longitude: "106.661772",
    },
  ];
};

const filterCarwashes = async (filterParams) => {
  try {
    if (false) {
      // Your API logic here
      // return actual API results
    }
    return generateMockResults();
  } catch (error) {
    console.error("Filter API error:", error);
    return generateMockResults();
  }
};

export const useFilterCarwash = () => {
  const [storeState, setStoreState] = useState(() => filterCarwashStore.state);

  useEffect(() => {
    const unsubscribe = filterCarwashStore.subscribe(() => {
      setStoreState(filterCarwashStore.state);
    });
    return unsubscribe;
  }, []);

  const mutation = useMutation({
    mutationFn: filterCarwashes,
    onSuccess: (data) => {
      filterCarwashStore.setState({
        data,
        hasResults: Array.isArray(data) && data.length > 0,
      });
    },
    onError: (error) => {
      console.error("Filter mutation error:", error);
      filterCarwashStore.setState({
        data: [],
        hasResults: false,
      });
    },
  });

  return {
    // Mutation methods
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: storeState.data,
    hasResults: storeState.hasResults,
  };
};
