
import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { PRIORITY_COLORS } from '../constants';
import { format } from 'date-fns';

interface TaskSidebarProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: () => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ tasks, onToggleTask, onDeleteTask, onAddTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <aside className="w-80 h-full border-l border-slate-800 bg-slate-900/50 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            Your Tasks
          </h2>
          <button 
            onClick={onAddTask}
            className="p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{completedCount} of {tasks.length} completed</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-700 mb-2" />
            <p className="text-slate-500 text-sm">No tasks yet.<br/>Speak them to add!</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <div 
              key={task.id}
              className={`group relative p-3 rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800/50 transition-all ${task.status === 'completed' ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium leading-tight truncate ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>
                      P{task.priority}
                    </span>
                    {task.deadline && (
                      <span className="text-[10px] text-slate-500 font-medium uppercase">
                        {format(new Date(task.deadline), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default TaskSidebar;
