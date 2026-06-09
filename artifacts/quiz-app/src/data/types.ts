export interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: 'A' | 'B' | 'C' | 'D' | null;
  image?: string;
}

export interface TopicMeta {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
}

export interface Topic extends TopicMeta {
  questions: Question[];
}
