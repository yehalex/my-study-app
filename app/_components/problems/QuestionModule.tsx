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
import { updateProgressBatch, resetProgress } from "@/app/_lib/actions";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/solid";
import useKeyboardNavigation from "@/app/hooks/useKeyboardNavigation";
import useProgressSaver from "@/app/hooks/useProgressSaver";

const QuestionModule = ({
  questionArray,
  userID,
  subjectID,
  progress,
}: QuestionModuleProps) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const {
    queueUpdate,
    flush,
    error: saveError,
  } = useProgressSaver(userID, subjectID);
  const initialLoad = useRef(true);

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

  // useEffect(() => {
  //   const newQuestions = questionArray.map((question) => ({
  //     ...question,
  //     selectedAnswer: progress?.progress?.[question.id] || null,
  //   }));

  //   const firstUnansweredIndex = newQuestions.findIndex(
  //     (q) => q.selectedAnswer === null
  //   );

  //   setQuestions(newQuestions);
  //   setQuestionIndex(firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex);
  // }, [questionArray, progress]);
  useEffect(() => {
    if (initialLoad.current) {
      const newQuestions = questionArray.map((question) => ({
        ...question,
        selectedAnswer: progress?.progress?.[question.id] || null,
      }));

      const firstUnansweredIndex = newQuestions.findIndex(
        (q) => q.selectedAnswer === null
      );

      setQuestions(newQuestions);
      setQuestionIndex(firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex);
      initialLoad.current = false;
    }
  }, [questionArray, progress?.progress]);

  const handleAnswered = useCallback(
    (answeredCorrectly: boolean, answer: string) => {
      const currentQuestion = questions[questionIndex];
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...currentQuestion,
        selectedAnswer: answer,
      };
      setQuestions(updatedQuestions);

      // Queue the batch update
      queueUpdate(currentQuestion.id, answer);

      // Immediate save if last question
      if (questionIndex === questionArray.length - 1) {
        flush().catch(() => setLocalError("Failed to save final answer"));
      }
    },
    [questionIndex, questions, queueUpdate, flush, questionArray.length]
  );

  const handleNavigation = useCallback(
    async (direction: "next" | "previous") => {
      try {
        await flush();
        setQuestionIndex((prev) =>
          direction === "next"
            ? Math.min(prev + 1, questionArray.length - 1)
            : Math.max(prev - 1, 0)
        );
      } catch (error) {
        setLocalError("Failed to save progress before navigation");
      }
    },
    [flush, questionArray.length]
  );

  useKeyboardNavigation(
    () => handleNavigation("previous"),
    () => handleNavigation("next")
  );

  const handleRetry = async () => {
    try {
      await flush();
      const result = await resetProgress(userID, subjectID);
      if (!result.success) throw new Error("Failed to reset progress");

      setQuestions(questionArray.map((q) => ({ ...q, selectedAnswer: null })));
      setQuestionIndex(0);
      setLocalError(null);
    } catch (error) {
      setLocalError("Failed to reset progress");
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

      {(localError || saveError) && (
        <p className="text-red-500 text-sm mb-4">{localError || saveError}</p>
      )}

      {questions[questionIndex] && (
        <Question
          question={questions[questionIndex]}
          onAnswer={handleAnswered}
        />
      )}

      <div className="flex justify-between w-full mt-5 px-0">
        <Button
          onClick={() => handleNavigation("previous")}
          disabled={questionIndex === 0}
          variant="icon"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>

        {allAnswered ? (
          <Button onClick={handleRetry} className="flex items-center gap-1">
            <ArrowPathIcon className="h-5 w-5" />
            Redo
          </Button>
        ) : (
          <Button onClick={flush} variant="icon">
            <CloudArrowUpIcon className="h-5 w-5" />
          </Button>
        )}

        <Button
          onClick={() => handleNavigation("next")}
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
