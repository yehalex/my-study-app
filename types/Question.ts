export interface QuestionProps {
  id: number;
  created_at: Date;
  question: string;
  options: {
    [key: number]: string;
  };
  answer: number;
  subjectID: number;
  onwerID: number[];
  selectedAnswer?: string | null;
}
