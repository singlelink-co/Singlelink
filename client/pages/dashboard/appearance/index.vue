<template>
  <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
    <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl w-full mb-4">
      Appearance
    </h1>

    <!-- Your Themes-->
    <div class="flex flex-col p-6 bg-white shadow rounded-lg w-full mb-8">
      <theme-list :active="activeThemeId" name="Your themes" :themes="themes" :extended="false" icon="edit"/>
      <a
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
        href="/dashboard/appearance/theme/create">
        Create new theme
      </a>

    </div>

    
    <div class="flex flex-col p-6 bg-white shadow rounded-lg w-full mb-8">
      <div class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2">
        <h2 class="text-gray-800 font-semibold text-lg">
          Customization
        </h2>
        <a href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432" class="text-gray-500 text-xs hover:underline hover:text-gray-600">Need help? Read our documentation</a>
      </div>
      <builder v-if="builderCssLoaded" v-model="builderCss"/>
      <button
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>
    
    <div class="flex lg:hidden flex-col p-4 bg-orange-200 border border-orange-600 rounded-lg w-full mb-8">
              <span class="text-orange-500 text-sm text-center mx-auto w-full">
                View on desktop to edit custom HTML & CSS
              </span>
            </div>
    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full mb-8">
      <div class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2">
        <h2 class="text-gray-800 font-semibold text-lg">
          Custom HTML
        </h2>
        <a href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432" target="_blank" class="text-gray-500 text-xs hover:underline hover:text-gray-600">Need help? Read our documentation</a>
      </div>
      <MonacoEditor
                height="350"
                language="html"
                theme="vs-dark"
                :options="{
                  extraEditorClassName: 'rounded overflow-hidden mb-2',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (modalIntent === 'view'),
                }"
                v-model="customHtml"
              ></MonacoEditor>
      <button
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>

    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full">
      <div class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2">
        <h2 class="text-gray-800 font-semibold text-lg">
          Custom CSS
        </h2>
        <a href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432" target="_blank" class="text-gray-500 text-xs hover:underline hover:text-gray-600">Need help? Read our documentation</a>
      </div>
      <MonacoEditor
                height="350"
                language="css"
                theme="vs-dark"
                :options="{
                  extraEditorClassName: 'rounded overflow-hidden',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (modalIntent === 'view'),
                }"
                v-model="editorCss"
              ></MonacoEditor>
      <button
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>

    <transition name="fade">
      <div
        v-if="modalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="closeModal"
      >
        <div class="flex flex-col bg-white shadow rounded-lg overflow-hidden w-full max-w-xl" @click.stop>
          <div class="relative p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
            <h2 v-if="modalIntent === 'view'" class="text-gray-800 font-semibold text-xl">
              Theme details
            </h2>
            <h2 v-if="modalIntent === 'create'" class="text-gray-800 font-semibold text-xl">
              Create new theme
            </h2>
            <h2 v-if="modalIntent === 'edit'" class="text-gray-800 font-semibold text-xl">
              Edit theme
            </h2>
            <p v-if="modalIntent === 'view'" class="text-gray-600 text-sm">Viewing theme details
            </p>
            <p v-if="modalIntent === 'create'" class="text-gray-600 text-sm">Fill out the form below to add your new
              theme.</p>
            <p v-if="modalIntent === 'edit'" class="text-gray-600 text-sm">Fill out the form below to edit & save your
              theme changes.</p>

            <!-- Theme preview icon-->
            <div
              :key="pendingTheme.id"
              class="rounded-lg nc-theme"
              :style="`background:${pendingTheme.colors.fill.primary}; position: absolute; top: 12px; right: 12px`"
            >
              <div class="nc-inner" :style="`background:${pendingTheme.colors.fill.secondary};`">
                <div class="nc-bottom-inner" :style="`background:${pendingTheme.colors.text.primary};`"/>
              </div>
            </div>

          </div>

          <form class="p-6 pt-4 bg-gray-100 w-full overflow-y-scroll" style="max-height:calc(100vh - 217px);">
            <div
              v-if="error"
              class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded-lg w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
            >
              <img style="width: 12px;" src="/caution.svg" alt="caution">
              <div class="flex flex-col ml-2">
                {{ error }}
              </div>
            </div>
            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="label">Label</label>
              <input
                id="label"
                v-model="pendingTheme.label"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                type="text"
                placeholder="e.g. 🌈 Colorful theme"
                :disabled="modalIntent === 'view'"
              >
            </div>
            <div class="flex flex-col lg:flex-row">
              <div class="flex flex-col mb-3 mr-3 w-full lg:w-1/2 mb-3 lg:mb-0">
                <label class="font-medium text-sm text-gray-800" for="primary_fill">Primary background fill</label>
                <input
                  id="primary_fill"
                  v-model="pendingTheme.colors.fill.primary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="text"
                  placeholder="e.g. #5353EC"
                  :disabled="modalIntent === 'view'"
                >
                <input
                  id="primary_fill_picker"
                  v-model="pendingTheme.colors.fill.primary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="color"
                  aria-label="primary fill color picker"
                  :disabled="modalIntent === 'view'"
                >
              </div>
              <div class="flex flex-col mb-3 lg:ml-3 w-full lg:w-1/2">
                <label class="font-medium text-sm text-gray-800" for="secondary_fill">Secondary background fill</label>
                <input
                  id="secondary_fill"
                  v-model="pendingTheme.colors.fill.secondary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="text"
                  placeholder="e.g. #0094DE"
                  :disabled="modalIntent === 'view'"
                >
                <input
                  id="secondary_fill_picker"
                  v-model="pendingTheme.colors.fill.secondary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="color"
                  aria-label="secondary fill color picker"
                  :disabled="modalIntent === 'view'"
                >
              </div>
            </div>

            <div class="flex flex-col lg:flex-row">
              <div class="flex flex-col mb-3 mr-3 w-full lg:w-1/2 mb-3 lg:mb-0">
                <label class="font-medium text-sm text-gray-800" for="primary_text_fill">Primary text fill</label>
                <input
                  id="primary_text_fill"
                  v-model="pendingTheme.colors.text.primary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="text"
                  placeholder="e.g. #FFFFFF"
                  :disabled="modalIntent === 'view'"
                >
                <input
                  id="primary_text_fill_picker"
                  v-model="pendingTheme.colors.text.primary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="color"
                  aria-label="primary text fill color picker"
                  :disabled="modalIntent === 'view'"
                >
              </div>
              <div class="flex flex-col mb-3 lg:ml-3 w-full lg:w-1/2">
                <label class="font-medium text-sm text-gray-800" for="secondary_text_fill">Secondary text fill</label>
                <input
                  id="secondary_text_fill"
                  v-model="pendingTheme.colors.text.secondary"
                  class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="text"
                  placeholder="e.g. rgba(255,255,255,.75)"
                  :disabled="modalIntent === 'view'"
                >
                <input
                  id="secondary_text_fill_picker"
                  v-model="pendingTheme.colors.text.secondary"
                  class="mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                  type="color"
                  aria-label="secondary text fill picker"
                  :disabled="modalIntent === 'view'"
                >
              </div>
            </div>

            <div v-if="isAdmin" class="mt-4 mb-4">
              <h1>Admin Options</h1>

              <div class="flex flex-row mt-2" style="align-items: center">
                <input
                  id="themeGlobal"
                  v-model="pendingTheme.global"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  :disabled="modalIntent === 'view'"
                >
                <label for="themeGlobal" class="ml-2 block text-md leading-5 text-gray-700">
                  Set Global
                </label>
              </div>

            </div>

            <div class="flex lg:hidden flex-col p-4 bg-orange-200 border border-orange-600 rounded-lg w-full mb-8">
              <span class="text-orange-500 text-sm text-center mx-auto w-full">
                View on desktop to edit custom HTML & CSS
              </span>
            </div>
            <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full mb-8">
              <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
                Custom HTML
              </h2>
              <MonacoEditor
                height="350"
                language="html"
                theme="vs-dark"
                :options="{
                  extraEditorClassName: 'rounded overflow-hidden',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (modalIntent === 'view'),
                }"
                v-model="pendingTheme.customHtml"
              ></MonacoEditor>
            </div>

            <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full">
              <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">
                Custom CSS
              </h2>
             <MonacoEditor
                height="350"
                language="css"
                theme="vs-dark"
                :options="{
                  extraEditorClassName: 'rounded overflow-hidden',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (modalIntent === 'view'),
                }"
                v-model="pendingTheme.customCss"
              ></MonacoEditor>
            </div>
          </form>
          <div
            v-if="modalIntent === 'create'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveCreateTheme(true)"
            >
              Save and add theme
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
              @click="saveCreateTheme(false)"
            >
              Save theme and continue
            </button>
          </div>

          <div
            v-if="modalIntent === 'edit'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveEditTheme"
            >
              Save
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-red-600 hover:bg-red-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="deleteTheme"
            >
              Delete
            </button>
          </div>

          <div
            v-if="modalIntent === 'view'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import themeList from "~/components/theme/theme-list.vue";

type ThemeModalIntent = "create" | "edit" | "view";

export default Vue.extend({
  components: { themeList },
  name: 'DashboardAppearance',
  layout: 'dashboard',
  middleware: 'authenticated',
  head: {
    title: 'Site appearance - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Design your ' + process.env.APP_NAME + ' without limits in our appearance & customization panel'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Design your ' + process.env.APP_NAME + ' without limits in our appearance & customization panel'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content:  'Site appearance - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content:  'Site appearance - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Design your ' + process.env.APP_NAME + ' without limits in our appearance & customization panel'
      },
    ],
  },
  data() {
    return {
      error: '',
      themes: new Array<Theme>(),
      globalThemes: new Array<Theme>(),
      activeThemeId: '',
      editorCss: '',
      builderCss: '',
      customCss: '',
      customHtml: '',
      modalActive: false,
      modalIntent: 'create' as ThemeModalIntent,
      pendingTheme: {
        id: '',
        label: '',
        global: false,
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
      userId: '',
      customization: {
          background: null,
          header: {
            size: null,
            color: null,
            family: null,
            weight: null,
          },
          subtitle: {
            size: null,
            color: null,
            family: null,
            weight: null
          },
          items: {
            padding: null,
            background: null,
            font: {
              size: null,
              color: null,
              family: null,
              weight: null
            },
          }
        },
      isAdmin: false,
      builderCssLoaded: false
    };
  },

  async beforeMount() {
    const permGroup = await this.$axios.$post("/admin/perm-group", {
      token: this.$store.getters['auth/getToken']
    });

    this.isAdmin = permGroup["groupName"] === 'admin';
  },

  async mounted() {
    await this.getUserData();
    await this.loadThemes();
  },

  methods: {
    async selectTheme(id: string | null) {
      try {
        const response = await this.$axios.$post<Profile>('/profile/activate-theme', {
          token: this.$store.getters['auth/getToken'],
          id,
        });

        this.activeThemeId = response.themeId;
        this.$root.$emit('refreshUserProfileView');
      } catch (error) {
        console.log('Failed to activate theme');
        console.log(error);
      }
    },

    async loadThemes() {
      try {
        // Grab themes from response
        this.themes = (await this.$axios.$post<Theme[]>('/themes', {
          token: this.$store.getters['auth/getToken'],
          includeGlobal: false
        }));

      } catch (error) {
        console.log('Failed to get themes');
        console.log(error);
      }
    },

    setPending(theme: Theme | null) {
      if (!theme) {
        this.pendingTheme = this.getNewTheme();
      } else {
        this.pendingTheme = theme;
      }
    },

    openModal(intent: ThemeModalIntent) {
      this.modalIntent = intent;
      this.modalActive = true;
    },

    closeModal() {
      this.setPending(null);
      this.modalActive = false;
    },

    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];

        const profileResponse = await this.$axios.$post<Profile>('/profile/active-profile', {
          token
        });

        this.activeThemeId = profileResponse.themeId ?? null;
        this.customCss = profileResponse.customCss ?? '';
        this.editorCss = this.customCss.split('/* SL-NO-CODE */')[0];
        if(this.customCss.split('/* SL-NO-CODE */').length > 1) {
          this.builderCss = this.customCss.split('/* SL-NO-CODE */')[1];
        }
        this.builderCssLoaded = true;
        this.customHtml = profileResponse.customHtml ?? '';
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },

    async saveChanges() {
      try {
        console.log('Builder CSS');
        console.log(this.builderCss);

        await this.$axios.$post('/profile/update', {
          token: this.$store.getters['auth/getToken'],
          customCss: this.editorCss + '/* SL-NO-CODE */' + this.builderCss,
          customHtml: this.customHtml
        });

        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log(err);
      }
    },

    getNewTheme(): Theme {
      return {
        id: '',
        label: '',
        global: false,
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
    },
  }
});
</script>

<style>

.hide-scrollbar::-webkit-scrollbar {
    width: 0px !important;
    background: transparent !important; /* make scrollbar transparent */
}

</style>

<style lang="scss" scoped>
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
