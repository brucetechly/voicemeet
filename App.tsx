
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Search, Settings, Bell, User, LayoutDashboard, Calendar as CalendarIcon, CheckSquare, Sparkles } from 'lucide-react';
import CalendarView from './components/CalendarView';
import TaskSidebar from './components/TaskSidebar';
import VoiceOverlay from './components/VoiceOverlay';
import { INITIAL_EVENTS, INITIAL_TASKS } from './constants';
import { CalendarEvent, Task, Intent } from './types';
import { processInput } from './services/geminiService';
import { addDays, subDays } from 'date-fns';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Persistence (Simulated)
  useEffect(() => {
    const saved = localStorage.getItem('vocalendar_data');
    if (saved) {
      const { events, tasks } = JSON.parse(saved);
      setEvents(events);
      setTasks(tasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vocalendar_data', JSON.stringify({ events, tasks }));
  }, [events, tasks]);

  const handleVoiceResult = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await processInput(text, {
        currentDateTime: new Date().toISOString(),
        existingEvents: events,
        existingTasks: tasks
      });

      setAiMessage(response.user_response);

      // Execute AI Logic
      if (response.intent === Intent.CREATE_EVENT) {
        const { title, start_time, end_time } = response.extracted_data;
        const newEvent: CalendarEvent = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          startTime: start_time,
          endTime: end_time || new Date(new Date(start_time).getTime() + 3600000).toISOString(),
          type: 'meeting'
        };
        setEvents(prev => [...prev, newEvent]);
      } else if (response.intent === Intent.CREATE_TASK) {
        const { title, deadline, priority } = response.extracted_data;
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          deadline,
          priority: (priority as any) || 3,
          status: 'pending'
        };
        setTasks(prev => [...prev, newTask]);
      } else if (response.intent === Intent.DELETE_ITEM) {
        // Simple logic for deletion by title match if ID isn't found
        const { item_id, title } = response.extracted_data;
        if (item_id) {
          setEvents(prev => prev.filter(e => e.id !== item_id));
          setTasks(prev => prev.filter(t => t.id !== item_id));
        } else if (title) {
          setEvents(prev => prev.filter(e => !e.title.toLowerCase().includes(title.toLowerCase())));
          setTasks(prev => prev.filter(t => !t.title.toLowerCase().includes(title.toLowerCase())));
        }
      }

      // Show AI response for a while then close overlay
      setTimeout(() => {
        setIsVoiceActive(false);
        setIsProcessing(false);
        setAiMessage(null);
      }, 3000);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-20 border-r border-slate-800 bg-slate-900/50 flex flex-col items-center py-8 gap-10">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col gap-6">
          <button className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-all">
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
            <CalendarIcon className="w-6 h-6" />
          </button>
          <button className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
            <CheckSquare className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-6">
          <button className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
            <Settings className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/user/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 min-w-[300px]">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Type a command or search..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVoiceResult((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <button 
              onClick={() => setIsVoiceActive(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <Mic className="w-4 h-4" />
              Voice Mode
            </button>
          </div>
        </header>

        {/* Dynamic AI Feedback Toast */}
        {aiMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm font-medium">{aiMessage}</p>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <CalendarView 
            events={events} 
            currentDate={currentDate}
            onPrevWeek={() => setCurrentDate(prev => subDays(prev, 7))}
            onNextWeek={() => setCurrentDate(prev => addDays(prev, 7))}
          />
          <TaskSidebar 
            tasks={tasks} 
            onToggleTask={toggleTaskStatus} 
            onDeleteTask={deleteTask}
            onAddTask={() => setIsVoiceActive(true)}
          />
        </div>
      </main>

      {/* Voice Assistant Overlay */}
      {isVoiceActive && (
        <VoiceOverlay 
          onResult={handleVoiceResult} 
          onClose={() => setIsVoiceActive(false)} 
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default App;
