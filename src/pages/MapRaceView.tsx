import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  Bike,
  Bus,
  Car,
  Footprints,
  MapPin,
  Navigation2,
  Play,
  Square,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { MobileNav } from "@/components/MobileNav.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { SAFE_ZONES } from "../../constants.ts";
import { TransportMode } from "../../types.ts";

const LIBRARIES = ["marker"];

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

interface SafeZoneMarker {
  lat: number;
  lng: number;
  title: string;
}

const MapRaceView: React.FC = () => {
  const [isRacing, setIsRacing] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [selectedMode, setSelectedMode] = useState<TransportMode>(
    TransportMode.BIKE,
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [safeZones, setSafeZones] = useState<SafeZoneMarker[]>([]);

  const [useFallback, setUseFallback] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: LIBRARIES as any, // Cast because of issue with the library's type definitions
  });

  const mapOptions = React.useMemo(
    () => ({
      styles: DARK_MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: false,
    }),
    [],
  );

  const center = React.useMemo(() => currentPosition, [currentPosition]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get initial location
  useEffect(() => {
    let isMounted = true;
    if (!isLoaded || useFallback) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return;

          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);

          // Generate safe zones around the initial user position
          setSafeZones([
            {
              lat: pos.lat + 0.003,
              lng: pos.lng + 0.003,
              title: "Safe Zone Alpha",
            },
            {
              lat: pos.lat - 0.002,
              lng: pos.lng + 0.004,
              title: "Safe Zone Beta",
            },
            {
              lat: pos.lat + 0.001,
              lng: pos.lng - 0.003,
              title: "Eco Charging Station",
            },
          ]);
        },
        (error) => {
          if (isMounted) {
            console.warn("Geolocation error, using fallback:", error);
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
    return () => {
      isMounted = false;
    };
  }, [isLoaded, useFallback]);

  // Track User Location
  useEffect(() => {
    if (!isLoaded || !navigator.geolocation || useFallback || !map) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(pos);

        if (isRacing) {
          map.panTo(pos);
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isRacing, isLoaded, useFallback, map]);

  // Effect to handle API load errors or invalid keys
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (loadError || !apiKey || apiKey.includes("placeholder")) {
      console.warn("Maps API load error or invalid key, using fallback.");
      setUseFallback(true);
    }
  }, [loadError]);

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

  if (!isLoaded)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-1/2">
        <Spinner className="inline-block size-4" />
        <span className="ml-2">Loading map please wait...</span>
      </div>
    );

  return (
    <div className="relative flex h-screen w-full flex-col bg-slate-900">
      <>
        {/* Map Rendering: Real or Fallback */}
        {useFallback && currentPosition === null ? (
          // --- Fallback Simulated Map ---
          <div className="animate-fade-in absolute inset-0 z-0 overflow-hidden opacity-80">
            <div
              className="relative h-full w-full bg-[#1a1f2e]"
              style={{
                backgroundImage:
                  "radial-gradient(#2d3748 1px, transparent 1px), radial-gradient(#2d3748 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                backgroundPosition: "0 0, 20px 20px",
              }}
            >
              {/* Simulated Roads */}
              <div className="absolute top-1/2 left-0 h-4 w-full -rotate-12 transform border-y-2 border-slate-600 bg-slate-700"></div>
              <div className="absolute top-0 left-1/3 h-full w-6 rotate-45 transform border-x-2 border-slate-600 bg-slate-700"></div>

              {/* Safe Zone Markers (From Constants) */}
              {SAFE_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className="group absolute flex cursor-pointer flex-col items-center transition-transform hover:scale-110"
                  style={{ top: `${zone.lat}%`, left: `${zone.lng}%` }}
                >
                  <div className="relative">
                    <div className="absolute -inset-2 animate-ping rounded-full bg-green-500/30"></div>
                    <div className="rounded-full border-2 border-white bg-green-500 p-2 text-slate-900 shadow-lg">
                      <MapPin size={20} fill="currentColor" />
                    </div>
                  </div>
                  <span className="mt-1 rounded border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    {zone.name}
                  </span>
                </div>
              ))}

              {/* User Puck */}
              <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-xl">
                  <Navigation2
                    size={14}
                    className="rotate-45 transform fill-white text-white"
                  />
                </div>
              </div>

              {/* Fallback Notice */}
              <div className="absolute top-4 left-4 rounded border border-yellow-500/50 bg-yellow-500/10 px-2 py-1 text-[10px] text-yellow-500">
                Simulated Mode
                {locationError
                  ? `: ${locationError}`
                  : " (Maps API Unavailable)"}
              </div>
            </div>
          </div>
        ) : (
          // --- Real Google Map ---
          <>
            <GoogleMap
              mapContainerClassName="absolute inset-0 z-0 h-full w-full"
              center={center as google.maps.LatLngLiteral}
              zoom={16}
              options={mapOptions}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {/* User Marker */}
              <Marker
                position={currentPosition as google.maps.LatLngLiteral}
                title="You"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-xl" />
              </Marker>

              {/* Safe Zone Markers */}
              {safeZones.map((zone) => (
                <Marker
                  key={zone.title}
                  position={zone}
                  title={zone.title}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: "#B6F25A",
                    fillOpacity: 0.9,
                    scale: 1.5,
                    strokeWeight: 1,
                    strokeColor: "#000",
                    labelOrigin: new google.maps.Point(12, 10),
                  }}
                  label={{
                    text: "★",
                    color: "black",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                />
              ))}
            </GoogleMap>
            {locationError && !useFallback && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
                <div className="rounded-xl border border-red-500 bg-red-500/20 p-4 text-center text-red-200 backdrop-blur-md">
                  <p className="font-bold">! GPS Signal Lost</p>
                  <p className="text-sm">{locationError}</p>
                </div>
              </div>
            )}
          </>
        )}
      </>

      {/* Top HUD */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 bg-gradient-to-b from-slate-900/90 to-transparent p-4 pt-8">
        <div className="flex items-start justify-between">
          <div className="rounded-lg border border-slate-700 bg-slate-800/90 p-2 px-4 shadow-xl backdrop-blur">
            <span className="block text-xs tracking-wider text-slate-400 uppercase">
              Speed
            </span>
            <span className="font-mono text-2xl font-bold text-green-400">
              {speed} <span className="text-sm text-slate-500">km/h</span>
            </span>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/90 p-2 px-4 text-right shadow-xl backdrop-blur">
            <span className="block text-xs tracking-wider text-slate-400 uppercase">
              Time
            </span>
            <span
              className={`font-mono text-2xl font-bold ${isRacing ? "text-white" : "text-slate-500"}`}
            >
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Transport Mode Selector (Only visible if not racing) */}
      {!isRacing && (
        <div className="pointer-events-auto absolute top-28 left-4 z-20 space-y-2">
          {[
            { mode: TransportMode.WALK, icon: Footprints },
            { mode: TransportMode.BIKE, icon: Bike },
            { mode: TransportMode.TRANSIT, icon: Bus },
            { mode: TransportMode.EV, icon: Car },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`flex items-center gap-2 rounded-full border p-2 pr-4 shadow-lg transition-all ${
                selectedMode === mode
                  ? "border-blue-400 bg-blue-600 text-white"
                  : "border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              <div
                className={`rounded-full p-1 ${selectedMode === mode ? "bg-white/20" : ""}`}
              >
                <Icon size={16} />
              </div>
              <span className="text-xs font-bold">{mode}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Control Deck */}
      <div className="pointer-events-auto absolute right-4 bottom-24 left-4 z-20">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">
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
                <span className="block h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                <span className="text-xs font-bold text-red-400 uppercase">
                  REC
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsRacing(!isRacing)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-black tracking-wide uppercase shadow-lg transition-transform active:scale-95 ${
              isRacing
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-slate-900 hover:bg-green-600"
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
      <MobileNav />
    </div>
  );
};

export default MapRaceView;
