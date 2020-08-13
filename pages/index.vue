<template>
  <div class="flex flex-col items-center justify-center bg-gray-50 min-h-screen">
    <section class="flex items-center justify-center flex-col mt-auto w-screen">
      <img src="/Icon.svg"/>
      <h1 class="font-semibold text-3xl mt-2">Sign in to your account</h1>
      <p class="text-gray-700 text-sm">Or, <a class="text-indigo-600 hover:text-indigo-700" href="#">create your new account for free</a></p>
      <form class="w-11/12 max-w-sm mt-4 p-6 bg-white rounded-md shadow-md flex-col">
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Email Address</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-sm border" type="email" placeholder="e.g. jane@gmail.com"/>
        </div>
        <div class="flex flex-col mb-4">
          <label class="font-medium text-sm">Password</label>
          <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-sm border" type="password" placeholder="e.g. your password"/>
        </div>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember_me" type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out">
            <label for="remember_me" class="ml-2 block text-sm leading-5 text-gray-900">
              Remember me
            </label>
          </div>
          <div class="text-sm leading-5">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Forgot your password?
            </a>
          </div>
        </div>

        <button class="mt-2 w-full p-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-sm font-semibold">Login</button>
      </form>
    </section>
    <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.</br>Copyright ©2020 Neutron Creative Inc.</section>
  </div>
</template>

<style lang="sass">
  .NeutronLogo
    width: 180px
</style>
