import axios from "axios";
import { User } from "../types";
import api from "./api";

const API_BASE = "api/v1/users";

export const registerUser = async (
  userData: Omit<User, "id" | "createdAt">
): Promise<User> => {
  try {
    const res = await api.post(`${API_BASE}/register`, userData, {
      withCredentials: true,
    });
    if (!res.data?.user) {
      throw new Error("Invalid response from server");
    }
    return res.data.user as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

export const uploadProfilePicture = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const res = await api.post(`${API_BASE}/upload-picture`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!res.data?.user) {
      throw new Error("Invalid response from server");
    }
    return res.data.user as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    console.log(`api ----> ${API_BASE}/login`);
    console.log("auth.api.ts-->", email, password);
    const res = await api.post(
      `${API_BASE}/login`,
      { email, password },
      { withCredentials: true }
    );
    if (!res.data?.user) {
      throw new Error("Invalid response from server");
    }
    return res.data.user as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

export const logoutUser = async (): Promise<void> => {
  console.log("logout hit from auth.api.ts");
  await api.post(`${API_BASE}/logout`, {}, { withCredentials: true });
};

export const updateUserProfile = async (
  updatedData: Partial<Omit<User, "id" | "createdAt" | "email" | "password">>
): Promise<User> => {
  try {
    const res = await api.patch(`${API_BASE}/update`, updatedData, {
      withCredentials: true,
    });
    console.log("res.data?.user -->", res.data.user);
    if (!res.data?.user) {
      throw new Error("Invalid response from server");
    }

    return res.data.user as User;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};
