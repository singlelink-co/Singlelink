<template>
  <section class="flex flex-col p-8 items-center flex-grow bg-gray-100 overflow-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">
      Settings
    </h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
        Profile details
      </h2>
      <form class="flex flex-col">
        <div class="flex flex-row mb-3">
          <div class="flex flex-col w-1/2 mr-4">
            <label class="font-medium text-sm text-gray-800" for="name">Full Name</label>
            <input
              id="name"
              v-model="user.name"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
              type="text"
              placeholder="e.g. Jane Doe"
            >
          </div>
          <div class="flex flex-col w-1/2">
            <label class="font-medium text-sm text-gray-800" for="email">Email Address</label>
            <input
              id="email"
              v-model="user.email"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
              type="email"
              placeholder="e.g. jane@gmail.com"
            >
          </div>
        </div>
        <div class="flex flex-row mb-6">
          <div class="flex flex-col w-1/2 mr-3">
            <label class="font-medium text-sm text-gray-800" for="handle">Handle</label>
            <div class="flex flex-row rounded border border-solid border-gray-300 text-sm mt-2 overflow-hidden">
              <span
                class="flex p-2 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0"
              >singlelink.co/u/</span>
              <input
                id="handle"
                v-model="user.activeProfile.handle"
                class="p-2 flex-grow"
                type="text"
                placeholder="e.g. janedoe"
              >
            </div>
          </div>
          <div class="flex flex-col w-1/2">
            <label class="font-medium text-sm text-gray-800" for="visibility">Visibility</label>
            <select
              id="visibility"
              v-model="user.activeProfile.visibility"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
            >
              <option value="unpublished">
                Unpublished, not viewable
              </option>
              <option value="published">
                Public, no sensitive content (Most used)
              </option>
              <option value="published-18+">
                Public, sensitive content warning
              </option>
            </select>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center"
        >
          Save changes
        </button>
      </form>
    </div>
    <div class="flex flex-row p-6 bg-white shadow rounded justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-1/2">
        <h2 class="text-gray-800 font-semibold text-lg w-full">
          Reset your password
        </h2>
        <p class="text-gray-600 font-medium">Forgot your password? Click the button to the right to have a reset link
          sent to your account email.</p>
      </div>
      <button
        type="button"
        class="ml-2 flex p-3 text-sm text-white text-center bg-blue-600 hover:bg-blue-700 rounded font-semibold w-1/3 justify-center align-center"
        @click="openInfoModal"
      >
        Request reset link
      </button>
    </div>
    <div class="flex flex-row p-6 bg-white shadow rounded justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-1/2">
        <h2 class="text-gray-800 font-semibold text-lg w-full">
          Delete your account
        </h2>
        <p class="text-gray-600 font-medium">Done with Singlelink? Click the button on your right to delete your account
          and all related info.</p>
      </div>
      <button
        type="button"
        class="ml-2 flex p-3 text-sm text-white text-center bg-red-600 hover:bg-red-700 rounded font-semibold w-1/3 justify-center align-center"
        @click="openModal"
      >
        Delete your account
      </button>
    </div>
    <div
      v-if="modal"
      class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
      style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
      @click="closeModal"
    >
      <div class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg" @click.stop>
        <h2 class="text-gray-800 font-semibold text-xl">
          Are you sure?
        </h2>
        <p class="text-gray-600 text-sm">
          Deleting your account is irreversible, please confirm to continue.
        </p>
        <button
          type="button"
          class="mt-4 w-full p-4 text-center text-md text-white bg-red-600 hover:bg-red-700 rounded font-semibold"
          @click="attemptDelete"
        >
          Yes, delete my account
        </button>
      </div>
    </div>
    <div
      v-if="infoModal"
      class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
      style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
      @click="closeInfoModal"
    >
      <div class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg" @click.stop>
        <h2 class="text-gray-800 font-semibold text-xl">
          Password reset requested
        </h2>
        <p class="text-gray-600 text-sm">A password reset link has been sent to your account email inbox successfully.
          Make sure to check your spam folder.</p>
        <button
          type="button"
          class="mt-4 p-3 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
          @click="closeInfoModal"
        >
          Close
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DashboardAccountSettings',
  layout: 'dashboard',
  middleware: 'authenticated',

  data() {
    return {
      infoModal: false,
      modalActive: false,
      originalHandle: '',
      user: {
        name: '',
        email: '',
        activeProfile: {
          handle: '',
          visibility: ''
        }
      }
    };
  },

  async mounted() {
    await this.getUserData();
  },

  methods: {
    openInfoModal() {
      this.infoModal = true;
    },

    closeInfoModal() {
      this.infoModal = false;
    },

    openModal() {
      this.modalActive = true;
    },

    closeModal() {
      this.modalActive = false;
    },

    attemptDelete() {
      // this.closeModal();
      this.$nuxt.$loading.start();
      this.$router.push('/');
      this.$nuxt.$loading.finish();
    },

    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const userResponse = await this.$axios.$post('/user', {
          token
        });

        const profileResponse = await this.$axios.$post('/profile/active-profile', {
          token
        });

        this.user = userResponse;
        this.user.activeProfile = profileResponse;
        this.originalHandle = this.user.activeProfile.handle;
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    }
  }
});
</script>
