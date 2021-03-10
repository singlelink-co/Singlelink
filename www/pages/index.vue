<template>
  <div>
    <section class="mb-20 text-center interface">
      <!--<img src="/hero-image.png"/>-->
      <!---->
      <div class="flex flex-row items-center justify-center lg:space-x-10 relative">
        <img data-aos="fade-in"  data-aos-easing="ease" data-aos-duration="1000" data-aos-delay="500" style="width:180px;height:auto;position:absolute;z-index:11;left:102px;top:178px;" src="/Pink-arrow.svg"/>
        <img data-aos="fade-in"  data-aos-easing="ease" data-aos-duration="1000" data-aos-delay="500" style="width:120px;height:auto;position:absolute;z-index:11;right:190px;top:130px;" src="/Purple-arrow.svg"/>
        <div class="phone-container opacity-0 md:opacity-100">
          <div class="mini phone-display relative">
              <div class="w-full h-full" style="background-image:url('/Instagram-Screen.svg');background-position:top left;background-size: 100% auto;"></div>
          </div>
        </div>
        <div class="phone-container">
          <div data-aos="fade-up"  data-aos-easing="ease" data-aos-duration="1000" style="transform: scale(1.1);top:145px;" class="bg-white z-10 absolute w-full flex flex-row items-center justify-center rounded-lg tracking-tighter shadow px-8 py-4 font-extrabold">Buy on Amazon!</div>
          <div class="mini phone-display relative">
              <iframe style="border-radius: 50px;" class="w-full" id="preview-frame" src="https://singlel.ink/u/influencer" scrolling="no"/>
          </div>
        </div>
        <div class="phone-container opacity-0 md:opacity-100">
          <div class="mini phone-display relative">
              <div class="w-full h-full" style="background-image:url('/Amazon-Screen.svg');background-position:top left;background-size: 100% auto;"></div>
          </div>
        </div>
      </div>
      <!---->
      <div class="w-full flex flex-col items-center"  data-aos="fade-up"  data-aos-easing="ease" data-aos-duration="1000" data-aos-delay="1000">
        <h1 style="margin-top: -115px; margin-bottom: 12px;max-width: ">The open-source micro-site platform,<a href="/gallery" style="text-shadow: 0 0 15px rgba(83,83,238,.5);" class="text-indigo-600 ml-4">Singlelink.</a></h1>
        <p class="mb-6 text-2xl max-w-2xl mx-auto">
          The powerful, easy-to-use, and customizable micro-site that gets your content to your consumers in fewer clicks.
        </p>
        <a class="text-center w-full shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
        <a href="https://github.com/Neutron-Creative/Singlelink" class="text-gray-600 hover:underline text-lg mt-6"/>100% free & open-source, no credit card required</a>
      </div>
    </section>

    <section class="interface wide row mx-none">
      <div class="flex flex-col relative justify-start">
        <div class="phone-display relative" style="right:50px; height:550px;">
            <iframe style="border-radius: 50px;" class="w-full" id="preview-frame" src="https://singlel.ink/u/umberto" scrolling="no"/>
        </div>
        <testimonial  data-aos="fade-up"  data-aos-easing="ease" data-aos-duration="1000" :at="false" style="top:300px;" class="shadow absolute right-0" date="Dec 18, 2020" avatar="/adrenaline-hunter.png" platform="discord" name="Umberto Gnocchi" handle="CGI & Motion Design Artist" content="Thank you! What I like is that in 5 minutes I’ve configured everything."/>
      </div>
      <div class="flex flex-col lg:ml-12 flex-grow justify-start">
        <h3 class="neg-top">Getting online has never been easier</h3>
        <p class="text-xl mb-8">Building your Singlelink takes just minutes, and publishing to your link or custom domain is instant. There’s no code needed, and we have hundreds of available themes for you to choose from.</p>
        <a style="width:fit-content;" class="text-center shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
      </div>
    </section>

    <section class="interface wide row mx-none">
      <div class="flex flex-col lg:mr-12 flex-grow justify-start">
        <h3>Take control with or without code</h3>
        <p class="text-xl mb-8">Building & customizing your Singlelink from top-to-bottom is easy with our optimized no-code builder. You can control every detail without code from your phone or desktop, and go further with available custom HTML & CSS if you choose.</p>
        <a style="width:fit-content;" class="text-center shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
      </div>
      <div class="order-first lg:order-2 flex flex-col relative justify-start">
        <div class="phone-display relative" style="left:50px;">
            <iframe style="border-radius: 50px;" class="w-full" id="preview-frame" src="https://singlel.ink/u/Vibez" scrolling="no"/>
        </div>
        <testimonial  data-aos="fade-up"  data-aos-easing="ease" data-aos-duration="1000" :at="false" style="top:300px;" class="shadow absolute left-0" date="Jan 22, 2021" avatar="/vibez.png" platform="ph" name="VibeszCS" handle="Twitch Streamer" content="TL:DR: Doesn't get much better than this... Beginners can easily add links and colors & have a working landing page in less then five minutes.... Neutron Creative sure knows how to make a good program!"/>
      </div>
    </section>

    <section class="interface wide row mx-none">
      <div class="flex flex-col relative justify-start">
        <div class="phone-display relative" style="right:50px;">
            <iframe style="border-radius: 50px;" class="w-full" id="preview-frame" src="https://singlel.ink/u/remi" scrolling="no"/>
        </div>
        <testimonial  data-aos="fade-up"  data-aos-easing="ease" data-aos-duration="1000" :at="false" style="top:300px;" class="shadow absolute right-0" date="Feb 23, 2021" avatar="https://pbs.twimg.com/profile_images/1361677841654497281/Mys20SoV_400x400.jpg" platform="twitter" name="Rémi Carreiro" handle="Architectural Photographer" content="If you’re looking to set up a little landing page for yourself, check out @SingleLink. I stumbled across it while looking for alternatives to Linktree and couldn’t be happier with it."/>
      </div>
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
import Testimonial from '../components/testimonial.vue';
import wallOfLove from '../components/wall-of-love.vue';
  export default {
  components: { wallOfLove, Testimonial },
    head: {
      title: 'Singlelink - The open-source micro-site platform',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Singlelink - The open-source micro-site platform'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Singlelink is your beautiful, easy-to-use, and powerful micro-site that focuses on the content your consumers care about most, and nothing else. Sign up free in seconds, no credit card required!'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Singlelink - The open-source micro-site platform'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Singlelink is your beautiful, easy-to-use, and powerful micro-site that focuses on the content your consumers care about most, and nothing else. Sign up free in seconds, no credit card required!'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Singlelink is your beautiful, easy-to-use, and powerful micro-site that focuses on the content your consumers care about most, and nothing else. Sign up free in seconds, no credit card required!'
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

  .phone-container {
    position: relative;
    width: 
  }

  .phone-display {
    display: flex;
    margin: 0 auto 0 0;
    border-radius: 65px;
    overflow: hidden;
    background: linear-gradient(to bottom, #FFF, #EEE);
    padding: 14px;
    width: 375px;
    /*height: 812px;*/
    height: 600px;
    transform: scale(.8);
    box-shadow: inset 0 0 5px rgba(0,0,0,.25);
    -webkit-mask-image: linear-gradient(to bottom, black 35%, transparent 75%);
}

.phone-display.mini {
  transform: scale(.58);
  position: absolute;
  top:-126px;
  left: -80px;
  -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%) imp !important;
  mask-image: linear-gradient(to bottom, black 90%, transparent 100%) imp !important;
}

.phone-container {
  width: 218px;
  height: 350px;
  position: relative;
}

.phone-display > iframe {
  border: none;
  width: 348px;
  height: 784px;
  border-radius: 50px;
}

.phone-display > div {
  border-radius: 50px;
}

.interface.wide.row.mx-none {
  transform:translateX(0px)
}
</style>