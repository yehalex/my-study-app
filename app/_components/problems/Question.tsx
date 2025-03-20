"use client";

import { useEffect } from "react";
import { QuestionProps } from "@/types/Question";

export default function Question({
  question,
  onAnswer,
}: {
  question: QuestionProps;
  onAnswer: (answeredCorrectly: boolean, answer: string) => void;
}) {
  const getButtonColor = (key: string) => {
    if (question.selectedAnswer === null)
      return "bg-gray-700 hover:bg-gray-600";
    if (question.answer.includes(Number(key))) return "bg-teal-500";
    if (key === question.selectedAnswer) return "bg-red-500";
    return "bg-gray-700";
  };

  useEffect(() => {
    const handleClicked = (optionNumber: string) => {
      if (question.selectedAnswer === null) {
        question.selectedAnswer = optionNumber;
        const answeredCorrectly = question.answer.includes(
          Number(optionNumber)
        );
        onAnswer(answeredCorrectly, optionNumber);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      const optionNumber = parseInt(key, 10);

      // Check if the key corresponds to one of the options
      if (optionNumber && question.options[optionNumber]) {
        handleClicked(optionNumber.toString());
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [question, onAnswer]);

  return (
    <div>
      <h4 className="text-white text-xl font-semibold mb-4 whitespace-pre-wrap">
        {question.question}
      </h4>

      <div className="space-y-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            className={`w-full py-3 px-4 text-white text-left rounded-lg transition duration-200 ${getButtonColor(
              key
            )}`}
            onClick={() => {
              if (question.selectedAnswer === null) {
                question.selectedAnswer = key;
                const answeredCorrectly = question.answer.includes(Number(key));
                onAnswer(answeredCorrectly, key);
              }
            }}
            disabled={question.selectedAnswer !== null}
          >
            {value}
          </button>
        ))}
      </div>

      {question.selectedAnswer !== null && question.explanation && (
        <div className="mt-4 p-4 bg-gray-600 rounded-lg">
          <h5 className="font-semibold mb-2">Explanation:</h5>
          <p className="text-gray-200 whitespace-pre-wrap">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
