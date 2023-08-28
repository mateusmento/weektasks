import type { User } from "@/lib/models/user.model";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const createdUser = ref<User | null>(null);
    return { createdUser };
});