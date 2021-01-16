<template>
  <div class="flex flex-col items-center w-full">
    <section class="flex flex-col p-8 md:p-20 w-full items-center">
      <div class="flex flex-col w-full max-w-5xl text-center items-center">
        <h1 data-aos="fade-up" data-aos-duration="1000" class="text-4xl md:text-6xl font-bold text-black mb-2">Planned outage 01/15/2021</h1>
        <p data-aos="fade-up" data-aos-duration="1000" class="text-2xl mb-6 text-gray-700">Learn more about our planned outage on Thursday, January 15th, 2021.</p>
        <section data-aos="fade-up" data-aos-duration="1000" class="py-8 text-left">
          <div class="flex flex-wrap md:w-11/12 mx-auto">
            <div class="w-full p-4 text-lg text-gray-700 leading-loose">
              Later tonight (6PM EST), Singlelink will experience a brief planned outage (~1hr) while we initiate a major migration from v2.0 to v2.1, which includes large changes to our tech stack for better scalbility.

              Most notably, we'll be switching to a much more secure build rebuilt from scratch from our CTO & Co-Founder Navid, including a migration from MongoDb to PostgreSQL, Javascript to Typescript, improved self-hosting cababilities & documentation, and so much more.

              The outage shouldn't last long - however you may notice that your profile may not load for a short period of time (if you're depending on your profile today, <a class="text-indigo-600 hover:underline" href="https://discord.com/invite/3pBM4Px">DM me on Discord</a>), you may not be able to make changes for a brief period of time, or you might not be able to signup for an account.

              Rest assured these issues are expected and will be resolved in a quick & orderly fashion, and we're always available if you need helo.

              Thanks so much for using Singlelink, we appreciate every one of our community members helping us to make the world open-source.<br/><br/>

              Sincerely,<br/>
              Jim Bisenius<br/>
              Founder & President of Neutron Creative | Maintainer @ Singlelink<br/>
              Email: <a href="mailto:jim@neutroncreative.com" class="font-medium text-indigo-600 hover:underline">jim@neutroncreative.com</a><br/>
              Phone Number: <a href="tel:+19196530790" class="font-medium text-indigo-600 hover:underline">(919) 653-0790</a>
            </div>
        </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Planned Outage - 01/15/20 - Singlelink',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Planned Outage - 01/15/20 - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Learn more about our planned outage on Thursday, January 15th, 2021.'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'article'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Planned Outage - 01/15/20 - Singlelink'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Learn more about our planned outage on Thursday, January 15th, 2021.'
        },
        {
          hid: 'twitter:type',
          name: 'twitter:type',
          content: 'article'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Learn more about our planned outage on Thursday, January 15th, 2021.'
        },

      ],
    }
  };
</script>
