import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebase";

import { MobileNav } from "@/components/MobileNav";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/contexts/GameContext";
import Challenges from "@/pages/Challenges";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Race from "@/pages/MapRaceView";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { Onboarding } from "@/pages/Onboarding";
import Login from "@/pages/Login";

const queryClient = new QueryClient();

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'onboarding' | 'app'>('login');

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // No user authenticated - show login
        setCurrentScreen('login');
        setLoading(false);
      } else {
        // User is authenticated - check if they completed onboarding
        try {
          const userDoc = await getDoc(doc(db, "mainUser", firebaseUser.uid));
          
          if (userDoc.exists()) {
            // User completed onboarding - show main app
            setCurrentScreen('app');
          } else {
            // User needs to complete onboarding
            setCurrentScreen('onboarding');
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setCurrentScreen('onboarding');
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (screen: string) => {
    if (screen === 'onboarding') {
      setCurrentScreen('onboarding');
    } else if (screen === 'app') {
      setCurrentScreen('app');
    }
  };

  const handleOnboardingComplete = (userData: any) => {
    console.log("Onboarding completed:", userData);
    setCurrentScreen('app');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show Login screen
  if (currentScreen === 'login') {
    return <Login onNavigate={handleNavigate} />;
  }

  // Show Onboarding screen (without GameProvider)
  if (currentScreen === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show main app (WITH GameProvider)
  return (
    <GameProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/race" element={<Race />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MobileNav />
      </div>
    </GameProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;