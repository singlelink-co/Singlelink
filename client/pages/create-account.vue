<template>
  <div class="flex flex-col items-center justify-center bg-gray-50 min-h-screen">
    <section class="flex items-center justify-center flex-col mt-auto w-screen">
      <img src="/icon.svg">
      <h1 class="font-semibold text-3xl mt-2">
        Create a new account
      </h1>
      <p class="text-gray-700 text-sm">Or, <a class="text-indigo-600 hover:text-indigo-700" href="/">sign in to your
        existing account</a></p>
      <div
        v-if="error"
        class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm"
      >
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ error }}
        </div>
      </div>
      <form class="w-11/12 max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Email Address</label>
          <input
            v-model="email"
            class="p-2 mt-2 text-sm border-solid border-gray-200 rounded-sm border"
            type="email"
            placeholder="e.g. jane@gmail.com"
            aria-label="email"
          >
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm text-gray-800" for="handle">Handle</label>
          <div class="flex flex-row p-2 pl-0 pt-0 pb-0 mt-2 text-sm border-solid border-gray-200 rounded-sm border">
            <span
              class="flex p-2 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0"
            >
              {{ origin }}/u/
            </span>
            <input id="handle" v-model="handle" class="p-2 flex-grow" type="text" placeholder="e.g. janedoe">
          </div>
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Password</label>
          <input
            v-model="password"
            class="p-2 mt-2 text-sm border-solid border-gray-200 rounded-sm border"
            type="password"
            placeholder="e.g. your password"
            aria-label="password"
          >
        </div>
        <button
          type="button"
          class="mt-2 w-full p-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-sm font-semibold"
          @click="attemptRegister"
        >
          Sign up
        </button>
      </form>
    </section>
    <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.<br>Copyright ©2020
      Neutron Creative Inc.
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {StatusCodes} from "http-status-codes";

export default Vue.extend({
  name: 'CreateAccount',
  middleware: 'unauthenticated',

  data() {
    return {
      email: '',
      password: '',
      handle: '',
      error: ''
    };
  },

  computed: {
    origin() {
      if (process.client) {
        return window.location.origin.replace('https://', '').replace('http://', '');
      }

      return '';
    }
  },

  methods: {
    async attemptRegister() {
      this.$nuxt.$loading.start();
      if (!this.email) {
        this.error = 'Email address is required to register.';
        this.$nuxt.$loading.finish();
        return;
      }
      if (!this.email) {
        this.error = 'A unique handle is required to register.';
        this.$nuxt.$loading.finish();
        return;
      }
      if (!this.password) {
        this.error = 'A password is required to register.';
        this.$nuxt.$loading.finish();
        return;
      }

      try {
        const response = await this.$axios.post('/user/create', {
          email: this.email,
          handle: this.handle,
          password: this.password,
        });

        // Cookies.setCookie('singlelink_token', response.data.token, 7);
        this.$store.commit('auth/login', response.data.token);
        this.$nuxt.$loading.finish();

        await this.$router.push('/dashboard');
      } catch (err) {
        if (err.response) {
          if (err.response.status === StatusCodes.CONFLICT) {
            this.error = 'Email or handle already in use. Try again with a different email address or handle.';
          } else {
            this.error = 'The server was unable to create your account. Please try again later.';
          }

          console.error(this.error);
        } else {
          throw err;
        }

        this.$nuxt.$loading.finish();
      }
    },

    clearErrors() {
      this.error = '';
    }
  }
});
</script>

<style lang="scss">
.NeutronLogo {
  width: 180px
}
</style>
