export interface ApiResponse<T>{
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export interface ApiError{
    status: 'error';
    message: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T>{
    data: T[];
    total: number;
    page: number;
    limit: number;
}