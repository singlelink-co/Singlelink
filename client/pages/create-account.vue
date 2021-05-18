<template>
	<div class="w-screen min-h-screen flex flex-col lg:flex-row text-white">
		<section class="w-full lg:w-1/2 xl:w-5/12 flex flex-col lg:h-screen p-12 items-start justify-center">
            <div class="flex flex-col max-w-lg w-full mx-auto">
                <h1 class="text-5xl font-bold mb-4">Create an account</h1>
                <p class="opacity-80 font-semibold text-2xl mb-8">Create your first Singlelink site free!</p>
                <a href="#" class="flex flex-row items-center font-semibold justify-center rounded-full w-full px-8 py-4 text-lg border-2 border-gray-700 hover:border-white" >
                    <img src="/google-icon.png" class="w-5 mr-4"/>
                    Sign up with Google
                </a>
                <div class="w-full flex flex-row items-center justify-center opacity-60 my-4">
                    <div class="line"></div>
                    <p class="mx-4">Or, sign up with email</p>
                    <div class="line"></div>
                </div>
                <div class="flex flex-col w-full mb-4">
                    <label>Email address</label>
                    <input v-model="email" type="text" placeholder="e.g. jane@singlelink.co"/>
                </div>
                <div class="flex flex-col w-full mb-4">
                    <label>Handle</label>
                    <input v-model="handle" type="text" placeholder="e.g. jim"/>
                </div>
                <div class="flex flex-col w-full mb-4">
                    <label>Password</label>
                    <input v-model="password" type="password" placeholder="Minimum 8 characters"/>
                </div>
                <div class="flex flex-row items-center justify-apart w-full my-4">
                    <div class="flex flex-row justify-start items-center" style="width:150px;">
                        <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe" style="border-radius:3px;width:15px;height:15px;"/>
                        <label for="remember-me" class="opacity-50 ml-3" style="margin-bottom:0;width:105px;font-size: 14px;"><nobr>Remember me?</nobr></label>
                    </div>
                </div>
                <div @click="attemptRegister" class="button">Get started free</div>
                <a href="/" class="mx-auto text-center text-indigo-500 mb-4 text-sm hover:underline font-semibold">Already have an account? Click here to login</a>
                <span class="mx-auto text-center opacity-50 text-sm">©2021 Neutron Creatixve Inc., All rights reserved.</span>
            </div>
        </section>
		<section class="order-first lg:order-last right w-full lg:w-1/2 xl:w-7/12 flex flex-col lg:h-screen text-center items-center justify-center p-12">
            <img src="/integrations.png" class="w-full max-w-sm"/>
            <h3 class="text-4xl font-bold max-w-sm mb-4">Integrations for all of your favorite apps</h3>
            <p class="text-2xl opacity-80 max-w-md">Connect your micro-site with your content from all your favorite platforms</p>
            <div class="flex flex-row items-center justify-center mt-8 space-x-3">
                <div class="w-3 h-3 rounded-full shadow bg-white"></div>
                <div class="w-3 h-3 rounded-full shadow bg-white opacity-40"></div>
                <div class="w-3 h-3 rounded-full shadow bg-white opacity-40"></div>
                <div class="w-3 h-3 rounded-full shadow bg-white opacity-40"></div>
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
      logo_width: process.env.LOGO_WIDTH,
      rememberMe: false
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

        window.location.href='/dashboard?tour=sl-101-01';
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

<style>
body {
	background: #111;
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
        background: rgba(255,255,255,.2);
    }
    label {
        @apply mb-2 text-lg font-semibold;
    }
    input {
        @apply w-full rounded-full px-8 py-3 text-lg text-gray-800 font-semibold outline-none;
        transition: .1s ease-in;
    }
    input:focus {
        box-shadow: 0 0 0 4.5px rgba(83,83,236,.8);
    }
        .button {
            color: #FFF !important;
        }
    .button {
        @apply mb-8 w-full font-bold rounded-full px-8 py-4 text-lg text-center;
        background: #5353ec;
        background: linear-gradient(to bottom, #5353ec, #1717ca);
        box-shadow: inset 0 0 0 3px rgba(255,255,255,.2), 0 2px 25px rgba(83,83,267,.25);
        transition: .1s ease-in;
    }
    .button:hover {
        transform: scale(1.01);
        box-shadow: inset 0 0 0 4px rgba(255,255,255,.4), 0 2px 15px rgba(83,83,267,.75);
    }
    .button:focus {
        transform: scale(1);
        box-shadow: inset 0 0 0 5px rgba(255,255,255,.5), 0 2px 20px rgba(83,83,267,.95);
    }
</style>
