<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-center justify-start w-full mb-4">
      <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl mr-auto mb-4 lg:mb-0 lg:mr-4">
        Marketplace
      </h1>
      <div class="ml-auto flex flex-row p-1 rounded-lg bg-white flex-grow" style="max-width: 465px;">
        <input class="flex text-sm text-gray-700 flex-grow font-medium rounded-lg p-2" type="text" v-model="query" placeholder="e.g. A theme name or term, colorful, bold, etc..."/>
        <div @click="searchAddons" class="p-2 bg-indigo-200 text-indigo-600 cursor-pointer font-bold tracking-tight text-sm rounded-lg border border-indigo-500">Search themes</div>
      </div>
    </div>

    <theme-list v-if="addons.query.length>0" :name="'Search results for ' + query" :preview="false" :themes="addons.query" :addon="true" :extended="false" class="mb-8"/>
    
    <div v-if="addons.query.length>0" class="rounded-lg mb-10 px-12 py-10 bg-indigo-500 w-full flex flex-col justify-start items-start">
          <h5 class="tracking-wide font-bold uppercase text-sm text-indigo-300 mb-1">Go back</h5>
          <h2 class="text-white font-bold tracking-tight text-2xl mb-2">Didn't find what you were looking for?</h2>
          <span class="text-gray-200 font-medium mb-4">Don't worry, there are tons more themes available. Return to the marketplace to discover more themes to use on your profile!</span>
          <div @click="addons.query=[]" class="bg-indigo-200 border border-indigo-600 hover:bg-indigo-300 px-6 py-2 rounded-lg text-sm font-semibold text-indigo-500">Return to the marketplace</div>
      </div>

    <div v-if="addons.query.length<1" class="w-full flex flex-col justify-center items-start">
      <!-- Featured section -->
      <div v-if="addons.featured.length>0" class="rounded-lg mb-10 px-12 py-10 bg-indigo-500 w-full flex flex-col lg:flex-row justify-start">
          <div class="relative rounded" style="width: 201px; height: 217px; overflow: hidden;"><iframe scrolling="no" :src="'/dashboard/marketplace/preview/' + addons.featured[0].id" style="pointer-events: none; width: 375px; height: 406px; transform: scale(0.536) translate(-163px, -175px); top: 0px; left: 0px; position: absolute;"></iframe> <!----> <!----></div>
          <div class="flex flex-col flex-1 ml-6">
              <h5 class="tracking-wide font-bold uppercase text-sm text-indigo-300 mb-1">Featured theme</h5>
              <h2 class="text-white font-bold tracking-tight text-2xl mb-2">{{ addons.featured[0].displayName }}</h2>
              <span class="text-gray-200 font-medium mb-4">{{ addons.featured[0].description }}</span>
              <a :href="'/dashboard/marketplace/addon/' + addons.featured[0].id" class="bg-indigo-600 rounded-lg px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700" style="width:fit-content;">See details</a>
          </div>
      </div>
      <!-- End featured section -->
      <theme-list v-if="addons.hot.length>0" name="🔥 Trending themes" :preview="false" :themes="addons.hot" :addon="true" :extended="false" class="mb-8"/>
      <theme-list v-if="addons.new.length>0" name="✨ Newest themes" :preview="false" :themes="addons.new" :addon="true" :extended="false" class="mb-8"/>
      <theme-list v-if="addons.submissions.length>0" name="Your submissions" :preview="false" :themes="addons.submissions" :addon="true" :extended="false" class="mb-8"/>
      <div v-if="addons.hot.length>0||addons.new.length>0" class="rounded-lg mb-10 px-12 py-10 bg-indigo-500 w-full flex flex-col justify-start items-start">
          <h5 class="tracking-wide font-bold uppercase text-sm text-indigo-300 mb-1">Become a creator</h5>
          <h2 class="text-white font-bold tracking-tight text-2xl mb-2">Ready to publish your first theme?</h2>
          <span class="text-gray-200 font-medium mb-4">Submitting to the marketplace is easy, free, and takes seconds. All you need is a theme you've created that you're ready to share!</span>
          <a href="/dashboard/marketplace/addon/submit" class="bg-indigo-200 border border-indigo-600 hover:bg-indigo-300 px-6 py-2 rounded-lg text-sm font-semibold text-indigo-500">Submit a theme<span class="ml-2 text-xl leading-none">+</span></a>
      </div>
    </div>
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
      addons: {
        featured: new Array<Addon>(),
        hot: new Array<Addon>(),
        new: new Array<Addon>(),
        query: new Array<Addon>(),
        submissions: new Array<Addon>(),
      },
      top_feature: null,
      userId: '',
      isAdmin: false,
      query: null as any
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
        // Fetch featured addons from response
        this.addons.featured = (await this.$axios.$post<Addon[]>('/marketplace/addons', {
          sorting: "featured",
          token: this.$store.getters['auth/getToken'],
          detailed: true
        }));
        // Fetch hottest addons from response
        this.addons.hot = (await this.$axios.$post<Addon[]>('/marketplace/addons', {
          sorting: "currentInstalls",
          token: this.$store.getters['auth/getToken'],
          detailed: true,
          limit: 8
        }));
        // Grab newest addons from response
        this.addons.new = (await this.$axios.$post<Addon[]>('/marketplace/addons', {
          sorting: "new",
          token: this.$store.getters['auth/getToken'],
          detailed: true,
          limit: 8
        }));

        console.log('Addons');
        console.log(this.addons);

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
    async searchAddons() {
      console.log('Query');
      console.log(this.query);
      if(!this.query) return;
      try {
        // Fetch query addons from response
        let url = '/marketplace/addons/search?detailed=true&query=' + encodeURI(this.query);
        this.addons.query = (await this.$axios.$get<Addon[]>(url));
        console.log('url');
        console.log(url);
        console.log(this.addons.query);
        console.log('done');
      } catch(err) {
        console.log('Error');
        console.log(err);
      }

    }

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
  }
});
</script>