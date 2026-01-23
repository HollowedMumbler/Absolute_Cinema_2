import { motion } from "framer-motion";
import { User, LogOut, Palette, ChevronRight, Save } from "lucide-react";
import { useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useGame();
  const [username, setUsername] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
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
          displayName: username
        });

        // Update Firestore database
        const userRef = doc(db, "mainUser", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: username
        });

        toast.success("Username updated successfully! 🎉");
        setIsEditing(false);
        
        // Optional: Reload to update context
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Username update error:', error);
      toast.error("Failed to update username. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-display font-bold text-gradient-primary mb-2">
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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center text-4xl animate-pulse-glow">
            {user.avatar}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Your Avatar</p>
            <p className="font-display font-bold text-xl text-gradient-primary">
              Level {user.level || 1} Racer
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">Username</h3>
              <p className="text-xs text-muted-foreground">
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
                className="w-full px-4 py-3 bg-card border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors font-display"
                placeholder="Enter new username"
                maxLength={20}
              />
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveUsername}
                  disabled={isSaving}
                  className="flex-1 btn-racing flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setUsername(user.name);
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-display font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-3 bg-card border border-primary/20 rounded-xl hover:border-primary/40 transition-colors flex items-center justify-between group"
            >
              <span className="font-display font-semibold">{username}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
            className="w-full racing-card hover:border-primary/40 transition-all group"
            onClick={() => {
              // Placeholder - leads nowhere
              console.log("Avatar customization clicked");
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display font-semibold">
                  Customize Avatar
                </h3>
                <p className="text-xs text-muted-foreground">
                  Coming soon - unlock new avatars
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
            className="w-full racing-card border-red-500/20 hover:border-red-500/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display font-semibold text-red-500">
                  Log Out
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
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
        <p className="text-xs text-muted-foreground">
          EcoRace v1.0.0
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Racing towards a greener future 🌱
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;