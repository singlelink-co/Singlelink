<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 min-h-screen overflow-y-scroll overflow-x-hidden">
    <section class="flex justify-center flex-col mt-auto w-full max-w-sm p-8">
      <img :src="icon_url" :width="icon_width">
      <h1 class="font-bold text-3xl mt-4 tracking-tight">
        Log into {{ app_name }}
      </h1>
      <div
        v-if="error"
        class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm"
      >
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ error }}
        </div>
      </div>
      <form class="w-full mt-4 flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium">Email Address</label>
          <input
            v-model="email"
            class="px-2 py-3 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
            type="email"
            placeholder="e.g. jane@gmail.com"
          >
        </div>
        <div class="flex flex-col mb-6">
          <label class="font-medium">Password</label>
          <input
            v-model="password"
            class="px-2 py-3 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
            type="password"
            placeholder="e.g. your password"
          >
        </div>
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              :value="rememberMe"
            >
            <label for="remember_me" class="ml-2 block text-sm leading-5 text-gray-700">
              Remember me
            </label>
          </div>
          <div class="text-sm leading-5">
            <n-link
              to="/forgot-password"
              class="font-medium text-indigo-600 hover:underline focus:outline-none"
            >
              Forgot your password?
            </n-link>
          </div>
        </div>
        <button
          type="button"
          class="mt-2 w-full p-3 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
          @click="attemptLogin"
        >
          Login
        </button>
        <p v-if="free_signup" class="mt-6 text-center mx-auto text-gray-700">Or, <a class="text-indigo-600 hover:underline" href="/create-account">create
        your new account for free</a></p>
        <a href="https://singlelink.co" class="mt-2 flex items-start justify-center text-xs mx-auto hover:underline text-center w-full text-gray-500">Learn more about Singlelink</a>
      </form>
    </section>
    <section class="flex text-center text-gray-600 text-sm mt-auto mb-4 p-8">All rights reserved.<br>Copyright ©{{ new Date().getFullYear() }}
      {{ organization }}
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'Index',

  middleware: 'unauthenticated',

  data: () => {
    return {
      email: '',
      password: '',
      error: '',
      rememberMe: false,
      hostname: process.env.HOSTNAME,
      app_name: process.env.APP_NAME,
      icon_url: process.env.ICON_URL,
      organization: process.env.ORGANIZATION,
      free_signup: process.env.FREE_SIGNUP,
      icon_width: process.env.ICON_WIDTH
    };
  },

  methods: {
    async attemptLogin() {
      this.$nuxt.$loading.start();

      if (!this.email) {
        this.error = 'Email address is required to login.';
        this.$nuxt.$loading.finish();
        return;
      }

      if (!this.password) {
        this.error = 'Password is required to login.';
        this.$nuxt.$loading.finish();
        return;
      }

      this.$cookies.set("remember_auth", this.rememberMe);

      try {
        const response = await this.$axios.post('/user/login', {
          email: this.email,
          password: this.password
        });

        this.$store.commit('auth/login', response.data.token);
        this.$nuxt.$loading.finish();
        await this.$router.push('/dashboard');
      } catch (err) {
        console.log('Login failed');
        console.log(err);

        this.error = 'Your email or password is incorrect!';
        await this.$nuxt.$loading.finish();
      }
    },

    clearErrors() {
      this.error = '';
    }
  }
});
</script>

<style>
.NeutronLogo {
  width: 180px;
}
* {
  outline: none !important;
}
</style>
