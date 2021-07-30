<template>
  <div
    :id="name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').split(' ').join('-').toLowerCase()"
    class="flex flex-col w-full justify-center"
  >
    <h2 class="font-bold text-xl py-2 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full mb-2">{{
        name
      }}</h2>
    <div v-if="!addon" :class="'grid grid-cols-' + cols + ' mb-2 justify-start w-full'">
      <!-- Show active theme first -->
      <a
        v-for="theme in themes"
        v-if="!icon && getActiveThemeId === theme.id"
        :key="theme.id"
        :href="'/dashboard/marketplace/addon/'+theme.id+query_string"
        class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-xl"
      >
        <theme :id="theme.id" :label="theme.label" :colors="theme.colors" :theme="true"/>
      </a>
      <div
        v-for="theme in themes"
        v-if="icon && getActiveThemeId === theme.id"
        :key="theme.id"
        class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-xl"
        @click="selectTheme(theme.id)"
      >
        <theme :id="theme.id" :icon="icon" :label="theme.label" :colors="theme.colors" :theme="true"/>
      </div>
      <!-- List active themes -->
      <a
        v-for="theme in themes"
        v-if="!icon && getActiveThemeId !== theme.id"
        :key="theme.id"
        :href="'/dashboard/marketplace/addon/'+theme.id+query_string"
        class="flex flex-col p-3 flex-1 hover:bg-opaqueIndigo rounded-xl"
      >
        <theme :id="theme.id" :label="theme.label" :colors="theme.colors" :theme="true"/>
      </a>
      <div
        v-for="theme in themes"
        v-if="icon && getActiveThemeId !== theme.id"
        :key="theme.id"
        class="cursor-pointer flex flex-col p-3 flex-1 hover:bg-opaqueIndigo rounded-xl"
        @click="selectTheme(theme.id)"
      >
        <theme :id="theme.id" :icon="icon" :label="theme.label" :colors="theme.colors" :theme="true"/>
      </div>
    </div>
    <div v-if="addon" :class="'grid grid-cols-' + cols + ' mb-2 justify-start w-full'">
      <!-- Show active theme first -->
      <a
        v-for="theme in themes"
        v-if="!icon && getActiveThemeId === theme.id"
        :key="theme.id"
        :href="'/dashboard/marketplace/addon/'+theme.id+query_string"
        class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-xl"
      >
        <theme
          :id="theme.id"
          :colors="theme.resource.colors"
          :label="theme.displayName"
          :profile-data="theme.resource"
        />
      </a>
      <div
        v-for="theme in themes"
        v-if="icon && active === theme.id"
        :key="theme.id"
        class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-xl"
        @click="selectTheme(theme.id)"
      >
        <theme
          :id="theme.id"
          :colors="theme.resource.colors"
          :icon="icon"
          :label="theme.displayName"
          profile-data="theme.resource"
        />
      </div>
      <!-- List active themes -->
      <a
        v-for="theme in themes"
        v-if="!icon && active !== theme.id"
        :key="theme.id"
        :href="'/dashboard/marketplace/addon/'+theme.id+query_string"
        class="flex flex-col p-3 flex-1 hover:bg-opaqueIndigo rounded-xl"
      >
        <theme
          :id="theme.id"
          :colors="theme.resource.colors"
          :label="theme.displayName"
          :profile-data="theme.resource"
        />
      </a>
      <div
        v-for="theme in themes"
        v-if="icon && active !== theme.id"
        :key="theme.id"
        class="cursor-pointer flex flex-col p-3 flex-1 hover:bg-opaqueIndigo rounded-xl"
        @click="selectTheme(theme.id)"
      >
        <theme
          :id="theme.id"
          :colors="theme.resource.colors"
          :icon="icon"
          :label="theme.displayName"
          :profile-data="theme.resource"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ThemeList',
  props: {
    name: String,
    themes: Array,
    cols: {
      type: Number,
      default: 3
    },
    extended: Boolean,
    icon: String,
    iconClick: String,
    itemClick: String,
    active: String,
    addon: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      query_string: '',
      activeThemeId: ''
    };
  },

  computed: {
    getActiveThemeId(): string {
      return this.activeThemeId;
    }
  },

  mounted() {
    if (window.location.href.split('?').length > 1) {
      this.query_string = '?' + window.location.href.split('?')[1];
    }

    this.activeThemeId = this.active;
  },

  methods: {
    async selectTheme(id: string) {
      try {
        const response = await this.$axios.$post('/profile/activate-theme', {
          token: this.$store.getters['auth/getToken'],
          id,
        });

        this.activeThemeId = response.themeId;
        // window.location.reload();
        this.$root.$emit('refreshUserProfileView');
      } catch (error) {
        console.log('Failed to activate theme');
        console.log(error);
      }
    },
  }
});
</script>
