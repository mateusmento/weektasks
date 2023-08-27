import { axios } from "@/lib/axios";

export const createAuthService = () => ({
  signin(credentials: any) {
    return axios.post("/auth/access", credentials);
  },

  signout() {
    return axios.delete("/auth/access");
  },
});
