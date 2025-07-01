import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userStore } from "@/store/userStore";

const loginUser = async ({ username, password }) => {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || "Login failed";
    throw new Error(message);
  }

  return data; // { accessToken, refreshToken, user: { ... }, userId? }
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onMutate: () => {
      userStore.setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));
    },

    onSuccess: (data) => {
      const userId = data.user?.id || data.userId;

      userStore.setState((s) => ({
        ...s,
        userInfo: data.user,
        userId: userId,
        accessToken: data.accessToken,
        loading: false,
        error: null,
      }));

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userId", userId);

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },

    onError: (error) => {
      console.error("Login error:", error.message);
      userStore.setState((s) => ({
        ...s,
        loading: false,
        error: error.message || "Login failed",
      }));
    },
  });
};
