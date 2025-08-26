import { NextResponse } from "next/server";
import { GoogleGenAI, Part } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to convert a ReadableStream to a Buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = (formData.get("prompt") as string) || "";
    const imageFile = formData.get("imageFile") as File | null;
    const imageBase64 = formData.get("imageBase64") as string | null;
    const imageMimeType =
      (formData.get("imageMimeType") as string) || "image/png";

    const model = "gemini-2.5-flash-image-preview";

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const contents: Part[] = [{ text: prompt }];

    let imagePart: Part | null = null;
    if (imageFile) {
      const buffer = await streamToBuffer(imageFile.stream());
      imagePart = {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: imageFile.type,
        },
      };
    } else if (imageBase64) {
      imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      };
    }

    if (imagePart) {
      contents.push(imagePart);
    }

    const result = await ai.models.generateContent({
        model,
        contents,
        config: {
            // TODO: Figure out how to apply safetySettings
            // safetySettings: [
            //     {
            //       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            //       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            //     },
            // ],
        }
    });

    const imageResponsePart = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!imageResponsePart?.inlineData) {
      // Check for blocked response
      if (result.promptFeedback?.blockReason) {
        return NextResponse.json({ error: `Request was blocked: ${result.promptFeedback.blockReason}` }, { status: 400 });
      }
      return NextResponse.json({ error: "No image returned from model" }, { status: 500 });
    }

    return NextResponse.json({
      image: {
        imageBytes: imageResponsePart.inlineData.data,
        mimeType: imageResponsePart.inlineData.mimeType || "image/png",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to generate image. ${errorMessage}` },
      { status: 500 }
    );
  }
}
