export interface Topic{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    subjectId: string;
    subjectName?: string;
}

export interface CreateTopicData{
    name: string;
    description?: string;
    subjectId: string;
}

export interface UpdateTopicData{
    name?: string;
    description?: string;
    isActive?: boolean;
}