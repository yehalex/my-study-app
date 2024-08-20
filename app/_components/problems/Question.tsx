import { QuestionProps } from "@/types/Question";
import { useEffect, useState } from "react";

export default function Question({
  question,
  onAnswer,
}: {
  question: QuestionProps;
  onAnswer: (answeredCorrectly: boolean) => void;
}) {
  const handleClicked = (optionNumber: string) => {
    if (question.selectedAnswer === null) {
      question.selectedAnswer = optionNumber;
      const answeredCorrectly = question.answer.includes(
        parseInt(optionNumber)
      );
      onAnswer(answeredCorrectly);
    }
  };

  const getButtonColor = (key: string) => {
    if (question.selectedAnswer === null)
      return "bg-gray-700 hover:bg-gray-600";
    if (question.answer.includes(parseInt(key))) return "bg-teal-500";
    if (key === question.selectedAnswer) return "bg-red-500";
    return "bg-gray-700";
  };

  return (
    <div>
      <h4 className="text-white text-xl font-semibold mb-4">
        {question.question}
      </h4>

      <div className="space-y-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            className={`w-full py-3 px-4 text-white text-left rounded-lg transition duration-200 ${getButtonColor(
              key
            )}`}
            onClick={() => handleClicked(key)}
            disabled={question.selectedAnswer !== null}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
