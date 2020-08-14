<template>
  <div class="flex flex-row w-screen h-screen">
    <section class="flex flex-col w-px items-center p-3 border border-t-0 border-b-0 border-l-0" style="width: 70px; max-width: 70px;">
      <img src="/Icon.svg" class="mb-auto" style="width: 35px;"/>
      <img style="width: 100%; border-radius: 100px; cursor: pointer;" src="https://uifaces.co/our-content/donated/rSuiu_Hr.jpg"/>
    </section>
    <section class="flex flex-col flex-grow">
      <div class="flex flex-row border border-r-0 border-t-0 border-l-0 w-full">
        <n-link to="/dashboard">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard')">
            Blocks
          </div>
        </n-link>
        <n-link to="/dashboard/appearance">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard-appearance')">
            Appearance
          </div>
        </n-link>
        <n-link to="/dashboard/settings">
          <div class="p-4 pl-6 pr-6 cursor-pointer text-sm" :class="get_active_styles('dashboard-settings')">
            Settings
          </div>
        </n-link>
      </div>
      <Nuxt/>
    </section>
    <section class="flex flex-col w-4/12 items-center justify-center border boder-t-0 border-b-0 border-r-0 bg-gray-100">
      <div class="flex flex-row border border-r-0 border-t-0 border-l-0 w-full items-center justify-center mb-auto bg-white" style="height: 57px;">
        <p class="font-medium mr-2 text-gray-800">Your Singlelink:</p>
        <a class="text-indigo-600 hover:text-indigo-700 hover:underline" href="https://singlelink.co/u/jimbisenius/">https://singlelink.co/u/jimbisenius/</a>
      </div>
      <div class="phone-display">
        <iframe src="http://localhost:8080/u/i-write-garbage-code"></iframe>
      </div>
    </section>
  </div>
</template>

<style>
html {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  line-height: 1.65;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

</style>

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

<script>
  export default {
    data: () => {
      return {
        active: 'dashboard'
      };
    },
    methods: {
      get_active_styles (page) {
        if(page == this.active) return "text-indigo-600 bg-indigo-100 font-semibold border border-r-0 border-t-0 border-l-0 border-b-2 border-indigo-600";
        return "hover:bg-indigo-100 hover:text-indigo-600 text-gray-700 nc-item-link";
      },
      set_active () {
        try {
          switch (this.$route.name) {
            case "dashboard":
              this.active = "dashboard";
              break;
            case "dashboard-appearance":
              this.active = "dashboard-appearance";
              break;
            case "dashboard-settings":
              this.active = "dashboard-settings";
              break;
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    mounted: function() {
      this.set_active();
    },
    watch: {
      $route () {
        console.log('route changed', this.$route);
        this.set_active();
      }
    },
  };
</script>

<style lang="sass" scoped>
  .nc-item-link:hover
    border-bottom: solid 2px rgba(235, 244, 255, var(--bg-opacity))

</style>
