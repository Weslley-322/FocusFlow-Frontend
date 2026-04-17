import api from './api';
import {
  Subject,
  CreateSubjectData,
  UpdateSubjectData,
  ApiResponse,
} from '@/types';

interface SubjectStats {
  totalSubjects: number;
  activeSubjects: number;
}

export const subjectService = {
  
  async getStats(): Promise<SubjectStats> {
    const response = await api.get<ApiResponse<SubjectStats>>('/subjects/stats');
    return response.data.data;
  },

  async getAll(): Promise<Subject[]> {
    const response = await api.get<ApiResponse<Subject[]>>('/subjects');
    return response.data.data;
  },

  async getById(id: string): Promise<Subject> {
    const response = await api.get<ApiResponse<Subject>>(`/subjects/${id}`);
    return response.data.data;
  },

  async create(data: CreateSubjectData): Promise<Subject> {
    const response = await api.post<ApiResponse<Subject>>('/subjects', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateSubjectData): Promise<Subject> {
    const response = await api.put<ApiResponse<Subject>>(
      `/subjects/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/subjects/${id}`);
  },
};