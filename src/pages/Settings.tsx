import { getAuth, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ChevronRight, LogOut, Palette, Save, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { MobileNav } from "@/components/MobileNav";
import { db } from "@/config/firebase";
import { useGame } from "@/contexts/GameContext";

const Settings = () => {
  const { user, stats } = useGame();
  const [username, setUsername] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSaveUsername = async () => {
    if (username.trim() === "" || username === user.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        // Update Firebase Auth display name
        await updateProfile(auth.currentUser, {
          displayName: username,
        });

        // Update Firestore database
        const userRef = doc(db, "mainUser", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: username,
        });

        toast.success("Username updated successfully! 🎉");
        setIsEditing(false);

        // Optional: Reload to update context
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Username update error:", error);
      toast.error("Failed to update username. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-gradient-primary mb-2 text-3xl font-bold">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Customize your racing profile
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="racing-card-glow mb-6"
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="bg-card border-primary animate-pulse-glow flex h-20 w-20 items-center justify-center rounded-full border-2 text-4xl">
            {user.avatar}
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-sm">Your Avatar</p>
            <p className="font-display text-gradient-primary text-xl font-bold">
              Level {stats.level || 1} Racer
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Options */}
      <div className="space-y-3">
        {/* Username Change */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="racing-card"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">Username</h3>
              <p className="text-muted-foreground text-xs">
                Change your display name
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-card border-primary/20 focus:border-primary font-display w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                placeholder="Enter new username"
                maxLength={20}
              />
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveUsername}
                  disabled={isSaving}
                  className="btn-racing flex flex-1 items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setUsername(user.name);
                    setIsEditing(false);
                  }}
                  className="bg-muted hover:bg-muted/80 font-display rounded-xl px-6 py-3 font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="bg-card border-primary/20 hover:border-primary/40 group flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-colors"
            >
              <span className="font-display font-semibold">{username}</span>
              <ChevronRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
            </motion.button>
          )}
        </motion.div>

        {/* Avatar Customization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="racing-card hover:border-primary/40 group w-full transition-all"
            onClick={() => {
              // Placeholder - leads nowhere
              console.log("Avatar customization clicked");
            }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Palette className="text-accent h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display font-semibold">Customize Avatar</h3>
                <p className="text-muted-foreground text-xs">
                  Coming soon - unlock new avatars
                </p>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
            </div>
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="racing-card group w-full border-red-500/20 transition-all hover:border-red-500/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display font-semibold text-red-500">
                  Log Out
                </h3>
                <p className="text-muted-foreground text-xs">
                  Sign out to your account
                </p>
              </div>
              <ChevronRight className="text-muted-foreground h-5 w-5 transition-colors group-hover:text-red-500" />
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-muted-foreground text-xs">EcoRace v1.0.0</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Racing towards a greener future 🌱
        </p>
      </motion.div>
      <MobileNav />
    </div>
  );
};

export default Settings;
