<template>
  <div class="flex flex-col items-center w-full">
    <section class="flex flex-col p-8 md:p-20 w-full items-center">
      <div class="flex flex-col w-full max-w-5xl text-center items-center">
        <h1 data-aos="fade-up" data-aos-duration="1000" class="text-4xl md:text-6xl font-bold text-black mb-2">Outage report 10/29/20</h1>
        <p data-aos="fade-up" data-aos-duration="1000" class="text-2xl mb-6 text-gray-700">Learn more about our latest outage on Wednesday, October 28th, 2020, and what we're doing to mitigate events like these in the future.</p>
        <section data-aos="fade-up" data-aos-duration="1000" class="py-8 text-left">
          <div class="flex flex-wrap md:w-11/12 mx-auto">
            <div class="w-full p-4 text-lg text-gray-700 leading-relaxed">
              As many of you noticed, Singlelink experienced an extended outage yesterday as a result of our service provider MongoDB Atlas failing to throttle another user properly on our shared database, leading to a rare cluster-wide crash that proved inoperable by several members staff for over 12 hours, despite it's critical status.<br/><br/>

              Despite this, our team worked ruthlessly hard throughout the night and was able to finally obtain access to a backup after several hours and perform a manual restore onto an alternate service provider, being our trusted partners at <a href="https://digitalocean.com" class="font-medium text-indigo-600 hover:underline">DigitalOcean.</a><br/><br/>

              Moving forward, we're increasing our efforts to maintain our existing software and ensure it's reliability through extended testing, <a href="https://status.singlelink.co" class="font-medium text-indigo-600 hover:underline">improved public monitoring</a>, as well as eliminating tech-debt in the stack to prevent future reoccurances. Alongside this, all of our database operations have been moved from our previous service provider to our new provider, <a href="https://digitalocean.com" class="font-medium text-indigo-600 hover:underline">DigitalOcean</a>, effective immediately on Thursday, October 29th, 2020.<br/><br/>

              We're extremely apologetic for any disruptions this might have cost, as we know many of you depend on Singlelink - and we would hate to lose your trust. We were able to mitigate data-loss, however, we're certain some of you may have been effected in unpredictable ways.<br/><br/>

              In the event that any of you need help with your profile or want to discuss last-night's event or how we're preventing outages moving forward, my inbox is open and I've listed my phone number below for you to call with your questions & concerns.<br/><br/>

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
      title: 'Outage report - 10/29/20 - Singlelink',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Outage report - 10/29/20 - Singlelink'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Learn more about our latest outage and what we\'re doing to mitigate events like these in the future.'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'article'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Outage report - 10/29/20 - Singlelink'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Learn more about our latest outage and what we\'re doing to mitigate events like these in the future.'
        },
        {
          hid: 'twitter:type',
          name: 'twitter:type',
          content: 'article'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Learn more about our latest outage and what we\'re doing to mitigate events like these in the future.'
        },

      ],
    }
  };
</script>
