<template>
  <div class="flex flex-row w-screen h-screen">
    <section class="flex flex-col w-px items-center p-3 border border-t-0 border-b-0 border-l-0" style="width: 70px; max-width: 70px;">
      <n-link to="/dashboard"><img src="/Icon.svg" style="width: 35px;"/></n-link>
      <div class="mt-auto relative" style="margin-top: auto; width:100%; cursor: pointer;">
        <img @click="toggle_profile_select" v-if="user && profiles.length>=1" style="width: 100%; border-radius: 100px;" :src="user.active_profile.image_url || 'https://www.gravatar.com/avatar/' + user.hash"/>
        <ul v-if="profile_select" class="absolute bottom-0 rounded shadow bg-white border border-gray-200" style="left: 60px; width: 245px;">
          <li v-for="profile in profiles" @click="select_profile(profile._id)" class="p-2 pl-4 pr-4 hover:bg-gray-100 flex flex-row items-center justify-start">
            <img class="mr-2 rounded-full" style="width: 100%;max-width: 35px;" :src="profile.image_url || 'https://www.gravatar.com/avatar/' + user.hash" />
            <div class="flex flex-col">
              <span class="text-sm font-medium capitalize">{{profile.handle}}</span>
              <span class="text-xs text-gray-700">{{profile.headline}}</span>
            </div>
          </li>
          <li class=" flex flex-row items-center justify-center">
            <div class="flex flex-row items-center justify-center w-full">
              <span @click="create_new_profile" class="text-center w-full hover:bg-gray-100 p-2 pl-4 text-xs text-gray-700">Create new</span>
              <span @click="attempt_logout" class="text-center w-full hover:bg-gray-100 p-2 pr-4 text-xs text-gray-700">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="flex flex-col flex-grow">
      <div class="flex flex-row border border-r-0 border-t-0 border-l-0 w-full">
        <n-link to="/dashboard">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard')">
            Links
          </div>
        </n-link>
        <n-link to="/dashboard/analytics">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard-analytics')">
            Analytics
          </div>
        </n-link>
        <n-link to="/dashboard/appearance">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard-appearance')">
            Appearance
          </div>
        </n-link>
        <n-link to="/dashboard/settings">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard-settings')">
            Settings
          </div>
        </n-link>
      </div>
      <Nuxt/>
    </section>
    <section class="flex flex-col w-4/12 items-center justify-center border boder-t-0 border-b-0 border-r-0 bg-gray-100">
      <div class="flex flex-row border border-r-0 border-t-0 border-l-0 w-full items-center justify-center mb-auto bg-white" style="height: 57px;">
        <p class="font-medium mr-2 text-gray-800">Your Singlelink:</p>
        <a class="text-indigo-600 hover:text-indigo-700 hover:underline" :href="profile_url">{{ profile_url }}</a>
      </div>
      <div class="phone-display">
        <iframe id="preview-frame" :src="preview_url"></iframe>
      </div>
    </section>
  </div>
</template>

<style>
html {
  font-family:
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

</style>

<style lang="sass" scoped>
  .phone-display
    display: flex
    margin: 20px auto auto auto
    border-radius: 50px
    background: #000
    padding: 14px
    width: 280px
    height: 606px

  .phone-display > iframe
    border: none
    width: 100%
    height: 100%
    border-radius: 35px
</style>

<script>
  export default {
    data: () => {
      return {
        active: 'dashboard',
        user: null,
        profiles: [],
        profile_select: false,
      };
    },
    computed: {
      profile_url: function() {
        try {
          return window.location.origin + '/u/' + this.user.active_profile.handle;
        } catch(err) {
          console.log(err);
          return 'https://singlelink.co/';
        }
      },
      preview_url: function() {
        try {
          let origin = window.location.origin;
          //if(origin=='https://app.singlelink.co' || origin=='http://localhost:8080') return 'https://singlel.ink' + '/u-preview/' + this.user.active_profile.handle;
          return origin + '/u-preview/' + this.user.active_profile.handle;
        } catch(err) {
          console.log(err);
          return 'https://singlelink.co/';
        }
      }
    },
    methods: {
      attempt_logout() {
        return this.$nuxt.$router.push('/logout');
      },
      async create_new_profile() {
        await this.$axios.$post('/profile/create', {
          token : this.$store.getters['auth/get_token']
        });
        this.profile_select = false;
        location.reload();
      },
      async select_profile(profile) {
        this.user.active_profile = await this.$axios.$post('/user/set-active', {
          token : this.$store.getters['auth/get_token'],
          profile: profile
        });
        location.reload();
      },
      toggle_profile_select() {
        this.profile_select = !this.profile_select;
      },
      async fetch_profiles() {
        this.profiles = await this.$axios.$post('/profile/list', {
          token : this.$store.getters['auth/get_token']
        });
      },
      get_active_styles (page) {
        if(page == this.active) return "text-indigo-600 bg-indigo-100 font-semibold border border-r-0 border-t-0 border-l-0 border-b-2 border-indigo-600";
        return "hover:bg-indigo-100 hover:text-indigo-600 text-gray-700 nc-item-link";
      },
      set_active () {
        try {
          switch (this.$route.name) {
            case "dashboard":
              this.active = "dashboard";
              break;
            case "dashboard-appearance":
              this.active = "dashboard-appearance";
              break;
            case "dashboard-analytics":
              this.active = "dashboard-analytics";
              break;
            case "dashboard-settings":
              this.active = "dashboard-settings";
              break;
          }
        } catch (err) {
          console.log(err);
        }
      },
      fetch_user_data: function() {
        this.$axios.$post('/user/fetch', {
          token : this.$store.getters['auth/get_token']
        })
          .then((response) => {
            console.log('Fetched user data successfully');
            console.log(response);
            this.user = response;
          })
          .catch((error) => {
            console.log('Error fetching user data');
            console.log(error);
          });
      }
    },
    mounted: function() {
      this.set_active();
      this.fetch_user_data();
      this.fetch_profiles();
    },
    watch: {
      $route () {
        console.log('route changed', this.$route);
        this.set_active();
      }
    },
  };
</script>

<style lang="sass" scoped>
  .nc-item-link:hover
    border-bottom: solid 2px rgba(235, 244, 255, var(--bg-opacity))

</style>
