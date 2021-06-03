<template>
  <div class="w-screen min-h-screen flex flex-col lg:flex-row text-black">
    <section class="w-full lg:w-1/2 xl:w-5/12 flex flex-col lg:h-screen p-12 items-start justify-center">
      <div class="flex flex-col max-w-lg w-full mx-auto">
        <h1 class="text-5xl font-bold">
          Login
        </h1>
        <p class="opacity-70 font-bold text-2xl mb-8">
          Manage and monitor your Singlelink sites.
        </p>
        <a
          class="flex flex-row items-center font-bold justify-center rounded-full w-full px-8 py-4 text-lg border-gray-300 hover:border-gray-600"
          style="border-width:3px;border-style:solid;"
          @click="attemptGoogleLogin()"
        >
          <img src="/google-icon.png" class="w-5 mr-4">
          Sign in with Google
        </a>
        <div class="w-full flex flex-row items-center justify-center opacity-60 my-4">
          <div class="line"/>
          <p class="mx-4 font-bold">
            Or, sign in with email
          </p>
          <div class="line"/>
        </div>
        <div class="input-group flex flex-col w-full mb-4">
          <label>Email address</label>
          <input v-model="email" type="text" placeholder="e.g. jane@singlelink.co">
        </div>
        <div class="input-group flex flex-col w-full mb-4">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Minimum 8 characters">
        </div>
        <div class="flex flex-row items-center justify-apart w-full my-4">
          <div class="flex flex-row justify-start items-center" style="width:150px;">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              style="border-radius:3px;width:15px;height:15px;"
            >
            <label
              for="remember-me"
              class="opacity-50 ml-3 font-bold"
              style="margin-bottom:0;width:105px;font-size: 14px;"
            >
              <nobr>Remember me?</nobr>
            </label>
          </div>
          <a href="#" class="text-indigo-500 hover:underline ml-auto font-bold">Forgot your password?</a>
        </div>
        <div class="button cursor-pointer" @click="attemptEmailLogin">
          Login to your account
        </div>
        <a
          href="/create-account"
          class="mx-auto text-center font-bold text-indigo-500 mb-4 text-sm hover:underline font-bold"
        >Don't have an account? Get started free</a>
        <span class="mx-auto font-bold text-center opacity-50 text-sm">©{{ new Date().getFullYear() }} Neutron Creative Inc., All rights reserved.</span>
      </div>
    </section>
    <section
      class="hidden lg:flex order-first lg:order-last right w-full lg:w-1/2 xl:w-7/12 flex-col lg:h-screen text-center items-center justify-center p-12 text-white"
    >
      <img src="/integrations.png" class="w-full max-w-sm">
      <h3 class="text-4xl font-bold max-w-sm mb-4">
        Integrations for all of your favorite apps
      </h3>
      <p class="text-2xl opacity-80 max-w-md">Connect your micro-site with your content from all your favorite
        platforms</p>
      <div class="flex flex-row items-center justify-center mt-8 space-x-3">
        <div class="w-3 h-3 rounded-full shadow bg-white"/>
        <div class="w-3 h-3 rounded-full shadow bg-white opacity-40"/>
        <div class="w-3 h-3 rounded-full shadow bg-white opacity-40"/>
        <div class="w-3 h-3 rounded-full shadow bg-white opacity-40"/>
      </div>
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

  head: {
    title: 'Login - ' + process.env.APP_NAME,
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Login to your ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Login to your ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Login - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Login - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Login to your ' + process.env.APP_NAME + ' account.'
      },
    ],
  },

  methods: {
    async attemptEmailLogin() {
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

    async attemptGoogleLogin() {
      this.$cookies.set("remember_auth", this.rememberMe);

      const response = await this.$axios.post('/auth/google/login');

      window.location.assign(response.data);
    },

    clearErrors() {
      this.error = '';
    }
  }
});
</script>

<style>
body {
  background: #FEFEFE;
}

.NeutronLogo {
  width: 180px;
}

* {
  outline: none !important;
}

.right {
  background-color: #5353EC;
  background-image: url('/login-lightning.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top left;
}

.line {
  height: 1px;
  width: auto;
  flex-grow: 1;
  background: rgba(0, 0, 0, .2);
}

label {
  @apply mb-2 text-lg font-bold;
}

.input-group input {
  @apply w-full rounded-full px-8 py-3 text-lg text-gray-800 font-bold outline-none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, .1);
  transition: .1s ease-in;
}

.input-group input:focus {
  box-shadow: 0 0 0 4.5px rgba(83, 83, 236, .8);
}

.button {
  color: #FFF !important;
}

.button {
  @apply mb-8 w-full font-bold rounded-full px-8 py-4 text-lg text-center;
  background: #5353ec;
  background: linear-gradient(to bottom, #5353ec, #1717ca);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .2), 0 2px 25px rgba(83, 83, 267, .25);
  transition: .1s ease-in;
}

.button:hover {
  transform: scale(1.01);
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, .4), 0 2px 15px rgba(83, 83, 267, .75);
}

.button:focus {
  transform: scale(1);
  box-shadow: inset 0 0 0 5px rgba(255, 255, 255, .5), 0 2px 20px rgba(83, 83, 267, .95);
}
</style>
