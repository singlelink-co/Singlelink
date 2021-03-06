<template>
  <div/>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'Logout',
  head: {
    title: 'Logout - ' + process.env.APP_NAME,
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Logout of your ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Logout of your ' + process.env.APP_NAME + ' account.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Logout - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Logout - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Logout of your ' + process.env.APP_NAME + ' account.'
      },
    ],
  },
  mounted() {
    this.$store.commit('auth/logout');
    this.$router.push('/');
  }
});
</script>
