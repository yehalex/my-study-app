import { supabase } from "./supabase";

export async function getProblems() {
  const { data: problems, error } = await supabase.from("problems").select("*");

  if (error) {
    console.error(error);
  }

  return problems;
}

export async function getProblem(subjectID: number) {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("subjectID", subjectID);

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getProblemCount(subjectID: number) {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("subjectID", subjectID);

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
  let { data: subjects, error } = await supabase.from("subjects").select("*");

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
