<template>
  <div></div>
</template>
<script>
export default {
  head() {
    return {
      title: 'Analytics - ' + process.env.APP_NAME,
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex'}
      ]
    }
  },
  mounted() {
    location.href = 'https://singlelink.co/analytics';
  }
}
</script>
