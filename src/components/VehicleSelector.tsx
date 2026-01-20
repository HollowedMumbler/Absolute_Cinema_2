import { motion } from 'framer-motion';
import { useGame, VehicleType } from '@/contexts/GameContext';
import { Lock } from 'lucide-react';

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
            onClick={() => !isLocked && setSelectedVehicle(vehicle.id as VehicleType)}
            className={`vehicle-card ${isSelected ? 'selected' : ''} ${isLocked ? 'opacity-50' : ''}`}
            disabled={isLocked}
          >
            <div className="text-center">
              <span className="text-3xl">{vehicle.icon}</span>
              <p className="mt-2 text-xs font-display font-semibold truncate">{vehicle.name}</p>
              <p className="text-xs text-muted-foreground mt-1">x{vehicle.ecoFactor}</p>
              {isLocked && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
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
