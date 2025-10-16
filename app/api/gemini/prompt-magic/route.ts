import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

const PROMPT_MAGIC_SYSTEM_INSTRUCTION = `You are an expert prompt engineer for a generative AI video model. Your task is to take a user's simple or vague prompt and rewrite it into a "power prompt" that is more descriptive, vivid, and cinematic.

Follow these best practices:
1.  **Be Specific and Detailed:** Add concrete details about the subject, the setting, the action, and the mood. Instead of "a car driving," write "A vintage red convertible speeds down a winding coastal highway at sunset."
2.  **Use Strong Verbs and Adjectives:** Use evocative language to create a strong visual.
3.  **Incorporate Camera Work:** Suggest camera movements (e.g., "a sweeping drone shot," "a close-up on the character's eyes," "a slow-motion pan").
4.  **Define the Style:** Specify the artistic style (e.g., "cinematic, film noir style," "3D cartoon animation," "hyperrealistic macro photo").
5.  **Describe the Atmosphere:** Set the mood with lighting and color cues (e.g., "bathed in the eerie glow of a green neon sign," "warm, golden hour light," "cool blue tones").
6.  **Add Sound Cues (Optional but good):** If relevant, include sound effects or dialogue in quotes. (e.g., SFX: "tires screeching," Dialogue: "He whispered, 'It was you all along.'").

Your goal is to transform the user's initial idea into a prompt that will generate a visually stunning and compelling video. Do not reply with anything other than the rewritten prompt itself.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: PROMPT_MAGIC_SYSTEM_INSTRUCTION,
    });
    const suggestedPrompt = result.response.text();

    return NextResponse.json({ suggestedPrompt });
  } catch (error: unknown) {
    console.error("Error in Prompt Magic endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}