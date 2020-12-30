<template>
  <div id="user-profile-view" class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <section class="flex flex-col p-6 pt-8 pb-8 items-center text-center max-w-sm w-full">
      <img
        v-if="profile.imageUrl || user.avatarUrl || user.emailHash"
        class="nc-avatar mb-2"
        :src="profile.imageUrl || user.avatarUrl || 'https://www.gravatar.com/avatar/' + user.emailHash"
        alt="profile image"
      >
      <h1 class="text-black font-semibold text-2xl sl-headline">
        {{ profile.headline || user.name }}
      </h1>
      <h3 class="text-gray-600 mb-4 sl-subtitle">
        {{ profile.subtitle }}
      </h3>

      <a v-for="link in links" :key="link.id" :href="link.url" class="w-full">
        <div
          class="rounded shadow bg-white p-4 w-full font-medium mb-3 nc-link sl-item  flex items-center justify-center flex-col"
          :style="link.customCss"
        >
          <span class="font-medium text-gray-900 sl-label">{{ link.label }}</span>
          <span v-if="link.subtitle" class="text-sm text-gray-700 sl-link-subtitle mt-1">{{ link.subtitle }}</span>
        </div>
      </a>

      <div v-html="profile.customHtml"/>
      <div v-if="theme" v-html="theme.customHtml"/>

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

      <component :is="'style'" v-if="profile.customCss">
        {{ profile.customCss || null }}
      </component>

      <component :is="'style'" v-if="(theme ? theme.customCss : false)">
        {{ theme.customCss || null }}
      </component>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'UserProfileView',

  props: {
    profileHandle: {
      type: String,
    },
    authenticated: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      profile: {
        customHtml: null,
        customCss: null,
        imageUrl: null,
        headline: null,
        subtitle: null,
      },
      user: {
        name: null,
        emailHash: null,
        avatarUrl: null
      },
      theme: null,
      links: null,
    };
  },

  async mounted() {
    await this.refresh();

    this.$root.$on('refreshUserProfileView', () => {
      this.refresh();
    });
  },

  methods: {
    async refresh() {
      if (this.authenticated) {
        await this.getAuthenticatedProfile();
      } else {
        await this.getProfile();
      }
    },

    async getProfile() {
      try {
        const response = await this.$axios.$post(`/profile/${this.profileHandle}`, {
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

    async getAuthenticatedProfile() {
      try {
        const response: any = await this.$axios.$post('/profile/preview', {
          token: this.$store.getters['auth/getToken']
        });

        this.profile = response.profile;
        this.links = response.links?.sort(function (a: Link, b: Link) {
          return a.sortOrder - b.sortOrder;
        });
        this.user = response.user;
        this.theme = response.theme || null;
      } catch (err) {
        console.log('Error getting profile');
        console.log(err);
      }
    }
  }
});
</script>
