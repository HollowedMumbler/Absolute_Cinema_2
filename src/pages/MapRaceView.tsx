import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  Bike,
  Footprints,
  Bus,
  Car,
  MapPin,
  Navigation2,
} from "lucide-react";
import { TransportMode } from "../../types.ts";
import { SAFE_ZONES } from "../../constants";
import { Loader } from "@googlemaps/js-api-loader";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const MapRaceView: React.FC = () => {
  const [isRacing, setIsRacing] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [selectedMode, setSelectedMode] = useState<TransportMode>(
    TransportMode.BIKE,
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const userMarkerRef = useRef<any | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Timer and Speed Simulation
  useEffect(() => {
    let interval: any;
    if (isRacing) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        setSpeed(
          Math.floor(Math.random() * 10) +
            (selectedMode === TransportMode.EV ? 30 : 15),
        );
      }, 1000);
    } else {
      setSpeed(0);
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isRacing, selectedMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;

      // Check for missing or placeholder keys
      if (
        !apiKey ||
        apiKey === "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImMwZDkxMmZjMmYzNTQ4Zjg5NjlmZTYwOTQ3ZWU4MGE3IiwiaCI6Im11cm11cjY0In0=" ||
        apiKey.includes("placeholder")
      ) {
        console.warn("Invalid or missing API Key, switching to fallback map.");
        if (isMounted) setUseFallback(true);
        return;
      }

      // Handle Global Auth Failure (Invalid Key from Google's side)
      (window as any).gm_authFailure = () => {
        console.error("Google Maps Auth Failure - Switching to fallback");
        if (isMounted) setUseFallback(true);
      };

      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
      });

      try {
        const google = await loader.load();

        if (!isMounted) return;

        // Get initial location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (!isMounted) return;
              const { latitude, longitude } = position.coords;
              const pos = { lat: latitude, lng: longitude };

              // Check if mapRef exists and we are not already in fallback mode
              if (mapRef.current) {
                try {
                  mapInstanceRef.current = new google.maps.Map(mapRef.current, {
                    center: pos,
                    zoom: 16,
                    styles: DARK_MAP_STYLE,
                    disableDefaultUI: true,
                    zoomControl: false,
                  });

                  // User Marker
                  userMarkerRef.current = new google.maps.Marker({
                    position: pos,
                    map: mapInstanceRef.current,
                    title: "You",
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: "#4ADE80",
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                    },
                  });

                  // Generate some "Safe Zones" around the user for the demo
                  const generateSafeZone = (
                    offsetLat: number,
                    offsetLng: number,
                    title: string,
                  ) => {
                    new google.maps.Marker({
                      position: {
                        lat: latitude + offsetLat,
                        lng: longitude + offsetLng,
                      },
                      map: mapInstanceRef.current,
                      title: title,
                      icon: {
                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z", // Simple pin path
                        fillColor: "#FACC15", // Yellow
                        fillOpacity: 0.9,
                        scale: 1.5,
                        strokeWeight: 1,
                        strokeColor: "#000",
                      },
                      label: {
                        text: "★",
                        color: "black",
                        fontSize: "10px",
                        fontWeight: "bold",
                      },
                    });
                  };

                  generateSafeZone(0.003, 0.003, "Safe Zone Alpha");
                  generateSafeZone(-0.002, 0.004, "Safe Zone Beta");
                  generateSafeZone(0.001, -0.003, "Eco Charging Station");
                } catch (mapError) {
                  console.error("Error creating map instance:", mapError);
                  if (isMounted) setUseFallback(true);
                }
              }
            },
            (error) => {
              console.warn("Geolocation error, using fallback:", error);
              if (isMounted) {
                setLocationError(
                  "Unable to retrieve your location. Switching to simulated map.",
                );
                setUseFallback(true);
              }
            },
          );
        } else {
          if (isMounted) {
            setLocationError(
              "Geolocation not supported. Switching to simulated map.",
            );
            setUseFallback(true);
          }
        }
      } catch (e) {
        console.error("Error loading Google Maps Loader:", e);
        if (isMounted) setUseFallback(true);
      }
    };

    if (!useFallback) {
      initMap();
    }

    return () => {
      isMounted = false;
      // Cleanup global handler
      (window as any).gm_authFailure = () => {};
    };
  }, [useFallback]);

  // Track User Location (Only if not in fallback)
  useEffect(() => {
    if (
      !useFallback &&
      navigator.geolocation &&
      mapInstanceRef.current &&
      userMarkerRef.current
    ) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };

          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(pos);
          }

          if (isRacing && mapInstanceRef.current) {
            mapInstanceRef.current.panTo(pos);
          }
        },
        (error) => console.error(error),
        { enableHighAccuracy: true },
      );
    }
    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isRacing, useFallback]);

  return (
    <div className="h-screen w-full relative bg-slate-900 flex flex-col">
      {/* Map Rendering: Real or Fallback */}
      {useFallback ? (
        // --- Fallback Simulated Map ---
        <div className="absolute inset-0 z-0 overflow-hidden opacity-80 animate-fade-in">
          <div
            className="w-full h-full bg-[#1a1f2e] relative"
            style={{
              backgroundImage:
                "radial-gradient(#2d3748 1px, transparent 1px), radial-gradient(#2d3748 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0, 20px 20px",
            }}
          >
            {/* Simulated Roads */}
            <div className="absolute top-1/2 left-0 w-full h-4 bg-slate-700 transform -rotate-12 border-y-2 border-slate-600"></div>
            <div className="absolute top-0 left-1/3 h-full w-6 bg-slate-700 transform rotate-45 border-x-2 border-slate-600"></div>

            {/* Safe Zone Markers (From Constants) */}
            {SAFE_ZONES.map((zone) => (
              <div
                key={zone.id}
                className="absolute flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
                style={{ top: `${zone.lat}%`, left: `${zone.lng}%` }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-green-500/30 rounded-full animate-ping"></div>
                  <div className="bg-green-500 text-slate-900 p-2 rounded-full border-2 border-white shadow-lg">
                    <MapPin size={20} fill="currentColor" />
                  </div>
                </div>
                <span className="mt-1 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold border border-slate-700">
                  {zone.name}
                </span>
              </div>
            ))}

            {/* User Puck */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <Navigation2
                  size={14}
                  className="text-white fill-white transform rotate-45"
                />
              </div>
            </div>

            {/* Fallback Notice */}
            <div className="absolute top-4 left-4 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[10px] px-2 py-1 rounded">
              Simulated Mode (Maps API Unavailable)
            </div>
          </div>
        </div>
      ) : (
        // --- Real Google Map ---
        <>
          <div ref={mapRef} className="absolute inset-0 z-0 h-full w-full" />
          {locationError && !useFallback && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl text-center backdrop-blur-md">
                <p className="font-bold">! GPS Signal Lost</p>
                <p className="text-sm">{locationError}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-8 bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="bg-slate-800/90 backdrop-blur border border-slate-700 rounded-lg p-2 px-4 shadow-xl">
            <span className="text-xs text-slate-400 block uppercase tracking-wider">
              Speed
            </span>
            <span className="text-2xl font-mono font-bold text-green-400">
              {speed} <span className="text-sm text-slate-500">km/h</span>
            </span>
          </div>

          <div className="bg-slate-800/90 backdrop-blur border border-slate-700 rounded-lg p-2 px-4 shadow-xl text-right">
            <span className="text-xs text-slate-400 block uppercase tracking-wider">
              Time
            </span>
            <span
              className={`text-2xl font-mono font-bold ${isRacing ? "text-white" : "text-slate-500"}`}
            >
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Transport Mode Selector (Only visible if not racing) */}
      {!isRacing && (
        <div className="absolute top-28 left-4 z-20 space-y-2 pointer-events-auto">
          {[
            { mode: TransportMode.WALK, icon: Footprints },
            { mode: TransportMode.BIKE, icon: Bike },
            { mode: TransportMode.TRANSIT, icon: Bus },
            { mode: TransportMode.EV, icon: Car },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`flex items-center gap-2 p-2 pr-4 rounded-full shadow-lg border transition-all ${
                selectedMode === mode
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              <div
                className={`p-1 rounded-full ${selectedMode === mode ? "bg-white/20" : ""}`}
              >
                <Icon size={16} />
              </div>
              <span className="text-xs font-bold">{mode}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Control Deck */}
      <div className="absolute bottom-24 left-4 right-4 z-20 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold">
                {isRacing ? "Race in Progress" : "Ready to Race?"}
              </h3>
              <p className="text-xs text-slate-400">
                {isRacing
                  ? "Logging eco-miles..."
                  : `Selected Mode: ${selectedMode}`}
              </p>
            </div>
            {isRacing && (
              <div className="flex items-center gap-1">
                <span className="block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-red-400 font-bold uppercase">
                  REC
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsRacing(!isRacing)}
            className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
              isRacing
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-slate-900"
            }`}
          >
            {isRacing ? (
              <>
                <Square size={20} fill="currentColor" /> End Race
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" /> Start Engine
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapRaceView;

