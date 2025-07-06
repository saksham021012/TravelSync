import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import redMarker from "../../assets/marker-icon-red.png"; // Make sure this path is correct
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Custom red icon
const redIcon = new L.Icon({
  iconUrl: redMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fit map to all markers
const AutoFitBounds = ({ markers }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!markers.length) return;

    const bounds = L.latLngBounds(
      markers.map((item) => [item.coordinates[1], item.coordinates[0]])
    );

    map.fitBounds(bounds, { padding: [30, 30] });
  }, [markers, map]);

  return null;
};

const MapView = ({ services }) => {
  const allMarkers = Object.values(services || {}).flat();

  const defaultCenter =
    allMarkers.length && allMarkers[0].coordinates
      ? [allMarkers[0].coordinates[1], allMarkers[0].coordinates[0]]
      : [28.6139, 77.2090]; // fallback to Delhi

  return (
    <div className="h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow mb-6">
      <MapContainer center={defaultCenter} zoom={14} scrollWheelZoom className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        />

        <AutoFitBounds markers={allMarkers} />

        {allMarkers.map((item, idx) =>
          item.coordinates?.length === 2 ? (
            <Marker
              key={idx}
              position={[item.coordinates[1], item.coordinates[0]]}
              icon={redIcon}
            >
              <Popup>
                <strong>{item.name || "Unknown"}</strong>
                <br />
                {item.address}
                <br />
                {(item.distance / 1000).toFixed(2)} km away
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
