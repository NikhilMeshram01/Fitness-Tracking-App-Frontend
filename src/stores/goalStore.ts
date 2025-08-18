import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Goal } from "../types";

interface GoalState {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updatedData: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  // clearGoals: () => void;
  getActiveGoals: () => Goal[];
  // getCompletedGoals: () => Goal[];
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],

      setGoals: (goals) => {
        set({ goals });
      },

      addGoal: (goal) => {
        set((state) => ({ goals: [...state.goals, goal] }));
      },

      updateGoal: (id, updatedData) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal._id === id ? { ...goal, ...updatedData } : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal._id !== id),
        }));
      },

      // clearGoals: () => {
      //   set({ goals: [] });
      // },

      getActiveGoals: () => {
        return get().goals.filter((g) => !g.isCompleted);
      },

      // getCompletedGoals: () => {
      //   return get().goals.filter((g) => g.isCompleted);
      // },
    }),
    {
      name: "fitness-goals",
    }
  )
);
