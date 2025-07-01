import { useStore } from "@tanstack/react-store";
import { userStore } from "@/store/userStore";

export const useUserStore = () => {
  return useStore(userStore, (s) => s);
};
