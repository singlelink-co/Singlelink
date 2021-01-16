<template>
  <div class="w-screen min-h-screen flex flex-col">
    <a href="/blog/planned-outage-01-15-21" style="z-index:99;">
	<!--<a href="/blog/outage-report-10-29-20">-->
      <div class="flex flex-row w-full bg-black items-center justify-center p-3">
        <div class="w-full max-w-6xl flex-row flex items-center justify-center">
          <!--<img style="width: 80px;" class="mr-4" src="https://neutron.so/Sidebar-brandmark.svg"/>
          <span class="text-gray-400 text-sm flex flex-row items-center justify-center hover:underline hover:text-white cursor-pointer">Singlelink is part of our mission to make the world open-source.<span class="font-bold text-white flex flew-col items-center justify-center ml-2">Read more <img src='/r-finger-emoji.svg' class="w-4 ml-2"/></span></span>-->
          <span class="text-gray-400 text-sm flex flex-row items-center justify-center hover:underline hover:text-white cursor-pointer text-center">Singlelink will have a brief outage between 6PM-7PM EST on 11/15/21 for an update.<span class="hidden font-bold text-white lg:flex flew-col items-center justify-center ml-2">Read more <img src='/r-finger-emoji.svg' class="w-4 ml-2"/></span></span>
      <!-- <span class="text-gray-400 text-sm flex flex-row items-center justify-center hover:underline hover:text-white cursor-pointer">Unfortunately, Singlelink experienced issues yesterday due to service provider outage from MongoDB Atlas.<span class="font-bold text-white ml-2">Read more 👉</span></span> -->
        </div>
      </div>
    </a>
    <nav style="background:rgba(255,255,255,.5);backdrop-filter:blur(5px);border-color:rgba(255,255,255,.15) !important;" class="sticky top-0 z-50 flex flex-row p-3 border border-l-0 border-r-0 border-t-0 items-center justify-center">
      <div class="relative w-full max-w-6xl flex-row flex">
        <n-link to="/" class="flex items-center justify-center lg:mr-40">
          <img src="/singlelink-brandmark.svg"/>
        </n-link>
        <ul class="hidden md:flex flex-row text-gray-700 text-sm items-center justify-end ml-auto">
          <n-link to="/">
            <li class="p-2 mr-2 hover:text-black cursor-pointer">Overview</li>
          </n-link>
          <a href="https://neutroncreative.com/community">
            <li class="p-2 mr-2 hover:text-black cursor-pointer">Community</li>
          </a>
		  <n-link to="gallery"><li class="p-2 mr-2 hover:text-black cursor-pointer">Gallery</li></n-link>
          <n-link to="/pricing"><li class="p-2 mr-2 hover:text-black cursor-pointer">Pricing</li></n-link>
          <a href="https://app.singlelink.co"><li class="p-2 mr-2 hover:text-black cursor-pointer">Log in</li></a>
          <iframe class="mr-2" style="transform: scale(.9);" src="https://ghbtns.com/github-btn.html?user=Neutron-Creative&repo=Singlelink&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
        </ul>
        <a href="https://app.singlelink.co/create-account" class="ml-auto md:flex hidden">
          <button data-v-4b07093c="" class="bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg shadow font-semibold flex flex-row items-center justify-center" style="height: fit-content;">
            Create your free profile
            <img src='/r-finger-emoji.svg' class="w-4 ml-2"/>
          </button>
        </a>
        <li style="list-style: none;" @click="toggle_menu" class="ml-auto md:hidden text-xs p-2 pl-4 pr-4 bg-indigo-600 md:text-sm uppercase tracking-wide rounded shadow text-white hover:bg-indigo-700 font-medium cursor-pointer">
          <span v-if="!mobile_menu">Open </span>
          <span v-if="mobile_menu">Close </span>
          Menu
        </li>
      </div>
      <ul v-if="mobile_menu" style="top:100%;" class="shadow-lg absolute bg-gray-100 w-full flex flex-col text-gray-600 text-sm items-center justify-end">
        <n-link class="" to="/">
          <li class="p-3 text-sm text-center hover:text-black cursor-pointer">Overview</li>
        </n-link>
        <a class="" href="https://neutroncreative.com/community">
          <li class="p-3 text-sm text-center hover:text-black cursor-pointer">Community</li>
        </a>
		<n-link to="/gallery">
			<li class="p-3 text-sm text-center hover:text-black cursor-pointer">Gallery</li>
		</n-link>
        <n-link to="/pricing">
          <li class="p-3 text-sm text-center hover:text-black cursor-pointer">Pricing</li>
        </n-link>
        <a href="https://app.singlelink.co">
          <li class="p-3 text-sm text-center hover:text-black cursor-pointer">Log in</li>
        </a>
        <iframe style="transform: scale(.9);margin:15px auto; transform: translateX(35px);" src="https://ghbtns.com/github-btn.html?user=Neutron-Creative&repo=Singlelink&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
        <a href="https://app.singlelink.co/create-account" class="mb-4">
          <button data-v-4b07093c="" class="bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg shadow font-semibold" style="height: fit-content;">
            Create your free profile
            <span class="ml-2">👉</span>
          </button>
        </a>
      </ul>
    </nav>
    <Nuxt class="bg-gray-100 flex flex-grow w-full h-auto justify-start flex-col" style="padding-top:73px;position:relative;transform:translateY(-73px);margin-bottom:-73px;" />
    <footer class="bg-gray-100 border border-gray-200 border-l-0 border-r-0 border-b-0 p-10">
      <!--<a href="https://beta-app.singlelink.co/create-account" class="mx-auto text-sm text-gray-600 text-center flex items-center justify-center">
        <span class="p-2 mr-2 hover:text-gray-800 cursor-pointer flex-row items-center justify-center">Get access to Singlelink beta!<span class="ml-2">🤫</span></span>
	  </a>-->
      <ul class="w-full flex flex-col md:flex-row text-gray-600 text-sm items-center justify-center">
        <n-link to="/">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Overview</li>
        </n-link>
        <a href="https://neutroncreative.com/community">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Community</li>
        </a>
        <n-link to="/pricing">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Pricing</li>
        </n-link>
        <a href="https://app.singlelink.co">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Login</li>
        </a>
        <a href="https://app.singlelink.co/create-account">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Get started</li>
        </a>
        <a href="https://neutroncreative.com/contact-us/">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Contact us</li>
        </a>
        <a href="https://github.com/Neutron-Creative">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Github</li>
        </a>
        <a href="https://status.singlelink.co">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Status</li>
        </a>
        <a href="https://discord.com/invite/3pBM4Px">
          <li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Support</li>
        </a>
		<a href="https://singlel.ink/analytics">
			<li class="p-2 mr-2 hover:text-gray-800 cursor-pointer">Realtime Statistics</li>
		</a>
      </ul>
      <div class="text-gray-600 text-sm text-center p-3 leading-relaxed">
        Built as part of our mission to make the world open-source by the team at <a class="text-indigo-600 hover:underline cursor-pointer" href="https://neutroncreative.com">Neutron Creative Inc.</a>
        <br/>
        <div class="mt-2">
          Singlelink is open-source software licensed via
          <a class="text-indigo-600 hover:underline cursor-pointer" href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL v3+</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
  html, body {
    width: 100vw;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x:hidden;
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

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

  * {
    outline: none !important;
  }
</style>

<script>
  export default {
    data: function() {
      return {
        mobile_menu: false
      };
    },
    methods: {
      toggle_menu: function() {
        this.mobile_menu = !this.mobile_menu;
      }
    }
  };
</script>
