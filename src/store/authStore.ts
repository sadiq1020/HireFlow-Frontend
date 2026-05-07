import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  phone?: string;
  isActive: boolean;
}

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'hireflow-auth',
    }
  )
);