

<template>
    <div class="bg-blackish flex flex-col lg:flex-row w-screen h-screen oveflow-x-hidden">
        <div class="flex flex-col h-screen text-white font-semibold nav justify-between">
            <div class="p-8 pt-10 flex flex-col">
                <n-link to="/dashboard" class="flex flex-row items-center justify-start" style="margin-bottom: 1rem !important;">
                    <img src="/icon.png" style="width:28px;margin-right:.9rem;" />
                    <span class="font-bold text-2xl wordmark">singlelink</span>
                </n-link>
                <n-link to="/dashboard/" :class="getActiveStyles('dashboard')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <span class="ml-4 font-semibold">Links</span>
                </n-link>
                <n-link to="/dashboard/analytics" :class="getActiveStyles('dashboard-analytics')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                    <span class="ml-4 font-semibold">Analytics</span>
                </n-link>
                <n-link to="/dashboard/appearance" :class="getActiveStyles('dashboard-appearance')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                    <span class="ml-4 font-semibold">Appearance</span>
                </n-link>
                <n-link to="/dashboard/marketplace" :class="getActiveStyles('dashboard-marketplace')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span class="ml-4 font-semibold">Marketplace</span>
                </n-link>
                <a href="https://singlelink.co/leaderboard" :class="getActiveStyles('dashboard-leaderboard')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>
                    <span class="ml-4 font-semibold">Leaderboard</span>
                </a>
                <a :class="getActiveStyles('dashboard-discover')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="ml-4 font-semibold">Search & discover</span>
                </a>
                <a @click="toggleProfileSelect" :class="getActiveStyles('dashboard-profiles')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="ml-4 font-semibold">Switch profiles</span>
                </a>
                <a :class="getActiveStyles('dashboard-support')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <span class="ml-4 font-semibold">Get support</span>
                </a>
                <a href="/dashboard/settings" :class="getActiveStyles('dashboard-settings')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span class="ml-4 font-semibold">Settings</span>
                </a>
            </div>
            <div class="profile-bay mt-auto p-4 flex flex-row items-center" @click="toggleProfileSelect">
                <div class="w-10 h-10 rounded-full bg-gray-500" :style="'background-image:url(' + (user.activeProfile.imageUrl || 'https://www.gravatar.com/avatar/' + user.emailHash) + ');background-size:cover;background-position:center;margin-right:1rem;'"></div>
                <div class="flex flex-col">
                    <span class="font-bold">{{ user.activeProfile.headline }}</span>
                    <span class="font-semibold text-sm opacity-60" v-if="user.activeProfile.customDomain">{{ user.activeProfile.customDomain }}</span>
                    <span class="font-semibold text-sm opacity-60" v-if="!user.activeProfile.customDomain && user.activeProfile.handle">singlel.ink/u/{{ user.activeProfile.handle }}</span>
                </div>

            </div>
            
        </div>
        <Nuxt id="child" class="p-16 lg:h-screen flex-grow flex-1 lg:overflow-y-scroll"/>
        <div class=" h-screen flex flex-row items-center justify-center">
            <div class="white-05 px-4 py-6 text-center flex items-center justify-center cursor-pointer" @click="previewVisible=!previewVisible" title="Toggle preview visibility" style="border-radius:8px 0 0 8px;">
                <span class="font-semibold text-white" style="writing-mode: vertical-rl;">
                    <span v-if="!previewVisible">Show</span>
                    <span v-if="previewVisible">Hide</span>
                    preview
                </span>
            </div>
            <div v-if="previewVisible" class="items-center justify-start h-screen flex flex-col white-05 flex-1">
                <div class="flex flex-col w-full p-8 pt-6 black-45">
                    <span class="font-semibold text-white mb-2">Preview Device</span>
                    <select class="w-full rounded-full px-6 py-2 text-lg text-gray-800 font-semibold outline-none text-sm">
                        <option>iPhone 11 Pro - 375px : 812px</option>
                        <option>More coming soon!</option>
                    </select>
                </div>
                <div class="p-12">
                    <div class="phone-display">
                        <div class="w-full h-full flex overflow-hiddeniframe-container relative">
                            <iframe id="preview-frame" class="w-full h-full" style="border-radius:50px;" :src="'/u-preview/' + user.activeProfile.handle"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ul
          v-if="selectingProfile"
          class="absolute bottom-0 rounded-2xl shadow bg-blackish border border-gray-900 profile-list z-30"
          style="left: 80px; bottom: 40px; width: 245px;"
        >

          <li class="flex flex-row items-center justify-left profile-search text-white">
            <!-- Create new profile-->
            <input
              type="text"
              placeholder="Filter profiles..."
              aria-label="Filter profiles"
              class="text-sm p-2 mr-auto"
              style="outline:none !important;background:transparent;"
              @input="onFilterProfilesInput"
            >
            <i class="search-icon fas fa-search text-sm p-2 opacity-50"/>
          </li>

          <li
            v-for="profile in filteredProfiles"
            :key="profile.handle"
            class="p-2 pl-4 pr-4 hover:bg-opaqueWhite cursor-pointer flex flex-row items-center justify-start"
            :style="!profile.handle ? 'max-height: 51px;' : ''"
            @click="selectProfile(profile.id)"
          >
            <div
              v-if="profile.handle"
              class="w-8 h-8 rounded-full"
              :style="'width: 35px; height:35px;margin-right:.75rem;background-size:cover;background-repeat:no-repeat;background-position:center;background-image:url(' + (profile.imageUrl || 'https://www.gravatar.com/avatar/' + user.emailHash) + ');'"
              alt="avatar">
            </div>
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
              <span class="text-base text-white font-bold">{{ profile.handle }}</span>
              <span class="text-sm text-gray-200 font-semibold">{{ profile.headline }}</span>
            </div>
          </li>

          <li class="flex flex-row items-center justify-center button-controls">
            <!-- Create new profile-->
            <span
              class="text-center w-1/2 hover:bg-opaqueWhite p-2 pl-4 text-xs text-gray-100"
              @click="createNewProfile"
            >Create new</span>

            <!-- Logout-->
            <a class="text-center w-1/2 hover:bg-opaqueWhite p-2 pr-4 text-xs text-gray-100" href="/logout">Logout</a>
          </li>

        </ul>
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
      previewVisible: true,
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

    if (process.env.QR_API) {
      try {
        const qrRequest = await this.$axios.post('https://api.qr.io/v1/create', {
          apikey: process.env.QR_API,
          data: "https://singlel.ink/u/" + this.user.activeProfile.handle,
          transparent: "on",
          frontcolor: "#5353EC",
          marker_out_color: "#09FDFD",
          marker_in_color: "#1127EF",
          pattern: "special-circle",
          marker: "rounded",
          marker_in: "rounded",
        });
        this.qr_src = qrRequest.data.qrid;
      } catch (err) {
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

    getActiveStyles(page: String) {
      if (page === this.active) {
        return "nav-link active";
      }
      return "nav-link";
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
            this.active = "dashboard-marketplace";
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

<style scoped>

@media(min-width: 1024px) {
  .middle {
    width: calc(66.66vw - 70px);
  }
  .content-nuxt {
    height: calc(100vh - 122px);
  }
}

@media(max-width: 1024px) {
  html, body {
    overflow: hidden !important;
    height: 100vh !important;
    max-height: 100vh !important;
  }
  .content-container {
    height: calc(100% - 111px);
    max-height: calc(100% - 111px);
    min-height: calc(100% - 111px);
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
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
  font-family: 
  'Nunito',
  'Inter',
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
  max-height: calc(100vh - 300px);
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

.ace_editor, .ace_editor * {
  font-size: 14px impo !important;
  font-variant-ligatures: none !important;
  font-style: normal !important;
}
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

/* New Dashboard Styles */
#child::-webkit-scrollbar { 
        display: none;  /* Safari and Chrome */
    }
    .white-05 {
        background:rgba(255,255,255,.05);
    }
    .black-45 {
        background:rgba(255,255,255,.05);
    }
    .nav {
         background:rgba(255,255,255,.03);
    }
    .wordmark {
            color: #FFF;
        }
    @media screen and (prefers-color-scheme: light) {
        .white-05 {
            background:rgba(0,0,0,.05);
        }
        .black-45 {
            background:rgba(0,0,0,.05);
        }
        .nav {
            background:#FFF;
            box-shadow: 2px 0 5px rgba(0,0,0,.05);
        }
        .wordmark {
            color: #000;
        }
    }
    .phone-display {
        display: flex;
        margin: -60px auto auto;
        border-radius: 65px;
        overflow: hidden;
        background: #000;
        padding: 14px;
        width: 375px;
        height: 812px;
        transform: scale(.8);
    }
    .nav-link {
        @apply flex mb-1 flex-row p-3 px-4 rounded-lg cursor-pointer items-center justify-start;
        min-width: 240px;
    }
    .nav-link * {
        opacity: .85;
    }
    .nav-link:hover {
        background:rgba(255,255,255,.05);
    }
    .nav-link.active {
        background:rgba(255,255,255,.05);
    }
    @media screen and (prefers-color-scheme: light) {
        .nav-link.active {
            background:rgba(0,0,0,.05);
        }
        .nav-link:hover {
            background:rgba(0,0,0,.05);
        }
    }
    .nav-link.active * {
        opacity: 1;
    }
    .nav-link:hover * {
        opacity: 1;
    }
    .profile-bay {
        border-top:solid 1px rgba(255,255,255,.1);
        cursor: pointer;
    }
    .profile-bay:hover {
        background:rgba(255,255,255,.02);
    }
    @media screen and (prefers-color-scheme: light) {
        .profile-bay {
            border-top:solid 1px rgba(0,0,0,.1);   
        }
        .profile-bay:hover {
            background:rgba(0,0,0,.02);
        }
    }

    a.nav-link svg {
      margin-right: .65rem !important;
    }

    
</style>
