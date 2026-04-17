export interface Flashcard {
  id: string;
  front: string;
  back: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subjectId?: string;
  subjectName?: string;
  subjectColor?: string;
  topicId?: string;
  topicName?: string;
  reviewsCount?: number;
}

export interface CreateFlashcardData {
  front: string;
  back: string;
  subjectId?: string;
  topicId?: string;
}

export interface UpdateFlashcardData {
  front?: string;
  back?: string;
  isActive?: boolean;
}

export interface ReviewFlashcardData {
  quality: 0 | 1 | 2 | 3; // AGAIN, HARD, GOOD, EASY
}

export interface FlashcardReview {
  id: string;
  quality: number;
  qualityLabel: string;
  intervalAfter: number;
  easeFactorAfter: number;
  reviewedAt: string;
}

export interface FlashcardStats {
  totalCards: number;
  dueForReview: number;
  newCards: number;
  masteredCards: number;
}