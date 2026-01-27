import { motion } from "framer-motion";
import { Lock } from "lucide-react";

import { useGame, type VehicleType } from "@/contexts/GameContext";

export function VehicleSelector() {
  const { vehicles, selectedVehicle, setSelectedVehicle, stats } = useGame();

  return (
    <div className="grid grid-cols-3 gap-3">
      {vehicles.map((vehicle, index) => {
        const isSelected = selectedVehicle === vehicle.id;
        const isLocked = vehicle.unlockLevel > stats.level;

        return (
          <motion.button
            key={vehicle.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() =>
              !isLocked && setSelectedVehicle(vehicle.id as VehicleType)
            }
            className={`vehicle-card ${isSelected ? "selected" : ""} ${isLocked ? "opacity-50" : ""}`}
            disabled={isLocked}
          >
            <div className="text-center">
              <span className="text-3xl">{vehicle.icon}</span>
              <p className="font-display mt-2 truncate text-xs font-semibold">
                {vehicle.name}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                x{vehicle.ecoFactor}
              </p>
              {isLocked && (
                <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  <span>Lvl {vehicle.unlockLevel}</span>
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
