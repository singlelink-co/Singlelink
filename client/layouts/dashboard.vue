

<template>
    <div class="bg-whiteish flex flex-col items-center justify-center">
      <div class="flex flex-row w-full max-w-6xl py-6 justify-between relative" style="z-index:2;background:linear-gradient(180deg, #FFF 60%, rgba(255,255,255,.65) 80%, rgba(255,255,255,0) 100%);">
        <n-link to="/dashboard"><img src="/sl-icon.svg" class="w-10" style="filter: drop-shadow(0px 10px 25px #5353EC);"/></n-link>
        <div class="flex flex-row items-center justify-start bg-opaqueBlack px-4 py-1 rounded-full w-full max-w-md" style="border: solid 2px rgba(0,0,0,.15);">
          <img src="/Compass.svg" style="width: 16px;height:auto;"/>
          <input type="text" class="font-bold flex-grow flex-1 text-sm ml-2" style="background:transparent;" placeholder="Search pages, guides, and documentation..."/>
        </div>
        <div class="py-1 px-4 rounded-full text-gdp bg-opaqueIndigo text-sm font-bold leading-tight mx-8 cursor-pointer flex items-center justify-center hover:bg-gdp hover:text-white">Refer a friend and get $10!</div>
      </div>
      <div class="flex flex-col lg:flex-row w-full max-w-6xl h-screen oveflow-x-hidden">
        <div class="flex flex-col text-black font-semibold nav justify-start">
            <div class="profile-bay p-4 flex flex-col items-start relative">
                <div v-if="user.activeProfile.imageUrl || user.emailHash" style="width:70px;height:70px;box-shadow:inset 0 0 0 4px rgba(0,0,0,.25),0 5px 25px rgba(83,83,267,.25);" class="rounded-full" :style="'background-image:url(' + (user.activeProfile.imageUrl || 'https://www.gravatar.com/avatar/' + user.emailHash) + ');background-size:cover;background-position:center;'"></div>
                <div v-if="!user.activeProfile.imageUrl && !user.emailHash" style="background:linear-gradient(146deg, rgba(0,255,240,1) 00%, rgba(173,255,0,1) 100%);width:70px;height:70px;box-shadow:inset 0 0 0 4px rgba(0,0,0,.25),0 5px 25px rgba(83,83,267,.25);" class="rounded-full" ></div>

                <div class="flex flex-col justify-start">
                    <span class="font-extrabold text-2xl leading-tight mt-4">{{ user.activeProfile.headline }}</span>
                    <div class="flex flex-row items-center justify-start">
                      <div>
                        <span class="font-bold text-lg opacity-60" v-if="user.activeProfile.customDomain">{{ user.activeProfile.customDomain }}</span>
                        <span class="font-bold text-lg opacity-60" v-if="!user.activeProfile.customDomain && user.activeProfile.handle">singlel.ink/u/{{ user.activeProfile.handle }}</span>
                      </div>
                      <div class="py-1 px-2 rounded-full text-gdp bg-opaqueIndigo text-sm font-extrabold leading-tight mx-2 cursor-pointer grow" @click="copyUrl" v-if="user.activeProfile.handle">copy</div>
                      <div class="py-1 px-2 rounded-full text-sm font-extrabold leading-tight cursor-pointer grow" style="color:#6c6c6c;background:rgba(108,108,108,.1);" @click="toggleProfileSelect">switch profiles</div>

                    </div>
                </div>
                <ul
                  v-if="selectingProfile"
                  class="absolute bottom-0 rounded-2xl shadow bg-whiteish border border-gray-200 profile-list z-30"
                  style="left:0;right:0; top: 170px; width:100%;height:fit-content;max-height:450px;"
                >

          <li class="flex flex-row items-center justify-left profile-search text-black">
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
            class="p-2 pl-4 pr-4 hover:bg-opaqueIndigo cursor-pointer flex flex-row items-center justify-start"
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
              <span class="text-base text-black font-bold">{{ profile.handle }}</span>
              <span class="text-sm text-gray-800 font-semibold">{{ profile.headline }}</span>
            </div>
          </li>

          <li class="flex flex-row items-center justify-center button-controls">
            <!-- Create new profile-->
            <span
              class="text-center w-1/2 hover:bg-opaqueIndigo p-2 pl-4 text-xs text-gray-900"
              @click="createNewProfile"
            >Create new</span>

            <!-- Logout-->
            <a class="text-center w-1/2 hover:bg-opaqueIndigo p-2 pr-4 text-xs text-gray-900" href="/logout">Logout</a>
          </li>

        </ul>
            </div>
            <div class="flex flex-col">
                <n-link to="/dashboard/" :class="getActiveStyles('dashboard')">
                    <img src="/House.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Links</span>
                </n-link>
                <n-link to="/dashboard/analytics" :class="getActiveStyles('dashboard-analytics')">
                    <img src="/Rocket.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Analytics</span>
                </n-link>
                <n-link to="/dashboard/appearance" :class="getActiveStyles('dashboard-appearance')">
                    <img src="/Rainbow.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Appearance</span>
                </n-link>
                <n-link to="/dashboard/marketplace" :class="getActiveStyles('dashboard-marketplace')">
                    <img src="/High voltage.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Marketplace</span>
                </n-link>
                <a href="https://singlelink.co/leaderboard" :class="getActiveStyles('dashboard-leaderboard')">
                    <img src="/Fire.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Leaderboard</span>
                </a>
                <a :class="getActiveStyles('dashboard-discover')">
                    <img src="/Compass.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Search & discover</span>
                </a>
                <a :class="getActiveStyles('dashboard-support')">
                    <img src="/Cowboy Hat face.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Contact support</span>
                </a>
                <a :class="getActiveStyles('dashboard-support')">
                    <img src="/Heart.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Referrals</span>
                </a>
                <a href="/dashboard/settings" :class="getActiveStyles('dashboard-settings')">
                    <img src="/Pencil.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Settings</span>
                </a>
                <a href="/logout" :class="getActiveStyles('logout')">
                    <img src="/Waving hand.svg" style="width:24px;height:24px;"/>
                    <span class="ml-4 font-extrabold">Logout</span>
                </a>
            </div>
        </div>
        <Nuxt id="child" style="top:-88px;" class="relative lg:pt-24 p-16 flex-grow flex-1 w-auto lg:overflow-y-scroll lg:h-screen"/>
        </div>
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
          visibility: '',
          customDomain: '',
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

    async copyUrl() {
      var text = '';
      try {
        text = 'https://'+this.user.activeProfile.customDomain || 'https://singlel.ink/u/' + this.user.activeProfile.handle;
        let url = new URL(text);
        navigator.clipboard.writeText(url.toString());
        alert('Url copied to clipboard!');
      } catch (error) {
        
        alert('Copy this url to the clipboard!\n' + text);
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
        @apply flex mb-1 flex-row p-3 px-4 rounded-2xl cursor-pointer items-center justify-start text-lg;
        min-width: 300px;
    }
    .nav-link * {
        opacity: .85;
    }
    .nav-link:hover {
      @apply bg-opaqueIndigo;
    }
    .nav-link.active {
        background:linear-gradient(90deg, rgba(83,83,236,.25) 00%, rgba(83,83,236,0.05) 100%);
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

    a.nav-link svg {
      margin-right: .65rem !important;
    }

  .grow:hover {
    transform: scale(1.03);
  }
    
</style>
