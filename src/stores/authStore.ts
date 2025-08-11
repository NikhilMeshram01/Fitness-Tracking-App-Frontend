import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data
        const mockUser: User = {
          id: "1",
          email,
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1990-01-01",
          gender: "male",
          height: 175,
          weight: 75,
          fitnessLevel: "intermediate",
          createdAt: new Date().toISOString(),
        };

        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      register: async (userData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: "fitness-auth",
    }
  )
);
