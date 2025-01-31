import QuestionModule from "@/app/_components/problems/QuestionModule";
import { auth } from "@/app/_lib/auth";
import {
  getProblem,
  getUser,
  getQuestionProgress,
  initQuestionProgress,
} from "@/app/_lib/data-service";

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

  // Check for question progress
  let progress = await getQuestionProgress(
    user![0].id,
    Number(params.subjectID)
  );

  // If no progress exists, initialize it
  if (!progress || progress.length === 0) {
    await initQuestionProgress(user![0].id, Number(params.subjectID));
    // Get fresh progress after initialization
    progress = await getQuestionProgress(user![0].id, Number(params.subjectID));
  }

  return (
    <QuestionModule
      questionArray={questions}
      userID={user![0].id}
      subjectID={Number(params.subjectID)}
      progress={progress[0] || { progress: {} }}
    />
  );
}
