import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  uploadProfilePicture,
  // getCurrentUser,
} from "../apis/auth.api";
import { useAuthStore } from "../stores/authStore";
import { User } from "../types";

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return loginUser(data.email, data.password);
    },
    onSuccess: (user) => {
      setUser(user);
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (data: Omit<User, "id" | "createdAt">) => {
      return registerUser(data);
    },
    onSuccess: (user) => {
      setUser(user);
    },
    onError: (error: any) => {
      console.error("Registration error:", error.message);
    },
  });
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (
      data: Partial<Omit<User, "id" | "createdAt" | "email" | "password">>
    ) => {
      return updateUserProfile(data);
    },
    onSuccess: (user) => {
      setUser(user); // Update the user in global auth store
    },
    onError: (error: any) => {
      console.error("Update profile error:", error.message);
    },
  });
};

export const useUploadProfilePicture = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess(user) {
      setUser(user);
    },
    onError: (error: any) => {
      console.error("Update profile error:", error.message);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};
