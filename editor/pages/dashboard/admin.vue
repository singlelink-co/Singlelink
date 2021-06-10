<template>
  <section class="flex flex-col p-8 items-center flex-grow bg-gray-100 overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl w-full mb-4">
      Admin dashboard
    </h1>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

type ThemeModalIntent = "create" | "edit";

export default Vue.extend({
  name: 'DashboardAdmin',
  layout: 'dashboard',
  middleware: 'authenticated',
  head () {
    return {
      title: 'Admin - ' + process.env.APP_NAME,
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex' }
      ]
    }
  },
  data() {
    return {
      originalHandle: '',
      user: {
        name: '',
        email: '',
        activeProfile: {
          imageUrl: '',
          headline: '',
          subtitle: '',
          handle: '',
          customDomain: '',
          visibility: ''
        }
      },
      pendingTheme: {
        id: '',
        label: '',
        global: true,
        colors: {
          fill: {
            primary: '',
            secondary: ''
          },
          text: {
            primary: '',
            secondary: ''
          }
        },
        customCss: undefined,
        customHtml: undefined,
      } as EditorTheme,

      themeError: '',
      themes: new Array<EditorTheme>(),
      themeModalActive: false,
      themeModalIntent: 'create' as ThemeModalIntent,

      isAdmin: false
    };
  },

  async beforeMount() {
    const permGroup = await this.$axios.$post("/admin/perm-group", {
      token: this.$store.getters['auth/getToken']
    });

    this.isAdmin = permGroup["groupName"] === 'admin';
  },

  async mounted() {
    //await this.loadThemes();
    await this.getUserData();
  },

  methods: {
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const userResponse = await this.$axios.$post('/user', {
          token
        });

        const profileResponse = await this.$axios.$post('/profile/active-profile', {
          token
        });

        this.user = userResponse;
        this.user.activeProfile = profileResponse;
        this.originalHandle = this.user.activeProfile.handle;
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
  }
});
</script>

<style lang="scss">
.nc-theme {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-right: 10px;
  cursor: pointer;

  &.active {
    box-shadow: inset 0 0 2px 2px #5353EC;
  }

  .nc-inner {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .edit-icon {
    position: absolute;
    top: 2px;
    right: 5px;
    color: #3e39ab;
  }

  .nc-bottom-inner {
    width: 100%;
    height: 15px;
    margin-top: auto;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1);
  }

}

/**
  Animations
 */

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
