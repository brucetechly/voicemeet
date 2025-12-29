
import { CalendarEvent, Task } from './types';

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Morning Strategy Sync',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Deep Work: Project Apollo',
    startTime: new Date(Date.now() + 7200000).toISOString(),
    endTime: new Date(Date.now() + 14400000).toISOString(),
    type: 'block'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Finish Marketing Deck',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: 1,
    status: 'pending'
  },
  {
    id: 't2',
    title: 'Email Professor Smith',
    deadline: new Date(Date.now() + 3600000 * 5).toISOString(),
    priority: 3,
    status: 'pending'
  }
];

export const PRIORITY_COLORS = {
  1: 'bg-red-500/20 text-red-400 border-red-500/50',
  2: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  4: 'bg-lime-500/20 text-lime-400 border-lime-500/50',
  5: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
};
