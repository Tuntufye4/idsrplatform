import React, { useEffect, useState, useMemo } from 'react';
import api from "../api/api";
import MalawiOutline from '../assets/mw.svg';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Geographic bounds of Malawi used in the SVG viewBox
const LON_MIN = 32.4;
const LON_MAX = 36.0;
const LAT_MIN = -17.3;
const LAT_MAX = -9.1;

// Aspect ratio of the SVG
const ASPECT_RATIO = (LAT_MAX - LAT_MIN) / (LON_MAX - LON_MIN);

const lonLatToPercent = (lon, lat) => {
  const xPct = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100;
  const yPct = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x: xPct, y: yPct };
};

const MapView = () => {
  const [casesByLocation, setCasesByLocation] = useState([]);

  useEffect(() => {
    api.get('/cases/')
      .then((res) => {
        const grouped = {};
        res.data.forEach((c) => {
          const lat = c.lat ?? -13.25;
          const lng = c.lng ?? 34.3;
          const key = c.district || 'Unknown';

          if (!grouped[key]) {
            grouped[key] = { district: key, count: 1, lat, lng };
          } else {
            grouped[key].count += 1;
          }
        });

        setCasesByLocation(Object.values(grouped));
      })
      .catch((err) => console.error('Map error:', err));
  }, []);

  const { transformStyle, scale } = useMemo(() => {
    if (casesByLocation.length === 0) return { transformStyle: {}, scale: 1 };

    const lats = casesByLocation.map(m => m.lat);
    const lngs = casesByLocation.map(m => m.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const widthPercent = ((maxLng - minLng) / (LON_MAX - LON_MIN)) * 100;
    const heightPercent = ((maxLat - minLat) / (LAT_MAX - LAT_MIN)) * 100;

    const scaleX = 100 / (widthPercent * 1.1);
    const scaleY = 100 / (heightPercent * 1.1);
    const scale = Math.min(scaleX, scaleY, 1);

    const centerX = (minLng + maxLng) / 2;
    const centerY = (minLat + maxLat) / 2;
    const { x: centerXPct, y: centerYPct } = lonLatToPercent(centerX, centerY);

    const verticalOffsetPct = -15; // move map up
    const translateX = 50 - centerXPct * scale;
    const translateY = 50 - centerYPct * scale + verticalOffsetPct;

    return {
      transformStyle: {
        transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
        transformOrigin: 'top left',
      },
      scale,
    };
  }, [casesByLocation]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Cases by District 
      </h2>

      <div className="relative w-full max-w-6xl mx-auto rounded-xl shadow-lg overflow-hidden bg-white">
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: `${ASPECT_RATIO * 60}%`, // shorter container height
            overflow: 'hidden',
            ...transformStyle,
          }}
        >
          <img
            src={MalawiOutline}
            alt="Malawi outline"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {casesByLocation.map((loc, idx) => {
            const { x, y } = lonLatToPercent(loc.lng, loc.lat);
            const baseSize = 6 + loc.count * 0.5;
            const size = baseSize / scale;

            return (
              <div
                key={idx}
                data-tooltip-id={`tooltip-${idx}`}
                data-tooltip-content={`${loc.district}: ${loc.count} case${loc.count > 1 ? 's' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.8)',
                  border: '2px solid white',
                  cursor: 'pointer',
                }}
              >
                <ReactTooltip id={`tooltip-${idx}`} place="top" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg shadow flex items-center gap-4 w-max">
        <span className="w-4 h-4 bg-red-600 rounded-full"></span>
        <span className="text-sm text-gray-700">Number of Cases</span>
      </div>
    </div>   
  );
};

export default MapView;
