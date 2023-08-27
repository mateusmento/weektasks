<script setup lang="ts">
import { useAuthUserStore } from '@/lib/auth/auth-user.store';
import { createAuthService } from '@/lib/service/auth.service';
import { vOnClickOutside } from '@vueuse/components';
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import ColorfulBar from './ColorfulBar.vue';
import SearchBar from './SearchBar.vue';

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id);
const productId = computed(() => route.path.startsWith("/products") ? +route.params.id : null);

const authUserStore = useAuthUserStore();

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function hideDropdown() {
  showDropdown.value = false;
}

const authService = createAuthService();

async function signout() {
  await authService.signout();
  authUserStore.user = null;
  router.push("/auth/signin");
}
</script>

<template>
  <header>
    <div class="header-content">
      <nav>
        <router-link :to="{ name: 'timeline', params: { id } }">Timeline</router-link>
        <router-link :to="{ name: 'backlog', params: { id } }">Backlog</router-link>
        <router-link :to="{ name: 'board', params: { id } }">Board</router-link>
        <router-link :to="{ name: 'calendar', params: { id } }">Calendar</router-link>
        <router-link :to="{ name: 'collaborators', params: { id } }">Collaborators</router-link>
        <router-link :to="{ name: 'history', params: { id } }">History</router-link>
      </nav>

      <SearchBar v-if="productId" :productId="productId" />

      <div class="right-side">
        <router-link to="/products">
          <button class="purple" pill>Weektasks</button>
        </router-link>
        <div class="dropdown" :class="{ active: showDropdown }" v-on-click-outside="hideDropdown">
          <div class="dropdown-toggle" @click="toggleDropdown">
            <img class="user-photo" :src="`http://localhost:3000/users/${authUserStore.user?.id}/photo`" />
          </div>
          <ul class="dropdown-menu menu list">
            <li>Welcome, {{ authUserStore.user?.name }}</li>
            <li class="menu-item">
              <RouterLink to="" @click="toggleDropdown" @click.prevent="signout">Sign Out</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <ColorfulBar />
  </header>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

nav {
  display: flex;
  gap: 30px;
}

.right-side {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 200px;
}

.user-photo {
  width: 30px;
}
</style>

<style lang="sass" scoped>
.dropdown-menu
  right: 0
  margin-top: 10px
</style>
