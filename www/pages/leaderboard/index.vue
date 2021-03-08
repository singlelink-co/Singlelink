<template>
    <div>
        <section class="mb-16 w-full text-center flex flex-col items-center">
            <h1 class="mb-4">Singlelink leaderboard</h1>
            <p class="mb-6">
                See who the top creators on Singlelink are at all times.
            </p>
            <a href="https://app.singlelink.co" class="flex flex-row items-center justify-center purple-btn px-8 mb-8 py-4 text-white font-semibold rounded-lg shadow mb-8">Get started for free</a>
            <div v-if="!sites || sites.length <= 0" class="p-2 text-lg text-gray-600">
                Loading...
            </div>
            <div class="flex items-center justify-end w-full flex-row mb-6">
                <span class="text-gray-700 font-semibold mr-4 text-sm">Sorting leaderboard by</span>
                <select class="toggle">
                    <option value="views">Views</option>
                    <!--<option value="clicks">Clicks</option>-->
                    <!--<option value="ctr">Click through rate</option>-->
                </select>
            </div>
            <div v-if="sites && sites.length > 0"  class="w-full flex flex-row flex-wrap rounded-lg overflow-hidden shadow bg-white p-6">
                <a class="flex items-center justify-start flex-col p-4 rounded-lg hover:bg-gray-100 overflow-hidden" style="max-width:33%;" v-for="(site, index) in sites" :key="index" v-if="site.headline && site.headline.length > 1" :href="'https://singlel.ink/u/' + site.handle" target="_blank">
                    <div class="flex flex-col relative rounded-lg overflow-hidden mb-4" style="padding-bottom:52.5%;height:0;width:100%;">
                        <!--<iframe :src="'https://beta-app.singlelink.co/u/' + site.handle" scrolling="no" style="pointer-events: none;"/>-->
                        <!--<img :src="'https://api.singlelink.co/profile/thumbnail/' + site.handle" class="rounded"/>-->
                        <div v-if="site.visibility=='published-18+'" class="z-10 absolute top-0 left-0 right-0 bottom-0 width-full h-full flex items-center justify-center p-4" style="background: rgba(0,0,0,.45);backdrop-filter:blur(5px);">
                            <span class="text-sm text-white">18+ only, click to view more</span>
                        </div>
                    </div>
                    <div class="flex flex-row items-center justify-start w-full">
                        <div style="min-width:1.5rem;max-width:1.5rem;" class="w-6 h-6 flex items-center justify-center bg-indigo-200 border border-indigo-500 text-indigo-600 font-medium text-xs rounded-full mr-4">{{ index + 1 }}</div>
                        <div class="flex flex-col space-y-1 flex items-start justify-center text-left">
                            {{ site.headline }}
                            <span class="text-gray-500 text-xs">https://singlel.ink/u/{{site.handle}}</span>
                            <div class="flex flex-row items-center justify-start text-xs">
                                <div class="flex flex-row items-center justify-center mr-1">
                                    <img src="/eye.svg" class="opacity-50 w-4 h-auto mr-1"/>
                                    {{ site.totalViews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </div>
                                <div class="flex flex-row items-center justify-center mr-2">
                                    <img src="/mouse.svg" class="opacity-50 w-4 h-auto mr-1"/>
                                    {{ site.totalClicks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </div>
                                <div class="flex flex-row items-center justify-center">
                                    <img src="/flag.svg" class="opacity-50 w-3 h-auto mr-1"/>
                                    {{ ((site.totalClicks/site.totalViews)*100).toFixed(0) }}%
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        head: {
      title: 'Leaderboard - Singlelink',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Leaderboard - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'See who the top creators on Singlelink are at all times.'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Leaderboard - Singlelink'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'See who the top creators on Singlelink are at all times.'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'See who the top creators on Singlelink are at all times.'
        },

      ],
    },
        data() {
            return {
                sites: [],
                max_length: 50,
                max_loaded: 100,
            };
        },
        async mounted() {
            // Fetch sites from leaderboard API
            let site_request = await this.$axios.get('https://api.singlelink.co/profile/leaderboards/top/' + this.max_loaded);
            // If results, filter them
            if(site_request && site_request.data.length > 1) {
                // Set item to data
                site_request = site_request.data;
                // Define iterator & begin filtering results
                for(let i=0;i<site_request.length;i++) {
                    // If site meets filter criteria (isn't spam)
                    if(site_request[i].headline && site_request[i].headline.length>1) {
                        this.sites.push(site_request[i]);
                        if(this.sites.length >= this.max_length) break;
                    } else {
                        // Report spam?
                    }
                }
            }
            
            // Push results to website display
            site_request.data;

            console.log('sites');
            console.log(this.sites);
        }
    };
</script>  

<style>
  .toggle {
    @apply .px-6 .py-3 .text-sm .rounded-lg .text-gray-700 .font-medium .shadow; 
    transition: .2s ease-in;
  }

  .toggle:hover {
    box-shadow: 0 0 0 1px rgba(83,83,237,.25), 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  .toggle:focus {
    box-shadow: 0 0 0 4px rgba(83,83,237,.4), 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }
</style>