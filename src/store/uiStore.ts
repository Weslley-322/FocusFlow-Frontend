import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currentPage: string;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currentPage: 'dashboard',

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setCurrentPage: (page: string) => {
    set({ currentPage: page });
  },
}));