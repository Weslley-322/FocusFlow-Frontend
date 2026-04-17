export interface PomodoroSession{
    id: string;
    duration: number;
    breakTime: number;
    startTime: string;
    endTime?: string;
    completed: boolean;
    notes?: string;
    createdAt: string;
    subjectId?: string;
    subjectName?: string;
    subjectColor?: string;
    topicId?: string;
    topicName?: string;   
}

export interface CreatePomodoroData{
    duration: number;
    breakTime: number;
    subjectId?: string;
    topicId?: string;
}

export interface CompletePomodoroData{
    notes?: string;
}

export interface PomodoroStats{
    totalMinutes: number;
    totalSessions: number;
    completedSessions: number;
    activeSessions: number;
    bySubject: Array<{
        subjectName: string;
        subjectColor: string;
        totalMinutes: number;
        sessionsCount: number;
    }>;
}