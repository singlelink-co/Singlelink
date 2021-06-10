<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-center justify-start mb-4 space-x-4">
      <img class="w-10" src="/Rocket.svg">
      <h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
        Site analytics <span class="hidden lg:flex ml-2">(30 days)</span>
      </h1>
    </div>

    <div
      v-if="user.activeProfile.metadata.privacyMode"
      class="flex flex-col items-center justify-center w-full p-6 rounded-2xl shadow bg-white"
    >
      <div
        class="w-full p-6 bg-red-200 border-red-600 border rounded-2xl text-red-500 flex flex-col xl:flex-row xl:items-center justify-start"
      >
        <span class="text-xl xl:text-base font-bold mb-1 xl:mb-0 xl:mr-2">Notice:</span>
        <span class="text-sm">Privacy mode is currently enabled. Disable privacy mode to collect analytics data!</span>
      </div>
    </div>

    <div v-if="!user.activeProfile.metadata.privacyMode" class="grid lg:grid-cols-3 gap-x-4 w-full">
      <div class="flex flex-col p-6 bg-white shadow items-center text-center rounded-2xl mb-8">
        <h2 class="font-bold text-black opacity-70 text-lg w-full mb-1">
          Total views
        </h2>
        <h4 class="text-indigo-600 text-4xl leading-tight font-bold">
          {{ analytics.totalProfileViews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </h4>
      </div>
      <div class="flex flex-col p-6 bg-white shadow items-center text-center rounded-2xl mb-8">
        <h2 class="font-bold text-black opacity-70 text-lg w-full mb-1">
          Total clicks
        </h2>
        <h4 class="text-indigo-600 text-4xl leading-tight font-bold">
          {{ visitSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </h4>
      </div>
      <div class="flex flex-col p-6 bg-white shadow items-center text-center rounded-2xl mb-8">
        <h2 class="font-bold text-black opacity-70 text-lg w-full mb-1">
          Click through rate
        </h2>
        <h4 class="text-indigo-600 text-4xl leading-tight font-bold">
          {{ ((visitSum / (analytics.totalProfileViews === 0 ? 1 : analytics.totalProfileViews)) * 100).toFixed(2) }}%
        </h4>
      </div>
    </div>

    <div
      v-if="!user.activeProfile.metadata.privacyMode"
      class="flex flex-col p-6 bg-white shadow rounded-2xl w-full mb-8"
    >
      <h2 class="text-black font-bold opacity-70 text-lg mb-4">
        Link engagement
      </h2>

      <div
        v-for="link in analytics.linkVisits"
        :key="link.id"
        class="rounded-2xl shadow bg-white p-4 w-full font-medium mb-4 flex items-center justify-center lg:flex-row flex-col"
      >
        <div class="text-left mr-4 flex flex-col justify-start w-full lg:w-auto pt-1 px-2 lg:pt-0 lg:px-0">
          <span class="font-medium text-black font-bold text-lg mb-2">{{ link.link.label }}</span>
          <span
            v-if="link.link.url && link.link.url.length > 41"
            class="text-black opacity-70 font-bold overflow-x-hidden max-w-full"
          >{{ link.link.url.substr(0, 42) }}...</span>
          <span
            v-if="link.link.url && link.link.url.length < 42"
            class="text-black opacity-70 font-bold overflow-x-hidden max-w-full"
          >{{ link.link.url }}</span>
        </div>
        <div
          class="lg:ml-auto flex flex-row lg:flex-col justify-start lg:justify-end items-center mt-2 lg:mt-0 w-full lg:w-auto"
        >
          <span class="uppercase text-gray-800 font-bold mr-1 lg:mr-0 lg:mb-1">Total clicks</span>
          <span class="lg:hidden text-sm uppercase text-gray-700 font-semibold mr-2 lg:mr-0 lg:mb-1">:</span>
          <h4 class="lg:ml-auto text-indigo-600 text-2xl font-bold">
            {{ link.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
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
        totalProfileViews: 0,
        linkVisits: new Array<LinkVisit>(),
        clickThroughRate: 0,
      },
      visitSum: 0,
      originalHandle: '',
      user: {
        name: '',
        emailHash: '',
        activeProfile: {
          imageUrl: '',
          headline: '',
          subtitle: '',
          handle: '',
          customDomain: '',
          visibility: '',
          showWatermark: false,
          metadata: {
            privacyMode: false
          },
        }
      },
    };
  },
  head: {
    title: 'Site Analytics - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'View your site analytics from your analytics dashboard.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'View your site analytics from your analytics dashboard.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Site Analytics - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Site Analytics - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'View your site analytics from your analytics dashboard.'
      },
    ],
  },

  async mounted() {
    await this.getUserData();
    if (this.user.activeProfile.metadata.privacyMode) {
      return;
    }
    await this.getProfileAnalytics();
    for (let i = 0; i < this.analytics.linkVisits.length; i++) {
      this.visitSum += this.analytics.linkVisits[i].views;
    }
  },

  methods: {
    async getProfileAnalytics() {
      try {
        this.analytics = await this.$axios.$post('/analytics/profile', {
          token: this.$store.getters['auth/getToken']
        });
        console.log('analytics');
        console.log(this.analytics);
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const userResponse = await this.$axios.$post('/user', {
          token
        });

        const siteResponse = await this.$axios.$post('/profile/active-profile', {
          token
        });

        this.user.name = userResponse.name;
        this.user.emailHash = userResponse.emailHash;

        this.user.activeProfile.imageUrl = siteResponse.imageUrl;
        this.user.activeProfile.headline = siteResponse.headline;
        this.user.activeProfile.subtitle = siteResponse.subtitle;
        this.user.activeProfile.handle = siteResponse.handle;
        this.user.activeProfile.customDomain = siteResponse.customDomain;
        this.user.activeProfile.visibility = siteResponse.visibility;
        this.user.activeProfile.showWatermark = siteResponse.showWatermark;

        this.user.activeProfile.metadata.privacyMode = siteResponse.metadata.privacyMode;

        this.$set(this.user.activeProfile, 'user.activeProfile', siteResponse);

        this.originalHandle = this.user.activeProfile.handle;
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
  }
});
</script>

<style lang="scss">
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
