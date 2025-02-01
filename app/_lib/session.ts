import { auth } from "./auth";
import { getUser } from "./data-service";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await getUser(session.user.email);
  if (!user?.[0]) {
    throw new Error("User not found");
  }

  return user[0];
}

export async function getCurrentUserID() {
  const user = await getCurrentUser();
  return user.id;
}
