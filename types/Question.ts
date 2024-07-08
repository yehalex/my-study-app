export interface QuestionProps {
  id: number;
  created_at: Date;
  question: string;
  options: {
    [key: number]: string;
  };
  answer: number;
  subjectID: number;
  ownerID: number[];
  selectedAnswer?: string | null;
}
