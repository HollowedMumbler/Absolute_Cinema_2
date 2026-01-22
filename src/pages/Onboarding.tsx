import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Car, Bike, Bus, Leaf, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Logo } from "../components/Logo";

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const navigate = useNavigate();

  const modes = [
    { id: "car", label: "Car", icon: Car, color: "bg-orange-500" },
    { id: "bike", label: "Bike", icon: Bike, color: "bg-green-500" },
    { id: "transit", label: "Public Transit", icon: Bus, color: "bg-blue-500" },
    { id: "walk", label: "Walking", icon: Leaf, color: "bg-emerald-500" },
  ];

  const avatars = [
    { id: "ev", label: "Electric Car", emoji: "⚡🚗", ecoFactor: 0.8 },
    { id: "bike", label: "E-Bike", emoji: "🚴", ecoFactor: 0.95 },
    { id: "bus", label: "Electric Bus", emoji: "🚌", ecoFactor: 0.85 },
    { id: "scooter", label: "E-Scooter", emoji: "🛴", ecoFactor: 0.9 },
  ];

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pb-28">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 text-center"
            >
              <div className="relative mb-6 flex justify-center">
                <Logo size="lg" />
              </div>

              <h1 className="text-4xl text-white">EcoLap Challenge</h1>
              <p className="text-lg text-slate-300">
                Race to a Greener Tomorrow!
              </p>
              <p className="px-4 text-sm text-slate-400">
                Transform your daily commute into an exciting race while saving
                the planet
              </p>

              <Button
                onClick={() => setStep(1)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-lg text-white hover:from-green-600 hover:to-emerald-700"
                size="lg"
              >
                Start Your Journey <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-2 text-2xl text-white">Welcome, Racer!</h2>
                <p className="mb-6 text-slate-300">What should we call you?</p>

                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-slate-600 bg-slate-700 py-6 text-lg text-white placeholder:text-slate-400"
                />

                <Button
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 py-6 text-white hover:from-green-600 hover:to-emerald-700"
                  size="lg"
                >
                  Next <ArrowRight className="ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-2 text-2xl text-white">
                  How do you usually commute?
                </h2>
                <p className="mb-6 text-slate-300">
                  This helps us personalize your experience
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {modes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <motion.button
                        key={mode.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`rounded-lg border-2 p-6 transition-all ${
                          selectedMode === mode.id
                            ? "border-green-500 bg-green-500/10"
                            : "border-slate-600 bg-slate-700"
                        }`}
                      >
                        <Icon
                          className={`mx-auto mb-2 h-12 w-12 ${
                            selectedMode === mode.id
                              ? "text-green-400"
                              : "text-slate-400"
                          }`}
                        />
                        <p className="text-sm text-white">{mode.label}</p>
                      </motion.button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedMode}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 py-6 text-white hover:from-green-600 hover:to-emerald-700"
                  size="lg"
                >
                  Next <ArrowRight className="ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-2 text-2xl text-white">
                  Choose Your Vehicle Avatar
                </h2>
                <p className="mb-6 text-slate-300">
                  This will represent you in races!
                </p>

                <div className="space-y-3">
                  {avatars.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                        selectedAvatar === avatar.id
                          ? "border-green-500 bg-green-500/10"
                          : "border-slate-600 bg-slate-700"
                      }`}
                    >
                      <div className="text-4xl">{avatar.emoji}</div>
                      <div className="flex-1 text-left">
                        <p className="text-white">{avatar.label}</p>
                        <p className="text-sm text-slate-400">
                          Eco Factor: {(avatar.ecoFactor * 100).toFixed(0)}%
                        </p>
                      </div>
                      {selectedAvatar === avatar.id && (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      )}
                    </motion.button>
                  ))}
                </div>

                <Button
                  onClick={() => setStep(4)}
                  disabled={!selectedAvatar}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 py-6 text-white hover:from-green-600 hover:to-emerald-700"
                  size="lg"
                >
                  Next <ArrowRight className="ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="border-slate-700 bg-slate-800 p-6">
                <div className="space-y-4 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mx-auto w-fit text-6xl"
                  >
                    🏆
                  </motion.div>

                  <h2 className="text-2xl text-white">You're All Set!</h2>
                  <p className="text-slate-300">
                    You've earned your first badge:{" "}
                    <span className="text-green-400">Rookie Racer</span>
                  </p>

                  <div className="space-y-2 rounded-lg bg-slate-700 p-4 text-left">
                    <p className="text-sm text-slate-300">
                      💡 <span className="text-white">Quick Tip:</span> Walking
                      reduces carbon emissions by 90% compared to driving!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4">
                      <p className="text-2xl text-green-400">+100</p>
                      <p className="text-xs text-slate-400">Points</p>
                    </div>
                    <div className="rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4">
                      <p className="text-2xl text-blue-400">Level 1</p>
                      <p className="text-xs text-slate-400">Rookie</p>
                    </div>
                    <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4">
                      <p className="text-2xl text-purple-400">0 kg</p>
                      <p className="text-xs text-slate-400">CO₂ Saved</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleComplete}
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 py-6 text-white hover:from-green-600 hover:to-emerald-700"
                    size="lg"
                  >
                    Start Racing! 🏁
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-green-500" : "w-2 bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

