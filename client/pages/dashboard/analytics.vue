<template>
  <section class="flex flex-col p-8 items-center flex-grow bg-gray-100 overflow-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">
      Profile analytics
    </h1>
    <div class="flex md:flex-row flex-col items-center justify-center w-full">
      <div class="flex flex-col p-6 bg-white shadow rounded w-full md:w-1/2 mb-8 md:mr-2">
        <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
          Total views
        </h2>
        <h4 class="text-indigo-600 text-3xl">
          {{ analytics.totalProfileViews }}
        </h4>
      </div>
      <div class="flex flex-col p-6 bg-white shadow rounded w-full md:w-1/2 mb-8 md:ml-2">
        <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
          Click through rate
        </h2>
        <h4 v-if="analytics.clickThroughRate" class="text-indigo-600 text-3xl">
          {{ analytics.clickThroughRate.toFixed(2) }}%
        </h4>
      </div>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8 md:mr-2">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-4">
        Link engagement
      </h2>
      <div
        v-for="link in analytics.linkVisits"
        :key="link.id"
        class="rounded shadow bg-white p-4 w-full font-medium mb-3 flex items-center justify-center md:flex-row flex-col"
        :style="link.link.customCss"
      >
        <div class="text-left mr-4 flex flex-col justify-start">
          <span class="font-medium text-gray-900 mb-2">{{ link.link.label }}</span>
          <span v-if="link.link.url" class="text-sm text-gray-700">{{ link.link.url }}</span>
        </div>
        <div class="ml-auto flex flex-col justify-end items-center">
          <span class="text-sm uppercase text-gray-700 font-semibold mb-2">Total clicks</span>
          <h4 class="ml-auto text-indigo-600 text-lg">
            {{ link.views }}
          </h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DashboardAnalytics',
  layout: 'dashboard',
  middleware: 'authenticated',

  data() {
    return {
      analytics: {
        totalProfileViews: null,
        linkVisits: new Array<LinkVisit>(),
        clickThroughRate: null
      }
    };
  },

  async mounted() {
    await this.getProfileAnalytics();
  },

  methods: {
    async getProfileAnalytics() {
      try {
        this.analytics = await this.$axios.$post('/analytics/profile', {
          token: this.$store.getters['auth/getToken']
        });
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
  }
});
</script>
