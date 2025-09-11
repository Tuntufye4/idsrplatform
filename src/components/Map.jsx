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
          const key = c.district;
          if (!grouped[key]) {
            grouped[key] = {
              district: c.district,
              facility: c.health_facility,
              count: 1,
            };
          } else {
            grouped[key].count += 1;
          }
        });

        const results = Object.entries(grouped).map(([district, info]) => {
          const coords = locationCoords[district] || [-13.25, 34.3]; // fallback to Malawi center
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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cases by District</h2>
      <MapContainer
        center={[-13.25, 34.3]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-[600px] rounded shadow-lg"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {casesByLocation.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]}>
            <Popup>
              <div>
                <strong>{loc.district}</strong><br />
                Facility: {loc.facility}<br />
                Cases: {loc.count}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
