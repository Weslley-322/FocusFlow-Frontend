import { useEffect, useState } from 'react';
import {
  pomodoroService,
  flashcardService,
  goalService,
  subjectService,
} from '@/services';

interface DashboardStats {
  pomodoro: {
    totalMinutes: number;
    totalSessions: number;
    completedSessions: number;
  };
  flashcards: {
    totalCards: number;
    dueForReview: number;
    newCards: number;
    masteredCards: number;
  };
  goals: {
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    completionRate: number;
  };
  subjects: {
    totalSubjects: number;
    activeSubjects: number;
  };
  isLoading: boolean;
  error: string | null;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>({
    pomodoro: {
      totalMinutes: 0,
      totalSessions: 0,
      completedSessions: 0,
    },
    flashcards: {
      totalCards: 0,
      dueForReview: 0,
      newCards: 0,
      masteredCards: 0,
    },
    goals: {
      totalGoals: 0,
      completedGoals: 0,
      activeGoals: 0,
      completionRate: 0,
    },
    subjects: {
      totalSubjects: 0,
      activeSubjects: 0,
    },
    isLoading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats((prev) => ({ ...prev, isLoading: true, error: null }));

      // Buscar todas as estatísticas em paralelo
      const [pomodoroStats, flashcardStats, goalStats, subjectStats] =
        await Promise.all([
          pomodoroService.getStats(),
          flashcardService.getStats(),
          goalService.getStats(),
          subjectService.getStats(),
        ]);

      setStats({
        pomodoro: {
          totalMinutes: pomodoroStats.totalMinutes,
          totalSessions: pomodoroStats.totalSessions,
          completedSessions: pomodoroStats.completedSessions,
        },
        flashcards: {
          totalCards: flashcardStats.totalCards,
          dueForReview: flashcardStats.dueForReview,
          newCards: flashcardStats.newCards,
          masteredCards: flashcardStats.masteredCards,
        },
        goals: {
          totalGoals: goalStats.totalGoals,
          completedGoals: goalStats.completedGoals,
          activeGoals: goalStats.activeGoals,
          completionRate: goalStats.completionRate,
        },
        subjects: {
          totalSubjects: subjectStats.totalSubjects,
          activeSubjects: subjectStats.activeSubjects,
        },
        isLoading: false,
        error: null,
      });
    } catch {
      setStats((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar estatísticas',
      }));
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats((prev) => ({ ...prev, isLoading: true, error: null }));

        const [pomodoroStats, flashcardStats, goalStats, subjectStats] =
          await Promise.all([
            pomodoroService.getStats(),
            flashcardService.getStats(),
            goalService.getStats(),
            subjectService.getStats(),
          ]);

        setStats({
          pomodoro: {
            totalMinutes: pomodoroStats.totalMinutes,
            totalSessions: pomodoroStats.totalSessions,
            completedSessions: pomodoroStats.completedSessions,
          },
          flashcards: {
            totalCards: flashcardStats.totalCards,
            dueForReview: flashcardStats.dueForReview,
            newCards: flashcardStats.newCards,
            masteredCards: flashcardStats.masteredCards,
          },
          goals: {
            totalGoals: goalStats.totalGoals,
            completedGoals: goalStats.completedGoals,
            activeGoals: goalStats.activeGoals,
            completionRate: goalStats.completionRate,
          },
          subjects: {
            totalSubjects: subjectStats.totalSubjects,
            activeSubjects: subjectStats.activeSubjects,
          },
          isLoading: false,
          error: null,
        });
      } catch {
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar estatísticas',
        }));
      }
    };

    loadStats();
  }, []); 

  return { stats, refetch: fetchStats };
}