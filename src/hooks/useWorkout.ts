import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkoutsByUser,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../apis/workout.api";
import { Workout } from "../types";

// 🔁 Get all workouts for a user
export const useWorkouts = (userId: string) => {
  return useQuery({
    queryKey: ["workouts", userId],
    queryFn: () => getWorkoutsByUser(userId),
    enabled: !!userId, // only fetch if userId exists
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
