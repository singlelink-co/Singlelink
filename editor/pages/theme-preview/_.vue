<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <UserProfileView
        :themePreview="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UserProfileView from "~/components/profile/UserProfileView.vue";

export default Vue.extend({
  name: 'ThemePreview',
  components: {
    UserProfileView
  },


});
</script>

<style lang="scss" scoped>

.nc-avatar {
  width: 60px;
  height: 60px;
  border-radius: 1000px;

  .nc-link {
    cursor: pointer;
    transition: .15s ease-in-out;
    overflow: hidden;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1);
  }
}

</style>
