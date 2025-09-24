// src/components/Map.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from "../api/api";
import locationCoords from '../data/location_coords.json';
import 'leaflet/dist/leaflet.css';

// 🛠️ ES Module imports (Vite-compatible)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = () => {
  const [casesByLocation, setCasesByLocation] = useState([]);

  useEffect(() => {
    api.get('/cases/')
      .then((res) => {
        const grouped = {};

        res.data.forEach((c) => {
          const key = c.district || 'Unknown';
          if (!grouped[key]) {
            grouped[key] = {
              district: c.district,
              facility: c.health_facility || 'N/A',
              count: 1,
            };
          } else {
            grouped[key].count += 1;
          }
        });

        const results = Object.entries(grouped).map(([district, info]) => {
          const coords = locationCoords[district] || [-13.25, 34.3]; // fallback Malawi center
          return {
            ...info,
            lat: coords[0],
            lng: coords[1],
          };
        });

        setCasesByLocation(results);
      })
      .catch((err) => console.error('Map error:', err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cases by District</h2>

      <div className="relative w-full h-[600px] rounded-xl shadow-lg overflow-hidden">
        <MapContainer
          center={[-13.25, 34.3]}
          zoom={6}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {casesByLocation.map((loc, idx) => (
            <Marker key={idx} position={[loc.lat, loc.lng]}>
              <Popup className="text-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-700">{loc.district}</p>
                  <p>Facility: {loc.facility}</p>
                  <p className="text-green-600 font-medium">Cases: {loc.count}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Optional Legend */}
      <div className="mt-4 p-3 bg-white rounded-lg shadow flex items-center gap-4 w-max">
        <span className="w-4 h-4 bg-green-500 rounded-full"></span>
        <span className="text-sm text-gray-700">Number of Cases</span>
      </div>
    </div>
  );
};

export default MapView;
