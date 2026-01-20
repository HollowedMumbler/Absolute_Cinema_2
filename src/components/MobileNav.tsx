import { NavLink, useLocation } from "react-router";
import { Home, Map, Trophy, Target, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/race", icon: Map, label: "Race" },
  { path: "/challenges", icon: Target, label: "Challenges" },
  { path: "/leaderboard", icon: Trophy, label: "Ranks" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="mobile-nav safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <motion.div whileTap={{ scale: 0.9 }} className="relative">
              <Icon className="w-6 h-6" />
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
