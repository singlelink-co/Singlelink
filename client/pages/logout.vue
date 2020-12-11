<template>
  <div/>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'Logout',

  mounted() {
    this.$store.commit('auth/logout');
    this.$router.push('/');
  }
});
</script>
