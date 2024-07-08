export interface FormContentProps {
  id?: number;
  created_at?: Date;
  question?: string;
  options?: {
    [key: number]: string;
  };
  answer?: number;
  subjectID?: number;
  onwerID?: number[];
  selectedAnswer?: string | null;
  front?: string;
  back?: string;
}
