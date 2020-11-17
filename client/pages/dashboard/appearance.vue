<template>
  <section class="flex flex-col p-8 items-center bg-gray-100 flex-grow overflow-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">Appearance</h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Themes</h2>
      <div class="flex flex-row">
        <div class="rounded nc-theme bg-gray-200" @click="selectTheme(null)"
             v-bind:class="{'active': !activeTheme || activeTheme == null}">
          <div class="nc-inner bg-white">
            <div class="nc-bottom-inner bg-gray-600"></div>
          </div>
        </div>
        <div class="rounded nc-theme" v-if="themes" v-for="theme in themes"
             :style="'background:'+theme.colors.fill.primary+';'" @click="selectTheme(theme)"
             v-bind:class="{'active': activeTheme === theme.id}">
          <div class="nc-inner" :style="'background:'+theme.colors.fill.secondary+';'">
            <div class="nc-bottom-inner" :style="'background:'+theme.colors.text.primary+';'"></div>
          </div>
        </div>
        <div class="rounded nc-theme nc-add bg-gray-200" @click="openModal">
          <div class="nc-inner flex items-center justify-center">
            <span class="font-semibold text-gray-700 text-4xl">+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Custom HTML</h2>
      <textarea rows="5" class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border"
                placeholder="Place your third party scripts here (e.g. Google Analytics, Intercom, etc.)"
                v-model="customHtml"></textarea>
      <button @click="saveChanges" type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">
        Save changes
      </button>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Custom CSS</h2>
      <textarea rows="5" class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border"
                placeholder="e.g. a { color: rgba(0,0,0,.8); }" v-model="customCss"></textarea>
      <button @click="saveChanges" type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">
        Save changes
      </button>
    </div>
    <div v-if="modal" @click="closeModal"
         class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
         style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col bg-white shadow rounded overflow-hidden w-full max-w-xl">
        <div class="p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modalIntent === 'save'">Create new theme</h2>
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modalIntent === 'edit'">Edit theme</h2>
          <p class="text-gray-600 text-sm" v-if="modalIntent === 'save'">Fill out the form below to add your new
            theme.</p>
          <p class="text-gray-600 text-sm" v-if="modalIntent === 'edit'">Fill out the form below to edit & save your
            theme changes.</p>
        </div>
        <form class="p-6 pt-4 bg-gray-100 w-full">
          <div v-if="this.error"
               class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm">
            <img style="width: 12px;" src="/caution.svg">
            <div class="flex flex-col ml-2">
              {{ this.error }}
            </div>
          </div>
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="label">Label</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="label" type="text"
                   placeholder="e.g. 🌈 Colorful theme" v-model="pendingTheme.label"/>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col mb-3 mr-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="primary_fill">Primary background fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="primary_fill" type="text"
                     placeholder="e.g. #5353EC" v-model="pendingTheme.colors.fill.primary"/>
            </div>
            <div class="flex flex-col mb-3 ml-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="secondary_fill">Secondary background fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="secondary_fill"
                     type="text" placeholder="e.g. #0094DE" v-model="pendingTheme.colors.fill.secondary"/>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col mb-3 mr-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="primary_text_fill">Primary text fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="primary_text_fill"
                     type="text" placeholder="e.g. #FFFFFF" v-model="pendingTheme.colors.text.primary"/>
            </div>
            <div class="flex flex-col mb-3 ml-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="secondary_text_fill">Secondary text fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="secondary_text_fill"
                     type="text" placeholder="e.g. rgba(255,255,255,.75)" v-model="pendingTheme.colors.text.secondary"/>
            </div>
          </div>
        </form>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
             v-if="modalIntent === 'save'">
          <button @click="saveTheme(true)" type="button"
                  class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">
            Save and add theme
          </button>
          <button @click="saveTheme(false)" type="button"
                  class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center">
            Save theme and continue
          </button>
        </div>
        <!--        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"-->
        <!--             v-if="modalIntent === 'edit'">-->
        <!--          <button @click="saveLinkChanges" type="button"-->
        <!--                  class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">-->
        <!--            Save changes-->
        <!--          </button>-->
        <!--          <button @click="deleteLink" type="button"-->
        <!--                  class="inline-flex p-3 text-sm text-white text-center bg-red-500 hover:bg-red-600 rounded font-semibold w-auto max-w-xs justify-center align-center">-->
        <!--            Delete link-->
        <!--          </button>-->
        <!--        </div>-->
      </div>
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

  cursor: pointer

  &.active
    box-shadow: inset 0 0 2px 2px #5353EC

  .nc-inner
    width: 40px
    height: 40px
    border-radius: 40px
    display: flex
    flex-direction: column
    overflow: hidden

    .nc-bottom-inner
      width: 100%
      height: 15px
      margin-top: auto

  &:hover
    transform: scale(1.02)

  &:active
    transform: scale(1)

</style>

<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  data: function () {
    return {
      error: null,
      themes: [],
      activeTheme: null,
      customCss: '',
      customHtml: '',
      modal: false,
      modalIntent: 'save',
      pendingTheme: {
        label: '',
        colors: {
          fill: {
            primary: '',
            secondary: ''
          },
          text: {
            primary: '',
            secondary: ''
          }
        }
      }
    };
  },
  mounted: function () {
    this.fetchUserData();
    this.loadThemes();
  },
  methods: {
    selectTheme: function (theme) {
      if (!theme) theme = {id: null};
      this.$axios.$post('/profile/activate-theme', {
        token: this.$store.getters['auth/getToken'],
        theme: theme.id,
      })
        .then((response) => {
          this.activeTheme = response.theme;
          this.refreshPreview();
        })
        .catch((error) => {
          console.log('Failed to activate theme');
          console.log(error);
        });
    },
    loadThemes: function () {
      this.$axios.$post('/theme/fetch', {
        token: this.$store.getters['auth/getToken']
      })
        .then((response) => {
          this.themes = response;

        })
        .catch((error) => {
          //this.error = 'Failed to fetch themes';
          console.log('Failed to fetch themes');
          console.log(error);
        });
    },
    saveTheme: function (close) {
      this.$axios.$post('/theme/create', {
        token: this.$store.getters['auth/getToken'],
        label: this.pendingTheme.label,
        colors: {
          fill: {
            primary: this.pendingTheme.colors.fill.primary || 'rgba(255,255,255,1)',
            secondary: this.pendingTheme.colors.fill.secondary || 'rgba(255,255,255,.85)'
          },
          text: {
            primary: this.pendingTheme.colors.text.primary || 'rgba(0,0,0,1)',
            secondary: this.pendingTheme.colors.text.secondary || 'rgba(0,0,0,.85)'
          }
        }
      })
        .then((response) => {
          this.themes.push(response);
          if (close) return this.closeModal();
          this.setPending(null);
          this.refreshPreview();
        })
        .catch((error) => {
          this.error = 'Failed to create theme';
          console.log('Failed to create theme');
          this.error = error;
        });
    },
    setPending: function (theme) {
      if (theme === null) return this.pendingTheme = {
        label: '',
        colors: {
          fill: {
            primary: '',
            secondary: ''
          },
          text: {
            primary: '',
            secondary: ''
          }
        }
      };
      return this.pendingTheme = theme;
    },
    openModal: function () {
      this.setPending(null);
      return this.modal = true;
    },
    closeModal: function () {
      this.setPending(null);
      return this.modal = false;
    },
    refreshPreview: function () {
      document.getElementById('preview-frame').window.location.reload();
    },
    fetchUserData: function () {
      this.$axios.$post('/user/fetch', {
        token: this.$store.getters['auth/getToken']
      })
        .then((response) => {
          if (response.activeProfile.theme) this.activeTheme = response.activeProfile.theme;
          if (response.activeProfile.customCss) this.customCss = response.activeProfile.customCss;
          if (response.activeProfile.customHtml) this.customHtml = response.activeProfile.customHtml;
        })
        .catch((error) => {
          console.log('Error fetching user data');
          console.log(error);
        });
    },
    saveChanges: function () {
      this.$axios.$post('/profile/update', {
        token: this.$store.getters['auth/getToken'],
        customCss: this.customCss,
        customHtml: this.customHtml
      })
        .then((response) => {
          this.refreshPreview();
        })
        .catch((error) => {
          console.log('Error saving changes');
          console.log(error);
        });
    },
  }
};
</script>
