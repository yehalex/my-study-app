"use server";

import { FormContentProps } from "@/types/FormContent";
import { QuestionProps } from "@/types/Question";

import { auth, signIn, signOut } from "./auth";
import {
  getUser,
  insertProblem,
  updateProblemInDB,
  deleteProblemFromDB,
  updateQuestionProgress,
  updateQuestionProgressBatch,
  insertSubject,
  updateSubjectInDB,
  deleteSubjectFromDB,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./session";

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/problems" });
}

export async function createProblem(formData: FormContentProps) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }
  const user = await getUser(session?.user?.email!);
  formData.ownerID = [user![0].id];

  const result = await insertProblem(formData);
  revalidatePath("/problems");
  // add logic to handle failure
  return { success: true };
}

export async function updateProblem(problem: QuestionProps) {
  const result = await updateProblemInDB(problem);
  revalidatePath("/problems/manage");
  return { success: true };
}

export async function deleteProblem(id: number) {
  const result = await deleteProblemFromDB(id);
  revalidatePath("/problems/manage");
  return { success: true };
}

export async function updateProgress(
  userID: number,
  subjectID: number,
  problemID: number,
  answer: string
) {
  return updateProgressBatch(userID, subjectID, { [problemID]: answer });
}

export async function updateProgressBatch(
  userID: number,
  subjectID: number,
  newAnswers: Record<number, string>
) {
  try {
    await updateQuestionProgressBatch(userID, subjectID, newAnswers);
    revalidatePath(`/problems/${subjectID}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating progress:", error);
    return { success: false, error };
  }
}

export async function resetProgress(userID: number, subjectID: number) {
  try {
    const updatedProgress = {
      progress: {}, // Reset to empty object
    };

    await updateQuestionProgress(userID, subjectID, updatedProgress);
    revalidatePath(`/problems/${subjectID}`);
    return { success: true };
  } catch (error) {
    console.error("Error resetting progress:", error);
    return { success: false, error };
  }
}

export async function createSubject(subject: string) {
  try {
    const user = await getCurrentUser();
    const result = await insertSubject({
      subject: subject,
      subject_owner_ids: [user.id],
    });

    revalidatePath("/problems/subjects");
    return { success: true };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { success: false, error };
  }
}

export async function updateSubject(subject: {
  id: number;
  subject: string;
  subject_owner_ids: number[];
}) {
  try {
    const result = await updateSubjectInDB(subject);
    revalidatePath("/problems/subjects");
    return { success: true };
  } catch (error) {
    console.error("Error updating subject:", error);
    return { success: false, error };
  }
}

export async function deleteSubject(id: number) {
  try {
    const result = await deleteSubjectFromDB(id);
    revalidatePath("/problems/subjects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error };
  }
}
