<!-- TO BE DELETED -->
<template>
  <div class="flex flex-col items-center w-full">
    <section class="flex flex-col p-20 w-full items-center">
      <div class="flex flex-col w-full max-w-5xl text-center items-center">
        <div class="flex flex-row mb-2" data-aos="fade-up" data-aos-duration="1000" style="transform: translateX(-66px)">
          <img class="shadow-lg" style="width: 55px;height: 55px;border-radius: 100px; transform: translateX(88px); z-index: 4;" src="/jb-avatar.png"/>
          <img class="shadow-lg" style="width: 55px;height: 55px;border-radius: 100px; transform: translateX(66px); z-index: 3;" src="/nk-avatar.png"/>
          <img class="shadow-lg" style="width: 55px;height: 55px;border-radius: 100px; transform: translateX(44px); z-index:2;" src="/db-avatar.jpg"/>
          <img class="shadow-lg" style="width: 55px;height: 55px;border-radius: 100px; transform: translateX(22px)" src="/bill-avatar.jpg"/>
          <img class="shadow-lg" style="width: 55px;height: 55px;border-radius: 100px; transform: none;" src="/ma-avatar.jpg"/>
        </div>
        <h1 data-aos="fade-up" data-aos-duration="1000" style="font-size: 2.95rem;" class="font-bold text-black mb-2">Join our growing community</h1>
        <p data-aos="fade-up" data-aos-duration="1000" class="text-2xl mb-4 text-gray-700">Get involved in our rapidly growing Singlelink community of online professionals.</p>
        <div data-aos="fade-up" data-aos-duration="1000" class="flex flex-col md:flex-row mb-4">
          <a href="https://discord.gg/BUbmgV4">
            <button class="w-full md:w-auto mb-2 flex flex-row items-center justify-center p-5 pl-6 pr-6 font-semibold shadow tracking-wide uppercase rounded bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 hover:border-indigo-700 mr-4 text-sm"><img style="filter:invert(1);width:20px;height:auto;opacity:.85;" class="mr-3" src="https://discord.com/assets/41484d92c876f76b20c7f746221e8151.svg"/>Join us on Discord</button>
          </a>
          <a href="https://github.com/Neutron-Creative/singlelink-client">
            <button class="w-full md:w-auto mb-2 flex flex-row items-center justify-center p-5 pl-6 pr-6 font-semibold shadow tracking-wide uppercase rounded bg-white hover:bg-gray-200 text-white border border-gray-200 text-gray-700 text-sm"><img style="width: 20px; height: auto; opacity: .85;" class="mr-3" src="/github-mark.svg"/>Contribute on Github</button>
          </a>
        </div>
        <p data-aos="fade-up" data-aos-duration="1000" class="text-sm text-gray-700">Want to partner with the team at Singlelink? <a href="https://neutroncreative.com/contact-us/" class="text-indigo-600 hover:underline">Get in touch.</a></p>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Community - Singlelink',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Get involved in our rapidly growing Singlelink community of online professionals.'
        }
      ],
    }
  };
</script>
