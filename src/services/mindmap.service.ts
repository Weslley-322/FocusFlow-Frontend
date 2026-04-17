import api from './api';
import { ApiResponse } from '@/types';

interface MindMap {
  id: string;
  title: string;
  description?: string;
  topicId: string;
  topicName?: string;
  createdAt: string;
  updatedAt: string;
  nodesCount?: number;
}

interface MindMapNode {
  id: string;
  content: string;
  level: number;
  parentId?: string;
  positionX: number;
  positionY: number;
  backgroundColor?: string;
  textColor?: string;
  mindMapId: string;
  createdAt: string;
  updatedAt: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export const mindMapService = {
  /**
 * Criar novo mapa mental
 */
async create(data: {
  title: string;
  description?: string;
  topicId?: string;
}): Promise<MindMap> {
  const response = await api.post<ApiResponse<MindMap>>('/mindmaps', data);
  return response.data.data;
},

  /**
   * Listar todos os mapas
   */
  async getAll(): Promise<MindMap[]> {
    const response = await api.get<ApiResponse<MindMap[]>>('/mindmaps');
    return response.data.data;
  },

  /**
   * Buscar mapa por ID
   */
  async getById(id: string): Promise<MindMap> {
    const response = await api.get<ApiResponse<MindMap>>(`/mindmaps/${id}`);
    return response.data.data;
  },

  /**
   * Atualizar mapa
   */
  async update(
    id: string,
    data: { title: string; description?: string }
  ): Promise<MindMap> {
    const response = await api.put<ApiResponse<MindMap>>(`/mindmaps/${id}`, data);
    return response.data.data;
  },

  /**
 * Atualizar posição de um nó
 */
async updateNodePosition(
  nodeId: string,
  data: { positionX: number; positionY: number }
): Promise<MindMapNode> {
  console.log('🌐 [SERVICE] Chamando API:', `/mindmaps/nodes/${nodeId}/position`, data);
  
  const response = await api.patch<ApiResponse<MindMapNode>>(
    `/mindmaps/nodes/${nodeId}/position`,
    data
  );
  
  console.log('🌐 [SERVICE] Resposta da API:', response.data);
  
  return response.data.data;
},

/**
 * Atualizar nó
 */
async updateNode(
  nodeId: string,
  data: {
    content?: string;
    parentId?: string | null;
    backgroundColor?: string;
    textColor?: string;
    sourceHandle?: string;  
    targetHandle?: string;  
  }
): Promise<MindMapNode> {
  const response = await api.put<ApiResponse<MindMapNode>>(
    `/mindmaps/nodes/${nodeId}`,
    data
  );
  return response.data.data;
},

  /**
   * Deletar mapa
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/mindmaps/${id}`);
  },

  /**
   * Listar nós de um mapa
   */
  async getNodes(mindMapId: string): Promise<MindMapNode[]> {
    const response = await api.get<ApiResponse<MindMapNode[]>>(
      `/mindmaps/${mindMapId}/nodes`
    );
    return response.data.data;
  },

  /**
   * Criar novo nó
   */
  async createNode(
    mindMapId: string,
    data: { content: string; parentId?: string }
  ): Promise<MindMapNode> {
    const response = await api.post<ApiResponse<MindMapNode>>(
      `/mindmaps/${mindMapId}/nodes`,
      data
    );
    return response.data.data;
  },

  /**
   * Deletar nó
   */
  async deleteNode(nodeId: string): Promise<void> {
    await api.delete(`/mindmaps/nodes/${nodeId}`);
  },
};