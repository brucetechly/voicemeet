// Voice Button States
export type VoiceState = 'ready' | 'listening' | 'processing' | 'success' | 'error';

// Task Priority Levels
export type Priority = 1 | 2 | 3; // 1 = High, 2 = Medium, 3 = Low

// Task Status
export type TaskStatus = 'pending' | 'completed';

// Action Types from AI
export type ActionType = 'event' | 'task' | 'reminder';

// Task Interface
export interface Task {
  id: string;
  user_id: string;
  title: string;
  deadline: string | null;
  priority: Priority;
  status: TaskStatus;
  original_transcript: string | null;
  created_at: string;
}

// Reminder Interface
export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  remind_at: string;
  is_sent: boolean;
  google_event_id: string | null;
  created_at: string;
}

// History Item Interface
export interface HistoryItem {
  id: string;
  user_id: string;
  transcript: string;
  ai_response: AIResponse | null;
  actions_taken: ActionTaken[];
  created_at: string;
}

// User Preferences
export interface UserPreferences {
  voice_response_enabled: boolean;
  default_meeting_duration: number;
  default_morning_time: string;
  default_afternoon_time: string;
  default_evening_time: string;
  working_hours_start: string;
  working_hours_end: string;
  timezone: string;
}

// User Profile
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  google_tokens: GoogleTokens | null;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

// Google OAuth Tokens
export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  expiry: string;
}

// AI Action - Event
export interface EventAction {
  type: 'event';
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
}

// AI Action - Task
export interface TaskAction {
  type: 'task';
  title: string;
  deadline: string;
  priority: Priority;
}

// AI Action - Reminder
export interface ReminderAction {
  type: 'reminder';
  title: string;
  remind_at: string;
}

// Combined Action Type
export type AIAction = EventAction | TaskAction | ReminderAction;

// Conflict from AI
export interface Conflict {
  action_index: number;
  existing_event: string;
  conflict_time: string;
  suggestions: string[];
}

// AI Response
export interface AIResponse {
  actions: AIAction[];
  conflicts: Conflict[];
  response_text: string;
  clarification_needed: string | null;
}

// Action Taken (stored in history)
export interface ActionTaken {
  type: ActionType;
  id: string;
  title: string;
  google_event_id?: string;
}

// Process API Request
export interface ProcessRequest {
  audio?: string; // base64 encoded audio
  text?: string;  // alternative text input
}

// Process API Response
export interface ProcessResponse {
  transcript: string;
  actions: ActionTaken[];
  response_text: string;
  conflicts: Conflict[];
}

// Google Calendar Event (from API)
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}
