import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workout } from "../types";

interface WorkoutState {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, "id">) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsByDate: (date: string) => Workout[];
  getRecentWorkouts: (limit?: number) => Workout[];
}

// Mock data
const mockWorkouts: Workout[] = [
  {
    id: "1",
    userId: "1",
    type: "cardio",
    name: "Morning Run",
    duration: 45,
    caloriesBurned: 350,
    exercises: [{ id: "1", name: "Running", duration: 45, distance: 5 }],
    date: new Date().toISOString().split("T")[0],
    notes: "Great morning run in the park",
  },
  {
    id: "2",
    userId: "1",
    type: "strength",
    name: "Upper Body Workout",
    duration: 60,
    caloriesBurned: 280,
    exercises: [
      { id: "2", name: "Bench Press", sets: 3, reps: 10, weight: 80 },
      { id: "3", name: "Pull-ups", sets: 3, reps: 8 },
      { id: "4", name: "Shoulder Press", sets: 3, reps: 12, weight: 25 },
    ],
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  },
];

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: mockWorkouts,
      addWorkout: (workout) => {
        const newWorkout: Workout = {
          ...workout,
          id: Date.now().toString(),
        };
        set((state) => ({ workouts: [...state.workouts, newWorkout] }));
      },
      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },
      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
        }));
      },
      getWorkoutsByDate: (date) => {
        return get().workouts.filter((w) => w.date === date);
      },
      getRecentWorkouts: (limit = 5) => {
        return get()
          .workouts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      },
    }),
    {
      name: "fitness-workouts",
    }
  )
);
