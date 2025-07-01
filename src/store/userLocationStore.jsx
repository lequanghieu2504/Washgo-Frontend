import { Store } from "@tanstack/store";

export const userLocationStore = new Store({
  latitude: null,
  longitude: null,
  error: null,
  isLoading: false,
});
