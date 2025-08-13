import axios from "axios";
import { User } from "../types";

const API_BASE = "api/v1/users";

export const registerUser = async (
  userData: Omit<User, "id" | "createdAt">
): Promise<User> => {
  // console.log("registerUser inside auth.api.ts hit", userData);
  try {
    const res = await axios.post(`${API_BASE}/register`, userData, {
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

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    console.log(`api ----> ${API_BASE}/login`);
    console.log("auth.api.ts-->", email, password);
    const res = await axios.post(
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
  await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
};

export const updateUserProfile = async (
  updatedData: Partial<Omit<User, "id" | "createdAt" | "email" | "password">>
): Promise<User> => {
  try {
    const res = await axios.patch(`${API_BASE}/update`, updatedData, {
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

// export const getCurrentUser = async (): Promise<User> => {
//   try {
//     const res = await axios.get(`${API_BASE}/profile`, {
//       withCredentials: true,
//     });
//     if (!res.data?.user) {
//       throw new Error("Invalid response from server");
//     }
//     return res.data.user as User;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to fetch user");
//   }
// };
