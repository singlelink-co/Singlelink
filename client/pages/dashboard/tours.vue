<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-2">
      {{ app_name }} tours
    </h1>
    <p class="text-gray-600 w-full text-left mb-4">New to {{ app_name }}? Take our various product tours below to learn everything you need to know!</p>

    <div class="flex flex-col p-6 bg-white shadow rounded-lg w-full mb-8" v-for="tour in tours">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
        {{ tour.name }}
      </h2>
      <p class="text-gray-600 mb-4">{{ tour.description }}</p>
      <a v-if="!tour.completed" :href="tour.url" class="flex flex-row w-auto px-6 py-3 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500" style="width:fit-content;">Begin tour</a>
      <div v-if="tour.completed" class="flex flex-row items-center justify-start">
        <a :href="tour.url" class="flex flex-row w-auto px-6 py-3 text-gray-700 font-semibold rounded-lg bg-gray-300 hover:bg-gray-200" style="width:fit-content;">Take tour again</a>
        <span class="ml-4 text-gray-600 italic text-sm">Completed on {{ tour.completed }}</span>
      </div>
    </div>
  
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'Tours',
  layout: 'dashboard',
  middleware: 'authenticated',
  head: {
    title: 'Product tours - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Learn more about ' + process.env.APP_NAME + ' through guided product tours.'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Learn more about ' + process.env.APP_NAME + ' through guided product tours.'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Dashboard - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Dashboard - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Learn more about ' + process.env.APP_NAME + ' through guided product tours.'
      },
    ],
  },
  data: () => {
    return {
      app_name: process.env.APP_NAME,
      tours: [
        {
          name: 'Singlelink 101 - Creating your first link',
          description: 'Learn how to add your first link to your Singlelink profile!',
          url: '/dashboard?tour=sl-101-01',
          //completed: '10/29/20'
        },
        /*{
          name: 'Customization: Entrance to your appearance panel',
          description: 'Learn the basics of customizing your profile with our appearance panel and custom link css.',
          url: '/dashboard/appearance?tour=custom-101',
          completed: false
        },
        {
          name: 'Customization: Entrance to using custom HTML/CSS',
          description: 'Learn advanced techniques for styling your profile using custom HTML/CSS.',
          url: '/dashboard/appearance?tour=custom-102',
          completed: false
        }*/
      ]
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
