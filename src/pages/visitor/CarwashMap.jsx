import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  CircleMarker,
} from "react-leaflet";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BottomSheet from "@/components/ui/BottomSheet";
import { useCarwash } from "@/hooks/useAllCarwash";
import CarwashDetail from "@/pages/visitor/CarwashDetail";
import { useLocation } from "@/hooks/useLocation";
import LocationControl from "@/components/common/LocationControl";
import { useFilterCarwash } from "@/hooks/useFilterCarwash";

// Fix default icon issue for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function CarwashMap() {
  const { t } = useTranslation();
  const [selectedCarwashId, setSelectedCarwashId] = useState(null);
  const mapRef = useRef();
  const defaultPosition = [10.762622, 106.660172]; // Ho Chi Minh City

  const { data: allCarwashes, isLoading, error } = useCarwash();
  const { latitude, longitude } = useLocation();

  const { data: filtered, hasResults } = useFilterCarwash();

  const currentUserLocation =
    latitude && longitude ? [latitude, longitude] : defaultPosition;

  const carwashesToDisplay = hasResults ? filtered : allCarwashes || [];

  // --- Render Map ---
  return (
    <>
      <MapContainer
        ref={mapRef}
        center={currentUserLocation}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show user location and radius if available */}
        {currentUserLocation && (
          <>
            <CircleMarker
              center={currentUserLocation}
              radius={8}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#2563eb",
                fillOpacity: 1,
                weight: 2,
              }}
            />
            <Circle
              center={currentUserLocation}
              radius={3000} // 3km in meters
              pathOptions={{
                color: "#2563eb",
                fillColor: "#60a5fa",
                fillOpacity: 0.2,
              }}
            />
          </>
        )}

        {/* Display carwashes (either filtered results or all carwashes) */}
        {Array.isArray(carwashesToDisplay) &&
          carwashesToDisplay.map((carwash) => {
            const lat = parseFloat(carwash.latitude);
            const lon = parseFloat(carwash.longitude);

            if (!isNaN(lat) && !isNaN(lon)) {
              return (
                <Marker
                  key={carwash.id}
                  position={[lat, lon]}
                  eventHandlers={{
                    click: () => setSelectedCarwashId(carwash.id),
                  }}
                />
              );
            } else {
              console.warn(
                t("carwash_map.invalid_coordinates", {
                  id: carwash.id,
                  lat: carwash.latitude,
                  lon: carwash.longitude,
                })
              );
              return null;
            }
          })}
      </MapContainer>

      {/* Location Control Component */}
      <LocationControl mapRef={mapRef} />

      {/* Bottom sheet overlays the map, sits above footer */}
      {selectedCarwashId && (
        <BottomSheet onClose={() => setSelectedCarwashId(null)}>
          <CarwashDetail
            carwash={carwashesToDisplay.find((c) => c.id === selectedCarwashId)}
          />
        </BottomSheet>
      )}
    </>
  );
}

export default CarwashMap;
