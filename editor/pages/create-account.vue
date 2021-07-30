<template>
  <div class="w-screen min-h-screen flex flex-col lg:flex-row text-black">

    <section class="w-full flex flex-col lg:h-screen p-12 items-start justify-center">
      <div class="flex flex-col max-w-lg w-full mx-auto">
        <h1 class="text-5xl font-bold">Create an account</h1>
        <p class="opacity-70 font-bold text-2xl mb-8">Create your first Singlelink site in minutes!</p>
        <a href="#"
           class="flex flex-row items-center font-bold justify-center rounded-full w-full px-8 py-4 text-lg border-gray-300 hover:border-gray-600"
           style="border-width:3px;border-style:solid;"
           @click="attemptGoogleRegister"
        >
          <img src="/google-icon.png" class="w-5 mr-4" alt="google-icon"/>
          Sign up with Google
        </a>
        <div class="w-full flex flex-row items-center justify-center opacity-60 my-4">
          <div class="line"></div>
          <p class="mx-4 font-bold">Or, sign up with email</p>
          <div class="line"></div>
        </div>
        <div class="input-group flex flex-col w-full mb-4">
          <label>Email address</label>
          <input v-model="email" type="text" placeholder="e.g. jane@singlelink.co"/>
        </div>
        <div class="input-group flex flex-col w-full mb-4">
          <label>Handle</label>
          <input v-model="handle" type="text" placeholder="e.g. jim"/>
        </div>
        <div class="input-group flex flex-col w-full mb-4">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Minimum 8 characters"/>
        </div>
        <div class="flex flex-row items-center justify-apart w-full my-4">
          <div class="flex flex-row justify-start items-center" style="width:150px;">
            <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe"
                   style="border-radius:3px;width:15px;height:15px;"/>
            <label for="remember-me" class="opacity-50 ml-3" style="margin-bottom:0;width:105px;font-size: 14px;">
              <nobr>Remember me?</nobr>
            </label>
          </div>
        </div>
        <div @click="attemptEmailRegister" class="button cursor-pointer">Get started free</div>
        <div v-if="error" class="error">
          {{ error }}
        </div>
        <a href="/" class="mx-auto text-center text-indigo-500 mb-4 text-sm hover:underline font-bold">Already have an
          account? Click here to login</a>
        <span class="mx-auto text-center opacity-50 font-bold text-sm">©{{ new Date().getFullYear() }} Neutron Creatixve Inc., All rights reserved.</span>
      </div>
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
      app_name: process.env.APP_NAME,
      logo_url: process.env.LOGO_URL,
      organization: process.env.ORGANIZATION,
      logo_width: process.env.LOGO_WIDTH,
      rememberMe: false
    };
  },
  head: {
    title: 'Create your free account - ' + process.env.APP_NAME,
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Create your free ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Create your free ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Create your free account - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Create your free account - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Create your free ' + process.env.APP_NAME + ' account.'
      },
    ],
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
    async attemptEmailRegister() {
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

        window.location.href = '/dashboard?tour=sl-101-01';
      } catch (err) {
        if (err.response) {
          if (err.response.status === StatusCodes.CONFLICT) {
            this.error = 'Email or handle already in use. Try again with a different email address or handle.';
          } else if (err.response.status === StatusCodes.BAD_REQUEST) {
            this.error = `Error: ${err.response.data.error}`;
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

    async attemptGoogleRegister() {
      this.$cookies.set("remember_auth", this.rememberMe);

      const response = await this.$axios.post('/auth/google/create');

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

.error {
  @apply bottom-0 rounded-lg shadow border border-gray-200;
  color: mintcream;
  background-color: #ff4a4a;
  padding: 7px;
  z-index: 25;
}

</style>
