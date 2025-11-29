export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  testId: string;
  createdBy: string;
  title: string;
  description: string;
  questions: Question[];
}
