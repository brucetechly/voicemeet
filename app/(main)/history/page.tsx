"use client";

import { Clock, Calendar, CheckSquare, Bell, Trash2 } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";

const actionIcons = {
  event: Calendar,
  task: CheckSquare,
  reminder: Bell,
};

export default function HistoryPage() {
  const { history } = useAppStore();

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          Recent voice commands
        </p>
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="w-12 h-12 text-[rgba(255,255,255,0.2)] mb-4" />
          <h3 className="text-white font-medium mb-2">No history yet</h3>
          <p className="text-[rgba(255,255,255,0.4)] text-sm">
            Your voice commands will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4"
            >
              {/* Transcript */}
              <p className="text-white text-sm mb-3">"{item.transcript}"</p>

              {/* Actions taken */}
              {item.actions_taken && item.actions_taken.length > 0 && (
                <div className="space-y-2 mb-3">
                  {item.actions_taken.map((action, i) => {
                    const Icon = actionIcons[action.type];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[rgba(255,255,255,0.6)] text-xs"
                      >
                        <Icon className="w-3 h-3" />
                        <span>{action.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center justify-between">
                <span className="text-[rgba(255,255,255,0.3)] text-xs">
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <button className="p-1 text-[rgba(255,255,255,0.3)] hover:text-[#EF4444] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
