import {Plugin} from '@nuxt/types';
import {toCSS, toJSON} from 'cssjson';

const transform = {
  toCSS,
  toJSON
};

declare module 'vue/types/vue' {
  // this.$transform inside Vue components
  interface Vue {
    $transform: typeof transform
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$transform inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $transform: typeof transform
  }

  // nuxtContext.$transform
  interface Context {
    $transform: typeof transform
  }
}

const exportPlugin: Plugin = (context, inject) => {
  inject('transform', transform);
};

export default exportPlugin;
