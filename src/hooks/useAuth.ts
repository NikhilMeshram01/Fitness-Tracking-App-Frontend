// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   loginUser,
//   registerUser,
//   logoutUser,
//   getCurrentUser,
// } from "../apis/auth.api";
// import { useAuthStore } from "../stores/authStore";

// export const useLogin = () => {
//   const setUser = useAuthStore((s) => s.setUser);
//   return useMutation({
//     mutationFn: (data: { email: string; password: string }) =>
//       loginUser(data.email, data.password),
//     onSuccess: (user) => {
//       setUser(user);
//     },
//   });
// };

// export const useRegister = () => {
//   const setUser = useAuthStore((s) => s.setUser);
//   return useMutation({
//     mutationFn: (
//       data: Omit<Parameters<typeof registerUser>[0], "id" | "createdAt">
//     ) => registerUser(data),
//     onSuccess: (user) => {
//       setUser(user);
//     },
//   });
// };

// export const useLogout = () => {
//   const logout = useAuthStore((s) => s.logout);
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: logoutUser,
//     onSuccess: () => {
//       logout();
//       queryClient.clear();
//     },
//   });
// };

// export const useCurrentUser = () => {
//   const setUser = useAuthStore((s) => s.setUser);
//   return useQuery({
//     queryKey: ["currentUser"],
//     queryFn: getCurrentUser,
//     onSuccess: (user) => {
//       setUser(user);
//     },
//     onError: () => setUser(null),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  logoutUser,
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
      console.log("mutation function inside useAUth.ts hit", data);
      return registerUser(data);
    },
    onSuccess: (user) => {
      console.log("user set inside useAuth");
      setUser(user);
    },
    onError: (error: any) => {
      console.error("Registration error:", error.message);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  console.log("log out from useAUth hook");
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};

// export const useCurrentUser = () => {
//   const setUser = useAuthStore((s) => s.setUser);
//   return useQuery({
//     queryKey: ["currentUser"],
//     queryFn: getCurrentUser,
//     onSuccess: (user) => {
//       setUser(user);
//     },
//     onError: () => setUser(null),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };
