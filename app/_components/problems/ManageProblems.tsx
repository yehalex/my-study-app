"use client";

import { useState, useMemo } from "react";
import { QuestionProps } from "@/types/Question";
import { updateProblem, deleteProblem } from "@/app/_lib/actions";

interface Subject {
  id: number;
  subject: string;
}

export default function ManageProblems({
  problems,
  subjects,
}: {
  problems: QuestionProps[];
  subjects: Subject[];
}) {
  const [editingProblem, setEditingProblem] = useState<QuestionProps | null>(
    null
  );
  const [selectedSubject, setSelectedSubject] = useState<number | "all">("all");

  const sortedAndFilteredProblems = useMemo(() => {
    return problems
      .sort((a, b) => a.id - b.id)
      .filter(
        (problem) =>
          selectedSubject === "all" || problem.subjectID === selectedSubject
      );
  }, [problems, selectedSubject]);

  const handleEdit = (problem: QuestionProps) => {
    setEditingProblem(problem);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingProblem) {
      await updateProblem(editingProblem);
      setEditingProblem(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      await deleteProblem(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Problems</h1>
      <div>
        <label htmlFor="subjectFilter" className="mr-2 text-white">
          Filter by subject:
        </label>
        <select
          id="subjectFilter"
          value={selectedSubject}
          onChange={(e) =>
            setSelectedSubject(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject}
            </option>
          ))}
        </select>
      </div>
      {sortedAndFilteredProblems.map((problem) => (
        <div
          key={problem.id}
          className="bg-gray-800 p-4 rounded-lg text-gray-300"
        >
          {editingProblem?.id === problem.id ? (
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={editingProblem.question}
                onChange={(e) =>
                  setEditingProblem({
                    ...editingProblem,
                    question: e.target.value,
                  })
                }
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
              <select
                value={editingProblem.subjectID}
                onChange={(e) =>
                  setEditingProblem({
                    ...editingProblem,
                    subjectID: Number(e.target.value),
                  })
                }
                className="w-full bg-gray-700 text-white p-2 rounded"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject}
                  </option>
                ))}
              </select>
              {Object.entries(editingProblem.options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setEditingProblem({
                        ...editingProblem,
                        options: {
                          ...editingProblem.options,
                          [key]: e.target.value,
                        },
                      })
                    }
                    className="flex-grow bg-gray-700 text-white p-2 rounded"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingProblem.answer.includes(Number(key))}
                      onChange={(e) => {
                        const newAnswer = e.target.checked
                          ? [...editingProblem.answer, Number(key)]
                          : editingProblem.answer.filter(
                              (a) => a !== Number(key)
                            );
                        setEditingProblem({
                          ...editingProblem,
                          answer: newAnswer,
                        });
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    {/* <span className="text-sm">Correct</span> */}
                  </label>
                </div>
              ))}
              <textarea
                value={editingProblem.explanation || ""}
                onChange={(e) =>
                  setEditingProblem({
                    ...editingProblem,
                    explanation: e.target.value,
                  })
                }
                placeholder="Add an explanation (optional)"
                className="w-full bg-gray-700 text-white p-2 rounded mt-2"
                rows={3}
              />
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{problem.question}</h2>
              <p>
                Subject:{" "}
                {subjects.find((s) => s.id === problem.subjectID)?.subject ||
                  "Unknown"}
              </p>
              <ul>
                {Object.entries(problem.options).map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between">
                    <span
                      className={
                        problem.answer.includes(Number(key)) ? "font-bold" : ""
                      }
                    >
                      {value}
                    </span>
                    {/* {problem.answer.includes(Number(key)) && (
                      <span className="text-green-500">✓</span>
                    )} */}
                  </li>
                ))}
              </ul>
              <div className="mt-4 inline-flex space-x-2">
                <button
                  onClick={() => handleEdit(problem)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center align-middle"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(problem.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-center align-middle"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
