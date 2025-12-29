"use client";

import { motion } from "framer-motion";
import type { VoiceState } from "@/types";

interface AmbientGlowProps {
  state: VoiceState;
}

const glowColors = {
  ready: "rgba(139, 92, 246, 0.15)",
  listening: "rgba(239, 68, 68, 0.2)",
  processing: "rgba(59, 130, 246, 0.15)",
  success: "rgba(34, 197, 94, 0.15)",
  error: "rgba(239, 68, 68, 0.15)",
};

export function AmbientGlow({ state }: AmbientGlowProps) {
  const color = glowColors[state];

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: `radial-gradient(circle at 50% 40%, ${color} 0%, transparent 70%)`,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  );
}
