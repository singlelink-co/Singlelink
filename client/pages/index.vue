<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
    <section class="flex items-center justify-center flex-col mt-auto w-screen">
      <img src="/Icon.svg"/>
      <h1 class="font-semibold text-3xl mt-2">Sign in to your account</h1>
      <p class="text-gray-700 text-sm">Or, <a class="text-indigo-600 hover:text-indigo-700" href="/create-account">create your new account for free</a></p>
      <div v-if="this.error" class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm">
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ this.error }}
        </div>
      </div>
      <form class="w-11/12 max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Email Address</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" type="email" placeholder="e.g. jane@gmail.com" v-model="email"/>
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Password</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" type="password" placeholder="e.g. your password" v-model="password"/>
        </div>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember_me" type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out">
            <label for="remember_me" class="ml-2 block text-sm leading-5 text-gray-700">
              Remember me
            </label>
          </div>
          <div class="text-sm leading-5">
            <n-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:underline">
              Forgot your password?
            </n-link>
          </div>
        </div>
        <button type="button" @click="attempt_login" class="mt-2 w-full p-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">Login</button>
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
  name: 'Login',
  data: () => {
    return {
      email: '',
      password: '',
      error: null
    };
  },
    middleware: 'unauthenticated',
  methods: {
    attempt_login () {
      this.$nuxt.$loading.start();
      if (!this.email){ this.error = 'Email address is required to login.'; return this.$nuxt.$loading.finish(); }
      if (!this.password) { this.error = 'Password is required to login.'; return this.$nuxt.$loading.finish(); }
      this.$axios.post('/user/login', {
        email: this.email,
        password: this.password
      })
        .then((response) => {
          Cookies.setCookie('singlelink_token', response.data.token, 7, this);
          this.$store.commit('auth/login', response.data.token);
          this.$nuxt.$loading.finish();
          return this.$router.push('/dashboard');
        })
        .catch((err) => {
          console.log('Login failed');
          console.log(this.error);
          this.error = 'Your email or password is incorrect!';
          return this.$nuxt.$loading.finish();
        });
    },
    clear_errors: () => {
      this.error = null;
    }
  }
};
</script>
