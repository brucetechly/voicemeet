# VocaLendar V2: Ultra-Minimal Voice-First Scheduling Assistant
## Complete Project Meta Prompt

---

## 1. PROJECT OVERVIEW

### 1.1 Vision Statement
Build an ultra-minimal, voice-first scheduling assistant where the **only thing that matters is the microphone button**. Users speak naturally about their schedule, the AI handles everything, and events sync directly to Google Calendar. No complex dashboards. No internal calendar views. Just talk, and it's done.

### 1.2 Design Philosophy
**"One action, one screen, one purpose."**

Inspired by modern crypto swap interfaces — dark, focused, dramatic lighting, all attention drawn to the primary action. The UI should feel like talking to a personal assistant, not using a calendar app.

### 1.3 Core Problem Statement
- Manual calendar entry is high-friction
- Existing calendar apps are feature-bloated
- Users want to dump their thoughts and have it sorted
- Setting reminders and organizing tasks takes too much time

### 1.4 Solution
A web app with:
- **One big microphone button** as the hero element
- Voice input that captures natural speech/rambling
- AI that parses, prioritizes, and schedules automatically
- Direct sync to Google Calendar (source of truth)
- Optional AI voice response (toggle-able)
- Minimal secondary views for tasks and settings

### 1.5 Target User
- Busy professionals/students who think out loud
- People who avoid calendars because they're too complex
- Users who want a "brain dump → organized schedule" experience
- Anyone who prefers speaking over typing

---

## 2. USER EXPERIENCE FLOW

### 2.1 Primary Flow (Happy Path)

```
1. User opens app
   → Sees big glowing microphone button
   → Ambient background glow draws focus to center

2. User clicks/taps microphone
   → Button pulses red
   → "Listening..." text appears
   → Audio waveform visualization

3. User speaks naturally:
   "Hey so I need to meet Ahmed on Tuesday around 2pm,
   and finish the Odoo deck by Thursday, oh and remind
   me to email Professor Faris tomorrow morning"

4. User stops speaking (or clicks to stop)
   → Button changes to processing state (blue glow)
   → "Processing..." text
   → Brief loading animation

5. AI processes and responds
   → Success state (green glow)
   → Shows summary card of what was created:
     ✓ Meeting with Ahmed — Tue 2:00 PM (added to Google Calendar)
     ✓ Task: Finish Odoo deck — Due Thursday
     ✓ Reminder: Email Professor Faris — Tomorrow 9:00 AM

6. Optional: AI voice reads back confirmation
   "Got it. I've scheduled your meeting with Ahmed for Tuesday
   at 2pm, added the Odoo deck to your tasks due Thursday,
   and set a reminder for tomorrow morning about Professor Faris."

7. Card fades after 5 seconds, returns to ready state
```

### 2.2 States & Transitions

| State | Visual | Button | Background Glow |
|-------|--------|--------|-----------------|
| **Ready** | "Tap to speak" | Purple/violet, subtle pulse | Soft purple ambient |
| **Listening** | "Listening..." + waveform | Red, active pulse | Red pulsing glow |
| **Processing** | "Processing..." + spinner | Blue, rotating | Blue rotating glow |
| **Success** | Summary card | Green checkmark | Green glow |
| **Error** | Error message | Red with retry | Red static glow |

### 2.3 Secondary Views

**Tasks Tab:**
- Simple list of tasks extracted by AI
- Each task shows: title, deadline, priority badge
- Checkbox to mark complete
- Swipe to delete (mobile)
- No creation UI — tasks only come from voice

**History Tab:**
- Recent voice commands and what was created
- Useful for reviewing what you said
- Can undo/delete recent actions

**Settings Tab:**
- Connect Google Calendar (OAuth)
- Toggle: AI voice response on/off
- Voice: Select AI voice (if enabled)
- Default reminder time (e.g., "morning" = 9am)
- Working hours preference
- Disconnect account / Sign out

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Voice Input System

#### Recording
- Single tap to start recording
- Single tap to stop, OR auto-stop after 3 seconds of silence
- Visual waveform showing audio input
- Maximum recording length: 2 minutes
- Support for continuous rambling/natural speech

#### Transcription
- Use OpenAI Whisper API for speech-to-text
- Handle accents and natural speech patterns
- Support multiple languages (stretch goal)
- Latency target: < 2 seconds after recording stops

### 3.2 AI Reasoning Engine

#### Input Processing
The AI receives:
- Transcribed text from voice input
- Current date/time in user's timezone
- User's existing Google Calendar events (next 14 days)
- User's existing tasks
- User's preferences (working hours, default times)

#### Intent Extraction
From a single voice input, AI must extract multiple intents:
- **Events**: Meetings, calls, appointments with specific times
- **Tasks**: Things to do with deadlines but flexible timing
- **Reminders**: Time-triggered notifications

#### Smart Defaults
When information is missing, AI applies smart defaults:
- "Tuesday" with no time → Use user's default meeting time (e.g., 10am)
- "tomorrow morning" → 9:00 AM
- "end of week" → Friday 5:00 PM
- "meet Ahmed" with no duration → 30 minutes (default)
- Task with no deadline → Suggest "end of today" or ask

#### Conflict Handling
- Check Google Calendar for conflicts
- If conflict exists, suggest alternatives:
  - "Tuesday 2pm is blocked. How about 3pm or Wednesday 2pm?"
- User can respond with voice to resolve

### 3.3 Google Calendar Integration

#### Authentication
- OAuth 2.0 flow with Google
- Request scopes: calendar.events, calendar.readonly
- Secure token storage (encrypted in database)
- Auto-refresh tokens before expiry

#### Sync Operations
All events are written directly to Google Calendar:
- **Create event**: Title, start time, end time, description
- **Create reminder**: Using Google Calendar's reminder feature OR separate reminder system
- **Read events**: For conflict detection and context
- **No internal calendar storage** — Google Calendar is the source of truth

#### Event Formatting
When creating events, include:
```
Title: [Extracted title]
Time: [Parsed datetime]
Duration: [Extracted or default 30min]
Description: "Created by VocaLendar: [original voice transcript]"
```

### 3.4 Task Management

#### Task Properties
- Title (extracted from voice)
- Deadline (extracted or inferred)
- Priority (1-3: High, Medium, Low)
- Status (pending, completed)
- Created timestamp
- Original transcript

#### Storage
Tasks are stored in local database (Supabase) — not in Google Calendar.
Tasks appear in the Tasks tab only.

#### Priority Logic
AI assigns priority based on:
- Explicit cues: "urgent", "important", "ASAP" → High
- Deadline proximity: Due within 24 hours → High
- Default: Medium

### 3.5 Reminder System

#### Reminder Types
- **Time-based**: "remind me at 5pm"
- **Relative**: "remind me tomorrow morning"
- **Pre-event**: "remind me 30 minutes before the meeting"

#### Delivery
- Browser push notifications (primary)
- Optional: Create as Google Calendar event with notification
- In-app notification center (secondary)

### 3.6 AI Voice Response (Optional Feature)

#### Toggle
- User can enable/disable in settings
- When enabled, AI speaks the confirmation

#### Implementation
- Use Web Speech API (free, built into browser)
- OR use ElevenLabs/OpenAI TTS for higher quality (paid)
- Keep responses concise (< 15 seconds)

#### Response Format
```
"Got it. [Summary of actions taken]. Anything else?"
```

---

## 4. TECHNICAL ARCHITECTURE

### 4.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐      │
│    │                    MAIN VIEW                         │      │
│    │                                                     │      │
│    │              ┌─────────────────┐                    │      │
│    │              │                 │                    │      │
│    │              │   🎤 RECORD     │  ← Big button      │      │
│    │              │                 │                    │      │
│    │              └─────────────────┘                    │      │
│    │                                                     │      │
│    │              [ Result Card ]                        │      │
│    │                                                     │      │
│    └─────────────────────────────────────────────────────┘      │
│                                                                 │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│    │   Home   │ │  Tasks   │ │ History  │ │ Settings │         │
│    └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐      │
│    │  Audio Recording (Web Audio API + MediaRecorder)    │      │
│    └─────────────────────────────────────────────────────┘      │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ HTTPS (Audio blob + context)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER (API)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐      │
│    │                 /api/process                         │      │
│    │                                                     │      │
│    │   1. Receive audio blob                             │      │
│    │   2. Transcribe with Whisper                        │      │
│    │   3. Fetch user's calendar context                  │      │
│    │   4. Send to Claude for reasoning                   │      │
│    │   5. Execute actions (create events, tasks)         │      │
│    │   6. Return summary to client                       │      │
│    │                                                     │      │
│    └─────────────────────────────────────────────────────┘      │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│    │  Whisper API │  │  Claude API  │  │ Google Cal   │         │
│    │  (OpenAI)    │  │ (Anthropic)  │  │    API       │         │
│    └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────────────┐      ┌─────────────────────┐         │
│    │      Supabase       │      │   Google Calendar   │         │
│    │                     │      │   (External)        │         │
│    │  • Users            │      │                     │         │
│    │  • Tasks            │      │  • Events (source   │         │
│    │  • Reminders        │      │    of truth)        │         │
│    │  • History          │      │  • Reminders        │         │
│    │  • OAuth tokens     │      │                     │         │
│    │  • Preferences      │      │                     │         │
│    │                     │      │                     │         │
│    └─────────────────────┘      └─────────────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Frontend** | Next.js 14 (App Router) | Fast, modern, great DX |
| **Styling** | Tailwind CSS | Rapid styling, dark mode easy |
| **Animations** | Framer Motion | Smooth micro-interactions |
| **Voice Recording** | Web Audio API + MediaRecorder | Native, no library |
| **Speech-to-Text** | OpenAI Whisper API | Best accuracy |
| **AI Reasoning** | Claude API (claude-sonnet-4-20250514) | Best reasoning for scheduling |
| **Text-to-Speech** | Web Speech API / ElevenLabs | Browser native or premium |
| **Backend** | Next.js API Routes | Unified codebase |
| **Database** | Supabase (PostgreSQL) | Managed, auth included |
| **Auth** | Supabase Auth + Google OAuth | Handles tokens |
| **Calendar** | Google Calendar API v3 | Primary integration |
| **Hosting** | Vercel | Zero-config deployment |
| **Notifications** | Web Push API | Browser native |

### 4.3 Database Schema

```sql
-- Users (extends Supabase auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  google_tokens JSONB,  -- { access_token, refresh_token, expiry }
  preferences JSONB DEFAULT '{
    "voice_response_enabled": false,
    "default_meeting_duration": 30,
    "default_morning_time": "09:00",
    "default_afternoon_time": "14:00",
    "default_evening_time": "18:00",
    "working_hours_start": "09:00",
    "working_hours_end": "18:00",
    "timezone": "Asia/Dubai"
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks (internal storage)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  priority INTEGER DEFAULT 2 CHECK (priority >= 1 AND priority <= 3),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  original_transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  remind_at TIMESTAMPTZ NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  google_event_id TEXT,  -- If synced to Google Calendar
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interaction history
CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  ai_response JSONB,  -- What the AI extracted and created
  actions_taken JSONB,  -- [ { type: 'event', id: '...', title: '...' }, ... ]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_user ON tasks(user_id, status);
CREATE INDEX idx_reminders_pending ON reminders(user_id, remind_at) WHERE NOT is_sent;
CREATE INDEX idx_history_user ON history(user_id, created_at DESC);
```

### 4.4 API Endpoints

```
Authentication:
  GET  /api/auth/google           → Initiate Google OAuth
  GET  /api/auth/callback         → Handle OAuth callback
  POST /api/auth/logout           → Sign out

Main Processing:
  POST /api/process               → Main voice/text processing endpoint
       Body: { audio: base64 } OR { text: string }
       Returns: {
         transcript: string,
         actions: [
           { type: 'event', title, datetime, google_event_id },
           { type: 'task', title, deadline, priority },
           { type: 'reminder', title, remind_at }
         ],
         response_text: string,  // For TTS
         conflicts: []           // Any scheduling conflicts
       }

Tasks:
  GET    /api/tasks               → List user's tasks
  PATCH  /api/tasks/:id           → Update task (complete, edit)
  DELETE /api/tasks/:id           → Delete task

History:
  GET    /api/history             → Get interaction history
  DELETE /api/history/:id         → Delete history item (and undo actions)

User:
  GET    /api/user/preferences    → Get preferences
  PATCH  /api/user/preferences    → Update preferences
  DELETE /api/user                → Delete account and data
```

---

## 5. AI REASONING ENGINE

### 5.1 System Prompt for Claude

```markdown
You are a voice-first scheduling assistant. Users speak naturally (often rambling) about their schedule, and you extract structured actions.

## Your Role
1. Parse natural, conversational speech into scheduling intents
2. Extract multiple actions from a single voice input
3. Apply smart defaults for missing information
4. Detect potential conflicts with existing calendar
5. Generate a concise, friendly confirmation message

## Context You Receive
- Transcribed voice input
- Current datetime and user's timezone
- User's Google Calendar events (next 14 days)
- User's existing tasks
- User's preferences (working hours, default times)

## Output Format
Respond with valid JSON only:
```json
{
  "actions": [
    {
      "type": "event",
      "title": "Meeting with Ahmed",
      "start_time": "2025-01-02T14:00:00+04:00",
      "end_time": "2025-01-02T14:30:00+04:00",
      "description": "Optional details"
    },
    {
      "type": "task",
      "title": "Finish Odoo deck",
      "deadline": "2025-01-03T17:00:00+04:00",
      "priority": 1
    },
    {
      "type": "reminder",
      "title": "Email Professor Faris",
      "remind_at": "2025-01-01T09:00:00+04:00"
    }
  ],
  "conflicts": [
    {
      "action_index": 0,
      "existing_event": "Team standup",
      "conflict_time": "2025-01-02T14:00:00+04:00",
      "suggestions": ["2025-01-02T15:00:00+04:00", "2025-01-03T14:00:00+04:00"]
    }
  ],
  "response_text": "Got it! I've scheduled your meeting with Ahmed for Tuesday at 2pm, added the Odoo deck to your tasks due Thursday, and set a reminder for tomorrow morning about Professor Faris.",
  "clarification_needed": null
}
```

## Smart Defaults
- "Tuesday" with no time → 10:00 AM (user's default_morning_time)
- "tomorrow morning" → 09:00 AM
- "tomorrow afternoon" → 14:00 PM  
- "tomorrow evening" → 18:00 PM
- "end of week" → Friday, end of working hours
- "next week" → Monday of next week
- Meeting with no duration → 30 minutes
- Task with no deadline → End of today, priority 2

## Priority Levels
- 1 (High): "urgent", "important", "ASAP", "critical", due within 24h
- 2 (Medium): Default, normal tasks
- 3 (Low): "whenever", "low priority", "if I have time"

## Handling Ambiguity
If critical information is missing and cannot be defaulted:
```json
{
  "actions": [],
  "conflicts": [],
  "response_text": "",
  "clarification_needed": "I heard you want to meet with Ahmed, but I didn't catch when. What day and time works?"
}
```

## Examples

### Input 1:
Transcript: "I need to call mom tomorrow and also schedule a meeting with the team on Friday at 3"
Current: 2025-01-01T10:00:00+04:00

Output:
```json
{
  "actions": [
    {
      "type": "reminder",
      "title": "Call mom",
      "remind_at": "2025-01-02T10:00:00+04:00"
    },
    {
      "type": "event",
      "title": "Team meeting",
      "start_time": "2025-01-03T15:00:00+04:00",
      "end_time": "2025-01-03T15:30:00+04:00"
    }
  ],
  "conflicts": [],
  "response_text": "Done! I'll remind you to call mom tomorrow, and I've scheduled the team meeting for Friday at 3pm.",
  "clarification_needed": null
}
```

### Input 2:
Transcript: "uh so I have this deck I need to finish by Thursday and it's pretty important, also Ahmed wants to meet Tuesday afternoon"
Current: 2025-01-01T10:00:00+04:00

Output:
```json
{
  "actions": [
    {
      "type": "task",
      "title": "Finish deck",
      "deadline": "2025-01-03T17:00:00+04:00",
      "priority": 1
    },
    {
      "type": "event",
      "title": "Meeting with Ahmed",
      "start_time": "2025-01-02T14:00:00+04:00",
      "end_time": "2025-01-02T14:30:00+04:00"
    }
  ],
  "conflicts": [],
  "response_text": "Got it! Added 'Finish deck' as a high-priority task due Thursday, and scheduled your meeting with Ahmed for Tuesday at 2pm.",
  "clarification_needed": null
}
```
```

### 5.2 Processing Pipeline

```
1. RECEIVE AUDIO
   └─→ Audio blob from client (webm/mp3)

2. TRANSCRIBE
   └─→ Send to Whisper API
   └─→ Receive text transcript

3. GATHER CONTEXT
   ├─→ Fetch user preferences from Supabase
   ├─→ Fetch Google Calendar events (next 14 days)
   └─→ Fetch existing tasks

4. BUILD PROMPT
   ├─→ System prompt (above)
   ├─→ Current datetime in user's timezone
   ├─→ Calendar events as context
   ├─→ Existing tasks as context
   └─→ User's transcript

5. CALL CLAUDE
   └─→ Send prompt, receive JSON response

6. VALIDATE RESPONSE
   ├─→ Parse JSON
   ├─→ Validate datetime formats
   └─→ Check for required fields

7. EXECUTE ACTIONS
   ├─→ For each event: Create in Google Calendar
   ├─→ For each task: Create in Supabase
   ├─→ For each reminder: Create in Supabase + optionally Google Calendar
   └─→ Log to history table

8. RETURN TO CLIENT
   └─→ { transcript, actions (with IDs), response_text, conflicts }

9. CLIENT SPEAKS RESPONSE (if enabled)
   └─→ Web Speech API reads response_text
```

---

## 6. USER INTERFACE SPECIFICATIONS

### 6.1 Design System

#### Colors (Dark Theme)
```css
/* Background */
--bg-primary: #0a0a0a;      /* Main background */
--bg-card: rgba(20, 20, 25, 0.8);  /* Card background with transparency */
--bg-elevated: #1a1a1f;     /* Elevated surfaces */

/* Accent Colors (Glow States) */
--accent-ready: #8B5CF6;    /* Purple - idle/ready */
--accent-recording: #EF4444; /* Red - recording */
--accent-processing: #3B82F6; /* Blue - processing */
--accent-success: #22C55E;   /* Green - success */
--accent-error: #EF4444;     /* Red - error */

/* Text */
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.6);
--text-muted: rgba(255, 255, 255, 0.4);

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.1);
--border-accent: rgba(139, 92, 246, 0.5);

/* Priority Colors */
--priority-high: #EF4444;
--priority-medium: #F59E0B;
--priority-low: #6B7280;
```

#### Typography
```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px - labels */
--text-sm: 0.875rem;   /* 14px - secondary */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - emphasis */
--text-xl: 1.25rem;    /* 20px - headings */
--text-2xl: 1.5rem;    /* 24px - large headings */
```

#### Spacing
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

### 6.2 Main View Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [ Ambient Glow Background ]                  │
│                                                                 │
│                                                                 │
│                         VOCALENDAR                              │
│                    Your voice, your schedule                    │
│                                                                 │
│                                                                 │
│                    ╭───────────────────╮                        │
│                    │                   │                        │
│                    │                   │                        │
│                    │        🎤         │   ← 120px button       │
│                    │                   │                        │
│                    │                   │                        │
│                    ╰───────────────────╯                        │
│                                                                 │
│                       Tap to speak                              │
│                                                                 │
│                                                                 │
│              ┌─────────────────────────────────┐                │
│              │                                 │                │
│              │      [ Result Card ]            │  ← Appears     │
│              │      (appears after process)    │    after       │
│              │                                 │    speaking    │
│              └─────────────────────────────────┘                │
│                                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ○ Home      ○ Tasks      ○ History      ○ Settings           │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Component Specifications

#### Microphone Button
```
Size: 120px × 120px
Border radius: 50% (circle)
Background: Gradient based on state
Border: 2px solid with glow
Shadow: 0 0 60px [accent-color] (outer glow)

States:
- Ready: Purple gradient, subtle pulse animation
- Recording: Red gradient, active pulse animation, waveform inside
- Processing: Blue gradient, rotating spinner
- Success: Green gradient, checkmark icon
- Error: Red gradient, X icon

Interaction:
- Tap once to start recording
- Tap again to stop recording
- Voice Activity Detection auto-stops after 3s silence
```

#### Result Card
```
Width: 100% (max 400px)
Background: --bg-card with backdrop blur
Border: 1px solid --border-subtle
Border radius: 16px
Padding: 24px

Content:
- List of actions taken (icon + title + time/deadline)
- Each action has a small colored indicator
- Fade in animation on appear
- Auto-dismiss after 8 seconds (with progress bar)
- Tap to dismiss early
```

#### Bottom Navigation
```
Height: 64px
Background: --bg-elevated
Border-top: 1px solid --border-subtle

Items:
- Home (mic icon) - Main recording view
- Tasks (checkbox icon) - Task list
- History (clock icon) - Past commands
- Settings (gear icon) - Preferences

Active state: Accent color + label visible
Inactive: Muted color, icon only
```

### 6.4 Tasks View

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tasks                                         [ + Add Task ]   │
│                                                (voice only)     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ○  Finish Odoo deck                                     │    │
│  │    🔴 High • Due Thursday                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ○  Review presentation slides                           │    │
│  │    🟡 Medium • Due Friday                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ✓  Email professor (completed)                          │    │
│  │    Completed today                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│                                                                 │
│                    No more tasks 🎉                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ○ Home      ● Tasks      ○ History      ○ Settings           │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Settings View

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Settings                                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ACCOUNT                                                │    │
│  │                                                         │    │
│  │  Connected as                                           │    │
│  │  bejan@example.com                    [ Disconnect ]    │    │
│  │                                                         │    │
│  │  Google Calendar                                        │    │
│  │  ✓ Connected                          [ Reconnect ]     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  VOICE                                                  │    │
│  │                                                         │    │
│  │  AI Voice Response                                      │    │
│  │  Speak confirmations aloud             [ Toggle ON ]    │    │
│  │                                                         │    │
│  │  Voice                                                  │    │
│  │  [ Default (Browser) ▼ ]                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  DEFAULTS                                               │    │
│  │                                                         │    │
│  │  Default meeting duration                               │    │
│  │  [ 30 minutes ▼ ]                                       │    │
│  │                                                         │    │
│  │  Morning means                                          │    │
│  │  [ 9:00 AM ▼ ]                                          │    │
│  │                                                         │    │
│  │  Timezone                                               │    │
│  │  [ Asia/Dubai (GMT+4) ▼ ]                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ○ Home      ○ Tasks      ○ History      ● Settings           │
└─────────────────────────────────────────────────────────────────┘
```

### 6.6 Animations & Micro-interactions

#### Button Pulse (Ready State)
```css
@keyframes pulse-ready {
  0%, 100% { 
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 60px rgba(139, 92, 246, 0.6);
    transform: scale(1.02);
  }
}
```

#### Recording Pulse
```css
@keyframes pulse-recording {
  0%, 100% { 
    box-shadow: 0 0 40px rgba(239, 68, 68, 0.5);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 80px rgba(239, 68, 68, 0.8);
    transform: scale(1.05);
  }
}
```

#### Ambient Glow Transition
```css
.ambient-glow {
  transition: background 0.5s ease, transform 0.5s ease;
}
```

#### Result Card Entrance
```css
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 7. DEVELOPMENT PHASES

### Phase 1: Core Voice Flow (Week 1)
**Goal: Voice → Transcription → AI → Response working**

- [ ] Next.js project setup with Tailwind
- [ ] Main view UI with microphone button
- [ ] Audio recording with Web Audio API
- [ ] Whisper API integration for transcription
- [ ] Claude API integration for parsing
- [ ] Display result card with parsed actions
- [ ] Basic state management (Zustand)

**Deliverable:** User can tap, speak, and see what the AI understood.

### Phase 2: Google Calendar Integration (Week 2)
**Goal: Events actually appear in Google Calendar**

- [ ] Supabase setup (auth, database)
- [ ] Google OAuth flow
- [ ] Google Calendar API integration
- [ ] Create events from AI output
- [ ] Read events for conflict detection
- [ ] Store user preferences

**Deliverable:** User speaks "meeting Tuesday 2pm" and it appears in their Google Calendar.

### Phase 3: Tasks & Polish (Week 3)
**Goal: Full feature set, polished UI**

- [ ] Task management (create, complete, delete)
- [ ] Tasks view UI
- [ ] History view UI
- [ ] Settings view UI
- [ ] AI voice response (Web Speech API)
- [ ] Reminder system with notifications
- [ ] Error handling and edge cases
- [ ] Mobile responsiveness

**Deliverable:** Complete MVP ready for personal use.

### Phase 4: Beta Ready (Week 4)
**Goal: Ready for other users**

- [ ] Onboarding flow
- [ ] Landing page
- [ ] Performance optimization
- [ ] Security review
- [ ] Analytics (Plausible/Vercel Analytics)
- [ ] Feedback mechanism
- [ ] Documentation

**Deliverable:** Ready to share with beta testers.

---

## 8. PROJECT STRUCTURE

```
vocalendar/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx           # Main app layout with nav
│   │   ├── page.tsx             # Home - voice recording
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── google/route.ts
│   │   │   └── callback/route.ts
│   │   ├── process/route.ts     # Main processing endpoint
│   │   ├── tasks/
│   │   │   ├── route.ts         # GET, POST
│   │   │   └── [id]/route.ts    # PATCH, DELETE
│   │   ├── history/route.ts
│   │   └── user/
│   │       └── preferences/route.ts
│   ├── layout.tsx
│   ├── page.tsx                 # Landing/marketing page
│   └── globals.css
├── components/
│   ├── ui/                      # shadcn components
│   ├── VoiceButton.tsx
│   ├── ResultCard.tsx
│   ├── AmbientGlow.tsx
│   ├── TaskItem.tsx
│   ├── HistoryItem.tsx
│   └── BottomNav.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── google/
│   │   └── calendar.ts
│   ├── ai/
│   │   ├── whisper.ts
│   │   └── claude.ts
│   ├── audio/
│   │   └── recorder.ts
│   └── utils.ts
├── hooks/
│   ├── useVoiceRecording.ts
│   ├── useSpeechSynthesis.ts
│   └── useAuth.ts
├── stores/
│   └── appStore.ts
├── types/
│   └── index.ts
└── public/
    └── icons/
```

---

## 9. SETUP INSTRUCTIONS

### 9.1 Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Google Cloud Console project
- OpenAI API key (for Whisper)
- Anthropic API key (for Claude)

### 9.2 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# AI APIs
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 9.3 Initial Setup

```bash
# Create project
npx create-next-app@latest vocalendar --typescript --tailwind --app --src-dir=false
cd vocalendar

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install googleapis
npm install openai
npm install @anthropic-ai/sdk
npm install zustand
npm install framer-motion
npm install lucide-react
npm install date-fns

# Setup shadcn
npx shadcn@latest init
npx shadcn@latest add button card toast

# Run development server
npm run dev
```

### 9.4 Google Cloud Setup

1. Go to Google Cloud Console
2. Create new project "VocaLendar"
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback`
6. Copy Client ID and Client Secret to `.env`

### 9.5 Supabase Setup

1. Create new Supabase project
2. Run SQL schema from Section 4.3
3. Configure Google OAuth provider in Supabase Auth settings
4. Copy project URL and keys to `.env`

---

## 10. SUCCESS METRICS

### MVP Success
- [ ] Voice recording works reliably in Chrome/Safari
- [ ] AI correctly parses 80%+ of natural speech inputs
- [ ] Events appear in Google Calendar within 5 seconds
- [ ] Tasks are stored and displayed correctly
- [ ] App works on mobile browsers
- [ ] End-to-end flow completes without errors

### User Validation
- Use app personally for 1 week
- Create 50+ events via voice
- Measure time-to-schedule vs manual entry
- Track parsing accuracy
- Note pain points and edge cases

---

## 11. FUTURE ENHANCEMENTS (Post-MVP)

### V1.1
- Undo last action via voice ("undo that")
- Edit events via voice ("move the Ahmed meeting to 3pm")
- Multiple calendar support
- Recurring events ("every Monday at 10am")

### V1.2
- Native mobile app (React Native or Expo)
- Apple Calendar / Outlook integration
- Widgets for quick recording

### V2.0
- Proactive suggestions ("You usually have standup Monday mornings...")
- Natural language queries ("When am I free this week?")
- Team/shared calendars
- Meeting links auto-generation (Zoom/Meet)

---

*Document Version: 2.0*  
*Codename: VocaLendar Minimal*  
*Design Philosophy: One button, one purpose*

