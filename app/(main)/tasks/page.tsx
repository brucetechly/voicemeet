"use client";

import { CheckCircle2, Circle, AlertCircle, Mic } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";

const priorityColors = {
  1: "bg-[#EF4444] text-white",
  2: "bg-[#F59E0B] text-white",
  3: "bg-[#6B7280] text-white",
};

const priorityLabels = {
  1: "High",
  2: "Medium",
  3: "Low",
};

export default function TasksPage() {
  const { tasks, updateTask, removeTask } = useAppStore();

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const toggleTask = (id: string, currentStatus: string) => {
    updateTask(id, {
      status: currentStatus === "pending" ? "completed" : "pending",
    });
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-[rgba(255,255,255,0.4)] text-sm">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        <Link
          href="/home"
          className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] rounded-full text-white text-sm font-medium hover:bg-[#7C3AED] transition-colors"
        >
          <Mic className="w-4 h-4" />
          Add Task
        </Link>
      </div>

      {/* Tasks list */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-12 h-12 text-[rgba(255,255,255,0.2)] mb-4" />
          <h3 className="text-white font-medium mb-2">No tasks yet</h3>
          <p className="text-[rgba(255,255,255,0.4)] text-sm mb-6">
            Use voice to add your first task
          </p>
          <Link
            href="/home"
            className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] rounded-full text-white font-medium hover:bg-[#7C3AED] transition-colors"
          >
            <Mic className="w-4 h-4" />
            Speak to Add
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Pending tasks */}
          {pendingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id, task.status)}
                  className="mt-0.5 text-[rgba(255,255,255,0.4)] hover:text-[#8B5CF6] transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                    {task.deadline && (
                      <span className="text-xs text-[rgba(255,255,255,0.4)]">
                        Due {format(new Date(task.deadline), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="text-[rgba(255,255,255,0.4)] text-sm font-medium">
                  Completed
                </h3>
              </div>
              {completedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[rgba(20,20,25,0.4)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id, task.status)}
                      className="mt-0.5 text-[#22C55E]"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[rgba(255,255,255,0.5)] font-medium line-through">
                        {task.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
