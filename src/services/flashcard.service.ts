import api from './api';
import {
  Flashcard,
  CreateFlashcardData,
  UpdateFlashcardData,
  ReviewFlashcardData,
  FlashcardReview,
  FlashcardStats,
  ApiResponse,
} from '@/types';

export const flashcardService = {
  /**
   * Listar todos os flashcards
   */
  async getAll(): Promise<Flashcard[]> {
    const response = await api.get<ApiResponse<Flashcard[]>>('/flashcards');
    return response.data.data;
  },

  /**
   * Buscar flashcards para revisar hoje
   */
  async getDueForReview(): Promise<Flashcard[]> {
    const response = await api.get<ApiResponse<Flashcard[]>>(
      '/flashcards/review/due'
    );
    return response.data.data;
  },

  /**
   * Buscar flashcard por ID
   */
  async getById(id: string): Promise<Flashcard> {
    const response = await api.get<ApiResponse<Flashcard>>(
      `/flashcards/${id}`
    );
    return response.data.data;
  },

  /**
   * Criar flashcard
   */
  async create(data: CreateFlashcardData): Promise<Flashcard> {
    const response = await api.post<ApiResponse<Flashcard>>(
      '/flashcards',
      data
    );
    return response.data.data;
  },

  /**
   * Atualizar flashcard
   */
  async update(id: string, data: UpdateFlashcardData): Promise<Flashcard> {
    const response = await api.put<ApiResponse<Flashcard>>(
      `/flashcards/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Revisar flashcard (algoritmo SM-2)
   */
  async review(id: string, data: ReviewFlashcardData): Promise<Flashcard> {
    const response = await api.post<ApiResponse<Flashcard>>(
      `/flashcards/${id}/review`,
      data
    );
    return response.data.data;
  },

  /**
   * Buscar histórico de revisões
   */
  async getReviewHistory(id: string): Promise<FlashcardReview[]> {
    const response = await api.get<ApiResponse<FlashcardReview[]>>(
      `/flashcards/${id}/history`
    );
    return response.data.data;
  },

  /**
   * Deletar flashcard
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/flashcards/${id}`);
  },

  /**
   * Obter estatísticas
   */
  async getStats(): Promise<FlashcardStats> {
    const response = await api.get<ApiResponse<FlashcardStats>>(
      '/flashcards/stats'
    );
    return response.data.data;
  },
};