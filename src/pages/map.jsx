import React, { useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  MapIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import "react-tooltip/dist/react-tooltip.css";

import { getCases } from "../api/api";   
import MalawiOutline from "../assets/mw.svg";
import location_coords from "../data/location_coords";          

// =====================================================
// THEME
// =====================================================

const RED = "#DC2626";
const RED_DARK = "#991B1B";

// =====================================================
// MALAWI GEOGRAPHIC BOUNDS
// =====================================================

const LON_MIN = 32.67;
const LON_MAX = 35.93;

const LAT_MIN = -17.13;
const LAT_MAX = -9.37;

// =====================================================
// SVG MAP CONTENT BOUNDS
// =====================================================

const MAP_X_MIN = 31.4;
const MAP_X_MAX = 68.5;

const MAP_Y_MIN = 4.5;
const MAP_Y_MAX = 95.4;

// =====================================================
// VALUE HELPER
// =====================================================

const getValue = (object, keys) => {
  for (const key of keys) {
    const value = object?.[key];

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
// NORMALIZE DISTRICT NAME
// =====================================================

const normalizeDistrict = (district) => {
  if (!district) {
    return "Unknown";
  }

  const value = String(district).trim();

  const aliases = {
    "Nkhata Bay": "NkhataBay",
    "Nkhata-Bay": "NkhataBay",
    "NkhataBay": "NkhataBay",

    "Mzimba North": "Mzimba",
    "Mzimba South": "Mzimba",

    "Lilongwe City": "Lilongwe",
    "Blantyre City": "Blantyre",
    "Zomba City": "Zomba",
  };

  return aliases[value] || value;
};

// =====================================================
// LONGITUDE / LATITUDE → SVG PERCENTAGE
// =====================================================

const lonLatToPercent = (longitude, latitude) => {
  const lon = Number(longitude);
  const lat = Number(latitude);

  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    return {
      x: 50,
      y: 50,
    };
  }

  const normalizedX =
    (lon - LON_MIN) /
    (LON_MAX - LON_MIN);

  const normalizedY =
    (LAT_MAX - lat) /
    (LAT_MAX - LAT_MIN);

  const x =
    MAP_X_MIN +
    normalizedX *
      (MAP_X_MAX - MAP_X_MIN);

  const y =
    MAP_Y_MIN +
    normalizedY *
      (MAP_Y_MAX - MAP_Y_MIN);

  return {
    x: Math.max(
      MAP_X_MIN,
      Math.min(MAP_X_MAX, x)
    ),

    y: Math.max(
      MAP_Y_MIN,
      Math.min(MAP_Y_MAX, y)
    ),
  };
};

// =====================================================
// MAP VIEW
// =====================================================

const MapView = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ===================================================
  // LOAD CASES USING getCases()
  // ===================================================

  const loadCases = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getCases();

      console.log("getCases() response:", response);

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

    cases.forEach((item) => {
      const rawDistrict = getValue(item, [
        "district",
        "district_name",
        "District",
      ]);

      const district =
        normalizeDistrict(rawDistrict);

      // -----------------------------------------------
      // USE location_coordinates
      // -----------------------------------------------

      const coordinates =
        location_coords[district];

      let lat = null;
      let lng = null;

      if (
        Array.isArray(coordinates) &&
        coordinates.length >= 2
      ) {
        lat = Number(coordinates[0]);
        lng = Number(coordinates[1]);
      }

      // -----------------------------------------------
      // FALLBACK TO API GPS COORDINATES
      // -----------------------------------------------

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        lat = Number(
          getValue(item, [
            "lat",
            "latitude",
            "Latitude",
          ])
        );

        lng = Number(
          getValue(item, [
            "lng",
            "longitude",
            "lon",
            "Longitude",
          ])
        );
      }

      // -----------------------------------------------
      // FINAL FALLBACK
      // -----------------------------------------------

      if (!Number.isFinite(lat)) {
        lat = -13.9833;
      }

      if (!Number.isFinite(lng)) {
        lng = 33.7833;
      }

      // -----------------------------------------------
      // GROUP BY DISTRICT
      // -----------------------------------------------

      if (!grouped[district]) {
        grouped[district] = {
          district,
          count: 0,
          lat,
          lng,
        };
      }

      grouped[district].count += 1;
    });

    return Object.values(grouped);
  }, [cases]);

  // ===================================================
  // MAX CASE COUNT
  // ===================================================

  const maxCases = useMemo(() => {
    if (!casesByLocation.length) {
      return 1;
    }

    return Math.max(
      ...casesByLocation.map(
        (location) => location.count
      )
    );
  }, [casesByLocation]);

  // ===================================================
  // MARKER SIZE
  // ===================================================

  const getMarkerSize = (count) => {
    const minSize = 13;
    const maxSize = 34;

    if (maxCases <= 1) {
      return minSize;
    }

    const ratio = count / maxCases;

    return (
      minSize +
      ratio * (maxSize - minSize)
    );
  };

  // ===================================================
  // SUMMARY
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

      <div className="mb-6">

        <button
          type="button"
          onClick={() => navigate("/select")}
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-600
            shadow-sm
            transition-all
            duration-200
            hover:border-teal-200
            hover:bg-teal-50
            hover:text-teal-700
            hover:shadow
          "
        >
          Return to Menu
        </button>

        <div className="flex items-start gap-3">

         

          <div>

       

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Geographic distribution of reported
              surveillance cases across Malawi.
            </p>

          </div>

        </div>
      </div>

      {/* SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* TOTAL CASES */}

        <div
          className="
            rounded-2xl
            border
            border-red-100
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Cases
              </p>

              <p className="mt-1 text-3xl font-bold text-red-600">
                { totalCases}
              </p>
   
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-600
              "
            >
              <span className="text-lg">
                ●
              </span>
            </div>

          </div>

        </div>

        {/* DISTRICTS */}

        <div
          className="
            rounded-2xl
            border
            border-blue-100
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Districts Reporting
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-700">
                {totalDistricts}
              </p>

            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-purple-50
                text-purple-700
              "
            >
              <MapIcon className="h-6 w-6" />
            </div>

          </div>

        </div>

      </div>

      {/* ERROR */}

      {errorMessage && (
        <div
          className="
            mb-6
            flex
            items-center
            justify-between
            gap-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
          "
        >

          <div className="flex items-center gap-2">

            <ExclamationTriangleIcon
              className="h-5 w-5 text-red-600"
            />

            <p className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>

          </div>

          <button
            type="button"
            onClick={loadCases}
            className="
              rounded-lg
              bg-red-600
              px-3
              py-1.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-700
            "
          >
            Retry
          </button>

        </div>
      )}

      {/* MAP CARD */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* MAP HEADER */}

        <div
          className="
            border-b
            border-slate-200
            px-5
            py-4
          "
        >

          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <h2 className="text-lg font-semibold text-slate-800">
                Cases by District
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Red markers show reported cases.
                Larger markers indicate higher
                case counts.
              </p>

            </div>

            {!loading && cases.length > 0 && (
              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  rounded-full
                  bg-blue-50
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-blue-700
                "
              >
                {totalDistricts} reporting districts
              </span>
            )}

          </div>

        </div>

        {/* MAP */}

        <div className="flex justify-center p-3 md:p-8">

          <div
            className="
              relative
              w-full
              max-w-[720px]
              overflow-hidden
              rounded-2xl
              border
              border-purple-200
              bg-gradient-to-br
              from-purple-50
              via-white
              to-purple-50
              shadow-inner
            "
            style={{
              aspectRatio: "1 / 1",
            }}
          >

            {/* MALAWI SVG */}

            <img
              src={MalawiOutline}
              alt="Map outline of Malawi"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-contain
                select-none
              "
              draggable="false"
            />

            {/* CASE MARKERS */}

            {!loading &&
              casesByLocation.map(
                (location, index) => {

                  const {
                    x,
                    y,
                  } = lonLatToPercent(
                    location.lng,
                    location.lat
                  );

                  const size =
                    getMarkerSize(
                      location.count
                    );

                  const tooltipId =
                    `district-tooltip-${index}`;

                  const label =
                    `${location.district}: ${location.count} ${
                      location.count === 1
                        ? "case"
                        : "cases"
                    }`;

                  return (
                    <React.Fragment
                      key={`${location.district}-${index}`}
                    >

                      {/* PULSE */}

                      <span
                        className="
                          pointer-events-none
                          absolute
                          rounded-full
                          bg-red-500/30
                          animate-ping
                        "
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          transform:
                            "translate(-50%, -50%)",
                          zIndex: 5,
                        }}
                      />

                      {/* MARKER */}

                      <button
                        type="button"
                        aria-label={label}
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={label}
                        className="
                          absolute
                          rounded-full
                          border-[3px]
                          border-white
                          shadow-xl
                          transition-all
                          duration-200
                          hover:scale-125
                          focus:outline-none
                          focus:ring-2
                          focus:ring-red-500
                          focus:ring-offset-2
                        "
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          transform:
                            "translate(-50%, -50%)",
                          backgroundColor: RED,
                          boxShadow:
                            "0 3px 12px rgba(220,38,38,0.50)",
                          zIndex: 10,
                        }}
                      />

                      <ReactTooltip
                        id={tooltipId}
                        place="top"
                        className="
                          !rounded-lg
                          !px-3
                          !py-2
                          !text-xs
                          !font-semibold
                          !shadow-xl
                        "
                        style={{
                          backgroundColor: RED_DARK,
                        }}
                      />

                    </React.Fragment>
                  );
                }
              )}

      

            {/* EMPTY */}

            {!loading &&
              !errorMessage &&
              cases.length === 0 && (
                <div
                  className="
                    absolute
                    inset-0
                    z-20
                    flex
                    items-center
                    justify-center
                  "
                >

                  <div
                    className="
                      max-w-sm
                      px-6
                      text-center
                    "
                  >

                    <div
                      className="
                        mx-auto
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-purple-50
                        text-purple-600
                      "
                    >
                      <MapIcon className="h-7 w-7" />
                    </div>

                    <h3 className="font-semibold text-slate-700">
                      No cases found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      There are currently no surveillance
                      cases available to display.
                    </p>

                  </div>

                </div>
              )}

          </div>

        </div>

      </div>

      {/* LEGEND */}

      <div
        className="
          mt-5
          rounded-xl
          border
          border-slate-200
          bg-white
          px-5
          py-4
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-8
            gap-y-3
          "
        >

          <div className="flex items-center gap-2">

            <span
              className="
                h-4
                w-4
                rounded-full
                border-2
                border-white
                shadow
              "
              style={{
                backgroundColor: RED,
              }}
            />

            <span className="text-sm font-medium text-slate-600">
              Reported cases
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span
              className="
                h-3
                w-3
                rounded-full
                bg-blue-500    
              "
            />

            <span className="text-sm text-slate-500">
              Malawi map
            </span>

          </div>

          <div className="text-sm text-slate-500">   
            Larger red markers indicate more cases.
          </div>

        </div>

      </div>

    </div>
  );
};

export default MapView;