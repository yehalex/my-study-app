"use server";

import { auth, signIn, signOut } from "./auth";
import { getUser } from "./data-service";

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/problems" });
}

export async function createProblem(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }
  const user = await getUser(session?.user?.email!);
  // console.log(user![0].id);

  console.log("Question created:", Object.fromEntries(formData));
}
