<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
    <section class="flex items-center justify-center flex-col mt-auto w-screen">
      <img src="/icon.svg" alt="icon">
      <h1 class="font-semibold text-3xl mt-2">
        Set your new password
      </h1>
      <p class="text-gray-700 text-sm">
        Remember: Don't share passwords!
      </p>
      <div
        v-if="error"
        class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm"
      >
        <img style="width: 12px;" src="/caution.svg" alt="caution">
        <div class="flex flex-col ml-2">
          {{ error }}
        </div>
      </div>
      <div
        v-if="message"
        class="flex flex-row p-2 mt-4 mb-2 bg-green-200 text-green-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border text-center border-green-300 shadow-sm"
      >
        <div class="flex flex-col ml-2">
          {{ message }}
        </div>
      </div>
      <form class="w-11/12 max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Password</label>
          <input
            v-model="password"
            class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
            type="password"
            placeholder="e.g. Your secure password"
            aria-label="password"
          >
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Confirm password</label>
          <input
            v-model="passwordConfirmation"
            class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
            type="password"
            placeholder="e.g. Your secure password"
            aria-label="password confirmation"
          >
        </div>
        <button
          type="button"
          class="mt-2 w-full p-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
          @click="resetPassword"
        >
          Reset password
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

export default Vue.extend({
  name: 'ChangeForgotPassword',

  data: () => {
    return {
      password: '',
      passwordConfirmation: '',
      error: '',
      message: '',
    };
  },

  head: {
    title: 'Password reset - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Reset the password of your ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Reset the password of your ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Password reset - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Password reset - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Reset the password of your ' + process.env.APP_NAME + ' account.'
      },
    ],
  },

  mounted() {
    if (!this.$route.query['token']) {
      window.location.replace('/forgot-password');
    }
  },

  methods: {
    async resetPassword() {
      if (!this.password) {
        this.error = 'A password is required.';
        return;
      }

      if (!this.passwordConfirmation) {
        this.error = 'Confirm your password below and try again.';
        return;
      }

      if (this.password !== this.passwordConfirmation) {
        this.error = 'Your passwords don\'t match, try again';
        return;
      }

      try {
        const request = await this.$axios.post('/user/reset-password', {
          password: this.password,
          token: this.$route.query['token']
        });
        if (request.status && request.status === 200) {
          this.message = 'Password reset successful, redirecting.';
          setTimeout(function () {
            if (process.client) {
              window.location.replace('/');
            }
          }, 250);
        }
      } catch (err) {
        this.message = '';
        console.log('Error!');
        console.log(err);
        this.error = err;
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
  width: 180px;
}
</style>
