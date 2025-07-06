import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'forest', // Default to forest' theme if not set
    setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme })
    },   
}));