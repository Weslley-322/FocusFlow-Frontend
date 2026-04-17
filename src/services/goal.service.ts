import api from './api';
import {
  Goal,
  CreateGoalData,
  UpdateGoalData,
  UpdateGoalProgressData,
  GoalStats,
  ApiResponse,
} from '@/types';

export const goalService = {
  /**
   * Listar todas as metas
   */
  async getAll(): Promise<Goal[]> {
    const response = await api.get<ApiResponse<Goal[]>>('/goals');
    return response.data.data;
  },

  /**
   * Listar metas ativas
   */
  async getActive(): Promise<Goal[]> {
    const response = await api.get<ApiResponse<Goal[]>>('/goals/active');
    return response.data.data;
  },

  /**
   * Buscar meta por ID
   */
  async getById(id: string): Promise<Goal> {
    const response = await api.get<ApiResponse<Goal>>(`/goals/${id}`);
    return response.data.data;
  },

  /**
   * Criar meta
   */
  async create(data: CreateGoalData): Promise<Goal> {
    const response = await api.post<ApiResponse<Goal>>('/goals', data);
    return response.data.data;
  },

  /**
   * Atualizar meta
   */
  async update(id: string, data: UpdateGoalData): Promise<Goal> {
    const response = await api.put<ApiResponse<Goal>>(`/goals/${id}`, data);
    return response.data.data;
  },

  /**
   * Atualizar progresso
   */
  async updateProgress(
    id: string,
    data: UpdateGoalProgressData
  ): Promise<Goal> {
    const response = await api.post<ApiResponse<Goal>>(
      `/goals/${id}/progress`,
      data
    );
    return response.data.data;
  },

  /**
   * Marcar como falhada
   */
  async markAsFailed(id: string): Promise<Goal> {
    const response = await api.post<ApiResponse<Goal>>(`/goals/${id}/fail`);
    return response.data.data;
  },

  /**
   * Deletar meta
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },

  /**
   * Obter estatísticas
   */
  async getStats(): Promise<GoalStats> {
    const response = await api.get<ApiResponse<GoalStats>>('/goals/stats');
    return response.data.data;
  },
};