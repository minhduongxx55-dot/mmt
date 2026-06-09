import { topic1, topic1Meta } from './topic1';
import { topic2, topic2Meta } from './topic2';
import { topic3, topic3Meta } from './topic3';
import { topic4, topic4Meta } from './topic4';
import { topic5, topic5Meta } from './topic5';
import { topic6, topic6Meta } from './topic6';
import type { Topic, Question } from './types';

export type { Topic, Question };

export const allTopics: Topic[] = [
  { ...topic1Meta, questions: topic1 },
  { ...topic2Meta, questions: topic2 },
  { ...topic3Meta, questions: topic3 },
  { ...topic4Meta, questions: topic4 },
  { ...topic5Meta, questions: topic5 },
  { ...topic6Meta, questions: topic6 },
];

export function getTopicById(id: string): Topic | undefined {
  return allTopics.find(t => t.id === id);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pick10Questions(questions: Question[]): Question[] {
  const valid = questions.filter(q => q.answer !== null);
  const shuffled = shuffleArray(valid);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

export function shuffleAllQuestions(questions: Question[]): Question[] {
  const valid = questions.filter(q => q.answer !== null);
  return shuffleArray(valid);
}
