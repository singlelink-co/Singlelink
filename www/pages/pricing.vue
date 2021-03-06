<template>
  <div>
    <section class="mb-12 mt-6">
      <h1 class="my-10">Pricing & plans</h1>
      <p class="mb-8 text-2xl">
        Singlelink is 100% free & open-source, because we believe you should have the right to own your content. Should you want more from your Singlelink, we plans for individuals starting at $8/Month, plans for businesses starting at $25/Month.
      </p>
    </section>
    <section class="mb-20 w-full">
      <div class="flex items-center justify-end w-full flex-row mb-6">
        <span class="text-gray-700 font-semibold mr-4 text-sm">Viewing plans for</span>
        <select v-model="intent" class="toggle">
          <option value="personal">Personal use</option>
          <option value="business">Commercial use</option>
        </select>
      </div>
      <div class="p-12 rounded-lg shadow bg-white flex flex-col mb-8" v-if="intent=='personal'">
                <div class="flex flex-col lg:flex-row mb-2 items-center">
                  <h3 class="text-3xl font-extrabold mb-0">Forever free</h3>
                  <h4 class="text-xl font-medium text-indigo-600 mx-auto mr-auto ml-0 lg:mt-0 mt-2">$0/Month</h4>
                </div>
                <p class="mb-4 text-gray-600 font-medium leading-relaxed">The perfect option for users looking to build their first micro-site.</p>
                <h4 class="mb-4 font-heading font-semibold text-lg">Includes the following</h4>
                <ul class="mb-6 list-inside text-gray-600 flex flex-col lg:flex-row lg:space-x-4">
                  <div class="flex flex-col flex-grow">
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Unlimited links
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Multiple profiles (Up to 3)
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Unlimited customization
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Unlimited traffic & clicks
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
                      Access to marketplace
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Custom HTML & CSS
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      No-code theme builder
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Limited advertisements
                    </li>
                  </div>
                </ul>
                <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn" href="https://app.singlelink.co/create-account">Build your free Singlelink</a>
      </div>
      <div class="flex lg:flex-row flex-col space-y-8 lg:space-x-8 lg:space-y-0" v-if="intent=='personal'">
        <div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden w-full lg:w-1/2 flex flex-col">
        <div class="flex flex-col lg:flex-row mb-2 items-center">
          <h3 class="text-3xl font-extrabold mt-4 mb-0 lg:mt-0">Whale 🐳</h3>
				  <h4 class="text-xl font-medium text-indigo-600 lg:ml-auto lg:mr-0 mx-auto lg:mt-0 mt-2">$8/Month</h4>
        </div>
        <p class="mb-8 text-gray-600 font-medium leading-relaxed">The power users choice, perfect for those who go the extra mile and then some with Singlelink.</p>
        <h4 class="mb-3 font-heading font-semibold text-lg">Includes the following</h4>
        <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Everything in the free tier
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Advanced graphs & reports
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited profiles & domains
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Basic team collaboration (3 seats)
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Free premium themes and extensions
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    One-click export to static website
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Direct support via Discord DMs
                  </li>
        </ul>
        <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn" href="mailto:sales@neutroncreative.com">Pre-order now for $8</a>
        </div>
        <div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden w-full lg:w-1/2 flex flex-col">
        <div class="flex flex-col lg:flex-row mb-2 items-center">
          <h3 class="text-3xl font-extrabold mb-0">Enterprise</h3>
				  <h4 class="text-xl font-medium text-indigo-600 w-full text-right">Contact us</h4>
        </div>
        <p class="mb-8 text-gray-600 font-medium leading-relaxed">For those looking to work alongside the Singlelink team and rely on us for your online needs.</p>
        <h4 class="mb-3 font-heading font-semibold text-lg">Includes the following</h4>
        <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Everything in the previous tiers
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Dedicated instance & database
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited traffic, 99.9% uptime SLA
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Custom fork ownership & management
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Access to user metrics & custom events
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    1-on-1 help with our success team
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    24/7 support via Phone & Email
                  </li>
        </ul>
        <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn" href="mailto:sales@neutroncreative.com">Contact our sales team</a>
        </div>
      </div>
      <div class="p-12 rounded-lg shadow bg-white flex flex-col mb-8" v-if="intent=='business'">
                <div class="flex flex-col lg:flex-row mb-2 items-center">
                  <h3 class="text-3xl font-extrabold mb-0">Team</h3>
                  <h4 class="text-xl font-medium text-indigo-600 mx-auto mr-auto ml-0 lg:mt-0 mt-2 w-full text-right">From $25/Month</h4>
                </div>
                <p class="mb-4 text-gray-600 font-medium leading-relaxed">The perfect option for small businesses to start building with their team on Singlelink.</p>
                <h4 class="mb-4 font-heading font-semibold text-lg">Includes the following</h4>
                <ul class="mb-6 list-inside text-gray-600 flex flex-col lg:flex-row lg:space-x-4">
                  <div class="flex flex-col flex-grow">
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Unlimited links
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Up to 25 profiles
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Five team members & unlimited guests
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Unlimited traffic & clicks
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Deeplink support
                    </li>
                  </div>
                  <div class="flex flex-col flex-grow">
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Advanced graphs & reports
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Access to marketplace
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      Custom HTML & CSS
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      No-code theme builder
                    </li>
                    <li class="mb-2">
                      <span class="mr-2">✅</span>
                      No advertisements
                    </li>
                  </div>
                </ul>
                <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn" href="https://app.singlelink.co/create-account">Build your free Singlelink</a>
      </div>
      <div class="flex lg:flex-row flex-col space-y-8 lg:space-x-8 lg:space-y-0" v-if="intent=='business'">
        <div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden w-full lg:w-1/2 flex flex-col">
        <div class="flex flex-col lg:flex-row mb-2 items-center">
          <h3 class="text-3xl font-extrabold mt-4 mb-0 lg:mt-0">Platform</h3>
				  <h4 class="text-xl font-medium text-indigo-600 lg:ml-auto lg:mr-0 mx-auto lg:mt-0 mt-2 w-full text-right">From $50/Month</h4>
        </div>
        <p class="mb-8 text-gray-600 font-medium leading-relaxed">The ideal choice for medium-large businesses looking to build their business on Singlelink.</p>
        <h4 class="mb-3 font-heading font-semibold text-lg">Includes the following</h4>
        <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Everything in the team tier
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    10 Team members & unlimited guests
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Private theme & template libraries
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Dedicated instance & database
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    One-click whitelabeling support
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    1-on-1 help from our success team
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Direct support via Phone & Email
                  </li>
        </ul>
        <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn" href="mailto:sales@neutroncreative.com">Pre-order now for $8</a>
        </div>
        <div class="p-8 rounded-lg bg-white shadow-lg relative overflow-hidden w-full lg:w-1/2 flex flex-col">
        <div class="flex flex-col lg:flex-row mb-2 items-center">
          <h3 class="text-3xl font-extrabold mb-0">Enterprise</h3>
				  <h4 class="text-xl font-medium text-indigo-600 w-full text-right">Contact us</h4>
        </div>
        <p class="mb-8 text-gray-600 font-medium leading-relaxed">For small-large enterprises that need to rely on us to be readliy available for bugs, questions, and feedback.</p>
        <h4 class="mb-3 font-heading font-semibold text-lg">Get access to the following</h4>
        <ul class="mb-8 list-inside text-gray-600">
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Everything in the previous tiers
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Unlimited guests & team members
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Managed hosting & 99.9% uptime SLA
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Custom fork ownership & management
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Access to user metrics & custom events
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    Granular user security & SSO support
                  </li>
                  <li class="mb-2">
                    <span class="mr-2">✅</span>
                    24/7 support via Phone & Email
                  </li>
        </ul>
        <a class="text-center w-full text-sm font-medium text-white px-6 py-6 lg:py-5 rounded-lg purple-btn" href="mailto:sales@neutroncreative.com">Contact our sales team</a>
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
			intent: 'personal'
		};
	  }
  };
</script>


<style>
  .toggle {
    @apply .px-6 .py-3 .text-sm .rounded-lg .text-gray-700 .font-medium .shadow; 
    transition: .2s ease-in;
  }

  .toggle:hover {
    box-shadow: 0 0 0 1px rgba(83,83,237,.25), 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  .toggle:focus {
    box-shadow: 0 0 0 4px rgba(83,83,237,.4), 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }
</style>