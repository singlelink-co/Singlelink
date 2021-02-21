<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl w-full mb-4">
      Marketplace
    </h1>
    <div class="rounded-lg mb-10 px-12 py-10 bg-indigo-500 w-full flex flex-col lg:flex-row justify-start">
        <div class="rounded bg-gray-200 w-56 h-40 lg:mr-12"></div>
        <div class="flex flex-col flex-1">
            <h5 class="tracking-wide font-bold uppercase text-sm text-indigo-300 mb-1">Featured theme</h5>
            <h2 class="text-white font-bold tracking-tight text-2xl mb-2">Featured theme name</h2>
            <span class="text-gray-200 font-medium mb-4">Featured theme description! Describe the featured theme here and why users should use it or which users should use it.</span>
            <a href="#" class="bg-indigo-600 rounded-lg px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700" style="width:fit-content;">See details</a>
        </div>
    </div>
    <theme-list name="🔥 Trending themes" :themes="globalThemes" :extended="false"/>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import themeList from "../../components/theme/theme-list.vue";

type ThemeModalIntent = "create" | "edit" | "view";

export default Vue.extend({
  components: { themeList },
  name: 'DashboardAppearance',
  layout: 'dashboard',
  middleware: 'authenticated',

  data() {
    return {
      error: '',
      themes: new Array<Theme>(),
      globalThemes: new Array<Theme>(),
      userId: '',
      isAdmin: false
    };
  },

  async beforeMount() {
    const permGroup = await this.$axios.$post("/admin/perm-group", {
      token: this.$store.getters['auth/getToken']
    });

    this.isAdmin = permGroup["groupName"] === 'admin';
  },

  async mounted() {
    await this.getUserData();
    await this.loadThemes();
  },

  methods: {
    async loadThemes() {
      try {
        // Grab themes from response
        this.themes = (await this.$axios.$post<Theme[]>('/themes', {
          token: this.$store.getters['auth/getToken'],
          includeGlobal: false
        }));

        this.globalThemes = (await this.$axios.$post<Theme[]>('/themes', {
          token: this.$store.getters['auth/getToken'],
          onlyGlobal: true
        }));
      } catch (error) {
        console.log('Failed to get themes');
        console.log(error);
      }
    },
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const profileResponse = await this.$axios.$post<Profile>('/profile/active-profile', {
          token
        });

        this.activeThemeId = profileResponse.themeId ?? null;
        this.customCss = profileResponse.customCss ?? '';
        this.customHtml = profileResponse.customHtml ?? '';
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },

    async saveChanges() {
      try {
        await this.$axios.$post('/profile/update', {
          token: this.$store.getters['auth/getToken'],
          customCss: this.customCss,
          customHtml: this.customHtml
        });

        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log(err);
      }
    },

    getNewTheme(): Theme {
      return {
        id: '',
        label: '',
        global: false,
        colors: {
          fill: {
            primary: '',
            secondary: ''
          },
          text: {
            primary: '',
            secondary: ''
          }
        },
        customCss: undefined,
        customHtml: undefined,
      };
    },
  }
});
</script>