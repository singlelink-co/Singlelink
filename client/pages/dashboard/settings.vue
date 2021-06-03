<template>
  <section class="flex flex-col p-8 items-center overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-center justify-start mb-4 space-x-4 mb-4">
      <img class="w-8" src="/Settings.svg">
      <h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
        Site settings
      </h1>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded-2xl w-full mb-8">
      <transition name="fade">
        <div
          v-if="error"
          class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded-2xl w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
        >
          <img style="width: 12px;" src="/caution.svg" alt="caution">
          <div class="flex flex-col ml-2">
            {{ error }}
          </div>
        </div>
      </transition>

      <h2 class="text-black font-bold text-xl w-full mb-2">
        Site details
      </h2>
      <form class="flex flex-col">
        <div class="flex flex-col lg:flex-row mb-3">
          <div class="flex flex-col w-full lg:w-1/2 mr-4 mb-3 lg:mb-0">
            <label class="font-bold opacity-70 text-sm text-black" for="name">Headline</label>
            <input
              id="name"
              v-model="user.activeProfile.headline"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border"
              type="text"
              placeholder="e.g. Jane Doe, 21"
            >
          </div>
          <div class="flex flex-col w-full lg:w-1/2">
            <label class="font-bold opacity-70 text-sm text-black" for="subtitle">Subtitle</label>
            <input
              id="subtitle"
              v-model="user.activeProfile.subtitle"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border"
              type="text"
              placeholder="e.g. Developer at Neutron from Raleigh NC"
            >
          </div>
        </div>
        <div class="flex flex-col lg:flex-row mb-4">
          <div class="flex flex-col w-full lg:w-1/2 mr-3 mb-3 lg:mb-0">
            <label class="font-bold opacity-70 text-sm text-black" for="handle">Handle</label>
            <div class="flex flex-row rounded-2xl border border-solid border-gray-300 text-sm mt-2 overflow-hidden">
              <span
                class="flex p-2 bg-gray-100 border text-gray-900 border-solid border-gray-300 border-t-0 border-l-0 border-b-0"
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
            <label class="font-bold opacity-70 text-sm text-black" for="visibility">Visibility</label>
            <select
              id="visibility"
              v-model="user.activeProfile.visibility"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border"
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
        <div class="flex flex-row items-center justify-center space-x-4 mb-4">
          <input
            id="avatar_url"
            v-model="user.activeProfile.imageUrl"
            type="hidden"
            name="avatar_url"
            class="simple-file-upload"
          >
          <div class="flex flex-col w-auto flex-grow flex-1">
            <label class="font-bold opacity-70 text-sm text-black" for="image_url">Avatar Image URL</label>
            <input
              id="image_url"
              v-model="user.activeProfile.imageUrl"
              class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border"
              type="text"
              placeholder="e.g. https://uifaces.co/our-content/donated/rSuiu_Hr.jpg"
            >
            <div
              v-if="!profileValid"
              class="py-3 px-4 rounded-2xl bg-red-200 border border-red-400 text-red-500 flex flex-col items-start mt-2 text-sm"
            >
              <span class="font-semibold">Warning!</span>
              <span class="text-xs font-semibold">Your site picture may be improperly formatted! Please ensure your image is loaded via an SSL and ends in .gif, .png, .jpg, .jpeg, or another supported file extension.<a
                href="https://www.notion.so/neutroncreative/Troubleshooting-9a162db4a8ce482d89b3d3e1bc9825ba"
                target="_blank"
                class="ml-2 font-semibold underline hover:text-red-700"
              >Learn more</a></span>
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full mb-6">
          <div
            class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full"
          >
            <label class="font-bold text-sm text-black opacity-70" for="custom_domain">Custom domain</label>
            <a
              href="https://www.notion.so/neutroncreative/Setting-up-your-custom-domain-907421b1ac3841dbbd8d9a7d41d17f9a"
              class="text-black font-bold opacity-50 text-xs hover:underline hover:opacity-80"
            >Need help? Read our documentation</a>
          </div>
          <input
            id="custom_domain"
            v-model="user.activeProfile.customDomain"
            class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border"
            type="text"
            placeholder="e.g. neutroncreative.com (no http/https)"
          >
        </div>

        <!-- Watermark Toggle -->
        <div class="flex flex-row w-full mb-6 items-start">
          <input
            id="themeGlobal"
            v-model="user.activeProfile.showWatermark"
            type="checkbox"
            style="margin-top:3px;"
            class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
          >

          <label
            for="themeGlobal"
            class="ml-4 flex font-bold text-sm leading-5 opacity-70 w-full lg:w-auto flex-col"
            style="max-width:calc(100% - 32px)"
          >
            Display Watermark ("Proudly built with {{ app_name }}!")
            <br>
            <span
              v-show="showWatermarkNotice"
              class="mt-2 flex text-gdp p-1 px-4 rounded-full bg-opaqueIndigo font-bold text-xs lg:text-sm"
            >
              This is completely optional, but it really helps us out! Would you help us spread the word about {{
                app_name
              }}?
            </span>
          </label>
        </div>

        <!-- Privacy mode toggle -->
        <div class="flex flex-row w-full mb-6 items-start">
          <input
            v-model="user.activeProfile.metadata.privacyMode"
            type="checkbox"
            style="margin-top:3px;"
            class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            aria-label="privacy mode"
          >

          <label class="ml-4 block text-sm leading-5 text-black font-bold opacity-70">
            Privacy mode (Disables site analytics, discovery, and event tracking)
          </label>
        </div>

        <button
          type="button"
          class="mt-2 inline-flex p-3 text-white text-center bg-gdp hover:bg-indigo-500 rounded-2xl font-bold w-auto max-w-xs justify-center align-center"
          @click="saveChanges"
        >
          Save changes
        </button>
      </form>
    </div>

    <div
      v-if="alerts.googleLinked !== null && alerts.googleLinked"
      class="flex flex-col lg:flex-row justify-center items-center p-3 rounded-2xl bg-green-300 shadow w-full mb-8"
    >
      <p class="text-black opacity-70 font-semibold">
        Successfully linked Google!
      </p>
    </div>
    <div
      v-else-if="alerts.googleLinked !== null && !alerts.googleLinked"
      class="flex flex-col lg:flex-row justify-center items-center p-3 rounded-2xl bg-red-300 shadow w-full mb-8"
    >
      <p class="text-black opacity-70 font-semibold">
        Failed to link Google!
      </p>
    </div>

    <!-- Manage SSO -->
    <div class="flex flex-col lg:flex-row p-6 bg-white shadow rounded-2xl justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-full lg:w-1/2">
        <h2 class="text-black font-bold text-lg w-full">
          Manage SSO
        </h2>
        <p class="text-black opacity-70 font-semibold">
          Link up your social media accounts for easy single sign-on access.
        </p>
      </div>
      <div>
        <a
          class="flex flex-row items-center font-bold justify-center rounded-full px-8 py-2 my-2 text-md border-gray-300 hover:border-gray-600"
          style="border-width:3px;border-style:solid;"
          @click="assignGoogleAccount()"
        >
          <img src="/google-icon.png" class="w-5 mr-4">
          Link with Google
        </a>
        <!--        <a-->
        <!--          class="flex flex-row items-center font-bold justify-center rounded-full px-8 py-2 my-2 text-md border-gray-300 hover:border-gray-600"-->
        <!--          style="border-width:3px;border-style:solid;"-->
        <!--          @click="assignGitHubAccount()"-->
        <!--        >-->
        <!--          <img src="/google-icon.png" class="w-5 mr-4">-->
        <!--          Link with GitHub-->
        <!--        </a>-->
      </div>
    </div>

    <!-- Delete site -->
    <div class="flex flex-col lg:flex-row p-6 bg-white shadow rounded-2xl justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-full lg:w-1/2">
        <h2 class="text-black font-bold text-lg w-full">
          Delete this site
        </h2>
        <p class="text-black opacity-70 font-semibold">
          Done with this site? Click the button on your right to delete
          this
          site and all related content.
        </p>
      </div>
      <button
        type="button"
        class="w-full lg:w-auto mt-4 lg:mt-0 ml-2 flex p-3 px-6 text-white text-center bg-red-600 hover:bg-red-700 rounded-2xl font-bold w-1/3 justify-center align-center"
        @click="setDeleteProfileModalActive(true)"
      >
        Delete this site
      </button>
    </div>

    <div class="flex flex-col lg:flex-row p-6 bg-white shadow rounded-2xl justify-center items-center w-full mb-8">
      <div class="flex flex-col mr-auto w-full lg:w-7/12">
        <h2 class="text-black font-bold text-lg w-full">
          Account settings
        </h2>
        <p class="text-black opacity-70 font-semibold">
          Need to configure the account managing your micro-sites?
        </p>
      </div>
      <n-link
        to="/dashboard/account"
        class="w-full lg:w-auto mt-4 lg:mt-0 ml-2 flex p-3 px-6 text-white text-center bg-gdp hover:bg-indigo-500 rounded-2xl font-bold w-1/3 justify-center align-center"
      >
        Go to account settings
      </n-link>
    </div>

    <transition name="fade">
      <!-- Confirm site deletion modal -->
      <div
        v-if="deleteProfileModalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="setDeleteProfileModalActive(false)"
      >
        <div class="flex flex-col p-6 bg-white shadow rounded-2xl w-full max-w-lg" @click.stop>
          <h2 class="text-black font-semibold text-xl">
            Are you sure?
          </h2>
          <p class="text-gray-800 text-sm">
            Deleting this site is irreversible, please confirm to continue.
          </p>
          <button
            type="button"
            class="mt-4 w-full p-4 text-center text-md text-black bg-red-600 hover:bg-red-700 rounded-2xl font-semibold"
            @click="deleteProfile"
          >
            Yes, delete this site
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
        <div class="flex flex-col p-6 bg-white shadow rounded-2xl w-full max-w-lg" @click.stop>
          <h2 class="text-black font-semibold text-xl">
            {{ passwordError ? "Error on password request!" : "Password reset requested" }}
          </h2>
          <p v-if="!passwordError" class="text-gray-800 text-sm">A password reset link has been sent to your account
            email inbox successfully.
            Make sure to check your spam folder.</p>

          <p v-if="passwordError" class="text-gray-800 text-sm">
            <i class="fas fa-exclamation-triangle"/>
            {{ passwordError }}
          </p>
          <button
            type="button"
            class="mt-4 p-3 text-center text-md text-black bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold"
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
          metadata: {
            privacyMode: false
          },
        }
      },
      error: '',
      passwordError: '',
      passwordEmail: '',
      showWatermarkNotice: false,
      hostname: process.env.HOSTNAME,
      app_name: process.env.APP_NAME,
      icon_url: process.env.ICON_URL,
      alerts: {
        googleLinked: null as boolean | null
      }
    };
  },
  head: {
    title: 'Site settings - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Take administrative control over your microsites through the settings panel.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Take administrative control over your microsites through the settings panel.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Site settings - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Site settings - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Take administrative control over your microsites through the settings panel.'
      },
    ],
  },

  computed: {
    profileValid() {
      const imageUrl = this.$data.user.activeProfile.imageUrl;

      if (!imageUrl) {
        return true;
      }

      if (!imageUrl.includes('.jpg') && !imageUrl.includes('.jpeg') && !imageUrl.includes('.png') && !imageUrl.includes('gif')) {
        return false;
      }

      return imageUrl.includes('https://');
    },
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

    if (this.$route.query.googleLinked) {
      this.$data.alerts.googleLinked = this.$route.query.googleLinked === 'true';
    }

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

        this.user.activeProfile.metadata.privacyMode = profileResponse.metadata?.privacyMode ?? false;

        this.$set(this.user.activeProfile, 'user.activeProfile', profileResponse);

        this.originalHandle = this.user.activeProfile.handle;
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },

    async saveChanges() {
      // Update profile
      try {

        const avatarUpload: HTMLInputElement = (document.getElementById('avatar_url')) as HTMLInputElement;
        let avatarString = null;

        if (avatarUpload && avatarUpload.value) {
          avatarString = avatarUpload.value;
        }

        await this.$axios.$post('/profile/update', {
          token: this.$store.getters['auth/getToken'],
          imageUrl: avatarString ?? this.user.activeProfile.imageUrl ?? null,
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

      // Update privacy mode
      const privacyMode = this.user.activeProfile.metadata.privacyMode;

      try {
        const request = await this.$axios.post('/profile/set-privacy-mode', {
          token: this.$store.getters['auth/getToken'],
          privacyMode
        });

        if (request.status && request.status === 200) {
          this.passwordError = '';
        }
      } catch (err) {
        console.error(err);

        if (err.response) {
          if (err.response.status === StatusCodes.NOT_FOUND) {
            // This should be impossible under normal circumstances
            this.error = "The profile couldn't be found, please make sure it's correct.";
          }

          return;
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
    },

    async assignGoogleAccount() {
      const response = await this.$axios.post('/auth/google/assign', {
        token: this.$store.getters['auth/getToken']
      });

      window.location.assign(response.data);
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

* {
  outline: none !important;
}

iframe.widgetFrame {
  margin-left: 0 !important;
}
</style>
