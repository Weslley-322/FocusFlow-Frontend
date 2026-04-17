import { create } from 'zustand';
import { Subject } from '@/types';
import { subjectService } from '@/services';

interface SubjectState {
  subjects: Subject[];
  isLoading: boolean;
  
  fetchSubjects: () => Promise<void>;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, subject: Subject) => void;
  removeSubject: (id: string) => void;
  clearSubjects: () => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  isLoading: false,

  fetchSubjects: async () => {
    try {
      set({ isLoading: true });
      const subjects = await subjectService.getAll();
      set({ subjects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addSubject: (subject: Subject) => {
    set((state) => ({
      subjects: [...state.subjects, subject],
    }));
  },

  updateSubject: (id: string, updatedSubject: Subject) => {
    set((state) => ({
      subjects: state.subjects.map((subject) =>
        subject.id === id ? updatedSubject : subject
      ),
    }));
  },

  removeSubject: (id: string) => {
    set((state) => ({
      subjects: state.subjects.filter((subject) => subject.id !== id),
    }));
  },

  clearSubjects: () => {
    set({ subjects: [] });
  },
}));