"use server";

import { FormContentProps } from "@/types/FormContent";

import { auth, signIn, signOut } from "./auth";
import { getUser, insertProblem } from "./data-service";
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
