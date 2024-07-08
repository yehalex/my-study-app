import QuestionModule from "@/app/_components/problems/QuestionModule";
import { getProblem } from "@/app/_lib/data-service";

import { QuestionProps } from "@/types/Question";

export const revalidate = 0; // Always revalidate

export default async function ProblemDetailsPage({
  params,
}: {
  params: { subjectID: string };
}) {
  const problemArray = await getProblem(Number(params.subjectID));

  if (!problemArray) {
    return <div>No problems found</div>;
  }

  const questions = problemArray as QuestionProps[];

  return <QuestionModule questionArray={questions} />;
}
