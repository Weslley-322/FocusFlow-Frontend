export interface Subject{
    id: string;
    name: string;
    color: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    topicsCount?: number;
}

export interface CreateSubjectData{
    name: string;
    color?: string;
    description?: string;
}

export interface UpdateSubjectData{
    name?: string;
    color?: string;
    description?: string;
    isActive?: boolean;
}