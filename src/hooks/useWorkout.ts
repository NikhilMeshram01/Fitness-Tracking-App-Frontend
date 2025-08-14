import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkoutsByUser,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  // last30days,
  last30daysWorkoutByUser,
} from "../apis/workout.api";
import { Workout } from "../types";

interface PaginatedWorkoutResponse {
  workouts: Workout[];
  total: number;
  page: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalDuration: number;
  totalPages: number;
  currentPage: number;
  averageDuration: number;
}

export const useWorkouts = (
  userId: string,
  currentPage: number,
  ITEMS_PER_PAGE: number,
  sortBy: string
) => {
  return useQuery<PaginatedWorkoutResponse, Error>({
    queryKey: ["workouts", userId, currentPage, ITEMS_PER_PAGE, sortBy],
    queryFn: () =>
      getWorkoutsByUser(userId, sortBy, currentPage, ITEMS_PER_PAGE),
    enabled: !!userId,
    // keepPreviousData: true, // ⬅️ Keeps previous page's data while loading new one
  });
};

export const useLast30DaysWorkouts = (userId: string) => {
  return useQuery({
    queryKey: ["workouts", userId],
    queryFn: () => last30daysWorkoutByUser(userId),
    enabled: !!userId,
    // keepPreviousData: true, // ⬅️ Keeps previous page's data while loading new one
  });
};

// 🔍 Get a single workout by ID
export const useWorkout = (id: string) => {
  return useQuery({
    queryKey: ["workout", id],
    queryFn: () => getWorkoutById(id),
    enabled: !!id,
  });
};

// ➕ Create new workout
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newWorkout: Omit<Workout, "id">) => createWorkout(newWorkout),
    onSuccess: (createdWorkout) => {
      queryClient.invalidateQueries({
        queryKey: ["workouts", createdWorkout.userId],
      });
    },
  });
};

// ✏️ Update workout
export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<Workout>;
    }) => updateWorkout(id, updatedData),
    onSuccess: (updatedWorkout) => {
      if (updatedWorkout) {
        queryClient.invalidateQueries({
          queryKey: ["workouts", updatedWorkout.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["workout", updatedWorkout.id],
        });
      }
    },
  });
};

// ❌ Delete workout
export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkout(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.removeQueries({ queryKey: ["workout", id] });
    },
  });
};
