<template>

</template>
<script>
export default {
  mounted: function () {
    this.$store.commit('auth/logout');
    this.$router.push('/');
  }
};
</script>
