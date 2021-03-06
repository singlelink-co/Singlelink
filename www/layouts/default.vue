<template>
  <div class="interface wide">
    <!--<div style="background:rgba(0,0,0,.85);" class="w-screen position absolute top-0 left-0 right-0 flex flex-row py-2 px-2 text-center text-white items-center justify-center">
      <div class="interface row wide">
        <img style="width:18px;height:18px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1200px-Y_Combinator_logo.svg.png"/>
        <span class="max-w-xl text-white text-xs font-medium ml-4">
        We're currently live on Hacker News!
        </span>
        <a class="ml-auto px-2 py-1 hover:bg-gray-900 rounded-lg text-white text-xs font-semibold" href="#">Check it out 👉</a>
      </div>
    </div>-->
    <!-- Overlay gradients -->
    <!--
      <div class="overlays"><div style="background: linear-gradient(to top, rgb(83, 83, 236), transparent); opacity: 0.05; z-index: 5;"></div> <div style="background: linear-gradient(185deg, rgb(255, 0, 229), transparent); opacity: 0.08; z-index: 4;"></div> <div style="background: linear-gradient(135deg, rgb(0, 255, 255), transparent); opacity: 0.08; z-index: 3;"></div> <div style="background: radial-gradient(circle at center top, rgb(83, 83, 236), transparent); opacity: 0.15; z-index: 2;"></div> <div style="background: linear-gradient(rgb(255, 255, 255), transparent); opacity: 0.05; z-index: 1;"></div></div>
    -->
    <header class="mt-12 mb-10 lg:mt-16 flex flex-row w-full justify-start items-center">
      <a href="/" class=""><img style="height:40px;width:auto;" src="/singlelink-brandmark-shadow.png"/></a>
      <a class="hidden lg:flex ml-auto px-6 py-2 rounded-lg text-sm font-medium hover:underline" target="_blank" href="https://discord.gg/3pBM4Px">Community</a>
      <a class="hidden lg:flex px-6 py-2 rounded-lg text-sm font-medium hover:underline" href="/pricing">Pricing</a>
      <!--<a class="px-6 py-2 rounded-lg text-sm font-medium hover:underline" href="/pricing">Leaderboard</a>-->
      <a class="hidden lg:flex mx-0 px-6 py-2 rounded-lg text-sm font-medium hover:underline" href="https://app.singlelink.co">Sign in</a>
      <a href="https://app.singlelink.co/create-account" class="ml-auto flex lg:ml-0 sign-in">Get started free<img class="hidden md:flex w-3 ml-4" src="/arrow.svg"/></a>
    </header>
    <Nuxt class="interface" />
    <footer class="interface">
      <div class="flex-grow pb-20 flex flex-col text-center items-center justify-center">
        <h2 class="max-w-2xl mb-3">You're less than ten minutes from your new micro-site</h2>
        <p class="text-xl max-w-2xl mb-6">Our average user takes just under ten minutes from signup to site launch, and can expect a CTR of +50% instantly after publishing. It’s 100% free, no credit card required.</p>
        <a class="text-center mb-8 w-full shadow-lg lg:w-auto font-bold text-white px-8 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Create your free Singlelink</a>
        <div class="flex flex-col items-center justify-center relative rounded-lg shadow-lg mb-8 overflow-hidden w-full max-w-2xl video" style="height: 344px;background-image: url('/application-screenshot.png');background-repeat:no-repeat;background-position:center;background-size:cover;">
          <div class="rounded-full w-12 h-12 flex items-center justify-center" style="background:rgba(0,0,0,.5);">
            <img src="play.svg" class="w-4 h-auto"/>
          </div>
        </div>
        <!--<h2>Build your Singlelink in seconds</h2>
        <p class="mb-8">Creating your first Singlelink is free, effortless, and takes just seconds. There's no credit card required and we won't sell your data (we're open-source).</p>-->
        <!--<div class="flex flex-col w-full lg:w-auto lg:flex-row items-center justify-start space-y-4 lg:space-y-0 lg:space-x-4">
          <a class="text-center w-full lg:w-auto text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Claim your free Singlelink</a>
          <a class="text-center w-full lg:w-auto text-sm font-medium text-gray-700 px-6 py-6 lg:py-5 rounded-lg bg-gray-400 hover:bg-gray-300" href="/gallery">View community examples</a>
        </div>-->
      </div>
      <div class="flex-grow py-20 flex flex-col lg:flex-row items-start justify-center w-full space-y-8 lg:space-y-0 lg:space-x-8" style="border-top: solid 5px rgba(0,0,100,.07);">
        <div class="flex flex-col items-center text-center lg:text-left justify-center lg:justify-start lg:w-1/2">
          <img class="lg:mr-auto mb-2" src="/singlelink-brandmark.svg"/>
          <p class="text-sm font-medium leading-loose mb-1 text-gray-600">Simpler websites, better results.</p>
          <a href="https://neutroncreative.com" class="hover:underline text-sm font-medium leading-loose mr-auto text-left mb-2 text-gray-700">© Copyright {{ new Date().getFullYear() }} Neutron Creative Inc.</a>
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
            <a href="/leaderboard" class="text-gray-600 font-medium hover:text-indigo-500">Leaderboard</a>
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
        <div class="flex flex-row p-4 purple-btn w-full justify-between items-center">
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

.purple-btn {
  background: linear-gradient(to bottom, #6464FD, #5353EC);
  border: solid 2px #5353EC;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
  transition: .1s ease-in-out
}

.purple-btn:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%), inset 0 1000px 0 rgba(255,255,255,.1);
  transform: scale(1.02);
}

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
    background-image: url('/bg.png');
    background-size: 100% 100%;
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
    @apply flex-row items-center justify-center rounded-lg text-sm px-4 py-2;
    background: rgba(255,255,255,.25);
    backdrop-filter: blur(5px);
    border: solid 1px rgba(255,255,255,.5);
  }

  .sign-in:hover {
    background:rgba(255,255,255,.45);
  }

  .interface {
    @apply flex flex-col items-center justify-center mx-auto w-screen;
    max-width: 850px;
  }

  .interface.mx-none {
    margin: 0 !important;
  }

  .interface.wide {
    max-width: 1150px;
  }

  .interface.row {
    @apply flex-row;
  }

  @media(max-width:750px) {
    .interface {
      padding-left: 30px;
      padding-right: 30px;
    }
    .interface > .interface {
      transform:translateX(-30px);
    }

    .interface.row {
      @apply flex-col;
    }
  }

  h1 {
    @apply text-6xl font-extrabold text-black tracking-tighter mb-10 w-full;
    line-height: 110%;
  }

  h2 {
    @apply text-5xl font-extrabold text-black tracking-tighter mb-6 w-full;
    line-height: 110%;
  }

  h3 {
    @apply text-4xl font-extrabold text-black tracking-tighter mb-3 w-full;
  }

  p {
    @apply leading-relaxed text-lg w-full;
  }

  @media(max-width:720px) {
    h1 {
      @apply text-4xl;
    }

    h2 {
      @apply text-4xl;
    }

    h3 {
      @apply text-2xl;
    }
    p {
      @apply text-base;
    }
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
