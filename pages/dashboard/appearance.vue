<template>
  <section class="flex flex-col p-8 items-center bg-gray-100 flex-grow">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">Appearance</h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Themes</h2>
      <div class="flex flex-row">
        <div class="rounded nc-theme active bg-gray-200">
          <div class="nc-inner bg-white">
            <div class="nc-bottom-inner bg-gray-600"></div>
          </div>
        </div>
        <div class="rounded nc-theme bg-indigo-500">
          <div class="nc-inner bg-white">
            <div class="nc-bottom-inner bg-gray-500"></div>
          </div>
        </div>
        <div class="rounded nc-theme bg-blue-800">
          <div class="nc-inner bg-blue-500">
            <div class="nc-bottom-inner bg-white"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Custom CSS</h2>
      <textarea rows="5" class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border" placeholder="e.g. a { color: rgba(0,0,0,.8); }" v-model="custom_css"></textarea>
      <button @click="save_changes" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">Save changes</button>
    </div>
  </section>
</template>

<style lang="sass" scoped>
  .nc-theme
    display: flex
    justify-content: center
    align-items: center
    width: 80px
    height: 80px
    margin-right: 10px

    cursor: pointer
    &.active
      box-shadow: inset 0 0 2px 2px #5353EC
    .nc-inner
      width: 40px
      height: 40px
      border-radius: 40px
      display: flex
      flex-direction: column
      overflow: hidden
      .nc-bottom-inner
        width: 100%
        height: 15px
        margin-top: auto
    &:hover
      transform: scale(1.02)
    &:active
      transform: scale(1)

</style>

<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  data: function() {
    return {
      custom_css: ''
    };
  },
  mounted: function() {
    this.fetch_user_data();
  },
  methods: {
    refresh_preview: function() {
      document.getElementById('preview-frame').src = document.getElementById('preview-frame').src;
    },
    fetch_user_data: function() {
      this.$axios.$post('/user/fetch', {
        token : this.$store.getters['auth/get_token']
      })
        .then((response) => {
          console.log('Fetched user data successfully');
          console.log(response);
          if(response.active_profile.custom_css) this.custom_css = response.active_profile.custom_css;
        })
        .catch((error) => {
          console.log('Error fetching user data');
          console.log(error);
        });
    },
    save_changes: function() {
      this.$axios.$post('/profile/update', {
        token: this.$store.getters['auth/get_token'],
        custom_css: this.custom_css
      })
        .then((response) => {
          console.log('Successfully saved changes');
          console.log(response);
          this.refresh_preview();
        })
        .catch((error) => {
          console.log('Error saving changes');
          console.log(error);
        });
    },
  }
};
</script>
