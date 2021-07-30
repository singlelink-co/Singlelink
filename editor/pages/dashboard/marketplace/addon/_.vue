<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center flex-grow overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
      <h1 v-if="intent!=='view'" class="text-gray-800 font-extrabold tracking-tight text-3xl">
        Submission details
      </h1>
      <h1
        v-if="intent==='view' && addon && addon.displayName"
        class="text-gray-800 font-extrabold tracking-tight text-3xl"
      >{{ addon.displayName }}</h1>
    </div>
    <div class="flex flex-col lg:flex-row w-full items-start mb-4">
      <div
        class="p-3 bg-white"
        style="border-radius: 50px; overflow:hidden;box-shadow:0 10px 15px -3px rgb(0 0 0), 0 4px 6px -2px rgb(0 0 0), inset 0 0 5px 0 rgba(0,0,0,.1);"
      >
        <div
          class="relative text-center rounded flex items-center justify-ceneter p-6 bg-indigo-200"
          style="border-radius: 40px;width: 262px;height:568px;overflow:hidden;"
        >
          <span class="text-sm text-indigo-500 font-medium mx-auto">Save addon for preview</span>
          <iframe
            v-if="addon.id"
            style="z-index:2;pointer-events: none;width: 376px;height: 813px;transform: scale(0.7) translate(-82px, -175px);top:0;left:0;position:absolute;"
            :src="'/dashboard/marketplace/preview/' + addon.id"
          />
        </div>
      </div>
      <div class="flex flex-col lg:w-2/3 px-8">
        <div v-if="intent!=='view'" class="flex flex-col mb-4 justify-start">
          <label class="font-semibold mb-2">Display name</label>
          <input
            v-model="addon.displayName"
            class="p-3 rounded-xl bg-white text-sm text-gray-700"
            placeholder="e.g. My beautiful theme"
            type="text"
          >
        </div>
        <div v-if="intent!=='view'" class="flex flex-col mb-4 justify-start w-full">
          <label class="font-semibold mb-2">Theme or plugin for sale</label>
          <select v-model="addon.resourceId" class="p-3 rounded-xl bg-white text-sm text-gray-700">
            <option v-for="theme in themes" :key="theme.id" :value="theme.id">
              {{ theme.id }} - {{ theme.label }}
            </option>
          </select>
        </div>
        <div class="flex flex-col mb-4 justify-start">
          <label class="font-semibold mb-2">Description</label>
          <textarea
            v-if="intent !== 'view'"
            v-model="addon.description"
            rows="6"
            class="p-3 rounded-xl bg-white text-sm text-gray-700"
            :placeholder="`e.g. Your favorite beautiful theme for Singlelink.`"
          />
          <p v-if="intent === 'view'" class="text-gray-600 text-lg leading-relaxed">
            {{ addon.description }}
          </p>
        </div>
        <div class="flex flex-col mb-4 justify-start w-full">
          <label class="font-semibold mb-2">Tags/keywords</label>
          <input
            v-if="intent !== 'view'"
            v-model="pendingTag"
            class="p-3 rounded-xl bg-white text-sm text-gray-700"
            placeholder="e.g. colorful"
            type="text"
          >
          <ul
            v-if="addon && addon.tags && addon.tags.length>=1"
            class="mt-3 flex flew-rox flex-wrap justify-start items-start"
          >
            <li
              v-for="tag in addon.tags"
              :key="tag[0]"
              class="hover:bg-indigo-300 flex flex-row items-center justify-center p-1 text-sm px-3 text-indigo-500 mr-2 rounded bg-indigo-200 bg-indigo-200 font-medium"
            >
              {{ tag }}
              <div class="ml-2 cursor-pointer leading-none" @click="pluck(tag)">
                x
              </div>
            </li>
          </ul>
        </div>
        <div v-if="intent === 'edit'" class="flex flex-col mb-4 justify-start w-full">
          <label class="font-semibold mb-2">Published?</label>
          <select v-model="addon.global" class="p-3 rounded-xl bg-white text-sm text-gray-700">
            <option value="false">
              No, this theme is private.
            </option>
            <option value="true">
              Yes, this theme is available for community download.
            </option>
          </select>
        </div>
        <div class="flex flex-col lg:flex-row items-center justify-start mt-4">
          <div
            v-if="intent==='view' && installed.indexOf(Number(addon.id)) < 0"
            class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-indigo-500 bg-gdp lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
            @click="installAddon"
          >Install addon
          </div>
          <div
            v-if="intent==='view' && installed.indexOf(Number(addon.id)) >= 0"
            class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-indigo-500 bg-gdp lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
            @click="uninstallAddon"
          >Uninstall addon
          </div>
          <div
            v-if="intent==='view' && favorites.indexOf(Number(addon.id)) < 0"
            class="px-6 py-3 font-semibold text-gray-700 border border-gray-700 rounded-xl hover:bg-gray-50 lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
            @click="toggleFavoriteAddon"
          >Add to favorites
          </div>
          <div
            v-if="intent==='view' && favorites.indexOf(Number(addon.id)) >= 0"
            class="px-6 py-3 font-semibold text-gray-700 border border-gray-700 rounded-xl hover:bg-gray-50 lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
            @click="toggleFavoriteAddon"
          >Remove from favorites
          </div>
          <div
            v-if="intent==='submit'"
            class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-indigo-500 bg-gdp lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
            @click="attemptSubmit"
          >Create addon
          </div>
          <div
            v-if="intent==='edit'"
            class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-indigo-500 bg-gdp lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
            @click="updateAddon"
          >Save changes
          </div>
          <div
            v-if="intent==='edit'"
            class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-red-500 bg-red-600 cursor-pointer"
            @click="deleteAddon"
          >Delete addon
          </div>
        </div>
      </div>
    </div>
    <!--<div class="flex flex-col mb-4 justify-start w-full">
        <label class="font-semibold mb-2">Theme ID</label>
        <select class="p-3 rounded-xl bg-white text-sm text-gray-700" v-model="addon.global">
            <option v-for="theme in themes" :value="theme.id">{{ theme.id }} - {{ theme.label }}</option>
        </select>
    </div>-->
    <!--<div class="flex flex-col mb-4 justify-start w-full">
        <label class="font-semibold mb-2">Theme tags</label>
        <input class="p-3 rounded-xl bg-white text-sm text-gray-700" v-model="pendingTag" placeholder="e.g. colorful" type="text"/>
        <ul v-if="addon.tags.length>=1" class="mt-2 flex flew-rox flex-wrap justify-start items-start">
            <li class="hover:bg-indigo-300 flex flex-row items-center justify-center p-1 text-sm px-3 text-indigo-500 mr-2 rounded bg-indigo-200 bg-indigo-200 font-medium" v-for="tag in addon.tags">
                {{ tag }}
                <div class="ml-2 cursor-pointer leading-none" @click="pluck(tag)">x</div>
            </li>
        </ul>
    </div>-->
    <!--<div class="flex flex-col mb-4 justify-start w-full">
        <label class="font-semibold mb-2">Published?</label>
        <select class="p-3 rounded-xl bg-white text-sm text-gray-700" v-model="addon.global">
            <option value="false">No, this theme is private.</option>
            <option value="true">Yes, this theme is available for community download.</option>
        </select>
    </div>-->
    <!--<div class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-indigo-500 bg-gdp mr-auto mt-4 cursor-pointer">Publish addon</div>-->
    <!--<div class="px-6 py-3 font-semibold text-white rounded-xl hover:bg-indigo-500 bg-gdp mr-auto mt-4 cursor-pointer">Save changes</div>-->

  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'authenticated',

  async asyncData(ctx) {
    const addonResponse = {
      addon: {
        id: null,
        displayName: null,
        description: null,
        global: false,
        tags: [],
        resourceId: null
      },
      intent: 'view'
    } as any;

    console.log(addonResponse.addon.id);

    if (ctx.route.path.replace('/dashboard/marketplace/addon/', '') === 'submit') {
      // set intent to submit
      addonResponse.intent = 'submit';
      console.log('Submit!');
      return addonResponse;
    } else {
      addonResponse.addon.id = Number(ctx.route.path.replace('/dashboard/marketplace/addon/', ''));
      addonResponse.addon = await ctx.$axios.$post('/marketplace/addon/' + ctx.route.path.replace('/dashboard/marketplace/addon/', ''), {
        token: ctx.store.getters['auth/getToken'],
        detailed: true
      });

      return addonResponse;
    }
  },

  data() {
    return {
      id: null,
      activeProfileId: null,
      intent: 'view' as 'view' | 'edit' | 'submit',
      addon: {
        id: null as string | null | undefined,
        userId: null as string | null | undefined,
        activeProfileId: null as string | null | undefined,
        displayName: null as string | null | undefined,
        description: null as string | null | undefined,
        global: false,
        tags: [] as string[],
        resourceId: null as string | null | undefined
      },
      pendingTag: '',
      themes: [],
      colors: {
        fill: {
          primary: '#5353EC',
          secondary: '#FFFFFF'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#000000'
        }
      },
      installed: [] as number[],
      favorites: [] as number[],
    };
  },

  head() {
    let description = '';
    let displayName = 'Unnamed';

    if (this.addon.description) {
      description = this.addon.description;
    }
    if (this.addon.displayName) {
      displayName = this.addon.displayName;
    }

    return {
      title: displayName + ' theme - Singlelink',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description + '... Download this theme in seconds for free by creating a free Singlelink account!'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description + '... Download this theme in seconds for free by creating a free Singlelink account!'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: displayName + ' theme - Singlelink'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: displayName + ' theme - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description + '... Download this theme in seconds for free by creating a free Singlelink account!'
        },
      ],
    };
  },

  watch: {
    pendingTag(value) {
      this.pendingTag = value;
      this.buildTags();
    }
  },

  async mounted() {
    await this.getUserData();
    await this.loadThemes();

    console.log(this.addon);

    // If user is author
    if (this.intent !== 'submit' && this.addon.userId === this.id) {
      // Set intent to edit
      this.intent = 'edit';
    } else if (this.intent !== 'submit') {
      // Else, set intent to view
      this.intent = 'view';
    }

    console.log('Intent');
    console.log(this.intent);
    console.log('Loaded!');
    console.log(this.addon);

    await this.getInstalledAddons();
    await this.getFavoritedAddons();
  },

  methods: {
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];
        const userResponse = await this.$axios.$post('/user', {
          token
        });
        this.activeProfileId = userResponse.activeProfileId;
        this.id = userResponse.id;
        console.log(userResponse);
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },

    async loadThemes() {
      try {
        // Grab themes from response
        this.themes = (await this.$axios.$post('/themes', {
          token: this.$store.getters['auth/getToken'],
          includeGlobal: false,
        }));
        console.log(this.getUserData);
        /* this.globalThemes = (await this.$axios.$post<Theme[]>('/themes', {
            token: this.$store.getters['auth/getToken'],
            onlyGlobal: true
        })); */
      } catch (error) {
        console.log('Failed to get themes');
        console.log(error);
      }
    },

    async attemptSubmit() {
      // validation
      if (!this.addon.resourceId || !this.addon.displayName) {
        return;
      }
      const submission = await this.$axios.$post('/marketplace/addon/create', {
        token: this.$store.getters['auth/getToken'],
        addon: {
          // userId: this.id,
          displayName: this.addon.displayName,
          type: 'theme', // temporary
          description: this.addon.description,
          resourceId: this.addon.resourceId,
          tags: this.addon.tags,
          // global: this.addon.global
        }
      });
      console.log('Done!');
      console.log(submission);
      window.location.href = '/dashboard/marketplace/addon/' + submission.id;
    },

    async updateAddon() {
      const changed = await this.$axios.$post('/marketplace/addon/update', {
        token: this.$store.getters['auth/getToken'],
        addon: {
          id: this.$route.path.replace('/dashboard/marketplace/addon/', ''),
          displayName: this.addon.displayName,
          type: 'theme', // temporary
          description: this.addon.description,
          resourceId: this.addon.resourceId,
          tags: this.addon.tags,
          global: this.addon.global
        }
      });
      console.log('Done!');
      console.log(changed);
    },

    async deleteAddon() {
      const deleted = await this.$axios.$post('/marketplace/addon/delete', {
        token: this.$store.getters['auth/getToken'],
        id: this.$route.path.replace('/dashboard/marketplace/addon/', '')
      });
      console.log('Done!');
      console.log(deleted);
      window.location.href = '/dashboard/marketplace';
    },

    async getInstalledAddons() {
      const installed = await this.$axios.$post('/marketplace/addons/installed', {
        token: this.$store.getters['auth/getToken'],
        // profileId: this.activeProfileId
      });
      console.log(installed);
      for (let i = 0; i < installed.length; i++) {
        this.installed.push(Number(installed[i].addonId));
      }
    },

    async getFavoritedAddons() {
      this.favorites = await this.$axios.$post('/marketplace/user/favorites', {
        token: this.$store.getters['auth/getToken'],
      });
      /* console.log(this.addon.id);
      console.log(this.favorites.indexOf(Number(this.addon.id))); */
    },

    async toggleFavoriteAddon() {
      const favorite = await this.$axios.$post('/marketplace/user/favorite/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
        token: this.$store.getters['auth/getToken'],
        // id: this.id,
        // profileId: this.activeProfileId
      });

      if (this.intent !== 'submit') {
        if (this.favorites.includes(Number(this.addon.id))) {
          this.favorites.splice(this.favorites.indexOf(Number(this.addon.id)));
        } else {
          this.favorites.push(Number(this.addon.id));
        }
      }
      console.log('Toggled favorite!');
      console.log(favorite);
    },

    async installAddon() {
      const install = await this.$axios.$post('/marketplace/addon/install/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
        token: this.$store.getters['auth/getToken'],
        // id: this.id,
        // profileId: this.activeProfileId
      });
      console.log('Install');
      console.log(install);
      this.installed = [Number(this.$route.path.replace('/dashboard/marketplace/addon/', ''))];
      window.location.reload();
    },

    async uninstallAddon() {
      const uninstall = await this.$axios.$post('/marketplace/addon/uninstall/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
        token: this.$store.getters['auth/getToken'],
        // id: this.id,
        // profileId: this.activeProfileId
      });
      console.log('Uninstall');
      console.log(uninstall);
      this.installed = [];
      window.location.reload();
    },

    buildTags() {
      if (this.pendingTag.indexOf(' ') > 0) {
        this.addon.tags.push(this.pendingTag.trim());
        this.pendingTag = '';
      }
    },

    pluck(item: string) {
      const index = this.addon.tags.indexOf(item);
      if (index !== -1) {
        this.addon.tags.splice(index, 1);
      }
    }
  }
});
</script>
