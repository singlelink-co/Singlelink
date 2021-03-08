<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <UserProfileView
        v-if="addon.resource"
        :preview="true"
        :profileData="addon.resource"
    />
  </div>
</template>
<script>
export default {
    middleware: 'authenticated',
    head () {
        return {
        title: 'Marketplace theme preview - ' + process.env.APP_NAME,
        meta: [
            { hid: 'robots', name: 'robots', content: 'noindex' }
        ]
        }
    },
    data() {
        return {
            id: null,
            addon: {
                resource: null
            }
        }
    },
    async mounted() {
        this.id = this.$route.path.replace('/dashboard/marketplace/preview/', '');
        this.addon = await this.$axios.$post('/marketplace/addon/' + this.id, {
            token: this.$store.getters['auth/getToken'],
            detailed: true
        });
    },
    methods: {

    }
}
</script>