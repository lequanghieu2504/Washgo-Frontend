import { Store } from "@tanstack/store";

export const userStore = new Store({
  userInfo: null,
  userId: null,
  accessToken: null,
  loading: false,
  error: null,
});
