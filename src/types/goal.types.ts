export type GoalType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Goal{
    id: string;
    title: string;
    description?: string;
    type: GoalType;
    targetMinutes: number;
    currentMinutes: number;
    status: GoalStatus;
    progress: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGoalData{
    title: string;
    description?: string;
    type: GoalType;
    targetMinutes: number;
    startDate: string;
    endDate: string;
}

export interface UpdateGoalData{
    title?: string;
    description?: string;
    targetMinutes?: number;
    currentMinutes?: number;
    status?: GoalStatus;
}

export interface UpdateGoalProgressData{
    minutesToAdd: number;
}

export interface GoalStats{
    totalGoals: number;
    completedGoals: number;
    failedGoals: number;
    activeGoals: number;
    totalMinutesCompleted: number;
    completionRate: number;
}