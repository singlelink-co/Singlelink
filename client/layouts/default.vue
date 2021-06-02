<template>
  <div>
    <Nuxt/>

    <GDPRContentModal/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GDPRContentModal from "~/components/utilities/GDPRConsentPopup.vue";

export default Vue.extend({
  components: {GDPRContentModal}
});
</script>