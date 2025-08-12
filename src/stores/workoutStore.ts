import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workout } from "../types";

interface WorkoutState {
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Omit<Workout, "id">) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsByDate: (date: string) => Workout[];
  getRecentWorkouts: (limit?: number) => Workout[];
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],

      setWorkouts: (workouts) => {
        set({ workouts });
      },

      addWorkout: (workout) => {
        const newWorkout: Workout = {
          ...workout,
          _id: Date.now().toString(),
        };
        set((state) => ({ workouts: [...state.workouts, newWorkout] }));
      },

      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w._id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
        }));
      },

      getWorkoutsByDate: (date) => {
        return get().workouts.filter((w) => w.workoutDate === date);
      },

      getRecentWorkouts: (limit = 5) => {
        return [...get().workouts]
          .sort(
            (a, b) =>
              new Date(b.workoutDate).getTime() -
              new Date(a.workoutDate).getTime()
          )
          .slice(0, limit);
      },
    }),
    {
      name: "fitness-workouts",
      partialize: (state) => ({
        workouts: state.workouts,
      }),
    }
  )
);
