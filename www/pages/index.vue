<template>
  <div>
    <section class="mb-20 text-center interface">
      <img src="/hero-image.png"/>
      <h1 style="margin-top: -115px; margin-bottom: 12px;">Increase engagement by 50% or more with<a href="/gallery" style="text-shadow: 0 0 15px rgba(83,83,238,.5);" class="text-indigo-600 ml-4">Singlelink.</a></h1>
      <p class="mb-6 text-2xl max-w-2xl mx-auto">
        The powerful, easy-to-use, and customizable micro-site that gets your content to your consumers in fewer clicks.
      </p>
      <a class="text-center w-full shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
      <a href="https://github.com/Neutron-Creative/Singlelink" class="text-gray-600 hover:underline text-lg mt-6"/>100% free & open-source, no credit card required</a>
    </section>

    <section class="interface wide row mx-none">
      <img style="max-width:468px;" class="w-full" src="/umberto-screenshot.png"/>
      <div class="flex flex-col lg:ml-12 flex-grow justify-start">
        <h3>Getting online has never been easier</h3>
        <p class="text-xl mb-8">Building your Singlelink takes just minutes, and publishing to your link or custom domain is instant. There’s no-code needed, and we have hundreds of available themes for you to choose from.</p>
        <a style="width:fit-content;" class="text-center shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
      </div>
    </section>

    <section class="interface wide row mx-none">
      <div class="flex flex-col lg:mr-12 flex-grow justify-start">
        <h3>Take control with or without code</h3>
        <p class="text-xl mb-8">Building & customizing your Singlelink from top-to-bottom is easy with our optimized no-code builder. You can control every detail without code from your phone or desktop, and go further with available custom HTML & CSS if you choose.</p>
        <a style="width:fit-content;" class="text-center shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
      </div>
      <img style="max-width:468px;" class="w-full" src="/vibez-screenshot.png"/>
    </section>

    <section class="interface wide row mx-none">
      <img style="max-width:468px;" class="w-full" src="/remi-screenshot.png"/>
      <div class="flex flex-col lg:ml-12 flex-grow justify-start">
        <h3>Scale to infinite heights instantly</h3>
        <p class="text-xl mb-8">Never worry about downtime again. Singlelink is built-to-scale and has no traffic caps so you can go from zero to zeroes in minutes without outages, slowing, or an unexpected bill.</p>
        <a style="width:fit-content;" class="text-center shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
      </div>
    </section>

    <section class="interface my-24 text-left">
      <h3>Singlelink is trusted by {{ users.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} creators.</h3>
      <p class="mb-8 text-lg lg:text-2xl">Singlelink is trusted by creators of all sizes, from micro-macro. Hear from our users to learn why they love Singlelink, and why you will too.</p>
      <wall-of-love/>
    </section>
    <section style="background:#5353EC;" class="flex flex-col rounded-lg p-10 flex flex-col items-center justify-start mb-24 w-full">
      <h3 class="text-white mb-2">Join us on Discord!</h3>
      <p class="text-gray-300 mb-4">We're active on Discord, and love to meet new people. Join us!</p>
      <a href="https://discord.gg/3pBM4Px" class="bg-indigo-500 text-white hover:bg-indigo-400 px-6 py-4 text-center text-sm font-medium rounded-lg mr-auto">Join our Discord community</a>
    </section>
  </div>
</template>

<script>
import wallOfLove from '../components/wall-of-love.vue';
  export default {
  components: { wallOfLove },
    head: {
      title: 'Singlelink - You don\'t need a website, you need a Singlelink 🔗🔥',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Singlelink - You don\'t need a website, you need a Singlelink 🔗🔥'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Singlelink is your beautiful, easy-to-use, and powerful online profile that focuses on the content your consumers care about most, and nothing else. Sign up free in seconds, no credit card required!'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Singlelink - You don\'t need a website, you need a Singlelink 🔗🔥'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Singlelink is your beautiful, easy-to-use, and powerful online profile that focuses on the content your consumers care about most, and nothing else. Sign up free in seconds, no credit card required!'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Singlelink is your beautiful, easy-to-use, and powerful online profile that focuses on the content your consumers care about most, and nothing else. Sign up free in seconds, no credit card required!'
        },
      ],
    },
    data: function() {
      return {
        profile: [
          'https://singlel.ink/u/alex',
          'https://singlel.ink/u/bwhihub',
          'https://singlel.ink/u/nintendorable',
          'https://singlel.ink/u/neutron',
          'https://app.singlelink.co/u/daje',
          'https://app.singlelink.co/u/sarahrubia',
          'https://app.singlelink.co/u/gloomytoons',
          'https://app.singlelink.co/u/torres_asdf',
          'https://app.singlelink.co/u/SDCD',
          'https://app.singlelink.co/u/blackrose'
        ],
        active_profile: null,
        i: 0,
        total_run: 0,
        users: 0,
        handle_query: null,
        users: '...',
        links: '...',
        profiles: '...',
        profilesPublished: '...',
        percentPublished: '...',
        themes: '...',
        enterprise_users: [
            {
                url: 'https://api.norseapps.com/analytics'
            },
            {
                url: 'https://api.tinypage.app/analytics'
            }
        ]
      };
    },
    mounted: function() {
      this.fetch_analytics();
      let interval = 4500;
      setTimeout(function() {
        // wait
      }, interval);
      setInterval(function() {
        // Turn on or off
        let active = true;

        console.log(this.active_profile);
        if(active) this.active_profile = this.profile[this.i];
        this.total_run++;
        if(this.total_run >= 5) return clearInterval();
        if(this.i >= (this.profile.length - 1)) {
          this.i=0;
        } else {
          this.i++;
        }
      }.bind(this), interval);
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
                      if(this.enterprise_users[i].url) {
                          analytics = await this.$axios.get(this.enterprise_users[i].url);
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
                      } else {
                          users += parseFloat(this.enterprise_users[i].users);
                          links += parseFloat(this.enterprise_users[i].links);
                          profiles += parseFloat(this.enterprise_users[i].profiles);
                          if(this.enterprise_users[i].profiles_published) {
                              profilesPublished += parseFloat(this.enterprise_users[i].profiles_published);
                          } else {
                              profilesPublished += parseFloat(this.enterprise_users[i].profilesPublished);
                          }
                          themes += parseFloat(this.enterprise_users[i].themes);
                      }
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

<style scoped>
  .video {
    box-shadow: none;
    transition: .2s ease-in-out;
    cursor: pointer;
  }
  .video:hover {
    box-shadow: inset 0 -1000px 0 0 rgba(0,0,0,.3);
  }
</style>