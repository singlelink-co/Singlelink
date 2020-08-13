<template>
  <div class="flex flex-row w-screen h-screen">
    <section class="flex flex-col w-px items-center p-3 border border-t-0 border-b-0 border-l-0" style="width: 70px;">
      <img src="/Icon.svg" style="width: 40px;"/>
    </section>
    <section class="flex flex-col flex-grow">
      <div class="flex flex-row border border-r-0 border-t-0 border-l-0 w-full">
        <div class="p-4 pl-6 pr-6 bg-indigo-100 cursor-pointer text-indigo-600 font-semibold text-sm border border-r-0 border-t-0 border-l-0 border-b-2 border-indigo-600">
          Blocks
        </div>
        <div class="p-4 pl-6 pr-6 hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer text-gray-700 text-sm">
          Appearance
        </div>
        <div class="p-4 pl-6 pr-6 hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer text-gray-700 text-sm">
          Settings
        </div>
      </div>
    </section>
    <section class="flex flex-col w-4/12 items-center justify-center border boder-t-0 border-b-0 border-r-0">
      <div class="flex flex-row border border-r-0 border-t-0 border-l-0 w-full items-center justify-center mb-auto" style="height: 58px;">
        <p class="font-medium mr-2 text-gray-800">Your Singlelink:</p>
        <a class="text-indigo-600 hover:text-indigo-700 hover:underline" href="https://singlelink.co/u/jimbisenius/">https://singlelink.co/u/jimbisenius/</a>
      </div>
      <div class="phone-display">
        <iframe src="https://singlelink.co/u/jimbisenius?bypass_warning=true"></iframe>
      </div>
    </section>
  </div>
</template>

<style lang="sass" scoped>
  .phone-display
    display: flex
    margin: 20px auto auto auto
    border-radius: 50px
    background: #000
    padding: 14px
    width: 280px
    height: 606px
  .phone-display > iframe
    border: none
    width: 100%
    height: 100%
    border-radius: 35px
</style>
