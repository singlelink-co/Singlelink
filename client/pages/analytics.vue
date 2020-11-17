<template>
  <div class="w-screen min-h-screen bg-gray-100 flex items-center flex-col">
    <section
      class="flex w-full items-center p-8 md:p-12 bg-white justify-center border border-r-0 border-l-0 border-b-0 border-t-8 border-indigo-600">
      <div class="w-11/12 max-w-6xl flex flex-col md:flex-row">
        <div class="flex flex-col md:mr-4 text-center justify-center md:justify-start md:text-left">
          <h1 class="text-3xl font-medium mb-2">Singlelink global analytics</h1>
          <p class="text-lg text-gray-700 mb-2">A public dashboard of all available Singlelink member analytics.</p>
          <span class="text-gray-500 mr-4 mb-4 md:mb-0">Last updated on {{ new Date().toLocaleString('en-US') }}</span>
        </div>
        <div class="flex flex-col items-center justify-center md:ml-auto mt-4 md:mt-0">
          <button
            class="w-full mb-2 p-2 pr-4 pl-4 bg-indigo-600 tracking-wide text-sm uppercase font-medium hover:bg-indigo-500 text-white rounded shadow"
            @click="refreshData">
            Refresh data
          </button>
          <n-link class="w-full" to="/dashboard">
            <button
              class="w-full p-2 pr-4 pl-4 bg-gray-100 tracking-wide text-sm uppercase font-medium hover:bg-gray-200 text-gray-600 rounded shadow">
              Return home
            </button>
          </n-link>
        </div>
      </div>
    </section>
    <div class="w-11/12 max-w-6xl flex flex-col p-8 md:p-20">
      <div class="flex flex-col md:flex-row mb-8">
        <section
          class="w-full md:w-1/2 rounded shadow bg-white p-8 overflow-hidden items-center flex flex-row md:mr-4 mb-8 md:mb-0">
          <h2 class="text-xl font-medium mr-4">Total users</h2>
          <p class="text-xl text-indigo-600 ml-auto relative flex items-center justify-center">
            <span v-if="this.analytics.users && this.analytics.users >= 100" class="absolute top-0 text-2xl"
                  style="left: -70px;">🤠🎉</span>
            {{ analytics.users || '...' }}
          </p>
        </section>
        <section class="w-full md:w-1/2 rounded shadow bg-white p-8 overflow-hidden items-center flex flex-row">
          <h2 class="text-xl font-medium mr-4">Profiles published</h2>
          <p class="text-xl text-indigo-600 ml-auto">{{ analytics.profilesPublished || '...' }}</p>
        </section>
      </div>
      <div class="flex flex-col md:flex-row mb-8">
        <section
          class="w-full md:w-1/2 rounded shadow bg-white p-8 overflow-hidden items-center flex flex-row md:mr-4 mb-8 md:mb-0">
          <h2 class="text-xl font-medium mr-4">Total links</h2>
          <p class="text-xl text-indigo-600 ml-auto">{{ analytics.links || '...' }}</p>
        </section>
        <section class="w-full md:w-1/2 rounded shadow bg-white p-8 overflow-hidden items-center flex flex-row">
          <h2 class="text-xl font-medium mr-4">Total themes</h2>
          <p class="text-xl text-indigo-600 ml-auto">{{ analytics.themes || '...' }}</p>
        </section>
      </div>
      <div class="flex flex-col md:flex-row mb-8">
        <section
          class="w-full md:w-1/2 rounded shadow bg-white p-8 overflow-hidden items-center flex flex-row md:mr-4 mb-8 md:mb-0">
          <h2 class="text-xl font-medium mr-4">Hourly user growth rate</h2>
          <p class="text-xl text-indigo-600 ml-auto">{{ hourlyGrowthRate || '...' }}</p>
        </section>
        <section class="w-full md:w-1/2 rounded shadow bg-white p-8 overflow-hidden items-center flex flex-row">
          <h2 class="text-xl font-medium mr-4">Linear year projection</h2>
          <p class="text-xl text-indigo-600 ml-auto">{{ projectedUsers || '...' }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      analytics: {},
      hourlyGrowthRate: null,
      projectedUsers: null
    };
  },

  methods: {
    refreshData: async function () {
      this.analytics = {};
      this.hourlyGrowthRate = null;
      this.projectedUsers = null;

      this.analytics = await this.$axios.$get('/analytics/fetch');

      this.computeVariables();
    },

    computeVariables: function () {
      this.hourlyGrowthRate = (this.analytics.users / this.timeDifference(new Date(), new Date(1599035400 * 1000)));
      this.projectedUsers = this.hourlyGrowthRate * 24 * 365;

      this.hourlyGrowthRate = this.hourlyGrowthRate.toFixed(1);
      this.projectedUsers = this.projectedUsers.toFixed(0);
    },

    timeDifference: function (dt2, dt1) {
      let diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= (60 * 60);
      return Math.abs(Math.round(diff));
    },
  },

  mounted: async function () {
    this.analytics = await this.$axios.$get('/analytics/fetch');

    this.computeVariables();
  }
};
</script>
