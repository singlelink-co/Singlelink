<template>
  <section class="flex flex-col p-8 items-center bg-gray-100 flex-grow">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">Appearance</h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Themes</h2>
      <div class="flex flex-row">
        <div class="rounded nc-theme active">
          <div class="nc-inner">
            <div class="nc-bottom-inner"></div>
          </div>
        </div>
        <div class="rounded nc-theme">
          <div class="nc-inner">
            <div class="nc-bottom-inner"></div>
          </div>
        </div>
        <div class="rounded nc-theme">
          <div class="nc-inner">
            <div class="nc-bottom-inner"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Custom CSS</h2>
      <textarea rows="5" class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" placeholder="e.g. a { color: rgba(0,0,0,.8); }"></textarea>
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
    background: rgba(0,0,0,.15)
    cursor: pointer
    &.active
      box-shadow: inset 0 0 2px 2px #5353EC
    .nc-inner
      width: 40px
      height: 40px
      border-radius: 40px
      background: rgba(0,0,0,.15)
      display: flex
      flex-direction: column
      overflow: hidden
      .nc-bottom-inner
        width: 100%
        height: 15px
        background: rgba(0,0,0,.15)
        margin-top: auto
    &:hover
      transform: scale(1.02)
    &:active
      transform: scale(1)

</style>

<script>
export default {
  layout: 'dashboard'
};
</script>
