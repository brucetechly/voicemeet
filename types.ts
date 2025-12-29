
export enum Intent {
  CREATE_EVENT = 'create_event',
  CREATE_TASK = 'create_task',
  CREATE_REMINDER = 'create_reminder',
  MODIFY_EVENT = 'modify_event',
  DELETE_ITEM = 'delete_item',
  QUERY_SCHEDULE = 'query_schedule',
  UNCLEAR = 'unclear'
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // ISO
  endTime: string; // ISO
  description?: string;
  type: 'meeting' | 'personal' | 'block';
}

export interface Task {
  id: string;
  title: string;
  deadline?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'pending' | 'completed';
  estimatedDuration?: number;
}

export interface AIResponse {
  intent: Intent;
  extracted_data: any;
  user_response: string;
  reasoning: string;
}

export interface AppState {
  events: CalendarEvent[];
  tasks: Task[];
}
