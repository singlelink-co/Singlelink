<template>
  <div class="flex flex-col items-center justify-center bg-gray-50 min-h-screen">
    <section class="flex items-center justify-center flex-col mt-auto w-screen">
      <img src="/Icon.svg"/>
      <h1 class="font-semibold text-3xl mt-2">Create a new account</h1>
      <p class="text-gray-700 text-sm">Or, <a class="text-indigo-600 hover:text-indigo-700" href="/">sign in to your existing account</a></p>
      <div v-if="this.error" class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm">
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ this.error }}
        </div>
      </div>
      <form class="w-11/12 max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Email Address</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-200 rounded-sm border" type="email" placeholder="e.g. jane@gmail.com" v-model="email"/>
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm text-gray-800" for="handle">Handle</label>
          <div class="flex flex-row p-2 pl-0 pt-0 pb-0 mt-2 text-sm border-solid border-gray-200 rounded-sm border">
            <span class="flex p-2 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0">{{ origin }}/u/</span>
            <input class="p-2 flex-grow" id="handle" type="text" placeholder="e.g. janedoe" v-model="handle"/>
          </div>
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Password</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-200 rounded-sm border" type="password" placeholder="e.g. your password" v-model="password"/>
        </div>
        <button @click="attempt_register" type="button" class="mt-2 w-full p-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-sm font-semibold">Sign up</button>
      </form>
    </section>
    <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.</br>Copyright ©2020 Neutron Creative Inc.</section>
  </div>
</template>

<style lang="sass">
  .NeutronLogo
    width: 180px
</style>

<script>
  import Cookies from "~/middleware/utils";

  export default {
    data: function() {
      return {
        email: '',
        password: '',
        handle: '',
        error: null
      };
    },
    computed: {
      origin: function() {
        return window.location.origin.replace('https://', '').replace('http://', '');
      }
    },
    middleware: 'unauthenticated',
    methods: {
      attempt_register () {
        this.$nuxt.$loading.start();
        if (!this.email){ this.error = 'Email address is required to register.'; return this.$nuxt.$loading.finish(); }
        if (!this.email){ this.error = 'A unique handle is required to register.'; return this.$nuxt.$loading.finish(); }
        if (!this.password) { this.error = 'A password is required to register.'; return this.$nuxt.$loading.finish(); }
        this.$axios.post('/user/create', {
          email: this.email,
          handle: this.handle,
          password: this.password,
        })
          .then((response) => {
            console.log('Created account successful');
            console.log(response);
            Cookies.setCookie('singlelink_token', response.data.token, 7, this);
            this.$store.commit('auth/login', response.data.token);
            this.$nuxt.$loading.finish();
            return this.$router.push('/dashboard');
          })
          .catch((err) => {
            console.log('Creating account failed');
            console.log(this.error);
            this.error = 'Failed to create account, email or handle already in use. Try again with a different email address.';
            return this.$nuxt.$loading.finish();
          });
      },
      clear_errors: () => {
        this.error = null;
      }
    }
  };
</script>
