<template>

</template>
<script>
export default {
  mounted() {
    this.$store.commit('auth/logout');
    this.$router.push('/');
  }
};
</script>
