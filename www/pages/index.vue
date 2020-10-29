<template>
  <div class="bg-gray-100">
    <section class="w-full flex items-center bg-gray-100">
      <div class="w-11/12 mx-auto max-w-6xl text-left p-4 py-8 md:p-20  flex flex-col md:flex-col">
        <section class="w-full flex items-center bg-gray-100">
          <div data-aos="fade-up" data-aos-duration="1000" class="w-full mx-auto max-w-6xl text-center p-0 md:p-0 items-center flex flex-col md:flex-col">
            <a href="https://beta-app.singlelink.co">
              <h3 class="md:text-lg text-indigo-600 font-medium uppercase tracking-wider">🎉 Version 2 public beta out now! 🎉</h3>
            </a>
            <h1 class="text-4xl md:text-6xl font-bold leading-tight my-4">A single link for everything</h1>
            <p class="leading-relaxed text-gray-600 text-2xl mb-8">Singlelink is the free & improved link builder for social media built for the community, by the community. Build your profile in seconds and get online today!</p>
          </div>
        </section>
        <section data-aos="fade-up" data-aos-duration="1000" class="w-full flex flex-col items-center justify-center bg-gray-100">
          <a href="https://app.singlelink.co/create-account" class="flex items-center justify-center w-full mb-4">
            <button data-v-4b07093c="" class="bg-indigo-600 hover:bg-indigo-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content;">Create your free Singlelink profile in seconds<span class="ml-2">👉</span></button>
          </a>
          <a href="https://github.com/Neutron-Creative/Singlelink" class="text-gray-600 hover:underline hover:text-gray-700">Or, clone the repository</a>
        </section>
        <section class="mt-12 flex flex-col items-center justify-center">
          <div data-v-40f3ad8e="" class="phone-display w-full">
            <div class="iframe-container">
              <iframe v-if="active_profile" data-v-40f3ad8e="" id="preview-frame" :src="active_profile">
              </iframe>
            </div>
            <img class="hidden md:flex real-users" src="/real-users.svg"/>
          </div>
          <div data-aos="fade-up" data-aos-duration="1000" class="dashed-line"></div>
          <a v-if="active_profile" class="w-full flex flex-col justify-center items-center" :href="active_profile.replace('app.singlelink.co/', 'singlel.ink/')">
          <div data-aos="fade-up" data-aos-duration="1000" class="flex relative shadow-lg bg-white flex-row border-2 border-indigo-600 rounded-full px-8 py-4 mb-8 w-full max-w-xl flex justify-center items-center text-xl">
            <span class="mr-2">🔗</span>
            <span class="text-gray-700 font-medium">{{ active_profile.replace('https://', '').replace('http://', '').replace('app.singlelink.co/', 'singlel.ink/') }}</span>
            <img class="hidden md:flex custom-domain" src="/custom-domain.svg"/>
          </div>
          </a>
          <a data-aos="fade-up" data-aos-duration="1000" href="https://app.singlelink.co/create-account" class="flex items-center justify-center w-full mb-4">
            <button data-v-4b07093c="" class="bg-indigo-600 hover:bg-indigo-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content;">Create your free Singlelink profile in seconds<span class="ml-2">👉</span></button>
          </a>
        </section>
      </div>
    </section>
    <section data-aos="fade-up" data-aos-duration="1000" class="w-full flex items-center">
      <div class="w-11/12 mx-auto max-w-6xl text-left px-8 md:px-20 py-12 items-center justify-center text-center flex flex-col md:flex-col">
        <h2 class="text-5xl font-bold mb-2">Why Singlelink?</h2>
        <p class="text-2xl text-gray-600">Take a look at a few of the reasons why our community uses & loves Singlelink.</p>
      </div>
    </section>
    <section data-aos="fade-up" data-aos-duration="1000" class="w-full flex items-center">
      <div class=" w-11/12 mx-auto max-w-4xl text-left p-8 md:p-20 px-0 md:px-0 items-center justify-center flex flex-col md:flex-row">
        <div class="flex flex-col w-full md:w-2/3 justify-center md:mr-20 md:text-left text-center">
          <h2 class="text-4xl font-bold mb-2">Get started in seconds</h2>
          <p class="text-gray-600 text-2xl leading-relaxed mb-6">Singlelink has minimal onboarding, is easy to use, and quick to publish. Build your custom profile in seconds with one-click.</p>
          <a href="https://app.singlelink.co/create-account">
            <button class="mx-auto md:mx-0 bg-indigo-600 hover:bg-indigo-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content; width: fit-content;">Create your free profile<span class="ml-2">👉</span></button>
          </a>
        </div>
        <form data-aos="fade-up" data-aos-duration="1000" class="hidden md:flex shadow-lg relative w-full md:w-1/3 min-w-sm max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col aos-init" style="transform: perspective(1000px) rotate(0deg) rotateX(-2deg) rotateY(-12deg) scale(1.25);">
          <div class="flex flex-col mb-2"><label class="font-medium text-xs">Email Address</label>
            <input type="email" placeholder="e.g. jane@gmail.com" class="p-2 mt-1 text-xs border-solid border-gray-200 rounded-sm border">
          </div>
          <div class="flex flex-col mb-2"><label class="font-medium text-xs text-gray-800">Handle</label>
            <div class="flex flex-row p-2 pl-0 pt-0 pr-0 pb-0 mt-1 text-xs border-solid border-gray-200 rounded-sm border">
              <span class="flex p-2 bg-gray-100 border text-gray-700 border-solid border-gray-300 border-t-0 border-l-0 border-b-0 text-xs">app.singlelink.co/u/</span>
              <input type="text" placeholder="e.g. janedoe" class="p-2 flex-grow w-full text-xs"></div>
          </div>
          <div class="flex flex-col mb-2">
            <label class="font-medium text-xs">Password</label>
            <input type="password" placeholder="e.g. your password" class="p-2 mt-1 text-xs border-solid border-gray-200 rounded-sm border">
          </div>
          <button type="button" class="mt-1 w-full p-3 text-center text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">Sign up instantly</button>
        </form>
      </div>
    </section>
    <section data-aos="fade-up" data-aos-duration="1000" class="w-full flex items-center">
      <div class=" w-11/12 mx-auto max-w-4xl text-left p-8 md:p-20 px-0 md:px-0 items-center justify-center flex flex-col md:flex-row">
        <div class="w-full md:w-1/3 hidden md:flex" style="height: fit-content;">
          <div class="phone-display wider w-full" style="box-shadow:-10px 15px 30px rgba(0,0,0,.2);transform: perspective(1040px) rotate(0deg) rotateX(-2deg) rotateY(12deg) translateZ(10px)">
            <div class="iframe-container">
              <iframe v-if="active_profile" data-v-40f3ad8e="" id="preview-frame-2" :src="active_profile" >
              </iframe>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full justify-center md:ml-20 md:text-left text-center w-full md:w-2/3">
          <h2 class="text-4xl font-bold mb-2">Make it yours</h2>
          <p class="text-gray-600 text-2xl leading-relaxed mb-6">We don't cut stops out for our free version. With domain support, themes, and custom HTML/CSS, your possibilites are endless.</p>
          <a href="#preview-frame">
            <button class="mx-auto md:mx-0 bg-gray-600 hover:bg-gray-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content; width: fit-content;">View our community examples<span class="ml-2">👪</span></button>
          </a>
        </div>
      </div>
    </section>
    <section data-aos="fade-up" data-aos-duration="1000" class="w-full flex items-center">
      <div class=" w-11/12 mx-auto max-w-4xl text-left p-8 md:p-20 px-0 md:px-0  items-center justify-center flex flex-col md:flex-row">
        <div class="flex flex-col w-full justify-center md:mr-20 md:text-left text-center w-full md:w-2/3">
          <h2 class="text-4xl font-bold mb-2">Constantly improving</h2>
          <p class="text-gray-600 text-2xl leading-relaxed mb-6">Singlelink is an active open-source project, with new features added monthly.</p>
          <a href="https://github.com/Neutron-Creative/Singlelink/projects/1">
            <button class="mx-auto md:mx-0 flex flex-row items-center justify-center bg-gray-600 hover:bg-gray-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content; width: fit-content;">View our roadmap on Github<img src="/github-mark.svg" class="ml-2" style="filter:invert(1);width: 18px;"/></button>
          </a>
        </div>
       <div class="hidden md:flex flex-col bg-white rounded-lg px-6 py-4 w-full md:w-1/3 relative" style="transform: perspective(650px) rotate(0deg) rotateX(-2deg) rotateY(-12deg) scale(1.4) translateY(-20px);">
         <span class="text-black font-bold text-xs relative z-10">New update available!</span>
         <span class="text-gray-600 font-medium text-xs relative z-10">Singlelink version 2 is now available.</span>
         <div class="bg-white w-full h-full absolute top-0 left-0 right-0 bottom-0 rounded border border-gray-200 shadow"></div>
         <div class="bg-red-600 border border-red-700 rounded-full flex items-center justify-center shadow absolute text-white font-semibold" style="font-size:9px;width:18px;height:18px;right:-5px;top:-5px;line-height:1;">3</div>
         <div class="bg-white border border-gray-200 shadow-lg rounded w-full h-full absolute" style="top:10px;left:10px;z-index:-1;"></div>
         <div class="bg-white border border-gray-200 shadow-lg rounded w-full h-full absolute" style="top:18px;left:18px;z-index:-2;"></div>
       </div>
      </div>
    </section>
    <section data-aos="fade-up" data-aos-duration="1000" class="w-full flex items-center">
      <div class=" w-11/12 mx-auto max-w-4xl text-left p-8 md:p-20 px-0 md:px-0 md:pb-8 pb-8 items-center justify-center flex flex-col md:flex-row">
        <div style="transform: perspective(1040px) rotate(0deg) rotateX(-2deg) rotateY(12deg) translateZ(10px) scale(1.25);" class="w-full md:w-1/3 p-4 mb-2 md:mb-0 text-center md:text-left hidden md:flex">
          <div class="p-8 rounded border bg-white shadow-lg">
            <div class="flex flex-col md:flex-row mb-2 items-center">
              <h3 class="text-lg font-heading font-bold">Forever free</h3>
              <h4 class="text-xs font-bold text-indigo-600 mx-auto md:ml-auto md:mr-0 md:mt-0 mt-2">$0/Month</h4>
            </div>
            <p class="mb-4 text-gray-600 font-medium leading-relaxed text-xs">Including everything our competition offers and more.</p>
            <ul class="mb-2 list-inside text-gray-600 text-xs">
              <li class="mb-2"><span class="mr-2">✅</span>Unlimited links</li>
              <li class="mb-2"><span class="mr-2">✅</span>Unlimited customization</li>
              <li class="mb-2"><span class="mr-2">✅</span>Unlimited visits &amp; clicks</li>
              <li class="mb-2"><span class="mr-2">✅</span>Page &amp; link analytics</li>
              <li class="mb-2"><span class="mr-2">✅</span>Up to 10 profiles</li>
              <li class="mb-2"><span class="mr-2">✅</span>Deeplink support</li>
              <li class="mb-2"><span class="mr-2">✅</span>And so much more...</li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col w-full md:w-2/3 justify-center md:ml-20 md:text-left text-center">
          <h2 class="text-4xl font-bold mb-2">Forever free</h2>
          <p class="text-gray-600 text-2xl leading-relaxed mb-6">Singlelink is free forever and our entire codebase is made open-source, because you deserve better software.</p>
          <a href="https://neutroncreative.com">
            <button class="mx-auto md:mx-0 bg-gray-800 hover:bg-gray-700 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content; width: fit-content;">Learn more about our mission<span class="ml-2">🌎</span></button>
          </a>
        </div>
      </div>
    </section>
    <section data-aos="fade-up" data-aos-duration="1000" class="flex flex-col w-full items-center justify-content p-10 md:p-20">
      <div class="flex flex-col w-full items-center justify-center text-center max-w-2xl">
          <h2 class="font-bold text-5xl mb-4">Join our community</h2>
          <p class="text-gray-600 text-xl font-medium leading-relaxed mb-8">Join one of the fastest organically growing communities on the web and see why {{ users }} other members choose Singlelink.</p>
          <a href="https://app.singlelink.co/create-account" class="flex items-center justify-center w-full">
            <button data-v-4b07093c="" class="bg-indigo-600 hover:bg-indigo-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content;">Create your free Singlelink profile in seconds<span class="ml-2">👉</span></button>
          </a>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Singlelink - A single link for everything 🔗🔥',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Singlelink - A single link for everything 🔗🔥'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'A single link for everything. Build your profile in seconds and get started for free!'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Singlelink - A single link for everything 🔗🔥'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'A single link for everything. Build your profile in seconds and get started for free!'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'A single link for everything. Build your profile in seconds and get started for free!'
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
        users: 0
      };
    },
    mounted: function() {
      this.set_active();
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
      set_active: function() {
        this.i = Math.floor(Math.random() * (this.profile.length - 1));
        this.active_profile = this.profile[this.i];
      },
      fetch_analytics: async function() {
        try {
          let analytics = await this.$axios.get('https://beta-api.singlelink.co/analytics/fetch');
          this.users = analytics.data.users;
        } catch(err) {
          console.log(err);
        }
      }
    }
  };
</script>

<style>
  .phone-display.wider {
    width: 210px;
    height: 400px;
    margin: 0 !important;
    border-radius: 30px;
    padding: 9px;
  }

  .phone-display.wider .iframe-container {
    border-radius: 24px;
  }

  .phone-display.wider .iframe-container iframe {

  }

  .phone-display {
    position: relative;
    display: flex;
    margin: 20px auto auto;
    border-radius: 50px;
    background: #000;
    padding: 14px;
    width: 308px;
    height: 666px;
  }
  .phone-display .iframe-container {
    border: none;
    width: 100%;
    height: 100%;
    border-radius: 40px;
    overflow: hidden;
  }
  .phone-display iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
  .dashed-line {
    width: 2px;
    height:100px;
    display: flex;
    background: -webkit-linear-gradient(#00d2ff, rgba(90, 103, 216, 1));
  }
  .real-users {
    position: absolute;
    right: calc(100% + 40px);
    top: 120px;
    width: 200px;
    height: auto;
  }
  .custom-domain {
    position: absolute;
    left: calc(80% - 40px);
    bottom: calc(100% + 20px);
    width: 300px;
    height: auto;
  }

</style>
