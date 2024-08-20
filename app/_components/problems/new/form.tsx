"use client";

import { useState, useRef } from "react";
import { createProblem } from "../../../_lib/actions";
import ImageToTextForm from "./ImageToTextForm";

export default function Form({ subjects }: any) {
  const [options, setOptions] = useState<{ [key: number]: string }>({ 1: "" });
  const [question, setQuestion] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<number>(
    subjects[0]?.id || 0
  );
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Store selected answers
  const formRef = useRef<HTMLFormElement>(null);

  const handleParsedData = (data: { question: string; options: string[] }) => {
    setQuestion(data.question);
    const newOptions = data.options.reduce((acc, option, index) => {
      acc[index + 1] = option;
      return acc;
    }, {} as { [key: number]: string });
    setOptions(newOptions);
  };

  const addOption = () => {
    const newKey = Object.keys(options).length + 1;
    setOptions({ ...options, [newKey]: "" });
  };

  const removeOption = (keyToRemove: number) => {
    if (Object.keys(options).length > 1) {
      const newOptions = Object.entries(options)
        .filter(([key]) => Number(key) !== keyToRemove)
        .reduce((acc, [_, value], index) => {
          acc[index + 1] = value;
          return acc;
        }, {} as { [key: number]: string });

      setOptions(newOptions);
      setSelectedAnswers(
        selectedAnswers.filter((answer) => answer !== keyToRemove)
      );
    } else if (Object.keys(options).length === 1) {
      setOptions({ 1: "" });
      setSelectedAnswers([]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const questionProps = {
      question: formData.get("question") as string,
      options: {} as { [key: number]: string },
      answer: selectedAnswers, // Use the array of selected answers
      subjectID: parseInt(formData.get("subjectID") as string, 10),
    };

    Array.from(formData.keys()).forEach((key) => {
      if (key.startsWith("option")) {
        const value = formData.get(key) as string;
        if (value) {
          const optionNumber = parseInt(key.replace("option", ""), 10);
          questionProps.options[optionNumber] = value;
        }
      }
    });

    if (
      !questionProps.question ||
      Object.keys(questionProps.options).length === 0 ||
      questionProps.answer.length === 0 || // Ensure there's at least one correct answer
      isNaN(questionProps.subjectID)
    ) {
      console.error("Invalid form data");
      return;
    }

    const result = await createProblem(questionProps);
    if (result.success) {
      if (formRef.current) {
        formRef.current.reset();
        const subjectInput = formRef.current.elements.namedItem(
          "subjectID"
        ) as HTMLSelectElement;
        if (subjectInput) {
          subjectInput.value = selectedSubject.toString();
        }
      }
      setOptions({ 1: "" });
      setQuestion("");
      setSelectedAnswers([]); // Reset selected answers
    } else {
      console.error("Failed to create question");
    }
  };

  const handleOptionsPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedText = e.target.value;
    const lines = pastedText.split("\n");

    const parsedOptions: { [key: number]: string } = {};
    let optionIndex = 1;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const match = trimmedLine.match(
          /^(?:(?:\()?([A-E\d])(?:\)|\.)?|[A-E\d][\s.)-]*)(.*)$/
        );
        if (match) {
          parsedOptions[optionIndex] = match[2].trim();
        } else {
          parsedOptions[optionIndex] = trimmedLine;
        }
        optionIndex++;
      }
    });

    if (Object.keys(parsedOptions).length > 0) {
      setOptions(parsedOptions);
    }
  };

  const toggleSelectedAnswer = (optionKey: number) => {
    setSelectedAnswers((prev) =>
      prev.includes(optionKey)
        ? prev.filter((key) => key !== optionKey)
        : [...prev, optionKey]
    );
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <form
        ref={formRef}
        action={handleSubmit}
        className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
          Create New Question
        </h2>

        <div className="mb-4">
          <ImageToTextForm onParsedData={handleParsedData} />
        </div>

        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Question
          </label>
          <input
            type="text"
            id="question"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="subjectID"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Subject
          </label>
          <select
            id="subjectID"
            name="subjectID"
            required
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((subject: { id: number; subject: string }) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Paste Options
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
            placeholder="Paste your options here..."
            onChange={handleOptionsPaste}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Options
          </label>
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="flex items-center mb-2">
              <input
                type="text"
                name={`option${key}`}
                value={value}
                onChange={(e) =>
                  setOptions({ ...options, [key]: e.target.value })
                }
                className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Option ${key}`}
                required
              />
              <button
                type="button"
                onClick={() => removeOption(Number(key))}
                className="px-3 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                &times;
              </button>
              <input
                type="checkbox"
                id={`correctAnswer${key}`}
                checked={selectedAnswers.includes(Number(key))}
                onChange={() => toggleSelectedAnswer(Number(key))}
                className="ml-2"
              />
              <label
                htmlFor={`correctAnswer${key}`}
                className="ml-1 text-sm text-gray-300"
              >
                Correct
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Add Option
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Create Question
        </button>
      </form>
    </div>
  );
}
