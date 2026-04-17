import api from "./api";
import { Topic, CreateTopicData, UpdateTopicData, ApiResponse } from '@/types';

export const topicService = {
    async getBySubjectId(subjectId: string): Promise<Topic[]>{
        const response = await api.get<ApiResponse<Topic[]>>(
            `/topics/subject/${subjectId}`
        );
        return response.data.data;
    },

    async getById(id: string): Promise<Topic> {
        const response = await api.get<ApiResponse<Topic>>(`/topics/${id}`);
        return response.data.data;
    },

    async create(data: CreateTopicData): Promise<Topic>{
        const response = await api.post<ApiResponse<Topic>>('/topics', data);
        return response.data.data;
    },

    async update(id: string, data: UpdateTopicData): Promise<Topic>{
        const response = await api.put<ApiResponse<Topic>>(`/topics/${id}`, data);
        return response.data.data;
    },

    async delete(id: string): Promise<void>{
        await api.delete(`/topics/${id}`);
    },
};