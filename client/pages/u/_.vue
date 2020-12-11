<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <section
      v-if="profile.visibility==='published-18+' && ageVerificationRequired"
      class="fixed top-0 left-0 right-0 z-10 flex flex-col items-center justify-center w-screen h-screen"
      style="box-shadow: rgba(0, 0, 0, .65) 0  0 10px 5px inset;"
    >
      <div
        class="flex flex-col w-full h-full text-center items-center justify-center p-8"
        style="background:rgba(0,0,0,.65);backdrop-filter:saturate(180%) blur(5px)"
      >
        <span class="text-white text-2xl mb-2">Warning: 18+ only</span>
        <span class="text-gray-200 text-lg mb-4">To continue, please confirm your age below.</span>
        <div class="flex flex-col">
          <button
            class="w-full mb-4 uppercase rounded p-4 pl-4 pr-4 bg-indigo-600 hover:bg-indigo-500 cursor-pointer font-medium text-sm tracking-wide shadow text-white"
            @click="acceptAgeVerification"
          >
            Continue, I am 18+
          </button>
          <button
            style="background:#e74c3c;"
            class="w-full uppercase rounded p-4 pl-4 pr-4 cursor-pointer font-medium text-sm tracking-wide shadow text-white mr-2"
            @click="rejectAgeVerification"
          >
            Go back, I'm under 18
          </button>
        </div>
      </div>
    </section>

    <section class="flex flex-col p-6 pt-8 pb-8 items-center text-center max-w-sm w-full">
      <img
        v-if="profile.imageUrl || user.avatarUrl || user.emailHash"
        class="nc-avatar mb-2"
        :src="profile.imageUrl || user.avatarUrl || 'https://www.gravatar.com/avatar/' + user.emailHash"
      >
      <h1 class="text-black font-semibold text-2xl sl-headline">
        {{ profile.headline || user.name }}
      </h1>
      <h3 class="text-gray-600 mb-4 sl-subtitle">
        {{ profile.subtitle }}
      </h3>

      <a
        v-for="link in links"
        :key="link.id"
        :href="`${apiUrl}/analytics/link/${link.id}`"
        class="w-full"
      >
        <div
          class="rounded shadow bg-white p-4 w-full font-medium mb-3 nc-link sl-item flex items-center justify-center flex-col"
          :style="link.customCss"
        >
          <span class="font-medium text-gray-900 sl-label">{{ link.label }}</span>
          <span v-if="link.subtitle" class="text-sm text-gray-700 sl-link-subtitle mt-1">{{ link.subtitle }}</span>
        </div>
      </a>

      <div v-html="profile.customHtml"/>

      <component :is="'style'" v-if="theme">
        .sl-headline {
        color: {{ theme.colors.text.primary }};
        }
        .sl-subtitle {
        opacity: .85;
        color: {{ theme.colors.text.primary }};
        }
        .sl-bg {
        background: {{ theme.colors.fill.primary }};
        }
        .sl-item {
        background: {{ theme.colors.fill.secondary }};
        }
        .sl-label {
        color: {{ theme.colors.text.secondary }};
        }
        .sl-link-subtitle {
        opacity: .85;
        color: {{ theme.colors.text.secondary }};
        }
      </component>

      <component :is="'style'">
        {{ profile.customCss || null }}
      </component>

      <component :is="'style'">
        .nc-avatar {
        width: 60px;
        height: 60px;
        border-radius: 1000px;
        }
        .nc-link {
        @apply rounded shadow bg-white p-4 w-full font-medium mb-3;
        cursor: pointer;
        transition: .15s ease-in-out;
        }
        .nc-link:hover {
        transform: scale(1.02);
        }
        .nc-link:active {
        transform: scale(1);
        }
      </component>

    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Context} from "@nuxt/types";

export default Vue.extend({
  name: 'UShowProfile',

  async asyncData(ctx: Context): Promise<object | void> {
    try {
      const url = '/profile/' + ctx.route.path.replace('/u/', '');

      const response = await ctx.$axios.$post(url, {
        token: ctx.store.getters['auth/getToken']
      });

      return {
        profile: response.profile
      };
    } catch (err) {
      console.log('Error getting profile');
      console.log(err);

      ctx.error({
        statusCode: 404,
        message: "Page not found"
      });
    }
  },

  data() {
    return {
      apiUrl: process.env.API_URL,
      profile: {
        customHtml: '',
        customCss: '',
        imageUrl: '',
        headline: '',
        subtitle: '',
        visibility: ''
      },
      user: {
        name: '',
        emailHash: '',
        avatarUrl: ''
      },
      thumbnail: '',
      theme: '',
      links: '',
      failed: false,
      ageVerificationRequired: true
    };
  },

  head() {
    const profile: Profile = this.profile;

    return {
      title: profile.headline || '',

      meta: [
        {
          hid: 'title',
          name: 'title',
          content: profile.headline || ''
        },
        {
          hid: 'og:title',
          name: 'title',
          content: profile.headline || ''
        },
        {
          hid: 'description',
          name: 'description',
          content: profile.subtitle || ''
        },
        {
          hid: 'og:description',
          name: 'description',
          content: profile.subtitle || ''
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: 'https://api.singlelink.co/profile/thumbnail/' + this.$route.path.replace('/u/', '')
        }
      ]
    };
  },

  async mounted() {
    try {
      const url = '/profile/' + this.$route.path.replace('/u/', '');

      const response = await this.$axios.$post(url, {
        token: this.$store.getters['auth/getToken']
      });

      this.profile = response.profile;
      this.links = response.links.sort(function (a: any, b: any) {
        return a.sortOrder - b.sortOrder;
      });
      this.user = response.user;
      this.theme = response.theme || null;
    } catch (err) {
      console.log('Error getting profile');
      console.log(err);
    }
  },

  methods: {
    acceptAgeVerification() {
      this.ageVerificationRequired = false;
    },

    rejectAgeVerification() {
      if (process.client) {
        window.location.href = "https://singlelink.co";
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.nc-avatar {
  width: 60px;
  height: 60px;
  border-radius: 1000px;
}

.nc-link {
  cursor: pointer;
  transition: .15s ease-in-out;
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1);
  }
}

</style>
