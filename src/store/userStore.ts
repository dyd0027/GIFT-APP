import { create } from 'zustand';
import { p2021_user_m } from '@prisma/client';
interface UserState {
  user: p2021_user_m | null;
  setUser: (user: p2021_user_m) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    await fetch('/api/logout', { method: 'POST' });
    set({ user: null });
    window.location.href = '/';
  },
}));
