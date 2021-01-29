<template>
  <div>
    <section class="mb-12">
      <h1>Own your content, free.</h1>
      <p class="mb-8">
        Singlelink is 100% free & open-source, because we believe you should have the right to own your content. Should you want more from Singlelink, our whale tier is available for $6/Month and our enterprise plan is available from just $30/Month.
      </p>
    </section>
    <section class="mb-20">
      <div class="p-12 rounded-lg shadow bg-white flex flex-col mb-8">
                <div class="flex flex-col lg:flex-row mb-2 items-center">
                  <h3 class="text-3xl font-heading font-semibold">Forever free</h3>
                  <h4 class="text-xl font-bold text-indigo-600 mx-auto mr-auto ml-0 lg:mt-0 mt-2">$0/Month</h4>
                </div>
                <p class="mb-4 text-gray-600 font-medium leading-relaxed">Including everything our competition offers and more, our free tier is perfect for most users.</p>
                <h3 class="mb-4 font-heading font-semibold">Includes the following</h3>
                <ul class="mb-6 list-inside text-gray-600 flex flex-col lg:flex-row lg:space-x-4">
                  <div class="flex flex-col flex-grow">
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
                      Unlimited customization
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Unlimited visits & clicks
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Deeplink support
                    </li>
                  </div>
                  <div class="flex flex-col flex-grow">
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Detailed analytics
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Code export via CLI
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Custom HTML & CSS
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Your custom Singlelink
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      No advertisements
                    </li>
                  </div>
                </ul>
                <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg bg-indigo-600 hover:bg-indigo-500" href="https://app.singlelink.co/create-account">Claim your free Singlelink</a>
      </div>
      <div class="flex lg:flex-row flex-col space-y-8 lg:space-x-8 lg:space-y-0">
        <div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden w-full lg:w-1/2 flex flex-col">
				<div class="absolute top-0 left-0 right-0 flex flex-row text-white bg-gray-500 w-full p-1 text-xs text-center items-center justify-center font-medium">
					<!--<span v-if="remaining > 0">Limited time launch sale! Only {{remaining}}/50 remaining!</span>
					<span v-if="remaining <= 0">Price increases soon, buy now for the lowest price!</span>-->
          Early bird sale coming soon, first 50 members only $3/mo!
				</div>
        <div class="flex flex-col lg:flex-row mb-4 mt-2 items-center">
          <h3 class="text-3xl font-heading font-semibold mt-4 lg:mt-0">Whale 🐳</h3>
				  <div class="flex flex-col items-center justify-end mr-auto lg:mr-0 lg:mt-0 mt-2" v-if="remaining > 0">
				  	<h4 class="text-2xl font-bold text-indigo-600">$3/Month</h4>
					  <h4 class="text-sm font-bold text-gray-400 line-through mr-auto lg:mr-0">$6/Month</h4>
				  </div>
				  <h4 class="text-xl font-bold text-indigo-600 lg:ml-auto lg:mr-0 mx-auto lg:mt-0 mt-2" v-if="remaining <= 0">$6/Month</h4>
                </div>
                <p class="mb-8 text-gray-600 font-medium text-sm leading-relaxed">For those that go above and beyond, our whale tier is perfect for power users.</p>
                <h3 class="mb-3 font-heading font-semibold">Includes the following</h3>
                <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Everything in the free tier
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    One year analytics retention
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Custom domain support
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited Singlelink profiles
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Team profile collaboration
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    One-click code export
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Premium themes and extensions
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Support via Discord
                  </li>
                </ul>
                <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg bg-indigo-600 hover:bg-indigo-500" href="mailto:sales@singlelink.co">Reserve your spot! 49/50 remaining</a>
        </div>
        <div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden w-full lg:w-1/2 flex flex-col">
          <div class="flex flex-col lg:flex-row mb-4 items-center justify-center">
            <h3 class="text-3xl font-heading font-semibold mb-0">Enterprise</h3>
            <h4 class="text-2xl font-bold text-indigo-600 mt-2 lg:mt-0 mr-auto lg:mr-0">$30/Month</h4>
          </div>
                <p class="mb-8 text-gray-600 font-medium text-sm leading-relaxed">Custom tailored plans for business customers that rely on Singlelink.</p>
                <h3 class="mb-3 font-heading font-semibold">Go further with...</h3>
                <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    100% Uptime SLA
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Managed private instance
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited profiles
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited analtyics & seats
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Private data-store
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Whitelabeled experience
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Global admin panel control
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Urgent direct suppport
                  </li>
                </ul>
                <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 lg:mt-5" href="mailto:sales@singlelink.co">Contact sales</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Pricing - Singlelink',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Pricing - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'View and compare available pricing plans for Singlelink.'
        },
        {
          hid: 'twitter:title',
          name: 'og:title',
          content: 'Pricing - Singlelink'
        },
        {
          hid: 'twitter:description',
          name: 'og:description',
          content: 'View and compare available pricing plans for Singlelink.'
        },
        {
          hid: 'description',
          name: 'description',
          content:  'View and compare available pricing plans for Singlelink.'
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
