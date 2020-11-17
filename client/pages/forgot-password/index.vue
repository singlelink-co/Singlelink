<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
    <section class="flex items-center justify-center flex-col mt-auto w-screen">
      <img src="/Icon.svg"/>
      <h1 class="font-semibold text-3xl mt-2">Request a password reset</h1>
      <p class="text-gray-700 text-sm">Remember your password? <a class="text-indigo-600 hover:text-indigo-700"
                                                                  href="/create-account">Login</a></p>
      <div v-if="this.error"
           class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded w-11/12 max-w-sm justify-center items-center text-sm border border-orange-300 shadow-sm">
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ this.error }}
        </div>
      </div>
      <div v-if="this.message"
           class="flex flex-row p-2 mt-4 mb-2 bg-green-200 text-green-600 rounded w-11/12 max-w-sm justify-center items-center text-sm text-center border border-green-300 shadow-sm">
        <div class="flex flex-col ml-2">
          {{ this.message }}
        </div>
      </div>
      <form class="w-11/12 max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Email Address</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" type="email"
                 placeholder="e.g. jane@gmail.com" v-model="email"/>
        </div>
        <button type="button" @click="requestReset"
                class="mt-2 w-full p-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">
          Request reset link
        </button>
      </form>
    </section>
    <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.</br>Copyright ©2020
      Neutron Creative Inc.
    </section>
  </div>
</template>

<style lang="sass">
.NeutronLogo
  width: 180px
</style>

<script>

export default {
  name: 'Forgot password',
  data: () => {
    return {
      email: '',
      password: '',
      error: null,
      message: null,
    };
  },
  middleware: 'unauthenticated',
  methods: {
    async requestReset() {
      try {
        let request = await this.$axios.post('/user/request-reset-password', {
          email: this.email
        });
        if (request.status && request.status === 200) {
          this.error = null;
          this.message = 'Password reset sent, check your inbox.';
        }
      } catch (err) {
        this.message = null;
        console.log('Error!');
        console.log(err);
        this.error = err;
      }
    },
    clearErrors: () => {
      this.error = null;
    }
  }
};
</script>
