<template>
  <div>
    <transition name="fade">
      <div
        v-if="consentBannerActive"
        class="consent-banner"
      >
        <p class="text-gray-600 text-sm">
          By using {{ app_name }}, you agree to our <a class="text-indigo-600 hover:underline" href="/privacy-policy" target="_blank">Privacy
          Policy</a>.
        </p>
        <br>

        <button
          type="button"
          class="flex px-3 py-1 text-sm ml-auto text-white text-center bg-indigo-600 hover:bg-indigo-500 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
          @click="consentToPolicy"
        >
          I accept
        </button>

      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GDPRConsentPopup",

  data() {
    return {
      consentBannerActive: false,
      app_name: process.env.APP_NAME,
    };
  },

  mounted() {
    if (this.$route.fullPath.includes("privacy-policy") ||
      this.$route.fullPath.includes("/u/") ||
      this.$route.fullPath.includes("/u-preview/")) {
      return;
    }

    const gdprConsent = localStorage.getItem("gdpr_consent");

    if (!gdprConsent) {
      this.consentBannerActive = true;
    }
  },

  methods: {
    consentToPolicy() {
      localStorage.setItem("gdpr_consent", "true");

      this.consentBannerActive = false;
    }
  }
});
</script>

<style lang="scss">
.consent-banner {
  position: fixed;
  bottom: 80px;
  left: 25%;
  right: 25%;
  width: 50%;
  @apply p-2 rounded shadow-lg flex items-center justify-center bg-white;
}

.close {
  height: 20px;
  background-color: #777;
  border: none;
  color: white;
  border-radius: 2px;
  cursor: pointer;
}

/**
Animations
 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
