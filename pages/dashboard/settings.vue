<template>
  <section class="flex flex-col p-8 items-center justify-center">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">Settings</h1>
    <div class="flex flex-col p-6 bg-gray-100 rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Profile details</h2>
      <form class="flex flex-col">
        <div class="flex flex-row mb-4">
          <div class="flex flex-col w-1/2 mr-4">
            <label class="font-medium text-sm text-gray-800" for="name">Full Name</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="name" type="text" placeholder="e.g. Jane Doe" v-model="name"/>
          </div>
          <div class="flex flex-col w-1/2">
            <label class="font-medium text-sm text-gray-800" for="email">Email Address</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="email" type="email" placeholder="e.g. jane@gmail.com" v-model="email"/>
          </div>
        </div>
        <button type="button" @click="attempt_login" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">Save changes</button>
      </form>
    </div>
    <div class="flex flex-col p-6 bg-gray-100 rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Account management</h2>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'dashboard'
};
</script>
