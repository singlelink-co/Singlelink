<template>
  <div>
    Logging in... please wait. <br>
    You will be redirected shortly.
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'RedirectLogin',

  mounted() {
    // determine how we're going to login
    const service: "Google" | undefined = this.$route.query['service'] as "Google" | undefined;
    const requestToken = this.$route.query['requestToken'] as string;

    this.handleRequestToken(requestToken, service);
  },

  methods: {
    async handleRequestToken(requestToken: string, service: "Google" | null | undefined) {
      switch (service) {
        case "Google": {
          const response = await this.$axios.post<{ activeProfile: Profile, token: string, user: { id: string, email: string } }>(
            '/auth/google/login',
            {
              requestToken
            });

          const message = response.data;

          this.$store.commit('auth/login', message.token);
          localStorage.setItem("email", response.data.user.email);

          await this.$router.push('/dashboard');
          return;
        }

        default:
          console.log("Unknown auth service type.");
          await this.$router.push('/');
      }
    }
  }
});
</script>
