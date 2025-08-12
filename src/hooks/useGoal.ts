import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGoalsByUser,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../apis/goal.api";
import { Goal } from "../types";

export const useGoals = (userId: string) => {
  return useQuery({
    queryKey: ["goals", userId],
    queryFn: () => getGoalsByUser(userId),
    enabled: !!userId,
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: ["goal", id],
    queryFn: () => getGoalById(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newGoal: Omit<Goal, "_id">) => createGoal(newGoal),
    onSuccess: (createdGoal) => {
      queryClient.invalidateQueries({
        queryKey: ["goals", createdGoal.userId],
      });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<Goal>;
    }) => updateGoal(id, updatedData),
    onSuccess: (updatedGoal) => {
      if (updatedGoal) {
        queryClient.invalidateQueries({
          queryKey: ["goals", updatedGoal.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["goal", updatedGoal._id],
        });
      }
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.removeQueries({ queryKey: ["goal", id] });
    },
  });
};
