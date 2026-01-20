import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGame } from '@/contexts/GameContext';

// Custom vehicle marker
const createVehicleIcon = (emoji: string) => {
  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Sample city track coordinates (simplified loop)
const trackCoordinates: [number, number][] = [
  [40.7128, -74.006],
  [40.7148, -74.004],
  [40.7168, -74.002],
  [40.7178, -74.006],
  [40.7168, -74.010],
  [40.7148, -74.012],
  [40.7128, -74.010],
  [40.7118, -74.008],
  [40.7128, -74.006],
];

function AnimatedVehicle({ position, icon }: { position: [number, number]; icon: string }) {
  return <Marker position={position} icon={createVehicleIcon(icon)} />;
}

function MapController() {
  const map = useMap();
  
  useEffect(() => {
    map.setView([40.7148, -74.006], 15);
  }, [map]);
  
  return null;
}

export function RaceTrack() {
  const { vehicles, selectedVehicle } = useGame();
  const [vehiclePosition, setVehiclePosition] = useState<[number, number]>(trackCoordinates[0]);
  const [positionIndex, setPositionIndex] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [lapTime, setLapTime] = useState(0);

  const currentVehicle = vehicles.find(v => v.id === selectedVehicle);

  useEffect(() => {
    if (!isRacing) return;

    const interval = setInterval(() => {
      setPositionIndex(prev => {
        const next = (prev + 1) % trackCoordinates.length;
        setVehiclePosition(trackCoordinates[next]);
        return next;
      });
      setLapTime(prev => prev + 0.1);
    }, 500);

    return () => clearInterval(interval);
  }, [isRacing]);

  const startRace = () => {
    setIsRacing(true);
    setLapTime(0);
    setPositionIndex(0);
    setVehiclePosition(trackCoordinates[0]);
  };

  const stopRace = () => {
    setIsRacing(false);
  };

  return (
    <div className="space-y-4">
      {/* Race Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="racing-card text-center py-3">
          <p className="text-xs text-muted-foreground uppercase">Lap Time</p>
          <p className="font-display font-bold text-xl text-primary">
            {lapTime.toFixed(1)}s
          </p>
        </div>
        <div className="racing-card text-center py-3">
          <p className="text-xs text-muted-foreground uppercase">Position</p>
          <p className="font-display font-bold text-xl text-accent">
            {Math.ceil((positionIndex / trackCoordinates.length) * 100)}%
          </p>
        </div>
        <div className="racing-card text-center py-3">
          <p className="text-xs text-muted-foreground uppercase">Eco Boost</p>
          <p className="font-display font-bold text-xl text-secondary">
            x{currentVehicle?.ecoFactor}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="racing-card p-0 overflow-hidden h-[300px] relative">
        <MapContainer
          center={[40.7148, -74.006]}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <MapController />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Polyline
            positions={trackCoordinates}
            pathOptions={{
              color: 'hsl(152, 82%, 38%)',
              weight: 4,
              opacity: 0.8,
            }}
          />
          <AnimatedVehicle 
            position={vehiclePosition} 
            icon={currentVehicle?.icon || '🚗'} 
          />
        </MapContainer>
        
        {/* Overlay UI */}
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={isRacing ? stopRace : startRace}
            className={`w-full btn-racing ${isRacing ? 'bg-destructive' : ''}`}
          >
            {isRacing ? '🛑 Stop Race' : '🏁 Start Race'}
          </motion.button>
        </div>
      </div>

      {/* Speed Lines Animation */}
      {isRacing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-1 justify-center"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1 w-8 bg-primary rounded-full"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scaleX: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.1 
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
