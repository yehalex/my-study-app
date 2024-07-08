import QuestionModule from "@/app/_components/problems/QuestionModule";
import { auth } from "@/app/_lib/auth";
import { getProblem, getUser } from "@/app/_lib/data-service";

import { QuestionProps } from "@/types/Question";

export const revalidate = 0; // Always revalidate

export default async function ProblemDetailsPage({
  params,
}: {
  params: { subjectID: string };
}) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }
  const user = await getUser(session?.user?.email!);
  const problemArray = await getProblem(Number(params.subjectID), user![0].id);

  if (!problemArray) {
    return <div>No problems found</div>;
  }

  const questions = problemArray as QuestionProps[];

  return <QuestionModule questionArray={questions} />;
}
