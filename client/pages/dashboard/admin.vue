<template>
  <section class="flex flex-col p-8 items-center flex-grow bg-gray-100 overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">
      Admin Dashboard
    </h1>

    <!-- Global Themes-->
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <transition name="fade">
        <div
          v-if="themeError"
          class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
        >
          <img style="width: 12px;" src="/caution.svg" alt="caution">
          <div class="flex flex-col ml-2">
            {{ themeError }}
          </div>
        </div>
      </transition>

      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
        Global Themes
      </h2>

      <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">

        <div class="flex flex-row overflow-x-scroll hide-scrollbar">
          <div
            class="rounded nc-theme bg-gray-200"
            @click="selectTheme(null)"
            style="min-width:78px;min-height:80px;"
          >
            <div class="nc-inner bg-white">
              <div class="nc-bottom-inner bg-gray-600"/>
            </div>
          </div>

          <div
            v-for="theme in themes"
            v-if="themes"
            :key="theme.id"
            class="rounded nc-theme"
            :style="`background:${theme.colors.fill.primary}; position: relative;min-width:78px;min-height:80px;`"
            @click="selectTheme(theme.id)"
          >
            <i
              class="fas fa-pencil-alt edit-icon"
              @click.stop="openThemeModal('edit'); pendingTheme=theme;"
            />
            <div class="nc-inner" :style="`background:${theme.colors.fill.secondary};`">
              <div class="nc-bottom-inner" :style="`background:${theme.colors.text.primary};`"/>
            </div>
          </div>

          <div class="rounded nc-theme nc-add bg-gray-200" @click="openThemeModal('create')">
            <div class="nc-inner flex items-center justify-center">
              <span class="font-semibold text-gray-700 text-4xl">+</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <transition name="fade">
      <div
        v-if="themeModalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="closeThemeModal"
      >
        <div class="flex flex-col bg-white shadow rounded overflow-hidden w-full max-w-xl" @click.stop>
          <div class="relative p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
            <h2 v-if="themeModalIntent === 'create'" class="text-gray-800 font-semibold text-xl">
              Create new global theme
            </h2>
            <h2 v-if="themeModalIntent === 'edit'" class="text-gray-800 font-semibold text-xl">
              Edit global theme
            </h2>
            <p v-if="themeModalIntent === 'create'" class="text-gray-600 text-sm">Fill out the form below to add a new
              global theme.</p>
            <p v-if="themeModalIntent === 'edit'" class="text-gray-600 text-sm">Fill out the form below to edit & save
              your theme changes.</p>

            <!-- Theme preview icon-->
            <div
              :key="pendingTheme.id"
              class="rounded nc-theme"
              :style="`background:${pendingTheme.colors.fill.primary}; position: absolute; top: 12px; right: 12px`"
            >
              <div class="nc-inner" :style="`background:${pendingTheme.colors.fill.secondary};`">
                <div class="nc-bottom-inner" :style="`background:${pendingTheme.colors.text.primary};`"/>
              </div>
            </div>

          </div>

          <form class="p-6 pt-4 bg-gray-100 w-full overflow-y-scroll" style="max-height:calc(100vh - 217px);">
            <div
              v-if="themeError"
              class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
            >
              <img style="width: 12px;" src="/caution.svg" alt="caution">
              <div class="flex flex-col ml-2">
                {{ themeError }}
              </div>
            </div>
            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="label">Label</label>
              <input
                id="label"
                v-model="pendingTheme.label"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                type="text"
                placeholder="e.g. 🌈 Colorful theme"
              >
            </div>
            <div class="flex flex-row">
              <div class="flex flex-col mb-3 mr-3 w-1/2">
                <label class="font-medium text-sm text-gray-800" for="primary_fill">Primary background fill</label>
                <input
                  id="primary_fill"
                  v-model="pendingTheme.colors.fill.primary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="text"
                  placeholder="e.g. #5353EC"
                >
                <input
                  id="primary_fill_picker"
                  v-model="pendingTheme.colors.fill.primary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="color"
                  aria-label="primary fill color picker"
                >
              </div>
              <div class="flex flex-col mb-3 ml-3 w-1/2">
                <label class="font-medium text-sm text-gray-800" for="secondary_fill">Secondary background fill</label>
                <input
                  id="secondary_fill"
                  v-model="pendingTheme.colors.fill.secondary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="text"
                  placeholder="e.g. #0094DE"
                >
                <input
                  id="secondary_fill_picker"
                  v-model="pendingTheme.colors.fill.secondary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="color"
                  aria-label="secondary fill color picker"
                >
              </div>
            </div>

            <div class="flex flex-row">
              <div class="flex flex-col mb-3 mr-3 w-1/2">
                <label class="font-medium text-sm text-gray-800" for="primary_text_fill">Primary text fill</label>
                <input
                  id="primary_text_fill"
                  v-model="pendingTheme.colors.text.primary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="text"
                  placeholder="e.g. #FFFFFF"
                >
                <input
                  id="primary_text_fill_picker"
                  v-model="pendingTheme.colors.text.primary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="color"
                  aria-label="primary text fill color picker"
                >
              </div>
              <div class="flex flex-col mb-3 ml-3 w-1/2">
                <label class="font-medium text-sm text-gray-800" for="secondary_text_fill">Secondary text fill</label>
                <input
                  id="secondary_text_fill"
                  v-model="pendingTheme.colors.text.secondary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="text"
                  placeholder="e.g. rgba(255,255,255,.75)"
                >
                <input
                  id="secondary_text_fill_picker"
                  v-model="pendingTheme.colors.text.secondary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded border"
                  type="color"
                  aria-label="secondary text fill picker"
                >
              </div>
            </div>

            <div class="mt-4 mb-4">
              <h1>Admin Options</h1>

              <div class="flex flex-row mt-2" style="align-items: center">
                <input
                  id="themeGlobal"
                  v-model="pendingTheme.global"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  :disabled="themeModalIntent==='create'"
                >
                <label for="themeGlobal" class="ml-2 block text-md leading-5 text-gray-700">
                  Set Global
                </label>
              </div>

            </div>

            <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
              <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
                Custom HTML
              </h2>
              <textarea
                v-model="pendingTheme.customHtml"
                rows="5"
                class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border"
                placeholder="Place your third party scripts here (e.g. Google Analytics, Intercom, etc.)"
                aria-label="Custom HTML"
              />
            </div>

            <div class="flex flex-col p-6 bg-white shadow rounded w-full">
              <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
                Custom CSS
              </h2>
              <textarea
                v-model="pendingTheme.customCss"
                rows="5"
                class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border"
                placeholder="e.g. a { color: rgba(0,0,0,.8); }"
                aria-label="Custom CSS"
              />
            </div>
          </form>
          <div
            v-if="themeModalIntent === 'create'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveCreateTheme(true)"
            >
              Save and add theme
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center"
              @click="saveCreateTheme(false)"
            >
              Save theme and continue
            </button>
          </div>

          <div
            v-if="themeModalIntent === 'edit'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveEditTheme"
            >
              Save
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-red-600 hover:bg-red-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="deleteTheme"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

type ThemeModalIntent = "create" | "edit";

export default Vue.extend({
  name: 'DashboardAdmin',
  layout: 'dashboard',
  middleware: 'authenticated',

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
      } as Theme,

      themeError: '',
      themes: new Array<Theme>(),
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
    await this.loadThemes();
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

    async selectTheme(id: string | null) {
      try {
        await this.$axios.$post<Profile>('/profile/activate-theme', {
          token: this.$store.getters['auth/getToken'],
          id,
        });

        this.$root.$emit('refreshUserProfileView');
      } catch (error) {
        console.log('Failed to activate theme');
        console.log(error);
      }
    },

    openThemeModal(intent: ThemeModalIntent) {
      this.themeModalIntent = intent;
      this.themeModalActive = true;
    },

    closeThemeModal() {
      this.setPendingTheme(null);
      this.themeModalActive = false;
    },

    async loadThemes() {
      try {
        // Grab themes from response
        this.themes = (await this.$axios.$post<Theme[]>('/themes', {
          token: this.$store.getters['auth/getToken'],
          onlyGlobal: true
        }));
      } catch (error) {
        console.log('Failed to get themes');
        console.log(error);
      }
    },

    async saveCreateTheme(close: boolean) {
      try {
        const response = await this.$axios.$post<Theme>('/theme/create', {
          token: this.$store.getters['auth/getToken'],
          label: this.pendingTheme.label,
          colors: {
            fill: {
              primary: this.pendingTheme.colors.fill.primary ?? 'rgba(255,255,255,1)',
              secondary: this.pendingTheme.colors.fill.secondary ?? 'rgba(255,255,255,.85)'
            },
            text: {
              primary: this.pendingTheme.colors.text.primary ?? 'rgba(0,0,0,1)',
              secondary: this.pendingTheme.colors.text.secondary ?? 'rgba(0,0,0,.85)'
            }
          },
          customCss: this.pendingTheme.customCss,
          customHtml: this.pendingTheme.customHtml,
        });

        response.global = true;

        this.themes.push(response);

        const token = this.$store.getters['auth/getToken'];

        await this.$axios.$post('theme/admin/set-global', {
          token,
          id: response.id,
          global: true
        });

        if (close) {
          this.closeThemeModal();
          return;
        }

        this.setPendingTheme(null);
        this.$root.$emit('refreshUserProfileView');
      } catch (error) {
        this.themeError = 'Failed to create theme';
        console.log('Failed to create theme');
      }
    },

    async saveEditTheme() {
      try {
        const response = await this.$axios.$post<Theme>('/theme/admin/update', {
          token: this.$store.getters['auth/getToken'],
          id: this.pendingTheme.id,
          label: this.pendingTheme.label,
          colors: {
            fill: {
              primary: this.pendingTheme.colors.fill.primary ?? 'rgba(255,255,255,1)',
              secondary: this.pendingTheme.colors.fill.secondary ?? 'rgba(255,255,255,.85)'
            },
            text: {
              primary: this.pendingTheme.colors.text.primary ?? 'rgba(0,0,0,1)',
              secondary: this.pendingTheme.colors.text.secondary ?? 'rgba(0,0,0,.85)'
            }
          },
          customCss: this.pendingTheme.customCss,
          customHtml: this.pendingTheme.customHtml,
        });

        const themeId = response.id;
        const index = this.themes.findIndex(x => x.id === themeId);

        this.themes[index] = this.pendingTheme;

        const token = this.$store.getters['auth/getToken'];

        await this.$axios.$post('theme/admin/set-global', {
          token,
          id: response.id,
          global: this.pendingTheme.global
        });

        if (!this.pendingTheme.global) {
          this.themes.splice(this.themes.indexOf(response), 1);
        }

        this.closeThemeModal();
        this.$root.$emit('refreshUserProfileView');

        return;
      } catch (error) {
        this.themeError = 'Failed to create theme';
        console.log('Failed to create theme');
      }
    },

    async deleteTheme() {
      try {
        const response = await this.$axios.$post<Theme>('/theme/admin/delete', {
          token: this.$store.getters['auth/getToken'],
          id: this.pendingTheme.id,
        });

        const themeId = response.id;
        const index = this.themes.findIndex(x => x.id === themeId);

        this.themes.splice(index, 1);

        this.closeThemeModal();
        this.setPendingTheme(null);
        this.$root.$emit('refreshUserProfileView');

        return;
      } catch (error) {
        this.themeError = 'Failed to create theme';
        console.log('Failed to create theme');
      }
    },

    setPendingTheme(theme: Theme | null) {
      if (!theme) {
        this.pendingTheme = this.getNewTheme();
      } else {
        this.pendingTheme = theme;
      }
    },

    getNewTheme(): Theme {
      return {
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
      };
    }
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
