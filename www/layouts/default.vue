<template>
  <div class="interface">
    <!-- Overlay gradients -->
    <div class="overlays"><div style="background: linear-gradient(to top, rgb(83, 83, 236), transparent); opacity: 0.05; z-index: 5;"></div> <div style="background: linear-gradient(185deg, rgb(255, 0, 229), transparent); opacity: 0.08; z-index: 4;"></div> <div style="background: linear-gradient(135deg, rgb(0, 255, 255), transparent); opacity: 0.08; z-index: 3;"></div> <div style="background: radial-gradient(circle at center top, rgb(83, 83, 236), transparent); opacity: 0.15; z-index: 2;"></div> <div style="background: linear-gradient(rgb(255, 255, 255), transparent); opacity: 0.05; z-index: 1;"></div></div>
    <header class="my-12 lg:my-24 flex flex-row w-full justify-between items-center">
      <a href="/"><img src="/singlelink-brandmark.svg"/></a>
      <a href="https://app.singlelink.co" class="sign-in">Sign in<img class="w-3 ml-2" src="/arrow.svg"/></a>
    </header>
    <Nuxt class="interface" />
    <footer class="interface">
      <div class="flex-grow pb-20 flex flex-col" style="border-bottom: solid 5px rgba(0,0,100,.07);">
        <h2>Build your free Singlelink profile in seconds</h2>
        <p class="mb-8">Creating your Singlelink profile is free, effortless, and takes just seconds. There's no credit card required and we won't sell your data.</p>
        <div class="flex flex-col w-full lg:w-auto lg:flex-row items-center justify-start space-y-4 lg:space-y-0 lg:space-x-4">
          <a class="text-center w-full lg:w-auto text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg bg-indigo-600 hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Claim your free Singlelink</a>
          <a class="text-center w-full lg:w-auto text-sm font-medium text-gray-700 px-6 py-6 lg:py-5 rounded-lg bg-gray-400 hover:bg-gray-300" href="/gallery">View community examples</a>
        </div>
      </div>
      <div class="flex-grow py-20 flex flex-col lg:flex-row items-start justify-center w-full space-y-8 lg:space-y-0 lg:space-x-8">
        <div class="flex flex-col items-center text-center lg:text-left justify-center lg:justify-start lg:w-1/2">
          <img class="lg:mr-auto mb-2" src="/singlelink-brandmark.svg"/>
          <p class="text-sm font-medium leading-loose mb-2 text-gray-600">You don't need a website, you need a Singlelink.</p>
          <p class="text-sm font-medium leading-loose mb-2 text-gray-700">© Copyright {{ new Date().getFullYear() }} Neutron Creative Inc.</p>
        </div>
        <div class="flex flex-col lg:flex-row items-start justify-between w-full lg:w-1/2">
          <div class="flex flex-col font-semibold lg:text-sm text-center lg:text-left space-y-4 mb-8 lg:mb-0 lg:space-y-2 w-full lg:w-1/3">
            <span class="text-gray-900">Product</span>
            <a href="/" class="text-gray-600 font-medium hover:text-indigo-500">Overview</a>
            <a href="/pricing" class="text-gray-600 font-medium hover:text-indigo-500">Pricing</a>
            <a href="/gallery" class="text-gray-600 font-medium hover:text-indigo-500">Examples</a>
            <a href="https://app.singlelink.co/create-account" class="text-gray-600 font-medium hover:text-indigo-500">Sign up free</a>
            <a href="/analytics" class="text-gray-600 font-medium hover:text-indigo-500">Analytics</a>
            <a href="https://github.com/Neutron-Creative/Singlelink/projects" class="text-gray-600 font-medium hover:text-indigo-500">Roadmap</a>
            <a href="https://github.com/Neutron-Creative/Singlelink/blob/master/CHANGELOG.md" class="text-gray-600 font-medium hover:text-indigo-500">Changelog</a>
            <a href="https://status.singlelink.co" class="text-gray-600 font-medium hover:text-indigo-500">Status</a>
          </div>
          <div class="flex flex-col font-semibold lg:text-sm text-center lg:text-left space-y-4 mb-8 lg:mb-0 lg:space-y-2 w-full lg:w-1/3">
            <span class="text-gray-900">Company</span>
            <a href="https://neutroncreative.com/" class="text-gray-600 font-medium hover:text-indigo-500">Learn more</a>
            <a href="https://neutroncreative.com/community" class="text-gray-600 font-medium hover:text-indigo-500">Community</a>
            <a href="https://discord.gg/3pBM4Px" class="text-gray-600 font-medium hover:text-indigo-500">Support</a>
            <a href="https://discord.gg/3pBM4Px" class="text-gray-600 font-medium hover:text-indigo-500">Discord</a>
            <a href="https://twitter.com/neutroncreative" class="text-gray-600 font-medium hover:text-indigo-500">Twitter</a> 
            <a href="https://github.com/Neutron-Creative/" class="text-gray-600 font-medium hover:text-indigo-500">Github</a>
          </div>
          <div class="flex flex-col font-semibold lg:text-sm text-center lg:text-left space-y-4 mb-8 lg:mb-0 lg:space-y-2 w-full lg:w-1/3">
            <span class="text-gray-900">Resources</span>
            <a href="https://app.singlelink.co" class="text-gray-600 font-medium hover:text-indigo-500">Login</a>
            <a href="https://neutroncreative.com/terms-of-use" class="text-gray-600 font-medium hover:text-indigo-500">Terms of Use</a>
            <a href="https://neutroncreative.com/privacy-policy" class="text-gray-600 font-medium hover:text-indigo-500">Privacy Policy</a>
            <a href="https://neutroncreative.com" class="text-gray-600 font-medium hover:text-indigo-500">Open-source</a>
            <a href="https://neutroncreative.com" class="text-gray-600 font-medium hover:text-indigo-500">Blog</a>
          </div>
        </div>
      </div>
    </footer>
    <div class="chat">
      <img src="/chat.png" @click="bubble_modal=!bubble_modal" class="bubble-icon"/>
      <div v-if="bubble_modal" class="chat-window">
        <div class="flex flex-row p-4 bg-indigo-600 w-full justify-between items-center">
          <a href="https://discord.gg/3pBM4Px" class="flex flex-col">
            <span class="text-white font-bold tracking-tight">Get help on Discord!</span>
            <p class="text-gray-400 text-sm">Office hours: 9AM-5PM ET</p>
          </a>
          <div class="w-10 h-10 bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center rounded-lg cursor-pointer" @click="bubble_modal=false">
            <img src="/ex.svg" class="w-3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://rsms.me/inter/inter.css'); 

::selection {
  background: #FF4081; /* WebKit/Blink Browsers */
}
::-moz-selection {
  background: #FF4081; /* Gecko Browsers */
}

  html, body {
    width: 100vw;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x:hidden;
    background-image: url('/bg.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
html {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  line-height: 1.45;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
  * {
    outline: none !important;
    color: #333B4B;
  }

  .chat {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  
  .overlays {
    z-index: -1;
  }

  .overlays, .overlays * {
    position: fixed;
    top: 0;
    left:0;
    right:0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
  }

  .bubble-icon {
    @apply shadow-lg rounded-full cursor-pointer;
    width: 60px;
    transition: .2s ease-in-out;
  }

  .bubble-icon:hover {
    transform: scale(1.025);
  }

  .chat .chat-window {
    position: fixed;
    bottom: 100px;
    right: 20px;
    @apply flex flex-col items-center justify-center rounded-lg shadow-lg overflow-hidden;
    width: 315px;
  }

  .sign-in {
    @apply flex flex-row items-center justify-center rounded-lg text-sm px-4 py-2;
    background: rgba(255,255,255,.25);
    backdrop-filter: blur(5px);
    border: solid 1px rgba(255,255,255,.5);
  }

  .sign-in:hover {
    background:rgba(255,255,255,.45);
  }

  .interface {
    @apply flex flex-col items-center justify-center mx-auto w-full;
    max-width: 750px;
  }

  @media(max-width:750px) {
    .interface {
      padding-left: 30px;
      padding-right: 30px;
    }
    .interface > .interface {
      padding-left: 0;
      padding-right: 0;
    }
  }

  h1 {
    @apply text-6xl font-extrabold text-black tracking-tighter mb-10 w-full;
    line-height: 110%;
  }

  h2 {
    @apply text-4xl font-extrabold text-black tracking-tighter mb-6 w-full;
    line-height: 110%;
  }

  h3 {
    @apply text-2xl font-extrabold text-black tracking-tighter mb-3 w-full;
  }

  p {
    @apply leading-relaxed text-lg w-full;
  }
</style>

<script>
  export default {
    data: function() {
      return {
        mobile_menu: false,
        message: null,
        bubble_modal: false
      };
    },
    methods: {
      toggle_menu: function() {
        this.mobile_menu = !this.mobile_menu;
      }
    }
  };
</script>
