import axios from "axios";
import { Workout } from "../types";
import api from "./api";

const API_BASE = "api/v1/workouts";

// ✅ Create a new workout
export const createWorkout = async (
  newWorkout: Omit<Workout, "id">
): Promise<Workout> => {
  try {
    const res = await api.post(`${API_BASE}`, newWorkout, {
      withCredentials: true,
    });
    return res.data.workout as Workout;
  } catch (error: any) {
    console.log("inside workouts.api.ts-->", error);
    throw new Error(
      error.response?.data?.message || "Failed to create workout"
    );
  }
};

export const getWorkoutsByUser = async (
  userId: string,
  sortBy: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  workouts: Workout[];
  page: number;
  totalPages: number;
  total: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalDuration: number;
  currentPage: number;
  averageDuration: number;
}> => {
  try {
    console.log("sortBy  ----->", sortBy);
    const res = await api.get(`${API_BASE}`, {
      params: { userId, page, limit, sortBy },
      withCredentials: true,
    });
    console.log("res", res);
    return {
      workouts: res.data.workouts,
      page: res.data.page,
      totalPages: res.data.totalPages,
      total: res.data.total,
      totalWorkouts: res.data.totalWorkouts,
      totalCaloriesBurned: res.data.totalCaloriesBurned,
      totalDuration: res.data.totalDuration,
      currentPage: res.data.currentPage,
      averageDuration: res.data.averageDuration,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch workouts"
    );
  }
};

export const last30daysWorkoutByUser = async (
  userId: string
): Promise<{
  workouts: Workout[];
  totalWorkouts: number;
}> => {
  try {
    const res = await api.get(`${API_BASE}/last30days`, {
      params: { userId },
      withCredentials: true,
    });
    console.log("last 30 days from api.ts", res);
    return {
      totalWorkouts: res.data.results,
      workouts: res.data.workouts,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch workouts"
    );
  }
};

// ✅ Get a single workout by ID
export const getWorkoutById = async (id: string): Promise<Workout | null> => {
  try {
    const res = await api.get(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return res.data.workout as Workout;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch workout");
  }
};

// ✅ Update a workout
export const updateWorkout = async (
  id: string,
  updatedData: Partial<Workout>
): Promise<Workout> => {
  try {
    const res = await api.put(`${API_BASE}/${id}`, updatedData, {
      withCredentials: true,
    });
    return res.data.workout as Workout;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update workout"
    );
  }
};

// ✅ Delete a workout
export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    await api.delete(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete workout"
    );
  }
};
