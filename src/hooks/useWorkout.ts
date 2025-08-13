import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkoutsByUser,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../apis/workout.api";
import { Workout } from "../types";

interface PaginatedWorkoutResponse {
  workouts: Workout[];
  total: number;
  page: number;
  totalPages: number;
}

export const useWorkouts = (
  userId: string,
  currentPage: number,
  ITEMS_PER_PAGE: number,
  sortBy: string
) => {
  return useQuery<PaginatedWorkoutResponse, Error>({
    queryKey: ["workouts", userId, currentPage, ITEMS_PER_PAGE, sortBy],
    queryFn: async () => {
      const res = await fetch(
        `/api/v1/workouts?page=${currentPage}&limit=${ITEMS_PER_PAGE}&sortBy=${sortBy}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch workouts");
      return res.json(); // should return { workouts, total, page, totalPages }
    },
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
