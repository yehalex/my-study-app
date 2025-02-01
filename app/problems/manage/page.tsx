import ManageProblems from "@/app/_components/problems/ManageProblems";
import { auth } from "@/app/_lib/auth";
import {
  getCurrentUserSubjects,
  getCurrentUserProblems,
} from "@/app/_lib/data-helpers";
import { getUser, getProblems, getSubjects } from "@/app/_lib/data-service";
import { QuestionProps } from "@/types/Question";

export default async function ManageProblemPage() {
  // const session = await auth();
  // if (!session) {
  //   throw new Error("You must be logged in");
  // }
  // const user = await getUser(session?.user?.email!);
  // const problems = await getProblems(user![0].id);
  const problems = await getCurrentUserProblems();
  const subjects = await getCurrentUserSubjects();

  return (
    <ManageProblems
      problems={problems as QuestionProps[]}
      subjects={subjects ?? []}
    />
  );
}
