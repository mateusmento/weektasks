import type { User } from "@/lib/models/user.model";
import { defineStore } from "pinia";

export const useAuthUserStore = defineStore("auth-user", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {},
});
