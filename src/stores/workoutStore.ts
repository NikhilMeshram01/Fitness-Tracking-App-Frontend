import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workout } from "../types";

interface WorkoutState {
  workouts: Workout[];
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalDuration: number;
  totalPages: number;
  currentPage: number;
  averageDuration: number;
  last30Days: Workout[];
  setWorkoutData: (data: {
    workouts: Workout[];
    totalWorkouts: number;
    totalCaloriesBurned: number;
    totalDuration: number;
    totalPages: number;
    currentPage: number;
    averageDuration: number;
  }) => void;
  setLast30Days: (last30Days: Workout[]) => void;
  // addWorkout: (workout: Omit<Workout, "_id">) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  // getWorkoutsByDate: (date: string) => Workout[];
  getRecentWorkouts: (limit?: number) => Workout[];
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      totalWorkouts: 0,
      totalCaloriesBurned: 0,
      totalDuration: 0,
      totalPages: 0,
      currentPage: 1,
      averageDuration: 0,
      last30Days: [],
      setWorkoutData: (data) => {
        set({ ...data });
      },
      setLast30Days: (data) => {
        set({ last30Days: data });
      },

      // addWorkout: (workout) => {
      //   const newWorkout: Workout = {
      //     ...workout,
      //     _id: Date.now().toString(),
      //   };
      //   set((state) => ({ workouts: [...state.workouts, newWorkout] }));
      // },

      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w._id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((w) => w._id !== id),
        }));
      },

      // getWorkoutsByDate: (date) => {
      //   return get().workouts.filter((w) => w.workoutDate === date);
      // },

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
        totalWorkouts: state.totalWorkouts,
        totalCaloriesBurned: state.totalCaloriesBurned,
        totalDuration: state.totalDuration,
        averageDuration: state.averageDuration,
      }),
    }
  )
);
