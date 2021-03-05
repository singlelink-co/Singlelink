<template>
  <div class="flex flex-col lg:flex-row w-screen h-screen">

    <section
      class="hidden lg:flex flex-col w-px items-center p-3 border border-t-0 border-b-0 border-l-0"
      style="width: 70px; max-width: 70px;"
    >
      <a href="/dashboard">
        <img :src="icon_url" style="width: 35px;" alt="icon">
      </a>

      <div class="mt-auto relative" style="margin-top: auto; width:100%; cursor: pointer;">
        <img
          v-if="user && profiles.length>=1"
          style="width:45px; height:45px; border-radius: 100px;"
          :src="user.activeProfile.imageUrl || 'https://www.gravatar.com/avatar/' + user.emailHash"
          alt="avatar"
          onerror="this.src='https://www.gravatar.com/avatar'"
          @click="toggleProfileSelect"
        >

        <transition name="fade">
          <div
            v-if="error"
            class="error"
          >
            {{ error }}
          </div>
        </transition>

        <ul
          v-if="selectingProfile"
          class="absolute bottom-0 rounded-lg shadow bg-white border border-gray-200 profile-list z-30"
          style="left: 60px; width: 245px;"
        >

          <li class="flex flex-row items-center justify-left profile-search">
            <!-- Create new profile-->
            <input
              type="text"
              placeholder="Filter profiles..."
              aria-label="Filter profiles"
              @input="onFilterProfilesInput"
              class="text-sm p-2 mr-auto"
              style="outline:none !important;"
            >
            <i class="search-icon fas fa-search text-sm p-2 opacity-50"/>
          </li>

          <li
            v-for="profile in filteredProfiles"
            :key="profile.handle"
            class="p-2 pl-4 pr-4 hover:bg-gray-100 flex flex-row items-center justify-start"
            :style="!profile.handle ? 'max-height: 51px;' : ''"
            @click="selectProfile(profile.id)"
          >
            <img
              v-if="profile.handle"
              class="mr-2 rounded-full"
              onerror="this.src='https://www.gravatar.com/avatar'"
              style="width: 35px; height:35px; margin-right: 10px;"
              :src="(profile.imageUrl || 'https://www.gravatar.com/avatar/' + user.emailHash)"
              alt="avatar"
            >

            <div
              v-if="!profile.handle"
              class="mr-2 rounded-full"
              style="width: 100%; max-width: 35px; max-height: 58px; margin-right: 10px;"
            >
              &nbsp;
              <br>
              &nbsp;
            </div>

            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ profile.handle }}</span>
              <span class="text-xs text-gray-700">{{ profile.headline }}</span>
            </div>
          </li>

          <li class="flex flex-row items-center justify-center button-controls">
            <!-- Create new profile-->
            <span
              class="text-center w-1/2 hover:bg-gray-100 p-2 pl-4 text-xs text-gray-700"
              @click="createNewProfile"
            >Create new</span>

            <!-- Logout-->
            <a class="text-center w-1/2 hover:bg-gray-100 p-2 pr-4 text-xs text-gray-700" href="/logout">Logout</a>
          </li>

        </ul>
      </div>
    </section>

    <!-- Mobile Navbar -->
    <section class="fixed shadow flex lg:hidden flex-row z-10 items-center justify-between w-full p-4 bg-white border border-gray-300 border-l-0 border-t-0 border-r-0">
      <a href="/dashboard"><img :src="logo_url" style="width:7rem;" class="mr-4"/></a>
      <button @click="mobile_menu=!mobile_menu" type="button" class="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 text-sm rounded-lg text-white font-semibold tracking-wide" style="outline: none !important;">
        <span v-if="!mobile_menu" class="mr-2">Open</span>
        <span v-if="mobile_menu" class="mr-2">Close</span>
        menu
      </button>
      <nav v-if="mobile_menu" class="absolute z-20 shadow-lg flex flex-col items-center justify-center left-0 right-0 bg-white w-full" style="top: 64px;">
        <a href="/dashboard" class="w-full">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" :class="getActiveStyles('dashboard')">
            Links
          </div>
        </a>
        <a href="/dashboard/analytics" class="w-full">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" :class="getActiveStyles('dashboard-analytics')">
            Analytics
          </div>
        </a>
        <a href="/dashboard/appearance" class="w-full">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" :class="getActiveStyles('dashboard-appearance')">
            Appearance
          </div>
        </a>
        <a href="/dashboard/marketplace" class="w-full">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" :class="getActiveStyles('dashboard-marketplace')">
            Marketplace
          </div>
        </a>
        <a href="/dashboard/settings" class="w-full">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" :class="getActiveStyles('dashboard-settings')">
            Profile Settings
          </div>
        </a>
        <a v-if="isAdmin" to="/dashboard/admin" class="w-full">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" :class="getActiveStyles('dashboard-admin')">
            Admin
          </div>
        </a>
        <div class="p-4 pl-6 pr-6 cursor-pointer text-sm text-center" @click="toggleProfileSelect();mobile_menu=false;">Profiles</div>
      </nav>
    </section>
    <!-- End mobile navbar -->

    <section class="middle flex flex-col flex-grow overflow-x-hidden overflow-y-hidden h-screen bg-gray-100">
      <div class="hidden lg:flex flex-row border border-r-0 border-t-0 border-l-0 w-full bg-white">
        <a href="/dashboard">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="getActiveStyles('dashboard')">
            Links
          </div>
        </a>
        <a href="/dashboard/analytics">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="getActiveStyles('dashboard-analytics')">
            Analytics
          </div>
        </a>
        <a href="/dashboard/appearance">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="getActiveStyles('dashboard-appearance')">
            Appearance
          </div>
        </a>
        <a href="/dashboard/marketplace" id="marketplace-link">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="getActiveStyles('dashboard-marketplace')">
            Marketplace
          </div>
        </a>
        <a href="/dashboard/settings">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="getActiveStyles('dashboard-settings')">
            Settings
          </div>
        </a>
        <a v-if="isAdmin" to="/dashboard/admin">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="getActiveStyles('dashboard-admin')">
            Admin
          </div>
        </a>
      </div>

      <!-- Render Nuxt-->
      <Nuxt class="overflow-y-scroll flex content-container flex-basis-auto content-nuxt"/>

      <div class="p-4 text-sm bg-white text-gray-600 hidden lg:flex items-center justify-start flex-row border border-gray-300 border-r-0 border-l-0 border-b-0">
        <a
        style="margin-right:.5rem !important;"
        class="text-indigo-600 flex flex-row items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-full py-1 px-3 font-medium"
        href="/dashboard/account"
        >
        <img src="/Cog.svg" class="w-4 h-auto opacity-50" style="margin-right:.45rem !important;"/>
        Account</a>
        <a
        style="margin-right:.5rem !important;"
        class="text-indigo-600 flex flex-row items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-full py-1 px-3 font-medium"
        href="/dashboard/tours"
        >
        <img src="/Tour.svg" class="w-4 h-auto opacity-50" style="margin-right:.45rem !important;"/>
        Tours</a>
        <div
        style="margin-right:.5rem !important;"
        class="text-indigo-600 cursor-pointer flex flex-row items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-full py-1 px-3 font-medium"
        @click="toggleProfileSelect"
        >
        <img src="/Person.svg" class="w-4 h-auto opacity-50" style="margin-right:.45rem !important;"/>
        Switch profiles</div>
        <a
        style="margin-right:.5rem !important;"
        class="text-indigo-600 flex flex-row items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-full py-1 px-3 font-medium"
        href="https://discord.gg/3pBM4Px"
        >
        <img src="/Lifepreserver simple.svg" class="w-4 h-auto opacity-50" style="margin-right:.45rem !important;"/>
        Get help</a>
        <!-- TODO Make the CHANGELOG link automatically point to the correct branch instead of just the latest master branch-->
        <span style="margin-left:auto !important;" class=" pr-4">{{ version }}</span>
        <a
        class="text-indigo-600 flex bg-indigo-100 hover:bg-indigo-200 rounded-full py-1 px-2 font-medium"
        href="https://github.com/Neutron-Creative/Singlelink/blob/master/CHANGELOG.md"
      >Changelog</a>
      </div>
    </section>

    <!-- Mobile Preview Section -->
    <section class="bg-white lg:hidden flex flex-col items-center justify-center absolute z-10 bottom-0 left-0 right-0" style="box-shadow: 0 1px -5px  rgba(0,0,0,.1);max-height:100vh;">
      <!--<button @click="mobile_preview=!mobile_preview" class="w-full text-sm bg-indigo-200 text-indigo-600 font-semibold px-6 py-3" style="outline: none !important;">
        <span v-if="!mobile_preview" class="mr-2">Open</span>
        <span v-if="mobile_preview" class="mr-2">Close</span>
        preview
        </button>-->
        <a :href="'https://' + hostname + `/u-preview/${user.activeProfile.handle}`" class="text-center w-full text-sm bg-indigo-200 text-indigo-600 font-semibold px-6 py-3" style="outline: none !important;">
        <span class="mr-2">Open</span>
        preview
        </a>
      <div v-if="mobile_preview" class="w-full overflow-y-scroll flex flex-col items-center justify-center" style="max-height: calc(100vh - 100px);">
        <iframe :src="'https://' + hostname + `/u-preview/${user.activeProfile.handle}`" style="height: 10000px;" class="w-full"/>
      </div>
    </section>

    <!-- Preview Section-->
    <section
      class="relative overflow-hidden height-screen hidden lg:flex flex-col w-4/12 items-center justify-center px-8 border border-t-0 border-b-0 border-r-0 bg-gray-100"
    >

      <!-- Preview Navbar-->
      <div
        class="absolute top-0 flex flex-row border border-r-0 border-t-0 border-l-0 w-full items-center justify-center mb-auto bg-white"
        style="height: 57.5px;"
      >
        <p class="font-medium mr-2 text-gray-800 flex" style="margin-left:auto;">
          Your {{ app_name }}:&nbsp;
        </p>
        <a class="text-indigo-600 hover:text-indigo-700 hover:underline flex" :href="profileUrl">{{ profileUrl }}</a>
        <img @click="share_modal=!share_modal" src="/export.svg" class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-8 h-auto opacity-75 flex" style="margin-left:auto;margin-right:1.5rem;"/>
      </div>
      <!-- Share modal -->
      <div v-if="share_modal" class="absolute bg-white p-4 text-center rounded-lg shadow z-20 w-full flex flex-col items-center justify-start" style="top: 63px; max-width: 265px;">
          <p class="font-bold text-lg tracking-tight w-full items-center justify-center text-center text-gray-800 flex leading-tight pb-1 border border-t-0 border-r-0 border-l-0 border-gray-200">QR code:</p>
          <img v-if="qr_src" style="margin-bottom:.5rem;" :src="'https://qr.io/qr-svg/' + qr_src + '.svg'"/>
          <p class="font-bold text-lg tracking-tight w-full items-center justify-center text-center text-gray-800 flex leading-tight pb-1 border border-t-0 border-r-0 border-l-0 border-gray-200">Share on social media</p>
          <p class="text-gray-500 font-medium text-sm py-2 tracking-wide">Coming soon!</p>
      </div>
      <!-- End modal -->
      <div class="flex flex-col items-center justify-start overflow-y-scroll absolute p-4" style="height: calc(100vh - 57.5px);bottom:0;width:100%;left:0; right:0;">
        <!-- Preview Mode selector -->
        <div class="flex flex-col items-center justify-start space-y-2 w-full relative z-10">
          <label for="user-profile-view-type" class="uppercase text-sm tracking-wider font-semibold text-indigo-600">Preview Mode:&nbsp;</label>
          <div class="flex flex-row items-center justify-center space-x-2 w-full">
          <select
            id="user-profile-view-type"
            v-model="previewMode"
            class="text-sm text-gray-600 p-3 rounded-lg font-medium flex border border-gray-200 w-40"
          >
            <option selected value="mobile">
              Mobile
            </option>
            <option value="desktop">
              Desktop
            </option>
          </select>
          <i :class="getPreviewModeIcon()"/>
          </div>
        </div>

        <div class="user-profile-preview-parent" style="transform:translateY(-130px);">
          <div v-if="originalHandle" :class="checkPreviewMode()">
            <div class="w-full h-full flex overflow-x-hidden overflow-y-scroll iframe-container relative">
              <iframe class="w-full" id="preview-frame" :src="`/u-preview/${user.activeProfile.handle}`"/>
            </div>
          </div>
        </div>

          <!-- Visibility notification -->
          <a href="/dashboard/settings" v-if="profile_visibility=='unpublished'" class="absolute flex flex-row items-center text-sm text-center justify-center bg-indigo-600 text-white p-2 px-4 rounded-lg" style="bottom: 20px; left:20px; width: calc(100% - 40px);">
            <span class="font-semibold pr-1">Warning:</span>
            <span>Your profile is currently hidden!</span>
            <div class="hidden visibility-alert bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 px-2 py-1" style="margin-left:auto !important;">Go to settings</div>
          </a>
      </div>
    </section>

    <!-- Mobile profile selector -->
      <ul
          v-if="selectingProfile"
          class="lg:hidden absolute bottom-0 rounded-lg shadow bg-white border border-gray-200 profile-list z-30"
          style="left:0;bottom:0;right:0;width: 100%;"
        >

          <li class="flex flex-row items-center justify-left profile-search">
            <!-- Create new profile-->
            <input
              type="text"
              placeholder="Filter profiles..."
              aria-label="Filter profiles"
              @input="onFilterProfilesInput"
              class="text-sm p-2 mr-auto flex-grow lg:flex-auto"
              style="outline:none !important;"
            >
            <i class="search-icon fas fa-search text-sm p-2 opacity-50"/>
          </li>

          <li
            v-for="profile in filteredProfiles"
            :key="profile.handle"
            class="p-2 pl-4 pr-4 hover:bg-gray-100 flex flex-row items-center justify-start"
            :style="!profile.handle ? 'max-height: 51px;' : ''"
            @click="selectProfile(profile.id)"
          >
            <img
              v-if="profile.handle"
              class="mr-2 rounded-full"
              onerror="this.src='https://www.gravatar.com/avatar'"
              style="width:35px; height:35px; margin-right: 10px;"
              :src="(profile.imageUrl || 'https://www.gravatar.com/avatar/' + user.emailHash)"
              alt="avatar"
            >
c
            <div
              v-if="!profile.handle"
              class="mr-2 rounded-full"
              style="width: 100%; max-width: 35px; max-height: 58px; margin-right: 10px;"
            >
              &nbsp;
              <br>
              &nbsp;
            </div>

            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ profile.handle }}</span>
              <span class="text-xs text-gray-700">{{ profile.headline }}</span>
            </div>
          </li>

          <li class="flex flex-row items-center justify-center button-controls">
            <!-- Create new profile-->
            <span
              class="text-center w-1/2 hover:bg-gray-100 p-2 pl-4 text-xs text-gray-700"
              @click="createNewProfile"
            >Create new</span>

            <!-- Logout-->
            <a href="/logout" class="text-center w-1/2 hover:bg-gray-100 p-2 pr-4 text-xs text-gray-700">Logout</a>
          </li>

        </ul>
    <!-- End profile selector -->

    <GDPRContentModal/>

    <div v-html="usetiful_script"></div>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {StatusCodes} from "http-status-codes";
import GDPRContentModal from "~/components/utilities/GDPRConsentPopup.vue";

export default Vue.extend({
  components: {
    GDPRContentModal,
  },

  data() {
    return {
      active: "dashboard",
      originalHandle: '',
      user: {
        emailHash: '',
        activeProfile: {
          handle: '',
          visibility: ''
        },
      },
      share_modal: false,
      qr_src: null,
      profiles: [] as Profile[],
      filteredProfiles: [] as Profile[],
      selectingProfile: false,
      profileUrl: "",
      version: "Version loading...",
      previewMode: 'mobile',
      error: '',
      errorIntervalHandler: undefined as any,
      profile_visibility: '' as String,
      isAdmin: false,
      app_name: process.env.APP_NAME,
      icon_url: process.env.ICON_URL,
      logo_url: process.env.LOGO_URL,
      hostname: process.env.HOSTNAME,
      mobile_menu: false,
      mobile_preview: false,
      usetiful_script: `
        <script>
          (function (w, d, s) {
            var a = d.getElementsByTagName('head')[0];
            var r = d.createElement('script');
            r.async = 1;
            r.src = s;
            r.setAttribute('id', 'usetifulScript');
            r.dataset.token = "28f17918d3a60fc2f638a53eeb3a23d9";
            a.appendChild(r);
            if(window.location.href.split('?').length > 1) {
              let links = document.getElementsByTagName('a');
              for(let i=0;i<links.length;i++) {
                links[i].href += '?'+window.location.href.split('?')[1];
              }
            }
          })(window, document, "https://www.usetiful.com/dist/usetiful.js");
        <\/script>`
    };
  },

  watch: {
    $route() {
      this.setActive();
    }
  },

  async beforeMount() {
    const permGroup = await this.$axios.$post("/admin/perm-group", {
      token: this.$store.getters['auth/getToken']
    });

    this.isAdmin = permGroup["groupName"] === 'admin';
  },

  async mounted() {
    this.setActive();
    await this.getUserData();
    await this.listProfiles();

    try {
      this.profileUrl = window.location.origin + '/u/' + this.user.activeProfile.handle;
      this.profile_visibility = this.user.activeProfile.visibility;
    } catch (err) {
      console.log(err);
      this.profileUrl = 'https://singlelink.co/';
    }

    try {
      const response = await this.$axios.post("/info/version");
      this.version = "Version v" + response.data.version;
    } catch (err) {
      console.warn("Failed to retrieve version from server.");
    }

    if(process.env.QR_API) {
      try {
        let qr_request = await this.$axios.post('https://api.qr.io/v1/create', {
          apikey: process.env.QR_API,
          data:"https://singlel.ink/u/" + this.user.activeProfile.handle,
          transparent:"on",
          frontcolor:"#5353EC",
          marker_out_color:"#09FDFD",
          marker_in_color:"#1127EF",
          pattern:"special-circle",
          marker:"rounded",
          marker_in:"rounded",
        });
        this.qr_src = qr_request.data.qrid;
      } catch(err) {
        console.log('error');
        console.log(err);
      }
    }

    this.$root.$on('refreshUserProfileView', () => {
      const iFrame = document.getElementById('preview-frame') as HTMLIFrameElement;

      if (iFrame) {
        const contentWindow = iFrame.contentWindow;

        if (contentWindow) {
          contentWindow?.location.reload();
        }
      }
    });
  },

  methods: {
    attemptLogout() {
      this.$nuxt.$router.push('/logout');
    },

    async createNewProfile() {
      try {
        const profile = await this.$axios.$post<Profile>('/profile/create', {
          token: this.$store.getters['auth/getToken']
        });

        this.profiles.push(profile);

        this.filteredProfiles = this.profiles;

        this.filteredProfiles.sort(function (a, b) {
          return a.handle.localeCompare(b.handle);
        });
      } catch (err) {
        if (err.response) {
          if (err.response.status === StatusCodes.TOO_MANY_REQUESTS) {
            this.error = `Slow down! You are making profiles too quickly. Error: ${err.response.data.message}`;
          } else {
            this.error = `Error: ${err.response.data.message}`;
          }

          console.error(err);
        } else {
          throw err;
        }

        clearInterval(this.errorIntervalHandler);

        this.errorIntervalHandler = setTimeout(() => {
          this.error = '';
        }, 5000);
      }
    },

    async selectProfile(profile: any) {
      this.user.activeProfile = await this.$axios.$post('/user/set-active-profile', {
        token: this.$store.getters['auth/getToken'],
        newProfileId: profile
      });

      location.reload();
    },

    toggleProfileSelect() {
      this.selectingProfile = !this.selectingProfile;
    },

    async listProfiles() {
      this.profiles = await this.$axios.$post('/profiles', {
        token: this.$store.getters['auth/getToken']
      });

      this.filteredProfiles = this.profiles;

      this.filteredProfiles.sort(function (a, b) {
        return a.handle.localeCompare(b.handle);
      });
    },

    getActiveStyles(page: any) {
      if (page === this.active) {
        return "text-indigo-600 bg-indigo-100 font-semibold border border-r-0 border-t-0 border-l-0 border-b-2 border-indigo-600";
      }
      return "hover:bg-indigo-100 hover:text-indigo-600 text-gray-700 nc-item-link";
    },

    setActive() {
      try {
        switch (this.$route.name) {
          case "dashboard":
            this.active = "dashboard";
            break;
          case "dashboard-appearance":
            this.active = "dashboard-appearance";
            break;
          case "dashboard-marketplace":
            this.active="dashboard-marketplace";
            break;
          case "dashboard-analytics":
            this.active = "dashboard-analytics";
            break;
          case "dashboard-settings":
            this.active = "dashboard-settings";
            break;
          case "dashboard-admin":
            this.active = "dashboard-admin";
            break;
        }
      } catch (err) {
        console.log(err);
      }
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
    },

    getPreviewModeIcon() {
      switch (this.previewMode) {
        case "mobile":
          return 'fas fa-mobile-alt';
        case "desktop":
          return 'fas fa-tv';
      }
    },

    checkPreviewMode() {
      switch (this.previewMode) {
        case "mobile":
          return 'phone-display';
        case "desktop":
          return 'desktop-display';
      }
    },

    onFilterProfilesInput(event: any) {
      const target = event.target;
      const filterSearch = target.value.toLowerCase();
      const profiles = this.profiles as Profile[];

      this.filteredProfiles = profiles.filter(x => x.handle.toLowerCase().startsWith(filterSearch));

      this.filteredProfiles.sort(function (a, b) {
        return a.handle.localeCompare(b.handle);
      });

      const diff = this.profiles.length - this.filteredProfiles.length;

      for (let i = 0; i < diff; i++) {
        this.filteredProfiles.push({
          customCss: "",
          customHtml: "",
          handle: "",
          headline: "",
          imageUrl: "",
          subtitle: "",
          themeId: "",
          visibility: "",
          showWatermark: true
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@media(min-width: 1024px) {
  .middle {
    width: calc(66.66vw - 70px);
  }
  .content-nuxt {
    height: calc(100vh - 122px);
  }
}

@media(max-width:1024px) {
  html, body {
    overflow-y:hidden !important;
    height: 100vh !important;
    max-height: 100vh !important;
  }
  .content-container {
    height: calc(100% - 111px);
    max-height: calc(100% - 111px);
    min-height: calc(100% - 111px);
    position:absolute;
    top: 64px;
    left:0;
    right:0;
    z-index: 0;
    overflow-y: scroll;
  }
}

@media(min-width: 1650px) {
  .visibility-alert {
    display: flex;
  }
}

.iframe-container::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

html {
  font-family: 'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
  font-size: 16px;
  line-height: 1.65;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.user-profile-preview-parent {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 130px;
  width: 100%;
}

.phone-display {
  display: flex;
  margin: -60px auto auto auto;
  border-radius: 65px;
  overflow: hidden;
  background: #000;
  padding: 14px;
  width: 375px;
  height: 812px;
  transform: scale(.8)
}

.phone-display > iframe {
  border: none;
  width: 100%;
  height: 100%;
}

.phone-display > div {
  border-radius: 50px;
}

.desktop-display > div {
  @apply rounded-lg;
  max-height:calc(100vh - 300px);
}

.desktop-display {
  display: flex;
  margin: 20px auto auto auto;
  padding: 14px;
  width: 500px;
  height: 800px;
}

.desktop-display > iframe {
  border: none;
  width: 100%;
  height: 100%;
}

.nc-item-link:hover {
  border-bottom: solid 2px rgba(235, 244, 255, var(--bg-opacity));
}

.error {
  @apply bottom-0 rounded-lg shadow border border-gray-200;
  position: absolute;
  width: 30em;
  bottom: 5px;
  left: 70px;
  color: mintcream;
  background-color: red;
  padding: 7px;
  z-index: 25;
}

.profile-list {
  max-height: 400px !important;
  overflow-y: scroll;
  overflow-x: hidden;

  .profile-search {
    position: sticky;
    top: 0;
    background-color: #FFFFFF;

    input {
      width: 180px;
      padding-left: 10px;
    }

    i.search-icon {
      margin-left: 5px;
    }
  }

  .button-controls {
    position: sticky;
    bottom: 0;
    background-color: #FFFFFF;
  }
}

/**
  Animations
 */

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<style>
  .ace_editor, .ace_editor * {
    font-size: 14px impo !important;
    font-variant-ligatures: none !important;
    font-style: normal !important;
  }
</style>
<style>
  /* required class */
  .my-editor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background: #2d2d2d;
    color: #ccc;

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>