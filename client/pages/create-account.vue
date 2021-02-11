<template>
  <div class="flex flex-col items-center justify-center bg-gray-50 min-h-screen overflow-x-hidden w-full">
    <div class="flex-col lg:flex-row flex items-start justify-between lg:space-x-16 w-full px-8 py-8 lg:py-24 max-w-5xl">
      <section class="flex justify-center flex-col w-full lg:w-1/2">
      <h1 class="font-bold text-3xl mb-2 tracking-tight">
        Create your <span class="lg:hidden">free </span>{{ app_name }} account
      </h1>
      <p class="text-gray-600 mb-2 leading-relaxed">{{ app_name }} makes it easy to add your content and publish your first profile in seconds. No credit card required.</p>
      <div
        v-if="error"
        class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded-lg w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm"
      >
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ error }}
        </div>
      </div>
      <form class="w-full mt-2 flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium">Email Address</label>
          <input
            v-model="email"
            class="px-2 py-3 mt-2 text-sm border-solid border-gray-200 rounded-lg border"
            type="email"
            placeholder="e.g. jane@gmail.com"
            aria-label="email"
          >
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-gray-800" for="handle">Handle</label>
          <div class="flex flex-row mt-2 text-sm border-solid border-gray-200 rounded-lg bg-white border overflow-hidden">
            <span
              class="flex px-2 py-3 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0"
            >
              {{ hostname }}/u/
            </span>
            <input id="handle" v-model="handle" class="p-2 flex-grow" type="text" placeholder="e.g. janedoe">
          </div>
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium">Password</label>
          <input
            v-model="password"
            class="px-2 py-3 mt-2 text-sm border-solid border-gray-200 rounded-lg border"
            type="password"
            placeholder="e.g. your password"
            aria-label="password"
          >
        </div>
        <button
          type="button"
          class="mt-2 w-full p-3 text-center text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg"
          @click="attemptRegister"
        >
          Create your free Singlelink
        </button>
        <p class="text-gray-600 mt-4 flex lg:hidden mx-auto items-center justify-center">Already have an account? <a class="text-indigo-600 font-semibold hover:underline ml-2" href="/">Login</a></p>
      </form>
      </section>
      <section class="flex justify-center flex-col w-full lg:w-1/2 order-first lg:order-last mb-8 lg:mb-4">
          <img :src="logo_url" class="mt-4" :width="logo_width"/>
          <div class="py-8 flex-col space-y-8 hidden lg:flex">
            <div class="flex flex-row items-start justify-start">
              <img src="/checkmark.svg" class="w-10 h-auto mr-6 mt-2"/>
              <div class="flex flex-col space-y-1">
                <span class="font-semibold text-gray-900 text-lg">Fast & free signup</span>
                <span class="text-gray-600">Publish your first profile in seconds, no credit card neccessary.</span>
              </div>
            </div>
            <div class="flex flex-row items-start justify-start">
              <img src="/checkmark.svg" class="w-10 h-auto mr-6 mt-2"/>
              <div class="flex flex-col space-y-1">
                <span class="font-semibold text-gray-900 text-lg">Grow without limits</span>
                <span class="text-gray-600">Scale infinitely with our limitless hosting & style limitlessly with custom HTML & CSS for free.</span>
              </div>
            </div>
            <div class="flex flex-row items-start justify-start">
              <img src="/checkmark.svg" class="w-10 h-auto mr-6 mt-2"/>
              <div class="flex flex-col space-y-1">
                <span class="font-semibold text-gray-900 text-lg">Engage fans internationally</span>
                <span class="text-gray-600">More than 1,000 creators around the world trust Singlelink to reach their audience. <!--Our profiles average a <span class="font-bold text-indigo-600 underline">41.3% click through rate!</span>--></span>
              </div>
            </div>
          </div>
          <p class="text-gray-600 mt-4 hidden lg:flex">Already have an account? <a class="text-indigo-600 font-semibold hover:underline ml-2" href="/">Login</a></p>
      </section>
    </div>
    <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.<br>Copyright ©{{ new Date().getFullYear() }}
      {{ organization }}
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
      error: '',
      hostname: process.env.HOSTNAME,
      app_name: process.env.APP_NAME,
      logo_url: process.env.LOGO_URL,
      organization: process.env.ORGANIZATION,
      logo_width: process.env.LOGO_WIDTH
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
* {
  outline: none !important;
}
</style>
