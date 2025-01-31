"use server";

import { FormContentProps } from "@/types/FormContent";
import { QuestionProps } from "@/types/Question";

import { auth, signIn, signOut } from "./auth";
import {
  getUser,
  insertProblem,
  updateProblemInDB,
  deleteProblemFromDB,
  getQuestionProgress,
  updateQuestionProgress,
} from "./data-service";
import { revalidatePath } from "next/cache";

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
  try {
    const existingProgress = await getQuestionProgress(userID, subjectID);

    if (!existingProgress || !existingProgress[0]) {
      throw new Error("Progress not found");
    }

    const currentProgress = existingProgress[0].progress || {};
    const updatedProgress = {
      progress: {
        ...currentProgress,
        [problemID]: answer,
      },
    };

    await updateQuestionProgress(userID, subjectID, updatedProgress);
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
