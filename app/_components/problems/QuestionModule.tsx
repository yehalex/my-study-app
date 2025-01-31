"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Question from "./Question";
import ProgressBar from "./ProgressBar";
import Button from "../Button";
import { QuestionProps } from "@/types/Question";
import { QuestionModuleProps } from "@/types/QuestionModule";
import { updateProgress, resetProgress } from "@/app/_lib/actions";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import useKeyboardNavigation from "@/app/hooks/useKeyboardNavigation";

const QuestionModule = ({
  questionArray,
  userID,
  subjectID,
  progress,
}: QuestionModuleProps) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Derived state
  const totalAnswered = useMemo(
    () => questions.filter((q) => q.selectedAnswer !== null).length,
    [questions]
  );

  const totalCorrect = useMemo(
    () =>
      questions.filter(
        (q) =>
          q.selectedAnswer !== null &&
          q.answer.includes(Number(q.selectedAnswer))
      ).length,
    [questions]
  );

  useEffect(() => {
    const newQuestions = questionArray.map((question) => ({
      ...question,
      selectedAnswer: progress?.progress?.[question.id] || null,
    }));

    const firstUnansweredIndex = newQuestions.findIndex(
      (q) => q.selectedAnswer === null
    );

    setQuestions(newQuestions);
    setQuestionIndex(firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex);
  }, [questionArray, progress]);

  const handleAnswered = useCallback(
    async (answeredCorrectly: boolean, answer: string) => {
      const currentQuestion = questions[questionIndex];
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...currentQuestion,
        selectedAnswer: answer,
      };
      setQuestions(updatedQuestions);

      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);

      updateTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await updateProgress(
            userID,
            subjectID,
            currentQuestion.id,
            answer
          );

          if (!result.success) throw new Error("Failed to update progress");
        } catch (err) {
          setError("Failed to save progress");
          const rollbackQuestions = [...questions];
          rollbackQuestions[questionIndex] = {
            ...currentQuestion,
            selectedAnswer: null,
          };
          setQuestions(rollbackQuestions);
        }
      }, 500);
    },
    [questionIndex, questions, subjectID, userID]
  );

  const handleNext = useCallback(
    () =>
      setQuestionIndex((prev) => Math.min(prev + 1, questionArray.length - 1)),
    [questionArray.length]
  );

  const handlePrevious = useCallback(
    () => setQuestionIndex((prev) => Math.max(prev - 1, 0)),
    []
  );

  useKeyboardNavigation(handlePrevious, handleNext);

  const handleRetry = async () => {
    try {
      const result = await resetProgress(userID, subjectID);
      if (!result.success) throw new Error("Failed to reset progress");

      setQuestions((prev) => prev.map((q) => ({ ...q, selectedAnswer: null })));
      setQuestionIndex(0);
      setError(null);
    } catch (err) {
      setError("Failed to reset progress");
    }
  };

  const progressPercentage = ((questionIndex + 1) / questionArray.length) * 100;
  const allAnswered = totalAnswered === questionArray.length;

  return (
    <div className="max-w-full xl:max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between mb-3">
        <p className="text-gray-300 text-sm">
          Question {questionIndex + 1} / {questionArray.length}
        </p>
        <p className="text-gray-300 text-sm">
          Score: {totalCorrect} / {totalAnswered}
        </p>
      </div>

      <div className="mb-10">
        <ProgressBar percentage={progressPercentage} />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {questions[questionIndex] && (
        <Question
          question={questions[questionIndex]}
          onAnswer={handleAnswered}
        />
      )}

      <div className="flex justify-between w-full mt-5 px-0">
        <Button
          onClick={handlePrevious}
          disabled={questionIndex === 0}
          variant="icon"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>

        {allAnswered && (
          <Button onClick={handleRetry} className="flex items-center gap-1">
            <ArrowPathIcon className="h-5 w-5" />
            Redo
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={questionIndex === questionArray.length - 1}
          variant="icon"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionModule;
