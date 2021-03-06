<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-center justify-start w-full mb-4">
      <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl mr-auto mb-4 lg:mb-0">
        Marketplace
      </h1>
      <a href="/dashboard/marketplace/addon/submit" class="bg-indigo-200 border border-indigo-600 hover:bg-indigo-300 px-6 py-2 rounded-lg text-sm font-semibold text-indigo-500">Submit your theme<span class="ml-2 text-xl leading-none">+</span></a>
    </div>
    <!-- Featured section -->
    <div class="rounded-lg mb-10 px-12 py-10 bg-indigo-500 w-full flex flex-col lg:flex-row justify-start">
        <div class="rounded bg-gray-200 w-56 h-40 lg:mr-12" style="background-image:url('https://api.singlelink.co/profile/thumbnail/jim');background-size:cover;background-position:top left;background-repeat:no-repeat;"></div>
        <div class="flex flex-col flex-1">
            <h5 class="tracking-wide font-bold uppercase text-sm text-indigo-300 mb-1">Featured theme</h5>
            <h2 class="text-white font-bold tracking-tight text-2xl mb-2">Bitcoin Binance!</h2>
            <span class="text-gray-200 font-medium mb-4">The ultimate theme for Bitcoin lovers, take pride in your love for cryptocurrency with this exclusive Binance related theme.</span>
            <a href="/dashboard/marketplace/addon/14" class="bg-indigo-600 rounded-lg px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700" style="width:fit-content;">See details</a>
        </div>
    </div>
    <!-- End featured section -->
    <!--<theme-list name="🔥 Trending themes" :preview="false" :themes="themes" :extended="false"/>-->
    <theme-list name="✨ Newest themes" :preview="false" :themes="addons" :addon="true" :extended="false"/>
    <theme-list name="Your submissions" :preview="false" :themes="addons" :addon="true" :extended="false"/>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import themeList from "~/components/theme/theme-list.vue";

type ThemeModalIntent = "create" | "edit" | "view";

export default Vue.extend({
  components: { themeList },
  name: 'DashboardAppearance',
  layout: 'dashboard',
  middleware: 'authenticated',
  head: {
    title: 'Marketplace - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'View the available themes & plugins on the ' + process.env.APP_NAME + ' marketplace.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'View the available themes & plugins on the ' + process.env.APP_NAME + ' marketplace.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Marketplace - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Marketplace - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'View the available themes & plugins on the ' + process.env.APP_NAME + ' marketplace.'
      },
    ],
  },
  data() {
    return {
      error: '',
      addons: new Array<Addon>(),
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
    await this.loadAddons();
  },

  methods: {
    async loadAddons() {
      try {
        // Grab addons from response
        this.addons = (await this.$axios.$post<Addon[]>('/marketplace/addons', {
          token: this.$store.getters['auth/getToken'],
          detailed: true
        }));
        console.log('addons!');
        console.log(this.addons);

        // Enrich theme data
        

      } catch (error) {
        console.log('Failed to get addons');
        console.log(error);
      }
    },
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const profileResponse = await this.$axios.$post<Profile>('/profile/active-profile', {
          token
        });

        //this.activeThemeId = profileResponse.themeId ?? null;
        //this.customCss = profileResponse.customCss ?? '';
        //this.customHtml = profileResponse.customHtml ?? '';
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },

    /*async saveChanges() {
      try {
        await this.$axios.$post<Profile>('/profile/update', {
          token: this.$store.getters['auth/getToken'],
          customCss: this.customCss,
          customHtml: this.customHtml
        });

        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log(err);
      }
    },*/

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