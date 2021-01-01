<template>
  <div>
    <transition name="fade">
      <div
        v-if="consentBannerActive"
        class="consent-banner"
      >
        <p class="text-gray-600 text-lg">
          By using Singlelink, you agree to our <a href="/privacy-policy" target="_blank" style="color: #5353EC">Privacy
          Policy</a>.
        </p>
        <br>

        <button
          type="button"
          class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
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
    };
  },

  mounted() {
    if (this.$route.fullPath.includes("privacy-policy")) {
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
  padding: 5px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
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
