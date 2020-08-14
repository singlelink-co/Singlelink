<template>
  <div class="flex w-11/12 min-h-screen bg-gray-100 justify-center">
    <section class="flex flex-col p-8 items-center text-center max-w-md">
      <img class="nc-avatar mb-2" src="https://uifaces.co/our-content/donated/rSuiu_Hr.jpg"/>
      <h1 class="text-gray-800 font-semibold text-2xl">Lyle Kauffman</h1>
      <h3 class="text-gray-600 mb-4">Stanford alumni, currently building FundHippo</h3>
      <div class="nc-link">
        🔥<span class="ml-2">Get FundHippo</span>
      </div>
      <div class="nc-link">
         🗓<span class="ml-2">My Calendar</span>
      </div>
      <div class="nc-link">
        🏡<span class="ml-2">My Website</span>
      </div>
    </section>
  </div>
</template>

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
