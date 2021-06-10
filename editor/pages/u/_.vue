<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <section
      v-if="profile.visibility==='published-18+' && ageVerificationRequired"
      class="fixed top-0 left-0 right-0 z-10 flex flex-col items-center justify-center w-screen h-screen"
      style="box-shadow: rgba(0, 0, 0, .65) 0  0 10px 5px inset;"
    >
      <div
        class="flex flex-col w-full h-full text-center items-center justify-center p-8"
        style="background:rgba(0,0,0,.8);backdrop-filter:saturate(180%) blur(10px)"
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

    <UserProfileView
      :profile-handle="profileHandle"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Context} from "@nuxt/types";
import UserProfileView from "~/components/profile/UserProfileView.vue";

export default Vue.extend({
  name: 'UShowProfile',

  components: {
    UserProfileView
  },

  async asyncData(ctx: Context) {
    try {
      const url = '/profile/' + ctx.route.path.replace('/u/', '');

      const response = await ctx.$axios.$post(url, {
        token: ctx.store.getters['auth/getToken']
      });

      const profile = response.profile;

      await ctx.$axios.$get('/analytics/profile/record/' + profile.id);

      return {
        profileHandle: ctx.route.path.replace('/u/', ''),
        profile
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
      hostname: process.env.HOSTNAME,
      profileHandle: this.$route.path.replace('/u/', ''),
      profile: {
        themeId: '',
        customHtml: '',
        customCss: '',
        imageUrl: '',
        headline: '',
        subtitle: '',
        visibility: "unpublished",
        showWatermark: true,
        handle: ''
      } as EditorProfile,
      ageVerificationRequired: true
    };
  },

  head() {
    const profile: EditorProfile = this.profile;

    return {
      title: profile.headline + ' - ' + process.env.APP_NAME ?? '',

      meta: [
        {
          hid: 'title',
          name: 'title',
          content: profile.headline + ' - ' + process.env.APP_NAME ?? ''
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: profile.headline + ' - ' + process.env.APP_NAME ?? ''
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: profile.headline + ' - ' + process.env.APP_NAME ?? ''
        },
        {
          hid: 'description',
          name: 'description',
          content: profile.subtitle ?? ''
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: profile.subtitle ?? ''
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: profile.subtitle ?? ''
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: process.env.API_URL + '/profile/thumbnail/' + this.$route.path.replace('/u/', '')
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: process.env.API_URL + '/profile/thumbnail/' + this.$route.path.replace('/u/', '')
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: 'https://' + process.env.HOSTNAME + '/u/' + this.$route.path.replace('/u/', '')
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
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
        window.location.href = "https://" + process.env.HOSTNAME;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
body {
  overflow-x: hidden;
}

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
