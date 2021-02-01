<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-2">
      {{ app_name }} tours
    </h1>
    <p class="text-gray-600 w-full text-left mb-4">New to {{ app_name }}? Take our various product tours below to learn everything you need to know!</p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'Tours',
  layout: 'dashboard',
  middleware: 'authenticated',
  data: () => {
    return {
      app_name: process.env.APP_NAME
    };
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
