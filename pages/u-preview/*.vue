<template>
  <div class="flex min-h-screen w-screen bg-gray-100 justify-center w-full">
    <section class="flex flex-col p-6 pt-8 pb-8 items-center text-center max-w-sm w-full">
      <img class="nc-avatar mb-2" v-if="profile.image_url || user.avatar_url || user.hash" :src="profile.image_url || user.avatar_url || 'https://www.gravatar.com/avatar/' + user.hash"/>
      <h1 class="text-gray-800 font-semibold text-2xl">{{ profile.headline || user.name }}</h1>
      <h3 class="text-gray-600 mb-4">{{ profile.subtitle }}</h3>
      <a :href="link.url" v-for="link in links" class="w-full">
        <div class="nc-link">
          <span class="font-medium text-gray-900">{{ link.label }}</span>
        </div>
      </a>
      <style type="text/css" v-if="profile.custom_css">{{ profile.custom_css }}</style>
    </section>
  </div>
</template>

<script>
  export default {
    middleware: 'authenticated',
    data: function() {
      return {
        profile: {
          custom_css: null,
          image_url: null,
          headline: null,
          subtitle: null,
          parent: {
            name: null,
            hash: null
          }
        },
        user: {
          name: null,
          hash: null,
          avatar_url: null
        },
        links: null,
        failed: false
      };
    },
    mounted: function() {
      this.$axios.$post('/profile/fetch-preview', {
        token: this.$store.getters['auth/get_token']
      })
      .then((response) => {
        console.log('Profile fetched successfully');
        console.log(response);
        this.profile = response.profile;
        this.links = response.links.sort(function (a, b) {
          return a.order - b.order;
        });
        this.user = response.user;
      })
      .catch((error) => {
        console.log('Error fetching profile');
        console.log(error);
        this.failed = true;
      });
    }
  };
</script>

<style lang="sass" scoped>
  .nc-avatar
    width: 60px
    height: 60px
    border-radius: 1000px

  .nc-link
    @apply rounded shadow bg-white p-4 w-full font-medium mb-3
    cursor: pointer
    transition: .15s ease-in-out
    &:hover
      transform: scale(1.02)
    &:active
      transform: scale(1)

</style>
