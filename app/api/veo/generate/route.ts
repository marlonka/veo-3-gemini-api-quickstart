import { NextResponse } from "next/server";
import { GoogleGenAI, VideoGenerationReferenceImage } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const form = await req.formData();

    const prompt = (form.get("prompt") as string) || "";
    const model =
      (form.get("model") as string) || "veo-3.1-generate-preview";
    const negativePrompt = (form.get("negativePrompt") as string) || undefined;
    const aspectRatio = (form.get("aspectRatio") as string) || undefined;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // --- Veo 3.1 Inputs ---
    const imageFile = form.get("imageFile") as File | null;
    const lastFrameFile = form.get("lastFrameFile") as File | null;
    const referenceImageFiles = form.getAll("referenceImageFiles") as File[];
    const videoFile = form.get("videoFile") as File | null;
    const imageBase64 = (form.get("imageBase64") as string) || undefined;
    const imageMimeType = (form.get("imageMimeType") as string) || undefined;

    // --- Prepare Inputs for SDK ---
    let image: { imageBytes: string; mimeType: string } | undefined;
    if (imageFile) {
      const buf = await imageFile.arrayBuffer();
      image = {
        imageBytes: Buffer.from(buf).toString("base64"),
        mimeType: imageFile.type,
      };
    } else if (imageBase64) {
      const cleaned = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;
      image = { imageBytes: cleaned, mimeType: imageMimeType || "image/png" };
    }

    let lastFrame: { imageBytes: string; mimeType: string } | undefined;
    if (lastFrameFile) {
      const buf = await lastFrameFile.arrayBuffer();
      lastFrame = {
        imageBytes: Buffer.from(buf).toString("base64"),
        mimeType: lastFrameFile.type,
      };
    }

    let referenceImages: VideoGenerationReferenceImage[] | undefined;
    if (referenceImageFiles.length > 0) {
      referenceImages = await Promise.all(
        referenceImageFiles.map(async (file) => ({
          image: {
            imageBytes: Buffer.from(await file.arrayBuffer()).toString(
              "base64"
            ),
            mimeType: file.type,
          },
          referenceType: "asset", // Or other types if you plan to support them
        }))
      );
    }

    let video: { videoBytes: string; mimeType: string } | undefined;
    if (videoFile) {
      const buf = await videoFile.arrayBuffer();
      video = {
        videoBytes: Buffer.from(buf).toString("base64"),
        mimeType: videoFile.type,
      };
    }

    // --- Call the API ---
    const operation = await ai.models.generateVideos({
      model,
      prompt,
      ...(image && { image }),
      ...(video && { video }),
      config: {
        ...(aspectRatio && { aspectRatio }),
        ...(negativePrompt && { negativePrompt }),
        ...(lastFrame && { lastFrame }),
        ...(referenceImages && { referenceImages }),
      },
    });

    const name = (operation as unknown as { name?: string }).name;
    return NextResponse.json({ name });
  } catch (error: unknown) {
    console.error("Error starting Veo generation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to start generation: ${errorMessage}` },
      { status: 500 }
    );
  }
}
