"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PromptMagicModalProps {
  suggestion: string;
  onAccept: () => void;
  onCancel: () => void;
}

const PromptMagicModal: React.FC<PromptMagicModalProps> = ({
  suggestion,
  onAccept,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Prompt Suggestion
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          We&apos;ve enhanced your prompt. Would you like to use this version?
        </p>
        <div className="bg-gray-100 p-4 rounded-md text-gray-800 text-sm mb-6">
          {suggestion}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4 inline-block mr-1" />
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Check className="w-4 h-4 inline-block mr-1" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptMagicModal;