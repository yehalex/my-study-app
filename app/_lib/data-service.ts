import { supabase } from "./supabase";
import { QuestionProps } from "@/types/Question";

export async function getProblems(ownerID: number) {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("*")
    .contains("ownerID", [ownerID]);

  if (error) {
    console.error(error);
  }

  return problems;
}

export async function getProblem(subjectID: number, ownerID: number) {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("subjectID", subjectID)
    .contains("ownerID", [ownerID]);

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getProblemCount(subjectID: number, ownerID: number) {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("subjectID", subjectID)
    .contains("ownerID", [ownerID]);

  if (error) {
    console.error(error);
  }

  return data?.length;
}

export async function insertProblem(newProblem: {}) {
  const { data, error } = await supabase
    .from("problems")
    .insert([newProblem])
    .select();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getSubjects() {
  let { data: subjects, error } = await supabase
    .from("subjects")
    .select("*")
    .order("subject", { ascending: true });

  if (error) {
    console.error(error);
  }

  return subjects;
}

export async function getUser(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  return data;
}

export async function createUser(newUser: any) {
  console.log("called");
  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .select();

  if (error) {
    console.error(error);
    throw new Error("User cannot be created");
  }

  return data;
}

export async function updateProblemInDB(problem: QuestionProps) {
  const { data, error } = await supabase
    .from("problems")
    .update(problem)
    .eq("id", problem.id);

  if (error) {
    console.error(error);
    throw new Error("Problem cannot be updated");
  }

  return data;
}

export async function deleteProblemFromDB(id: number) {
  const { data, error } = await supabase.from("problems").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Problem cannot be deleted");
  }

  return data;
}

export async function getQuestionProgress(userID: number, subjectID: number) {
  const { data, error } = await supabase
    .from("question_progress")
    .select("*")
    .eq("user_id", userID)
    .eq("subject_id", subjectID);

  if (error) {
    console.error(error);
    throw new Error("Question progress cannot be retrieved");
  }

  return data;
}

export async function initQuestionProgress(userID: number, subjectID: number) {
  const { data, error } = await supabase
    .from("question_progress")
    .insert([{ user_id: userID, subject_id: subjectID, progress: {} }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Question progress cannot be initialized");
  }

  return data;
}

export async function updateQuestionProgress(
  userID: number,
  subjectID: number,
  progress: object
) {
  const { data, error } = await supabase
    .from("question_progress")
    .update(progress)
    .eq("user_id", userID)
    .eq("subject_id", subjectID);

  if (error) {
    console.error(error);
    throw new Error("Question progress cannot be updated");
  }

  return data;
}

export async function updateQuestionProgressBatch(
  userID: number,
  subjectID: number,
  newAnswers: Record<number, string>
) {
  // Use PostgreSQL's jsonb_set in a transaction
  const { data, error } = await supabase.rpc("update_progress_batch", {
    p_user_id: userID,
    p_subject_id: subjectID,
    p_new_answers: newAnswers,
  });

  if (error) {
    console.error("Batch update error:", error);
    throw new Error(`Failed to save progress: ${error.message}`);
  }

  return data;
}
