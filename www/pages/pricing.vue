<template>
  <div class="flex flex-col items-center w-full">
    <section class="flex flex-col p-8 md:p-20 w-full items-center">
      <div class="flex flex-col w-full max-w-5xl text-center items-center">
        <h1 data-aos="fade-up" data-aos-duration="1000" class="text-4xl md:text-6xl font-bold text-black mb-2">Pricing & plans</h1>
        <p data-aos="fade-up" data-aos-duration="1000" class="text-2xl mb-6 text-gray-700">View and compare available pricing plans for Singlelink cloud.</p>
        <a data-aos="fade-up" data-aos-duration="1000" href="https://app.singlelink.co/create-account" class="flex items-center justify-center w-full mb-4">
          <button data-v-4b07093c="" class="bg-indigo-600 hover:bg-indigo-500 text-white text-lg p-4 px-6 rounded-lg shadow font-semibold" style="height: fit-content;">Create your free Singlelink profile in seconds<span class="ml-2">👉</span></button>
        </a>
        <a href="https://github.com/Neutron-Creative/Singlelink" data-aos="fade-up" data-aos-duration="1000" class=" text-gray-600 hover:underline hover:text-gray-700">Looking for the full-featured, free, self-hosted Singlelink?</a>
        
        <!-- here -->
        <section data-aos="fade-up" data-aos-duration="1000" class="shadow-lg overflow-hidden pt-10 relative w-full max-w-xl font-medium p-4 text-center bg-white rounded text-grey-400 text-sm mt-8">
          <div class="absolute top-0 left-0 right-0 flex flex-row text-white bg-red-500 w-full p-1 text-xs text-center items-center justify-center font-medium">
            Attention: Singlelink is currently 100% Free!
          </div>
          <span class="text-gray-700">
          Singlelink hosted is currently 100% free & unlimited in beta v2.0.0, but when it reaches public v3.0.0 in 2021 we will activate the pricing plans below.<br/>
          Sign up today to reserve three months free of whale tier for 2021!
          </span>
        </section>

        <!-- coming soon -->
        <section class="text-center w-full mt-12 mb-8 text-sm text-gray-500 italic">
          -----------------------
          coming in 2021
          -----------------------
        </section>
        
        <section data-aos="fade-up" data-aos-duration="1000" class="py-8 text-left">
          <div class="flex flex-wrap md:w-11/12 mx-auto">
            <div class="w-full md:w-1/2 p-4 mb-2 md:mb-0 text-center md:text-left">
              <div class="p-8 rounded border">
                <div class="flex flex-col md:flex-row mb-4 items-center">
                  <h3 class="text-3xl font-heading font-semibold">Forever free</h3>
                  <h4 class="text-xl font-bold text-indigo-600 mx-auto md:ml-auto md:mr-0 md:mt-0 mt-2">$0/Month</h4>
                </div>
                <p class="mb-8 text-gray-600 font-medium leading-relaxed">Including everything our competition offers and more, our free tier is perfect for most users.</p>
                <h3 class="mb-3 font-heading font-semibold">Includes the following</h3>
                <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited links
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Multiple profiles (1-5)
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Full access to profile customizations
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited visits & basic link clicks
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Deeplink support (1000 Visits/Mo)
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Detailed page & link analytics (30 days)
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Code export with sync via CLI
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Custom HTML & CSS support
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    A Singlelink of your choice
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    No forced advertisements
                  </li>
                </ul>
                <a href="https://app.singlelink.co/create-account" class="flex items-center justify-center w-full mb-4">
                  <!--<button data-v-4b07093c="" class="text-sm md:text-base w-full bg-white hover:bg-gray-200 text-gray-700 p-3 rounded-lg shadow font-semibold" style="height: fit-content;">Create your free profile<span class="ml-2">👉</span></button>-->
                  <button data-v-4b07093c="" class="text-sm md:text-base w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg shadow font-semibold" style="height: fit-content;">Create your free profile<span class="ml-2">👉</span></button>
                </a>
              </div>
            </div>
            <div class="w-full md:w-1/2 p-4 mb-2 md:mb-0 text-center md:text-left">
				<div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden">
				<div class="absolute top-0 left-0 right-0 flex flex-row text-white bg-gray-500 w-full p-1 text-xs text-center items-center justify-center font-medium">
					<!--<span v-if="remaining > 0">Limited time launch sale! Only {{remaining}}/50 remaining!</span>
					<span v-if="remaining <= 0">Price increases soon, buy now for the lowest price!</span>-->
          Launch sale coming soon, first 50 memberships only $3/mo!
				</div>
                <div class="flex flex-col md:flex-row mb-4 mt-4 items-center">
                  <h3 class="text-3xl font-heading font-semibold">Whale tier 🐳</h3>
				  <div class="flex flex-col items-center justify-end md:ml-auto md:mr-0 mx-auto md:mt-0 mt-2" v-if="remaining > 0">
				  	<h4 class="text-2xl font-bold text-gray-500">$3/Month</h4>
					<h4 class="text-sm font-bold text-gray-400 line-through">$6/Month</h4>
				  </div>
				  <h4 class="text-xl font-bold text-indigo-600 md:ml-auto md:mr-0 mx-auto md:mt-0 mt-2" v-if="remaining <= 0">$6/Month</h4>
                </div>
                <p class="mb-8 text-gray-600 font-medium leading-relaxed">For those that go above and beyond, our whale tier is the perfect choice to grow without limits.</p>
                <h3 class="mb-3 font-heading font-semibold">Includes the following</h3>
                <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Everything in the free tier
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    One year analytics data rentention
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Custom domain support (Unlimited)
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited Singlelink profiles & pages
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited deeplink clicks & redirects
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited team members & guests
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Easy code-export for static hosting
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Premium themes and extensions
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Direct support via Discord Messages
                  </li>
                </ul>
                <a href="https://app.singlelink.co/create-account" class="flex items-center justify-center w-full mb-4">
                  <!--<button data-v-4b07093c="" class="text-sm md:text-base w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg shadow font-semibold" style="height: fit-content;">Join the whales!<span class="ml-2">🐳</span></button>-->
                  <button class="text-sm md:text-base w-full bg-gray-400 cursor-not-allowed text-gray-700 p-3 rounded-lg shadow font-semibold" style="height: fit-content;">Coming soon<span class="ml-2">⏳</span></button>
                </a>
              </div>
            </div>
        </div>
		<div class="w-11/12 p-8 rounded border mx-auto mt-8 max-w-5xl flex flex-col">
			<div class="flex flex-col md:flex-row mb-4 items-center">
				<h3 class="text-3xl font-heading font-semibold">Singlelink Enterprise</h3>
				<h4 class="text-xl font-bold text-indigo-600 md:ml-auto md:mr-0 mx-auto md:mt-0 mt-2">Starting from $30/Month</h4>
			</div>
			<p class="mb-8 text-gray-600 font-medium leading-relaxed">Custom tailored plans for business customers that depend on Singlelink.</p>
			<h3 class="mb-3 font-heading font-semibold">Go further with</h3>
			<div class="flex flex-col md:flex-row md:space-x-4">
				<ul class="w-full space-y-2 md:w-1/2 mb-8 list-inside text-gray-600">
					<li>
						<span class="mr-2">✅</span>
						100% Uptime SLA
					</li>
					<li>
						<span class="mr-2">✅</span>
						Managed dedicated hosted instance</span>
					</li>
          <li>
						<span class="mr-2">✅</span>
						Lifetime and/or privatized analytics retention</span>
					</li>
					<li>
						<span class="mr-2">✅</span>
						24/7 Support via Phone, Discord &amp; Email
					</li>
				</ul>
				<ul class="w-full space-y-2 md:w-1/2 mb-8 list-inside text-gray-600">
					<li>
						<span class="mr=2">✅</span>
						Private fork development & maintainence
					</li>
          <li>
						<span class="mr=2">✅</span>
						Custom features & 100% unique expirience
					</li>
					<li>
						<span class="mr=2">✅</span>
						Prioritized issue resolution on Github
					</li>
					<li>
						<span class="mr=2">✅</span>
						Uncrashable static hosting on Global CDN
					</li>
				</ul>
			</div>
			<a href="mailto:support@neutroncreative.com" class="text-center bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg shadow font-semibold">
				Contact sales - private beta available now
			</a>
		</div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Pricing & plans - Singlelink',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Pricing & plans - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'View and compare available pricing plans for Singlelink cloud & self-hosted editions.'
        },
        {
          hid: 'twitter:title',
          name: 'og:title',
          content: 'Pricing & plans - Singlelink'
        },
        {
          hid: 'twitter:description',
          name: 'og:description',
          content: 'View and compare available pricing plans for Singlelink cloud & self-hosted editions.'
        },
        {
          hid: 'description',
          name: 'description',
          content:  'View and compare available pricing plans for Singlelink cloud & self-hosted editions.'
        },

      ],
    },
	  data: function() {
		return {
			remaining:50
		};
	  }
  };
</script>
