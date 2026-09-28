import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon paths under Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Helper component to dynamically re-center and fit bounds 
 * when multiple points are present or when points array updates.
 */
function FitBoundsToMarkers({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 13);
    } else {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [points, map]);

  return null;
}

/**
 * Modernized Leaflet + OpenStreetMap wrapper styled for Dark Glassmorphism.
 * `points` is an array of { id, lat, lng, title, subtitle, directionsUrl }.
 */
export default function MapView({ points = [], height = "360px", zoom = 12 }) {
  if (!points || points.length === 0) return null;

  const defaultCenter = [points[0].lat, points[0].lng];

  return (
    <div
      style={{ height }}
      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-3d-card bg-brand-dark/80 backdrop-blur-md z-0"
    >
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        {/* CartoDB Dark Matter Tile Layer for Dark Glassmorphic Themes */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBoundsToMarkers points={points} />

        {points.map((p) => (
          <Marker key={p.id || `${p.lat}-${p.lng}`} position={[p.lat, p.lng]}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-slate-800">
                <p className="font-bold text-sm text-emerald-950">{p.title}</p>
                {p.subtitle && (
                  <p className="text-xs text-slate-600 mt-0.5 mb-2 leading-tight">
                    {p.subtitle}
                  </p>
                )}
                <a
                  href={
                    p.directionsUrl ||
                    `https://www.openstreetmap.org/directions?to=${p.lat}%2C${p.lng}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors mt-1"
                >
                  Get directions &rarr;
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}