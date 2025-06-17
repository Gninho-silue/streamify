import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'coffee', // Default to coffee' theme if not set
    setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme })
    },   
}));