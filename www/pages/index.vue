<template>
  <div>
    <section class="mb-32">
      <h1>You don't need a website.<br>You need a <a href="/gallery" class="text-indigo-600 hover:text-indigo-500 underline">Singlelink.</a></h1>
      <p class="mb-8">
        Singlelink is your beautiful, easy-to-use, and powerful online profile that focuses on the content your consumers care about most, and nothing else. Stop wasting time on a website that doesn't work for you, and create your Singlelink for free, no credit card required, in just 30 seconds.
      </p>
      <div class="flex flex-col w-full lg:w-auto lg:flex-row items-center justify-start space-y-4 lg:space-y-0 lg:space-x-4">
        <a class="text-center w-full lg:w-auto text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg bg-indigo-600 hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Claim your free Singlelink</a>
        <a class="text-center w-full lg:w-auto text-sm font-medium text-gray-700 px-6 py-6 lg:py-5 rounded-lg bg-gray-300 hover:bg-gray-200" href="/gallery">View community examples</a>
      </div>
    </section>
    <section class="interface mb-24 space-y-16">
      <div class="flex flex-col lg:flex-row items-start justify-between space-y-8 lg:space-y-0 lg:space-x-8">
        <div class="flex flex-col justify-center items-start lg:w-1/2">
          <h3>Easy to use</h3>
          <p class="text-sm">Singlelink is the easiest way to build your profile online. Simply add your content, publish, and share - no code required. Focus on your content and enjoy white-glove managed SEO, SSL, servers, backups, analytics, and more.</p>
        </div>
        <div class="flex flex-col justify-center items-start lg:w-1/2">
          <h3>Customize without limits</h3>
          <p class="text-sm">Go further with our community marketplace full of themes & plugins, and rest assured that custom HTML/CSS is there if you need it. Need help? Don't sweat it - we have a team of designers ready to bring your Singlelink to life.</p>
        </div>
      </div>
      <div class="flex flex-col lg:flex-row items-start justify-between space-y-8 lg:space-y-0 lg:space-x-8">
        <div class="flex flex-col justify-center items-start lg:w-1/2">
          <h3>Own your content</h3>
          <p class="text-sm">Leave vendor lock from platforms like Shopify, Linktree, and Beacons in the past - Singlelink is open-source, so you own the rights to your content, your audience, and your data. Because when your income is your community, you shouldn’t rent the platform you reach them with.</p>
        </div>
        <div class="flex flex-col justify-center items-start lg:w-1/2">
          <h3>100% free & open-source</h3>
          <p class="text-sm">At Singlelink, we believe in accessibility for all - which is why we offer a managed free tier we think you'll love, alongside our self-hosted Singlelink core available on <a href="https://github.com/Neutron-Creative/Singlelink" class="text-indigo-600 hover:underline">Github</a>. There's no catch - no name, email address, or credit card required. Singlelink is and will be free forever.</p>
        </div>
      </div>
    </section>
    <!--<section class="interface mb-24 text-center">
      <h2>Stop worrying, start publishing.</h2>
      <p class="mb-8">Never worry about your website again and watch engagements sour through the roof.<br class="hidden lg:block">
      We do the hosting, security, maintainence, and scaling - you bring the content.</p>
      <div class="flex flex-col items-center justify-center relative rounded shadow-lg mb-8 overflow-hidden w-full video" style="height: 344px;background-image: url('/application-screenshot.png');background-repeat:no-repeat;background-position:center;background-size:cover;">
        <div class="rounded-full w-12 h-12 flex items-center justify-center" style="background:rgba(0,0,0,.5);">
          <img src="play.svg" class="w-4 h-auto"/>
        </div>
      </div>
    </section>-->
    <section class="interface mb-24 text-left">
      <h2>Singlelink is trusted by {{ users.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} creators.</h2>
      <p class="mb-8">Singlelink is trusted by creators of all sizes, from micro-macro. Hear from our users to learn why they love Singlelink, and why you will too.</p>
      <wall-of-love/>
    </section>
    <section class="flex flex-col rounded-lg bg-indigo-600 p-10 flex flex-col items-center justify-start mb-24 w-full">
      <h3 class="text-white mb-2">Join us on Discord!</h3>
      <p class="text-gray-300 mb-4">We're active on Discord, and love to meet new people. Join us!</p>
      <a href="https://discord.gg/3pBM4Px" class="bg-indigo-500 text-white hover:bg-indigo-400 px-6 py-4 text-center text-sm font-medium rounded-lg mr-auto">Join our Discord community</a>
    </section>
    <section class="interface mb-24 text-left">
      <h2>Frequently asked questions</h2>
      <p class="mb-8">Have a question? Give our FAQ a read, and if you can't find your question listed don't hesitate to reach out to us on Discord using the chat icon at the bottom-right corner!</p>
      <!-- -->
      <h3>How much does Singlelink cost?</h3>
      <p class="mb-6 text-sm leading-loose">Singlelink is 100% free and open-source - seriously! Singlelink Cloud is free, no credit card required, and if you choose to do so you can upgrade to our Whale ($6/Month) or Enterprise ($35/Month) tiers for additional features. If you'd like to self-host Singlelink, you can find our fully-featured Core available for free on <a href="https://github.com/Neutron-Creative/Singlelink" class="text-indigo-600 hover:underline">Github</a> with detailed instructions.</p>
      <!-- -->
      <h3>Can I create multiple profiles with my Singlelink account?</h3>
      <p class="mb-6 text-sm leading-loose">Yes! Our free tier can create up to 3 profiles per user, our whale tier ($6/Month) can create up to 10 profiles per user, and our enterprise tier ($35/Month) can create unlimited profiles.</p>
      <!-- -->
      <h3>How can I customize my profile?</h3>
      <p class="mb-6 text-sm leading-loose">Customizing your profile is effortless with Singlelink - we have a community marketplace full of beautiful themes & plugins (coming soon) from the community for you to use, alongside dozens of free themes made by our team. PS: if you need help customizing your profile, don't hesitate to reach out on Discord!</p>
      <!-- -->
      <h3>How much traffic can my Singlelink take?</h3>
      <p class="mb-6 text-sm leading-loose">Your Singlelink is equipped to handle as much traffic as you need! We have 24/7 multi-point uptime monitoring available at <a href="https://status.singlelink.co" class="text-indigo-600 hover:underline">status.singlelink.co</a>, so rest assured your Singlelink can go as far as you take it.</p>
      <!-- -->
      <h3>Do I need to know how to code?</h3>
      <p class="text-sm leading-loose">Absolutely not! Singlelink Cloud is easy to use from any device and takes less than 30 seconds to set up your first profile. Try it out, it's 100% free! leading-loose</p>
      <!-- -->
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
                // Norsegoods, using manual update because lacking https
                url: false,
                users: 8,
                profiles: 10,
                profiles_published: 3,
                links: 4,
                themes: 3
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