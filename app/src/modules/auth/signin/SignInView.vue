<script lang="ts" setup>
import { createAuthService } from '@/lib/service/auth.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../auth.store';
import { Alert } from '@/lib/utils/alert';

const router = useRouter();
const authStore = useAuthStore();

const email = ref(authStore.createdUser?.credential.username);
const password = ref('');

const authService = createAuthService();

async function singin() {
  const credentials = {
    username: email.value,
    password: password.value,
  };

  try {
    await authService.signin(credentials);
    router.push({ name: 'products' });
  } catch (ex) {
    Alert.error('Unauthorized');
  }
}
</script>

<template>
  <div class="signin">
    <div class="card">
      <h3 class="signin-title">Sign in with your account</h3>
      <form @submit.prevent="singin">
        <input v-model="email" placeholder="Email..." />
        <input v-model="password" type="password" placeholder="Password..." />
        <button class="signin-button">Sign In</button>
      </form>
      <div>Don't have an account yet? <RouterLink to="/auth/signup">Sign Up</RouterLink></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signin {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
}

.card {
  width: 320px;
}

a {
  color: var(--light-purple-font);
}

.signin-title {
  margin-bottom: 50px;
  text-align: center;
}

input {
  margin-bottom: 10px;
}

.signin-button {
  display: block;
  margin-left: auto;
}
</style>
