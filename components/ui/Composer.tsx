"use client";

import React from "react";
import {
  Upload,
  Wand2,
  Plus,
  ArrowRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import NextImage from "next/image";
import ModelSelector from "@/components/ui/ModelSelector";

interface ComposerProps {
  prompt: string;
  setPrompt: (value: string) => void;

  selectedModel: string;
  setSelectedModel: (model: string) => void;

  canStart: boolean;
  isGenerating: boolean;
  startGeneration: () => void;

  showImageTools: boolean;
  setShowImageTools: React.Dispatch<React.SetStateAction<boolean>>;

  geminiPrompt: string;
  setGeminiPrompt: (value: string) => void;

  geminiBusy: boolean;
  onPickImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generateWithGemini: () => Promise<void> | void;

  imageFile: File | null;
  generatedImage: string | null;

  resetAll: () => void;
}

const Composer: React.FC<ComposerProps> = ({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
  canStart,
  isGenerating,
  startGeneration,
  showImageTools,
  setShowImageTools,
  geminiPrompt,
  setGeminiPrompt,
  geminiBusy,
  onPickImage,
  generateWithGemini,
  imageFile,
  generatedImage,
  resetAll,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onPickImage({
        target: { files },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleReset = () => {
    resetAll();
    setShowImageTools(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[min(100%,48rem)] px-4">
      {showImageTools && (
        <div className="mb-3 rounded-xl backdrop-blur-sm bg-white/30 p-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div
                className={`rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors ${
                  isDragging
                    ? "bg-white/30 border-indigo-400"
                    : "bg-white/10 border-gray-300/70 hover:bg-white/30"
                }`}
                onClick={handleOpenFileDialog}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex items-center gap-3 text-slate-800/80">
                  <Upload className="w-5 h-5" />
                  <div>
                    <div className="font-medium">
                      Drag & drop an image, or click to upload
                    </div>
                    <div className="text-xs opacity-80">
                      PNG, JPG, WEBP up to 10MB
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  value={geminiPrompt}
                  onChange={(e) => setGeminiPrompt(e.target.value)}
                  placeholder="Describe an image to generate, or an edit for the image above..."
                  className="flex-1 rounded-md bg-white/10 border border-white/20 px-3 py-2 placeholder-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={generateWithGemini}
                  disabled={!geminiPrompt.trim() || geminiBusy}
                  aria-busy={geminiBusy}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
                    !geminiPrompt.trim() || geminiBusy
                      ? "opacity-60 cursor-not-allowed"
                      : "bg-black/80 hover:bg-black text-white cursor-pointer"
                  }`}
                >
                  {geminiBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  {geminiBusy ? "Generating" : "Generate with Gemini"}
                </button>
              </div>
            </div>
            <div className="flex items-start justify-start">
              <div className="mt-1">
                {imageFile && (
                  <div className="text-sm text-stone-700">
                    Selected: {imageFile.name}
                  </div>
                )}
                {!imageFile && generatedImage && (
                  <NextImage
                    src={generatedImage}
                    alt="Generated"
                    width={640}
                    height={360}
                    className="max-h-48 rounded-md border w-auto h-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="text-lg font-semibold text-slate-900/80 backdrop-blur-sm bg-white/30 px-3 py-1 rounded-lg border ">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            aria-pressed={showImageTools}
            onClick={() => setShowImageTools((s) => !s)}
            className={`inline-flex items-center gap-2 pl-3 pr-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
              showImageTools
                ? "bg-white/70  text-slate-900"
                : "bg-white/50  text-slate-900 hover:bg-white/50"
            }`}
            title="Image to Video"
          >
            <Plus className="w-4 h-4" />
            Image
          </button>

          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Generate a video with text and frames..."
          className="w-full bg-transparent focus:outline-none resize-none text-base font-normal placeholder-slate-800/60"
          rows={2}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="h-10 w-10 flex items-center justify-center bg-white/50 rounded-full hover:bg-white/70 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={startGeneration}
            disabled={!canStart || isGenerating}
            aria-busy={isGenerating}
            className={`h-10 w-10 flex items-center justify-center rounded-full text-white transition ${
              !canStart || isGenerating
                ? "bg-white/50 cursor-not-allowed"
                : "bg-white/50 hover:bg-white/70 cursor-pointer"
            }`}
            title="Generate"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Composer;
