"use client";

import { FormContentProps } from "@/types/FormContent";
import { useState } from "react";
import { createProblem } from "../_lib/actions";

export default function Form({ content }: { content: FormContentProps }) {
  //   console.log(content);

  const [options, setOptions] = useState<{ [key: number]: string }>({ 1: "" });

  const addOption = () => {
    const newKey = Object.keys(options).length + 1;
    setOptions({ ...options, [newKey]: "" });
    console.log(options);
  };

  const removeOption = (keyToRemove: number) => {
    if (Object.keys(options).length > 1) {
      const newOptions = Object.entries(options).reduce(
        (acc, [key, value], index) => {
          if (Number(key) !== keyToRemove) {
            acc[index + 1] = value;
          }
          return acc;
        },
        {} as { [key: number]: string }
      );

      setOptions(newOptions);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        action={createProblem}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create New Question
        </h2>

        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Question
          </label>
          <input
            type="text"
            id="question"
            name="question"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="subjectID"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
          </label>
          <select
            id="subjectID"
            name="subjectID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                Subject {num}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options
          </label>
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="flex mb-2">
              <input
                type="text"
                name={`option${key}`}
                value={value}
                onChange={(e) =>
                  setOptions({ ...options, [key]: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Option ${key}`}
                required
              />
              <button
                type="button"
                onClick={() => removeOption(Number(key))}
                className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Option
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correct Answer
          </label>
          <select
            id="answer"
            name="answer"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.keys(options).map((key) => (
              <option key={key} value={key}>
                Option {key}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Question
        </button>
      </form>
    </div>
  );
}
