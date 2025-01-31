import { QuestionProps } from "@/types/Question";

export type QuestionModuleProps = {
  questionArray: QuestionProps[];
  userID: number;
  subjectID: number;
  progress: { progress: { [key: number]: string } };
};
