import { useState, useEffect } from "react";
import { userLocationStore } from "@/store/userLocationStore";

export const useLocation = () => {
  const [location, setLocation] = useState(() => userLocationStore.state);

  useEffect(() => {
    const unsubscribe = userLocationStore.subscribe(() => {
      setLocation(userLocationStore.state);
    });
    return unsubscribe;
  }, []);

  const setManualLocation = (location) => {
    const latitude = location[0];
    const longitude = location[1];

    sessionStorage.setItem(
      "manual-location",
      JSON.stringify([latitude, longitude])
    );

    userLocationStore.setState((prev) => ({
      ...prev,
      latitude,
      longitude,
      error: null,
      isLoading: false,
    }));
  };

  const getCurrentLocation = () => {
    userLocationStore.setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const manualLocation = sessionStorage.getItem("manual-location");
      if (manualLocation) {
        const [lat, lon] = JSON.parse(manualLocation);
        if (lat && lon) {
          userLocationStore.setState({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            error: null,
            isLoading: false,
          });
          return;
        }
      }
    } catch (error) {
      console.warn("Error parsing manual location:", error);
    }

    if (!navigator.geolocation) {
      userLocationStore.setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        isLoading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        userLocationStore.setState({
          latitude,
          longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        const errorMessage = `Unable to retrieve location: ${error.message}`;

        userLocationStore.setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));

        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  };

  useEffect(() => {
    if (!location.latitude && !location.longitude && !location.isLoading) {
      getCurrentLocation();
    }
  }, []);

  return {
    latitude: location.latitude,
    longitude: location.longitude,
    error: location.error,
    isLoading: location.isLoading,
    getCurrentLocation,
    setManualLocation,
  };
};
