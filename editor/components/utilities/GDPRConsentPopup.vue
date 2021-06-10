<template>
  <div>
    <transition name="fade">
      <div
        v-if="consentBannerActive"
        class="consent-banner"
      >
        <p class="text-black font-bold">
          <span class="opacity-70">By using {{ app_name }}, you agree to our </span><a class="text-gdp hover:underline" href="/privacy-policy" target="_blank">Privacy
          Policy</a>.
        </p>
        <br>

        <button
          type="button"
          class="flex px-3 py-1 text-sm ml-auto text-white text-center bg-gdp hover:bg-indigo-500 rounded-2xl font-bold w-auto max-w-xs justify-center align-center"
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

<style lang="scss" scoped>
.consent-banner {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  @apply p-2 px-4 rounded-2xl shadow-lg flex items-center justify-center bg-white w-11/12 max-w-lg;
}

@media(max-width:1024px) {
  .consent-banner {
    flex-direction: column;
    @apply text-center items-center justify-center;
  }

  .consent-banner p {
    max-width: 200px;
  }

  br {
    display: none;
  }
  .consent-banner button {
    @apply w-full mt-2 mx-auto;
  }
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
