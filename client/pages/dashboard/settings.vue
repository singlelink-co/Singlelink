<template>
  <section class="flex flex-col p-8 items-center flex-grow bg-gray-100 overflow-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">Profile settings</h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <div v-if="this.error"
           class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm">
        <img style="width: 12px;" src="/caution.svg">
        <div class="flex flex-col ml-2">
          {{ this.error }}
        </div>
      </div>
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Details</h2>
      <form class="flex flex-col">
        <div class="flex flex-row mb-3">
          <div class="flex flex-col w-1/2 mr-4">
            <label class="font-medium text-sm text-gray-800" for="name">Headline</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="name" type="text"
                   placeholder="e.g. Jane Doe, 21" v-model="user.activeProfile.headline"/>
          </div>
          <div class="flex flex-col w-1/2">
            <label class="font-medium text-sm text-gray-800" for="email">Subtitle</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="email" type="email"
                   placeholder="e.g. Developer at Neutron from Raleigh NC" v-model="user.activeProfile.subtitle"/>
          </div>
        </div>
        <div class="flex flex-row mb-4">
          <div class="flex flex-col w-1/2 mr-3">
            <label class="font-medium text-sm text-gray-800" for="handle">Handle</label>
            <div class="flex flex-row rounded border border-solid border-gray-300 text-sm mt-2 overflow-hidden">
              <span
                class="flex p-2 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0">singlelink.co/u/</span>
              <input class="p-2 flex-grow" id="handle" type="text" placeholder="e.g. janedoe" autocomplete="off"
                     v-model="user.activeProfile.handle"/>
            </div>
          </div>
          <div class="flex flex-col w-1/2">
            <label class="font-medium text-sm text-gray-800" for="visibility">Visibility</label>
            <select class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="visibility"
                    v-model="user.activeProfile.visibility">
              <option value="unpublished">Unpublished, not viewable</option>
              <option value="published">Public, no sensitive content (Most used)</option>
              <option value="published-18+">Public, sensitive content warning</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col w-full mb-4">
          <label class="font-medium text-sm text-gray-800" for="image_url">Avatar Image URL</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="image_url" type="text"
                 placeholder="e.g. https://uifaces.co/our-content/donated/rSuiu_Hr.jpg"
                 v-model="user.activeProfile.imageUrl"/>
        </div>
        <div class="flex flex-col w-full mb-6">
          <label class="font-medium text-sm text-gray-800" for="custom_domain">Custom Domain (🐳 Whales only!)</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="custom_domain" type="text"
                 placeholder="e.g. neutroncreative.com (no http/https)" v-model="user.activeProfile.customDomain"/>
        </div>
        <button @click="saveChanges" type="button"
                class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">
          Save changes
        </button>
      </form>
    </div>
    <!-- Delete profile -->
    <div class="flex flex-row p-6 bg-white shadow rounded justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-1/2">
        <h2 class="text-gray-800 font-semibold text-lg w-full">Delete this profile</h2>
        <p class="text-gray-600 font-medium">Done with this profile? Click the button on your right to delete this
          profile and all related content.</p>
      </div>
      <button type="button" @click="openModal"
              class="ml-2 flex p-3 text-sm text-white text-center bg-red-600 hover:bg-red-700 rounded font-semibold w-1/3 justify-center align-center">
        Delete this profile
      </button>
    </div>
    <!-- Confirm profile deletion modal -->
    <div v-if="modal" @click="closeModal"
         class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
         style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg">
        <h2 class="text-gray-800 font-semibold text-xl">Are you sure?</h2>
        <p class="text-gray-600 text-sm">Deleting this profile is irreversible, please confirm to continue.</p>
        <button @click="attemptDelete" type="button"
                class="mt-4 w-full p-4 text-center text-md text-white bg-red-600 hover:bg-red-700 rounded font-semibold">
          Yes, delete this profile
        </button>
      </div>
    </div>
    <!-- Password reset confirmation modal -->
    <div v-if="infoModal" @click="closeInfoModal"
         class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
         style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg">
        <h2 class="text-gray-800 font-semibold text-xl">Password reset requested</h2>
        <p class="text-gray-600 text-sm">A password reset link has been sent to your account email inbox successfully.
          Make sure to check your spam folder.</p>
        <button @click="closeInfoModal" type="button"
                class="mt-4 p-3 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">
          Close
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import {StatusCodes} from "http-status-codes";

export default Vue.extend({
  name: 'dashboard-settings',
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
          imageUrl: '',
          headline: '',
          subtitle: '',
          handle: '',
          customDomain: '',
          visibility: ''
        }
      },
      error: ''
    };
  },

  async mounted() {
    await this.getUserData();
  },

  methods: {
    refreshPreview() {
      if (process.client) {
        let iframe = <HTMLIFrameElement>document.getElementById('preview-frame');

        if (iframe.contentWindow)
          iframe.contentWindow.location.reload();
      }
    },

    async saveChanges() {
      try {
        await this.$axios.$post('/profile/update', {
          token: this.$store.getters['auth/getToken'],
          imageUrl: this.user.activeProfile.imageUrl || null,
          headline: this.user.activeProfile.headline || null,
          subtitle: this.user.activeProfile.subtitle || null,
          handle: this.user.activeProfile.handle || null,
          visibility: this.user.activeProfile.visibility || null,
          customDomain: this.user.activeProfile.customDomain || null
        });

        if (process.client) {
          if (this.user.activeProfile.handle !== this.originalHandle) {
            location.reload();
            return;
          }
        }

        this.refreshPreview();
      } catch (err) {

        if (err.response) {
          if (err.response.status === StatusCodes.CONFLICT) {
            console.error("This handle is already being used by another profile.");
            this.error = "This handle is already being used by another profile.";

            return;
          }
        }

        throw err;
      }
    },

    openInfoModal() {
      return this.infoModal = true;
    },

    closeInfoModal() {
      return this.infoModal = false;
    },

    openModal() {
      return this.modalActive = true;
    },

    closeModal() {
      return this.modalActive = false;
    },

    async attemptDelete() {
      this.$nuxt.$loading.start();
      await this.$axios.$post('/profile/destroy', {
        token: this.$store.getters['auth/getToken']
      });
      this.$nuxt.$loading.finish();
      return location.replace('/dashboard');
    },

    async getUserData() {
      try {
        let token = this.$store.getters['auth/getToken'];

        let userResponse = await this.$axios.$post('/user', {
          token
        });

        let profileResponse = await this.$axios.$post('/profile/active-profile', {
          token
        });

        this.user = userResponse;
        this.user.activeProfile = profileResponse;
        this.originalHandle = this.user.activeProfile.handle;

      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
  }
});
</script>
