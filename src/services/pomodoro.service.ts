import api from './api';
import {
  PomodoroSession,
  CreatePomodoroData,
  CompletePomodoroData,
  PomodoroStats,
  ApiResponse,
} from '@/types';

export const pomodoroService = {
  async create(data: CreatePomodoroData): Promise<PomodoroSession> {
    const response = await api.post<ApiResponse<PomodoroSession>>(
      '/pomodoro',
      data
    );
    return response.data.data;
  },

  async getAll(): Promise<PomodoroSession[]> {
    const response = await api.get<ApiResponse<PomodoroSession[]>>('/pomodoro');
    return response.data.data;
  },

  async getCompleted(): Promise<PomodoroSession[]> {
    const response = await api.get<ApiResponse<PomodoroSession[]>>(
      '/pomodoro/completed'
    );
    return response.data.data;
  },

  async getActive(): Promise<PomodoroSession[]> {
    const response = await api.get<ApiResponse<PomodoroSession[]>>(
      '/pomodoro/active'
    );
    return response.data.data;
  },

  async getById(id: string): Promise<PomodoroSession> {
    const response = await api.get<ApiResponse<PomodoroSession>>(
      `/pomodoro/${id}`
    );
    return response.data.data;
  },

  async complete(
    id: string,
    data: CompletePomodoroData
  ): Promise<PomodoroSession> {
    const response = await api.put<ApiResponse<PomodoroSession>>(
      `/pomodoro/${id}/complete`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/pomodoro/${id}`);
  },

  async getStats(): Promise<PomodoroStats> {
    const response = await api.get<ApiResponse<PomodoroStats>>(
      '/pomodoro/stats'
    );
    return response.data.data;
  },
};