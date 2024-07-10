// ImageToTextForm.tsx
"use client";

import React, { useState } from "react";

interface ParsedQuestion {
  question: string;
  options: string[];
}

interface ImageToTextFormProps {
  onParsedData: (data: ParsedQuestion) => void;
}

export default function ImageToTextForm({
  onParsedData,
}: ImageToTextFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", event.target.files[0]);

      try {
        const response = await fetch("/api/imagetotext", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        onParsedData(data.parsedQuestion);
      } catch (error) {
        console.error("Error:", error);
        // You might want to handle this error in the UI
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mt-4 bg-gray-800 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg, image/png"
          className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-600 file:text-white
                     hover:file:bg-indigo-700
                     cursor-pointer"
        />
        {isLoading && <span className="text-white">Processing...</span>}
      </div>
    </div>
  );
}
