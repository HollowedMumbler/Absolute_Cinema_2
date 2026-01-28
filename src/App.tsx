import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/contexts/GameContext";
import Challenges from "@/pages/Challenges";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Login from "@/pages/Login";
import Race from "@/pages/MapRaceView";
import NotFound from "@/pages/NotFound";
import { Onboarding } from "@/pages/Onboarding";
import Profile from "@/pages/Profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <div className="bg-background min-h-screen">
              <Routes>
                <Route
                  index
                  element={
                    <ProtectedRoutes>
                      <Dashboard />
                    </ProtectedRoutes>
                  }
                />

                <Route path="/sign-in" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/race" element={<Race />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoutes>
                      <Settings />
                    </ProtectedRoutes>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
};

export default App;
