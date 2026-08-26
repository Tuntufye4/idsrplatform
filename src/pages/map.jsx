import React, { useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { getCases } from "../api/api";
import MalawiOutline from "../assets/mw.svg";

// =====================================================
// THEME    
// =====================================================

const TEAL = "#0f766e";
const TEAL_LIGHT = "#14b8a6";
const TEAL_DARK = "#115e59";

// =====================================================
// MALAWI MAP BOUNDS
// =====================================================

const LON_MIN = 32.4;
const LON_MAX = 36.0;
const LAT_MIN = -17.3;
const LAT_MAX = -9.1;

const ASPECT_RATIO =
  (LAT_MAX - LAT_MIN) / (LON_MAX - LON_MIN);

// =====================================================
// COORDINATE CONVERSION
// =====================================================

const lonLatToPercent = (lon, lat) => {
  const longitude = Number(lon);
  const latitude = Number(lat);

  const x =
    ((longitude - LON_MIN) /
      (LON_MAX - LON_MIN)) *
    100;

  const y =
    ((LAT_MAX - latitude) /
      (LAT_MAX - LAT_MIN)) *
    100;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
};

// =====================================================
// VALUE HELPER
// =====================================================

const getValue = (obj, keys) => {
  for (const key of keys) {
    const value = obj?.[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return null;
};

// =====================================================
// MAP
// =====================================================

const MapView = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ===================================================
  // LOAD CASES
  // ===================================================

  const loadCases = async () => {
    setLoading(true);
    setErrorMessage("");
        
    try {
      const response = await getCases();

      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.results)
        ? response.data.results
        : [];

      setCases(data);
    } catch (error) {
      console.error("Map error:", error);
      setErrorMessage(
        "Unable to load surveillance cases."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // ===================================================
  // GROUP CASES BY DISTRICT
  // ===================================================

  const casesByLocation = useMemo(() => {
    const grouped = {};

    cases.forEach((c) => {
      const district =
        getValue(c, [
          "district",
          "district_name",
        ]) || "Unknown";

      let lat = getValue(c, [
        "lat",
        "latitude",
      ]);

      let lng = getValue(c, [
        "lng",
        "longitude",
        "lon",
      ]);

      /*
       * Fallback coordinates.
       * These keep records visible even if the API
       * does not contain coordinates.
       */
      lat = Number(lat);
      lng = Number(lng);

      if (!Number.isFinite(lat)) {
        lat = -13.25;
      }

      if (!Number.isFinite(lng)) {
        lng = 34.3;
      }

      if (!grouped[district]) {
        grouped[district] = {
          district,
          count: 0,
          lat,
          lng,
        };
      }

      grouped[district].count += 1;

      /*
       * Keep the first valid coordinate for the district.
       */
    });

    return Object.values(grouped);
  }, [cases]);

  // ===================================================
  // MAP SCALE
  // ===================================================

  const { transformStyle, scale } = useMemo(() => {
    if (casesByLocation.length === 0) {
      return {
        transformStyle: {},
        scale: 1,
      };
    }

    const lats = casesByLocation.map(
      (location) => location.lat
    );

    const lngs = casesByLocation.map(
      (location) => location.lng
    );

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const widthPercent =
      ((maxLng - minLng) /
        (LON_MAX - LON_MIN)) *
      100;

    const heightPercent =
      ((maxLat - minLat) /
        (LAT_MAX - LAT_MIN)) *
      100;

    /*
     * Prevent division by zero when all records
     * have the same coordinates.
     */
    const safeWidth = Math.max(widthPercent, 10);
    const safeHeight = Math.max(heightPercent, 10);

    const scaleX =
      100 / (safeWidth * 1.1);

    const scaleY =
      100 / (safeHeight * 1.1);

    const calculatedScale = Math.min(
      scaleX,
      scaleY,
      1
    );

    const centerLng =
      (minLng + maxLng) / 2;

    const centerLat =
      (minLat + maxLat) / 2;

    const {
      x: centerXPct,
      y: centerYPct,
    } = lonLatToPercent(
      centerLng,
      centerLat
    );

    const verticalOffsetPct = -15;

    const translateX =
      50 - centerXPct * calculatedScale;

    const translateY =
      50 -
      centerYPct * calculatedScale +
      verticalOffsetPct;

    return {
      transformStyle: {
        transform: `scale(${calculatedScale}) translate(${translateX}%, ${translateY}%)`,
        transformOrigin: "top left",
      },
      scale: calculatedScale,
    };
  }, [casesByLocation]);

  // ===================================================
  // TOTAL CASES
  // ===================================================

  const totalCases = cases.length;

  const totalDistricts =
    casesByLocation.length;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <p className="text-sm font-medium text-teal-700">
            IDSR Surveillance
          </p>

          <h1 className="text-3xl font-bold text-slate-800">
            Cases Map
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Geographic distribution of reported cases across Malawi
          </p>
        </div>

       

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
          <p className="text-sm font-medium text-slate-500">
            Total Cases
          </p>

          <p className="text-3xl font-bold text-teal-700 mt-1">
            {loading ? "—" : totalCases}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
          <p className="text-sm font-medium text-slate-500">
            Districts Reporting
          </p>

          <p className="text-3xl font-bold text-teal-700 mt-1">
            {loading ? "—" : totalDistricts}
          </p>
        </div>

      </div>

      {/* ERROR */}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* MAP CARD */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Cases by District
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Hover over a marker to view the number of reported cases.
          </p>

        </div>

        {/* MAP */}

        <div className="p-4 md:p-6">

          <div
            className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-teal-100 bg-teal-50/30"
            style={{
              minHeight: "500px",
            }}
          >

            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: `${ASPECT_RATIO * 60}%`,
                minHeight: "500px",
                overflow: "hidden",
                ...transformStyle,
              }}
            >

              <img
                src={MalawiOutline}
                alt="Map outline of Malawi"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />

              {/* CASE MARKERS */}

              {casesByLocation.map(
                (location, index) => {
                  const {
                    x,
                    y,
                  } = lonLatToPercent(
                    location.lng,
                    location.lat
                  );

                  /*
                   * Marker grows with case count,
                   * but is capped to avoid huge markers.
                   */
                  const baseSize =
                    10 +
                    Math.min(
                      location.count * 2,
                      35
                    );

                  const size =
                    baseSize /
                    Math.max(scale, 0.5);

                  const tooltipId =
                    `district-tooltip-${index}`;

                  return (
                    <React.Fragment
                      key={`${location.district}-${index}`}
                    >

                      <div
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={`${location.district}: ${location.count} ${
                          location.count === 1
                            ? "case"
                            : "cases"
                        }`}
                        style={{
                          position: "absolute",
                          left: `${x}%`,
                          top: `${y}%`,
                          transform:
                            "translate(-50%, -50%)",
                          width: `${size}px`,
                          height: `${size}px`,
                          minWidth: "10px",
                          minHeight: "10px",
                          borderRadius: "50%",
                          background:
                            TEAL_LIGHT,
                          border:
                            `3px solid white`,
                          boxShadow:
                            `0 2px 8px rgba(15,118,110,0.45)`,
                          cursor: "pointer",
                          zIndex: 10,
                        }}
                      />

                      <ReactTooltip
                        id={tooltipId}
                        place="top"
                        style={{
                          backgroundColor:
                            TEAL_DARK,
                          color: "white",
                          borderRadius:
                            "8px",
                          fontSize:
                            "13px",
                          fontWeight:
                            "500",
                          zIndex: 100,
                        }}
                      />

                    </React.Fragment>
                  );
                }
              )}

            </div>

            {/* LOADING */}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">

                <div className="flex flex-col items-center gap-3">

                  <div className="w-10 h-10 border-4 border-teal-100 border-t-teal-700 rounded-full animate-spin" />

                  <p className="text-sm font-medium text-slate-600">
                    Loading surveillance data...
                  </p>

                </div>

              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              cases.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="text-center">

                    <div className="text-4xl mb-3 text-teal-600">
                      ◉
                    </div>

                    <h3 className="font-semibold text-slate-700">
                      No cases found
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      There are currently no surveillance cases to display.
                    </p>

                  </div>

                </div>
              )}

          </div>

        </div>

      </div>

      {/* LEGEND */}

      <div className="mt-5 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">

        <div className="flex flex-wrap items-center gap-6">

          <div className="flex items-center gap-2">

            <span
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{
                backgroundColor:
                  TEAL_LIGHT,
              }}
            />

            <span className="text-sm text-slate-600">
              Reported cases
            </span>

          </div>

          <div className="text-sm text-slate-500">
            Larger markers indicate more cases.
          </div>

        </div>

      </div>

      {/* DISTRICT LIST */}

      {!loading &&
        casesByLocation.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-800">
                District Summary
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-teal-50">

                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-teal-800">
                      District
                    </th>

                    <th className="text-right px-5 py-3 font-semibold text-teal-800">
                      Cases
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {[...casesByLocation]
                    .sort(
                      (a, b) =>
                        b.count - a.count
                    )
                    .map(
                      (location) => (
                        <tr
                          key={
                            location.district
                          }
                          className="border-t border-slate-100 hover:bg-teal-50/50 transition"
                        >

                          <td className="px-5 py-3 text-slate-700">
                            {location.district}
                          </td>

                          <td className="px-5 py-3 text-right">

                            <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold">
                              {location.count}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                </tbody>

              </table>   

            </div>

          </div>
        )}

    </div>     
  );
};

export default MapView;
