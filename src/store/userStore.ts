import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { p2021_user_m } from '@prisma/client';
interface UserState {
  user: p2021_user_m | null;
  setUser: (user: p2021_user_m) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set): UserState => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        await fetch('/api/logout', { method: 'POST' });
        set({ user: null });
        window.location.href = '/';
      },
    }),
    {
      name: 'user-info',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
