"use client";

import { Mic, Loader2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import type { VoiceState } from "@/types";

interface VoiceButtonProps {
  state: VoiceState;
  onClick: () => void;
  disabled?: boolean;
}

const stateConfig = {
  ready: {
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
    animation: "animate-pulse-ready",
    icon: Mic,
    text: "Tap to speak",
  },
  listening: {
    gradient: "from-[#EF4444] to-[#DC2626]",
    animation: "animate-pulse-recording",
    icon: Mic,
    text: "Listening...",
  },
  processing: {
    gradient: "from-[#3B82F6] to-[#2563EB]",
    animation: "animate-pulse-processing",
    icon: Loader2,
    text: "Processing...",
  },
  success: {
    gradient: "from-[#22C55E] to-[#16A34A]",
    animation: "",
    icon: Check,
    text: "Done!",
  },
  error: {
    gradient: "from-[#EF4444] to-[#DC2626]",
    animation: "",
    icon: X,
    text: "Try again",
  },
};

export function VoiceButton({ state, onClick, disabled }: VoiceButtonProps) {
  const config = stateConfig[state];
  const Icon = config.icon;
  const isSpinning = state === "processing";

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        onClick={onClick}
        disabled={disabled || state === "processing"}
        className={`
          relative w-[120px] h-[120px] rounded-full
          bg-gradient-to-br ${config.gradient}
          flex items-center justify-center
          ${config.animation}
          cursor-pointer
          disabled:cursor-not-allowed disabled:opacity-70
          transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-white/20
        `}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
      >
        {/* Outer glow ring */}
        <div
          className={`
            absolute inset-[-4px] rounded-full
            bg-gradient-to-br ${config.gradient}
            opacity-30 blur-lg
          `}
        />

        {/* Icon */}
        <Icon
          className={`w-12 h-12 text-white relative z-10 ${
            isSpinning ? "animate-spin" : ""
          }`}
        />

        {/* Waveform indicator for listening state */}
        {state === "listening" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/50 rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </motion.button>

      {/* State text */}
      <motion.p
        className="text-[rgba(255,255,255,0.6)] text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={state}
      >
        {config.text}
      </motion.p>
    </div>
  );
}
