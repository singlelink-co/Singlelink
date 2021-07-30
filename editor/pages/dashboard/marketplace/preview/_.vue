<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <UserProfileView
      v-if="addon.resource"
      :preview="true"
      :profile-data="addon.resource"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UserProfileView from "~/components/profile/UserProfileView.vue";

export default Vue.extend({
  components: {
    UserProfileView
  },

  middleware: 'authenticated',

  data() {
    return {
      id: null,
      addon: {
        resource: null
      }
    };
  },

  head() {
    return {
      title: 'Marketplace theme preview - Singlelink',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex'
        }
      ]
    };
  },
  async mounted() {
    this.id = this.$route.path.replace('/dashboard/marketplace/preview/', '');
    this.addon = await this.$axios.$post('/marketplace/addon/' + this.id, {
      token: this.$store.getters['auth/getToken'],
      detailed: true
    });
  },
  methods: {}
});
</script>
