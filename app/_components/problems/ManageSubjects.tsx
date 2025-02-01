"use client";

import { useState } from "react";
import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/app/_lib/actions";

interface Subject {
  id: number;
  subject: string;
  subject_owner_ids: number[];
}

export default function ManageSubjects({ subjects }: { subjects: Subject[] }) {
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState("");

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingSubject) {
      await updateSubject(editingSubject);
      setEditingSubject(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      await deleteSubject(id);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newSubject.trim()) {
      await createSubject(newSubject);
      setNewSubject("");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Subjects</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="New subject name"
            className="flex-grow bg-gray-700 text-white p-2 rounded border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Subject
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-gray-800 p-4 rounded-lg text-gray-300"
          >
            {editingSubject?.id === subject.id ? (
              <form onSubmit={handleSave} className="flex gap-2">
                <input
                  type="text"
                  value={editingSubject.subject}
                  onChange={(e) =>
                    setEditingSubject({
                      ...editingSubject,
                      subject: e.target.value,
                    })
                  }
                  className="flex-grow bg-gray-700 text-white p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xl">{subject.subject}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
