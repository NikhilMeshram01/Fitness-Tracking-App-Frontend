import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Goal } from "../types";

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
}

const mockGoals: Goal[] = [
  {
    id: "1",
    userId: "1",
    type: "weight_loss",
    title: "Lose 5kg",
    description: "Target weight loss by end of month",
    targetValue: 70,
    currentValue: 73,
    unit: "kg",
    targetDate: "2025-02-28",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "1",
    type: "workout_frequency",
    title: "Workout 4 times per week",
    description: "Maintain consistent workout schedule",
    targetValue: 4,
    currentValue: 3,
    unit: "workouts/week",
    targetDate: "2025-12-31",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: mockGoals,
      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));
      },
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },
      getActiveGoals: () => {
        return get().goals.filter((g) => !g.isCompleted);
      },
      getCompletedGoals: () => {
        return get().goals.filter((g) => g.isCompleted);
      },
    }),
    {
      name: "fitness-goals",
    }
  )
);
