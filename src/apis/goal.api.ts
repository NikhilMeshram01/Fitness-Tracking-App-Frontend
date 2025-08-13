import axios from "axios";
import { Goal } from "../types";

const API_BASE = "api/v1/goals";

export const createGoal = async (newGoal: Omit<Goal, "_id">): Promise<Goal> => {
  try {
    console.log("create goal api hit from goal.api.ts", newGoal);
    const res = await axios.post(API_BASE, newGoal, {
      withCredentials: true,
    });
    return res.data.goal as Goal;
  } catch (error: any) {
    console.error("createGoal error:", error);
    throw new Error(error.response?.data?.message || "Failed to create goal");
  }
};

export const getGoalsByUser = async (userId: string): Promise<Goal[]> => {
  try {
    const res = await axios.get(API_BASE, {
      params: { userId },
      withCredentials: true,
    });
    return res.data.goals as Goal[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch goals");
  }
};

export const getGoalById = async (id: string): Promise<Goal> => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return res.data.goal as Goal;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch goal");
  }
};

export const updateGoal = async (
  id: string,
  updatedData: Partial<Goal>
): Promise<Goal> => {
  console.log("hit here");
  try {
    const res = await axios.put(`${API_BASE}/${id}`, updatedData, {
      withCredentials: true,
    });
    return res.data.goal as Goal;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update goal");
  }
};

export const deleteGoal = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete goal");
  }
};
