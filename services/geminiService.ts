
import { GoogleGenAI, Type } from "@google/genai";
import { Intent, AIResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are VocaLendar, an intelligent voice-first scheduling assistant.
Your goal is to parse natural language inputs into structured scheduling intents.

Interpret requests relative to the current time provided in context.

Return ONLY a JSON object with this schema:
{
  "intent": "create_event" | "create_task" | "create_reminder" | "modify_event" | "delete_item" | "query_schedule" | "unclear",
  "confidence": number,
  "extracted_data": {
    "title": string,
    "start_time": string (ISO),
    "end_time": string (ISO),
    "deadline": string (ISO),
    "priority": number (1-5),
    "item_id": string (for deletion/modification),
    "query": string
  },
  "user_response": string (Natural, friendly confirmation),
  "reasoning": string
}

Guidelines:
- Create Event: If user mentions a specific time and duration (e.g., "Schedule meeting at 2pm for 1hr").
- Create Task: If user mentions a deadline or thing to do (e.g., "I need to finish deck by Friday").
- Delete Item: If user wants to remove or cancel something (e.g., "Cancel my 3pm").
- Query: If user asks what's on their plate (e.g., "What does my week look like?").
- Priority: 1 is highest (urgent), 5 is lowest.
- If timing is missing for a task, assume end of current day.`;

export async function processInput(input: string, context: { currentDateTime: string, existingEvents: any[], existingTasks: any[] }): Promise<AIResponse> {
  try {
    const prompt = `
      User Input: "${input}"
      Current Time: ${context.currentDateTime}
      Context:
      - Existing Events: ${JSON.stringify(context.existingEvents)}
      - Existing Tasks: ${JSON.stringify(context.existingTasks)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      intent: Intent.UNCLEAR,
      extracted_data: {},
      user_response: "I'm sorry, I had trouble processing that. Could you try again?",
      reasoning: "API error or parsing failure"
    };
  }
}
