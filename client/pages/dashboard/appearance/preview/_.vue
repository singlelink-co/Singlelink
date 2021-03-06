<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <UserProfileView
        v-if="theme"
        :preview="true"
        :profileData="theme"
    />
  </div>
</template>
<script>
export default {
    middleware: 'authenticated',
    head () {
        return {
        title: 'Theme preview - ' + process.env.APP_NAME,
        meta: [
            { hid: 'robots', name: 'robots', content: 'noindex' }
        ]
        }
    },
    data() {
        return {
            id: null,
            theme: null,
            themes: []
        }
    },
    async mounted() {
        this.id = this.$route.path.replace('/dashboard/appearance/preview/', '');
        this.loadThemes();
    },
    methods: {
        async loadThemes() {
            try {
                // Grab themes from response
                this.themes = await this.$axios.$post('/themes', {
                    token: this.$store.getters['auth/getToken'],
                    includeGlobal: false
                });
                
                for(let i=0;i<this.themes.length;i++) {
                    if(this.themes[i].id == this.id) {
                        this.theme = this.themes[i];
                    }
                }
                console.log(this.themes);

            } catch (error) {
                console.log('Failed to get themes');
                console.log(error);
            }
        },
    }
}
</script>