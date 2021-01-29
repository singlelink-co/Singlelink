<template>
    <div>
        <section class="mb-16 w-full">
            <h1>Singlelink Analytics</h1>
            <p class="mb-8">
                Learn more about Singlelink's current traction, and our future growth projections.
            </p>
            <div class="flex flex-col w-full lg:w-auto lg:flex-row items-center justify-start space-y-4 lg:space-y-0 lg:space-x-4">
                <a class="text-center w-full lg:w-auto text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg bg-indigo-600 hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Claim your free Singlelink</a>
                <a class="text-center w-full lg:w-auto text-sm font-medium text-gray-700 px-6 py-6 lg:py-5 rounded-lg bg-gray-300 hover:bg-gray-200" href="/gallery">View community examples</a>
            </div>
        </section>
        <section class="mb-24 w-full">
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white mb-12">
                <h3 class="mb-0">Total users</h3>
                <span class="text-indigo-600 font-semibold text-2xl">{{ users }}</span>
            </div>
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white mb-12">
                <h3 class="mb-0">Enterprise accounts</h3>
                <span class="text-indigo-600 font-semibold text-2xl" v-if="parseInt(this.users)">{{ enterprise_users.length }}</span>
                <span class="text-indigo-600 font-semibold text-2xl" v-if="!parseInt(this.users)">...</span>
            </div>
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white mb-12">
                <h3 class="mb-0">Total links</h3>
                <span class="text-indigo-600 font-semibold text-2xl">{{ links }}</span>
            </div>
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white mb-12">
                <h3 class="mb-0">Total profiles</h3>
                <span class="text-indigo-600 font-semibold text-2xl">{{ profiles }}</span>
            </div>
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white mb-12">
                <h3 class="mb-0">Profiles published (sum)</h3>
                <span class="text-indigo-600 font-semibold text-2xl">{{ profilesPublished }}</span>
            </div>
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white mb-12">
                <h3 class="mb-0">Profiles published (%)</h3>
                <span class="text-indigo-600 font-semibold text-2xl">{{ percentPublished }}</span>
            </div>
            <div class="p-8 rounded-lg shadow flex flex-row justify-between items-center bg-white">
                <h3 class="mb-0">Total themes</h3>
                <span class="text-indigo-600 font-semibold text-2xl">{{ themes }}</span>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    head: {
      title: 'Analytics - Singlelink',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Analytics - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Learn more about Singlelink\'s current traction, and our future growth projections.'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Analytics - Singlelink'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Learn more about Singlelink\'s current traction, and our future growth projections.'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Learn more about Singlelink\'s current traction, and our future growth projections.'
        },

      ],
    },
    data: () => {
        return {
            users: '...',
            links: '...',
            profiles: '...',
            profilesPublished: '...',
            percentPublished: '...',
            themes: '...',
            enterprise_users: [
                'http://api.norseapps.com/analytics/fetch',
                'https://api.tinypage.app/analytics'
            ]
        };
    },  
    mounted() {
        this.fetch_analytics();
    },
    methods: {
        fetch_analytics: async function() {
            try {
                let analytics = await this.$axios.get('https://api.singlelink.co/analytics/');
                console.log(analytics);
                let users = parseFloat(analytics.data.users);
                let links = parseFloat(analytics.data.links);
                let profiles = parseFloat(analytics.data.profiles);
                let profilesPublished = parseFloat(analytics.data.profilesPublished);
                let themes = parseFloat(analytics.data.themes);

                for(let i=0;i<this.enterprise_users.length;i++) {
                    analytics = await this.$axios.get(this.enterprise_users[i]);
                    console.log(analytics);
                    users += parseFloat(analytics.data.users);
                    links += parseFloat(analytics.data.links);
                    profiles += parseFloat(analytics.data.profiles);
                    if(analytics.data.profiles_published) {
                        profilesPublished += parseFloat(analytics.data.profiles_published);
                    } else {
                        profilesPublished += parseFloat(analytics.data.profilesPublished);
                    }
                    themes += parseFloat(analytics.data.themes);
                }
                this.users = users;
                this.links = links;
                this.profiles = profiles;
                this.profilesPublished = profilesPublished;
                this.themes = themes;
                this.percentPublished = ((this.profilesPublished / this.profiles) * 100).toFixed(2) + '%';
            } catch(err) {
                console.log(err);
            }
      }
    }
};
</script>