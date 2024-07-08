"use client";

import React, { useEffect, useState } from "react";
import Question from "./Question";
import { QuestionProps } from "@/types/Question";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

export default function QuestionModule({
  questionArray,
}: {
  questionArray: QuestionProps[];
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [questions, setQuestions] = useState<QuestionProps[]>([]);

  useEffect(() => {
    const newQuestions = questionArray.map((question) => ({
      ...question,
      selectedAnswer: null,
    }));
    setQuestions(newQuestions);
  }, [questionArray]);

  const handleAnswered = (answeredCorrectly: boolean) => {
    setTotalAnswered(totalAnswered + 1);
    if (answeredCorrectly) setTotalCorrect(totalCorrect + 1);
  };

  const handleNext = () => {
    if (questionIndex < questionArray.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleRetry = () => {
    const newQuestions = questionArray.map((question) => ({
      ...question,
      selectedAnswer: null,
    }));
    setQuestions(newQuestions);
    setQuestionIndex(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
  };

  const progressPercentage = ((questionIndex + 1) / questionArray.length) * 100;
  const hasAnswered = questions[questionIndex]?.selectedAnswer !== null;

  return (
    <div className="max-w-full xl:max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Progress bar */}
      <div className="flex justify-between mb-3">
        <p className="text-gray-300 text-sm mt-2">
          Question {questionIndex + 1} / {questionArray.length}
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Score: {totalCorrect} / {totalAnswered}
        </p>
      </div>
      <div className="mb-10">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Component */}
      {questions[questionIndex] && (
        <Question
          question={questions[questionIndex]}
          onAnswer={handleAnswered}
        />
      )}

      {/* Navigation  */}
      {hasAnswered && (
        <div className="flex justify-between w-full mt-5 px-0">
          <button
            onClick={handlePrevious}
            disabled={questionIndex === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          {totalAnswered === questionArray.length && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-white rounded disabled:bg-gray-400 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-6 w-6" /> Redo
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={questionIndex === questionArray.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 transition-colors duration-200"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
