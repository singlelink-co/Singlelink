<template>
  <section class="flex flex-col p-8 items-center bg-gray-100 overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">
      Profile settings
    </h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <transition name="fade">
        <div
          v-if="error"
          class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
        >
          <img style="width: 12px;" src="/caution.svg" alt="caution">
          <div class="flex flex-col ml-2">
            {{ error }}
          </div>
        </div>
      </transition>

      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
        Details
      </h2>
      <form class="flex flex-col">
        <div class="flex flex-col lg:flex-row mb-3">
          <div class="flex flex-col w-full lg:w-1/2 mr-4 mb-3 lg:mb-0">
            <label class="font-medium text-sm text-gray-800" for="name">Headline</label>
            <input
              id="name"
              v-model="user.activeProfile.headline"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
              type="text"
              placeholder="e.g. Jane Doe, 21"
            >
          </div>
          <div class="flex flex-col w-full lg:w-1/2">
            <label class="font-medium text-sm text-gray-800" for="email">Subtitle</label>
            <input
              id="email"
              v-model="user.activeProfile.subtitle"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
              type="email"
              placeholder="e.g. Developer at Neutron from Raleigh NC"
            >
          </div>
        </div>
        <div class="flex flex-col lg:flex-row mb-4">
          <div class="flex flex-col w-full lg:w-1/2 mr-3 mb-3 lg:mb-0">
            <label class="font-medium text-sm text-gray-800" for="handle">Handle</label>
            <div class="flex flex-row rounded border border-solid border-gray-300 text-sm mt-2 overflow-hidden">
              <span
                class="flex p-2 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0"
              >{{ hostname }}/u/</span>
              <input
                id="handle"
                v-model="user.activeProfile.handle"
                class="p-2 flex-grow"
                type="text"
                placeholder="e.g. janedoe"
                autocomplete="off"
              >
            </div>
          </div>
          <div class="flex flex-col w-full lg:w-1/2">
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
        <div class="flex flex-col w-full mb-4">
          <label class="font-medium text-sm text-gray-800" for="image_url">Avatar Image URL</label>
          <input
            id="image_url"
            v-model="user.activeProfile.imageUrl"
            class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
            type="text"
            placeholder="e.g. https://uifaces.co/our-content/donated/rSuiu_Hr.jpg"
          >
        </div>

        <div class="flex flex-col w-full mb-6">
          <label class="font-medium text-sm text-gray-800" for="custom_domain">Custom Domain (hostname only) (🐳 Whales
            only!)</label>
          <input
            id="custom_domain"
            v-model="user.activeProfile.customDomain"
            class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
            type="text"
            placeholder="e.g. neutroncreative.com (no http/https)"
          >
        </div>

        <!-- Watermark Toggle -->
        <div class="flex flex-row w-full mb-6">
          <input
            id="themeGlobal"
            v-model="user.activeProfile.showWatermark"
            type="checkbox"
            class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
          >

          <label for="themeGlobal" class="ml-2 block text-md leading-5 text-gray-700">
            Display Watermark ("Proudly built with {{ app_name }}!")
            <br>
            <span
              v-show="showWatermarkNotice"
              class="mt-2 flex text-sm text-gray-600"
            >
              This is completely optional, but it really helps us out! Mind spreading the word about {{ app_name }}?
            </span>
          </label>
        </div>

        <button
          type="button"
          class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center"
          @click="saveChanges"
        >
          Save changes
        </button>
      </form>
    </div>

    <!-- Reset Password -->
    <div class="flex flex-col lg:flex-row p-6 bg-white shadow rounded justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-full lg:w-1/2">
        <h2 class="text-gray-800 font-semibold text-lg w-full">
          Reset your password
        </h2>
        <p class="text-gray-600 font-medium">
          An email will be sent to you with a password reset link. Please type in the same email you used to sign up
          for this account to confirm.
        </p>
        <input
          id="passwordResetEmail"
          v-model="passwordEmail"
          class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
          type="email"
          :placeholder="'e.g. jane@' + hostname"
          aria-label="password reset email"
        >
      </div>
      <button
        type="button"
        class="w-full lg:w-auto mt-4 lg:mt-0 lg:ml-2 flex p-3 text-sm text-white text-center bg-red-600 hover:bg-red-700 rounded font-semibold w-1/3 justify-center align-center"
        @click="setPasswordModalActive(true)"
      >
        Reset Password
      </button>
    </div>

    <!-- Delete profile -->
    <div class="flex flex-col lg:flex-row p-6 bg-white shadow rounded justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-full lg:w-1/2">
        <h2 class="text-gray-800 font-semibold text-lg w-full">
          Delete this profile
        </h2>
        <p class="text-gray-600 font-medium">Done with this profile? Click the button on your right to delete this
          profile and all related content.</p>
      </div>
      <button
        type="button"
        class="w-full lg:w-auto mt-4 lg:mt-0 ml-2 flex p-3 text-sm text-white text-center bg-red-600 hover:bg-red-700 rounded font-semibold w-1/3 justify-center align-center"
        @click="setDeleteProfileModalActive(true)"
      >
        Delete this profile
      </button>
    </div>

    <transition name="fade">
      <!-- Confirm profile deletion modal -->
      <div
        v-if="deleteProfileModalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="setDeleteProfileModalActive(false)"
      >
        <div class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg" @click.stop>
          <h2 class="text-gray-800 font-semibold text-xl">
            Are you sure?
          </h2>
          <p class="text-gray-600 text-sm">
            Deleting this profile is irreversible, please confirm to continue.
          </p>
          <button
            type="button"
            class="mt-4 w-full p-4 text-center text-md text-white bg-red-600 hover:bg-red-700 rounded font-semibold"
            @click="deleteProfile"
          >
            Yes, delete this profile
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <!-- Password reset confirmation modal -->
      <div
        v-if="resetPasswordModalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="setPasswordModalActive(false)"
      >
        <div class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg" @click.stop>
          <h2 class="text-gray-800 font-semibold text-xl">
            {{ passwordError ? "Error on password request!" : "Password reset requested" }}
          </h2>
          <p v-if="!passwordError" class="text-gray-600 text-sm">A password reset link has been sent to your account
            email inbox successfully.
            Make sure to check your spam folder.</p>

          <p v-if="passwordError" class="text-gray-600 text-sm">
            <i class="fas fa-exclamation-triangle"/>
            {{ passwordError }}
          </p>
          <button
            type="button"
            class="mt-4 p-3 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
            @click="setPasswordModalActive(false)"
          >
            Close
          </button>
        </div>
      </div>
    </transition>

  </section>
</template>

<script lang="ts">
import crypto from "crypto";
import Vue from "vue";
import {StatusCodes} from "http-status-codes";

export default Vue.extend({
  name: 'DashboardSettings',
  layout: 'dashboard',
  middleware: 'authenticated',

  data() {
    return {
      loaded: false,
      resetPasswordModalActive: false,
      deleteProfileModalActive: false,
      originalHandle: '',
      user: {
        name: '',
        emailHash: '',
        activeProfile: {
          imageUrl: '',
          headline: '',
          subtitle: '',
          handle: '',
          customDomain: '',
          visibility: '',
          showWatermark: false,
        }
      },
      error: '',
      passwordError: '',
      passwordEmail: '',
      showWatermarkNotice: false,
      hostname: process.env.HOSTNAME,
      app_name: process.env.APP_NAME,
      icon_url: process.env.ICON_URL
    };
  },

  watch: {
    'user.activeProfile.showWatermark': {
      handler(val) {
        this.showWatermarkNotice = (!val && this.loaded);
      }
    }
  },

  async mounted() {
    await this.getUserData();

    this.loaded = true;
  },

  methods: {
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const userResponse = await this.$axios.$post('/user', {
          token
        });

        const profileResponse = await this.$axios.$post('/profile/active-profile', {
          token
        });

        this.user.name = userResponse.name;
        this.user.emailHash = userResponse.emailHash;

        this.user.activeProfile.imageUrl = profileResponse.imageUrl;
        this.user.activeProfile.headline = profileResponse.headline;
        this.user.activeProfile.subtitle = profileResponse.subtitle;
        this.user.activeProfile.handle = profileResponse.handle;
        this.user.activeProfile.customDomain = profileResponse.customDomain;
        this.user.activeProfile.visibility = profileResponse.visibility;
        this.user.activeProfile.showWatermark = profileResponse.showWatermark;

        this.$set(this.user.activeProfile, 'user.activeProfile', profileResponse);

        this.originalHandle = this.user.activeProfile.handle;
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },

    async saveChanges() {
      try {
        await this.$axios.$post('/profile/update', {
          token: this.$store.getters['auth/getToken'],
          imageUrl: this.user.activeProfile.imageUrl ?? null,
          headline: this.user.activeProfile.headline ?? null,
          subtitle: this.user.activeProfile.subtitle ?? null,
          handle: this.user.activeProfile.handle ?? null,
          visibility: this.user.activeProfile.visibility ?? null,
          customDomain: this.user.activeProfile.customDomain ?? null,
          showWatermark: this.user.activeProfile.showWatermark ?? true,
        });

        if (process.client) {
          if (this.user.activeProfile.handle !== this.originalHandle) {
            location.reload();
            return;
          }

          this.$root.$emit('refreshUserProfileView');
        }
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

    setPasswordModalActive(active: boolean) {
      this.resetPasswordModalActive = active;

      if (active) {
        if (!this.passwordEmail) {
          this.passwordError = "Please enter a valid email.";
          return;
        } else {
          this.passwordError = '';
        }

        const md5 = crypto.createHash('md5').update(this.passwordEmail).digest('hex');

        console.log(md5);
        console.log(this.user.emailHash);

        if (md5 !== this.user.emailHash) {
          this.passwordError = "Please enter the same email you used for this account.";
          return;
        }
        this.requestPasswordReset();
      }
    },

    setDeleteProfileModalActive(active: boolean) {
      this.deleteProfileModalActive = active;
    },

    async deleteProfile() {
      this.$nuxt.$loading.start();

      await this.$axios.$post('/profile/delete', {
        token: this.$store.getters['auth/getToken']
      });

      this.$nuxt.$loading.finish();

      location.reload();
    },

    async requestPasswordReset() {
      try {
        const request = await this.$axios.post('/user/request-reset-password', {
          email: this.passwordEmail
        });
        if (request.status && request.status === 200) {
          this.passwordError = '';
        }
      } catch (err) {
        console.error(err);

        this.passwordError = err.toString();

        if (err.response) {
          if (err.response.status === StatusCodes.NOT_FOUND) {
            this.passwordError = "The email couldn't be found, please make sure it's correct.";
          }

          if (err.response.status === StatusCodes.TOO_MANY_REQUESTS) {
            this.passwordError = `Whoa, slow down! Error: ${err.response.data.message}`;
          }

          return;
        }

        throw err;
      }
    }
  }
});
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
