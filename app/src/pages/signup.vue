<script lang="ts" setup>
import { computed, ref } from 'vue';
import { AxiosError } from 'axios';
import { createUsersRepository } from '@/lib/service/users.service';

const name = ref('');
const email = ref('');
const password = ref('');
const repassword = ref('');

const usersRepo = createUsersRepository();

const passwordStrengh = computed(() => {
  const hasMinimalLength = password.value.length >= 8;
  const containsNumber = /\d/g.test(password.value);
  const containsLetters = /[a-zA-z]/g.test(password.value);
  let strengh = 0;
  if (hasMinimalLength) strengh++;
  if (containsNumber) strengh++;
  if (containsLetters) strengh++;

  switch (strengh) {
    case 1:
      return 'weak';
    case 2:
      return 'medium';
    case 3:
      return 'strong';
    default:
      return false;
  }
});

const confirmedPassword = computed(() => password.value === repassword.value);

async function signup() {
  if (password.value !== repassword.value) return alert("Passwords don't match");

  const userData = {
    name: name.value,
    username: email.value,
    password: password.value,
  };

  try {
    await usersRepo.createUser(userData);
  } catch (ex) {
    if (ex instanceof AxiosError) {
      alert(ex.response?.data.message);
    }
  }
}
</script>

<template>
  <div class="signup">
    <div class="card">
      <div class="signup-title">
        <h1>Weektasks</h1>
        <div>Find your power with Scrum best tool support</div>
      </div>
      <form class="signup-form flex-vert gap-md" @submit.prevent="signup">
        <div>
          <label>Name</label>
          <input v-model="name" class="name" placeholder="Full name" />
        </div>
        <div>
          <label>Email</label>
          <input v-model="email" class="email" placeholder="Your email" />
        </div>
        <div class="form-control">
          <label>Password</label>
          <input
            v-model="password"
            class="password"
            type="password"
            placeholder="At least 8 characters"
          />
          <div class="password-strengh" :class="passwordStrengh">
            <div class="bullet"></div>
            <div class="bullet"></div>
            <div class="bullet"></div>
          </div>
          <small :class="{ hide: !passwordStrengh }">{{ passwordStrengh }} password</small>
        </div>
        <div class="form-control">
          <label>Repassword</label>
          <input
            v-model="repassword"
            class="password"
            type="password"
            placeholder="Retype password"
          />
          <small :class="{ hide: !confirmedPassword }">Password confirmed</small>
        </div>
        <button class="signup-button" type="submit">Sign Up</button>
      </form>
      <div>Already have an account? <RouterLink to="/signin">Sign In</RouterLink></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signup {
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

.signup-title {
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 2rem;
    font-size: 32px;
  }

  div {
    font-size: 14px;
    margin-top: 10px;
    /* width: 200px; */
    text-align: center;
  }
}

input {
  margin-bottom: 10px;
}

.signup-button {
  display: block;
  margin-left: auto;
}

.form-control small {
  display: block;
  margin-left: 5px;
  margin-top: 5px;
}

.hide {
  opacity: 0;
}

.password-strengh {
  display: flex;
  width: 100%;
  gap: 5px;
  margin-top: 10px;
  padding: 0 5px;

  .bullet {
    /* width: 20px; */
    height: 5px;
    background-color: #ccc;
    flex: 1;
    border-radius: 2px;
  }

  &.weak .bullet:nth-child(1) {
    background-color: var(--light-orange-bg);
  }

  &.weak + small {
    color: var(--strong-orange-bg);
  }

  &.medium .bullet:nth-child(1),
  &.medium .bullet:nth-child(2) {
    background-color: var(--light-blue-bg);
  }

  &.medium + small {
    color: var(--strong-blue-bg);
  }

  &.strong .bullet:nth-child(1),
  &.strong .bullet:nth-child(2),
  &.strong .bullet:nth-child(3) {
    background-color: var(--light-green-bg);
  }

  &.strong + small {
    color: var(--strong-green-bg);
  }
}

input {
  margin-bottom: 0;
}
</style>
