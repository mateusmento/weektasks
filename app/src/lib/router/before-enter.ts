import { authenticate } from "@/lib/auth/authenticate";
import { useAuthUserStore } from "@/lib/auth/auth-user.store";

export async function beforeEnter() {
  const store = useAuthUserStore();
  const user = await authenticate();
  if (!user) {
    store.user = null;
    return { name: "signin" };
  } else {
    store.user = user;
  }
}
