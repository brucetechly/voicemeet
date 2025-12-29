
import React from 'react';
import { CalendarEvent } from '../types';
import { format, startOfWeek, addDays, isSameDay, startOfHour, addHours } from 'date-fns';
import { Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, currentDate, onPrevWeek, onNextWeek }) => {
  const weekStart = startOfWeek(currentDate);
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventStyle = (event: CalendarEvent) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const hourStart = start.getHours() + start.getMinutes() / 60;
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    // Position relative to 8 AM
    const top = (hourStart - 8) * 80; // 80px per hour
    const height = duration * 80;

    const colors = {
      meeting: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200',
      personal: 'bg-purple-500/20 border-purple-500/50 text-purple-200',
      block: 'bg-slate-500/20 border-slate-500/50 text-slate-400'
    };

    return {
      top: `${top}px`,
      height: `${height}px`,
      className: `absolute inset-x-1 p-2 rounded-lg border-l-4 shadow-lg backdrop-blur-sm overflow-hidden text-xs transition-transform hover:scale-[1.02] cursor-pointer z-10 ${colors[event.type]}`
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-slate-500">Weekly Schedule Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPrevWeek} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5"/></button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors">Today</button>
          <button onClick={onNextWeek} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[800px] flex flex-col h-full">
          {/* Week Days Header */}
          <div className="flex sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 ml-16">
            {weekDays.map(day => (
              <div key={day.toString()} className="flex-1 py-4 text-center border-l border-slate-800/50 first:border-l-0">
                <span className="block text-xs uppercase font-semibold text-slate-500 mb-1">{format(day, 'EEE')}</span>
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${isSameDay(day, new Date()) ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-300'}`}>
                  {format(day, 'd')}
                </span>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="flex flex-1 relative min-h-[1200px]">
            {/* Time Labels */}
            <div className="w-16 sticky left-0 z-20 bg-slate-950/80 backdrop-blur-md">
              {hours.map(hour => (
                <div key={hour} className="h-20 flex items-start justify-end pr-3 pt-[-6px]">
                  <span className="text-[10px] font-medium text-slate-600 uppercase tracking-tighter">
                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Event Columns */}
            {weekDays.map(day => (
              <div key={day.toString()} className="flex-1 border-l border-slate-800/30 relative">
                {/* Hour Lines */}
                {hours.map(hour => (
                  <div key={hour} className="h-20 border-b border-slate-800/20" />
                ))}
                
                {/* Events for this day */}
                {events.filter(e => isSameDay(new Date(e.startTime), day)).map(event => {
                  const style = getEventStyle(event);
                  return (
                    <div key={event.id} style={{ top: style.top, height: style.height }} className={style.className}>
                      <div className="font-bold mb-1 line-clamp-1">{event.title}</div>
                      <div className="flex items-center gap-1 opacity-70">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(event.startTime), 'HH:mm')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
