import { getCurrentUserID } from "./session";
import {
  getSubjects,
  getProblems,
  getProblemCount,
  getQuestionProgress,
} from "./data-service";

export async function getCurrentUserSubjects() {
  const ownerID = await getCurrentUserID();
  return getSubjects(ownerID);
}

export async function getCurrentUserProblems() {
  const ownerID = await getCurrentUserID();
  return getProblems(ownerID);
}

export async function getCurrentUserProblemCount(subjectID: number) {
  const ownerID = await getCurrentUserID();
  return getProblemCount(subjectID, ownerID);
}

// ... create similar wrappers for other functions
