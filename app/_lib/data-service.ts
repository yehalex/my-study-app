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
