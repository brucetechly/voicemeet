"use client";

import { Home, CheckSquare, Clock, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { id: "home", href: "/home", icon: Home, label: "Home" },
  { id: "tasks", href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { id: "history", href: "/history", icon: Clock, label: "History" },
  { id: "settings", href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="h-16 bg-[#1a1a1f] border-t border-[rgba(255,255,255,0.1)] flex items-center justify-around px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[rgba(139,92,246,0.1)] rounded-xl"
                transition={{ type: "spring", duration: 0.3 }}
              />
            )}
            <Icon
              className={`w-5 h-5 relative z-10 transition-colors ${
                isActive ? "text-[#8B5CF6]" : "text-[rgba(255,255,255,0.4)]"
              }`}
            />
            {isActive && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-[#8B5CF6] relative z-10"
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
