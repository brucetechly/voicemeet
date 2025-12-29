"use client";

import { motion } from "framer-motion";
import { Calendar, CheckSquare, Bell, X } from "lucide-react";
import type { ActionTaken } from "@/types";

interface ResultCardProps {
  actions: ActionTaken[];
  responseText: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const actionIcons = {
  event: Calendar,
  task: CheckSquare,
  reminder: Bell,
};

const actionColors = {
  event: "text-[#3B82F6]",
  task: "text-[#22C55E]",
  reminder: "text-[#F59E0B]",
};

export function ResultCard({
  actions,
  responseText,
  onDismiss,
  autoDismissMs = 8000,
}: ResultCardProps) {
  return (
    <motion.div
      className="w-full max-w-[400px] bg-[rgba(20,20,25,0.9)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Done!</h3>
        <button
          onClick={onDismiss}
          className="p-1 text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Actions list */}
      <div className="space-y-3 mb-4">
        {actions.map((action, index) => {
          const Icon = actionIcons[action.type];
          const colorClass = actionColors[action.type];

          return (
            <motion.div
              key={action.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-lg bg-[rgba(255,255,255,0.05)]`}>
                <Icon className={`w-4 h-4 ${colorClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{action.title}</p>
                <p className="text-[rgba(255,255,255,0.4)] text-xs capitalize">
                  {action.type} created
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
            </motion.div>
          );
        })}
      </div>

      {/* AI Response */}
      {responseText && (
        <p className="text-[rgba(255,255,255,0.6)] text-sm italic border-t border-[rgba(255,255,255,0.1)] pt-4">
          "{responseText}"
        </p>
      )}

      {/* Auto-dismiss progress bar */}
      <motion.div
        className="mt-4 h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-[#8B5CF6]"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
          onAnimationComplete={onDismiss}
        />
      </motion.div>
    </motion.div>
  );
}
