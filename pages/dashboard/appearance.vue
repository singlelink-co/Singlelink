<template>
  <section class="flex flex-col p-8 items-center bg-gray-100 flex-grow overflow-scroll">
    <h1 class="text-gray-800 font-semibold text-2xl w-full mb-4">Appearance</h1>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Themes</h2>
      <div class="flex flex-row">
        <div class="rounded nc-theme bg-gray-200" @click="select_theme(null)" v-bind:class="{'active': !active_theme || active_theme == null}">
          <div class="nc-inner bg-white">
            <div class="nc-bottom-inner bg-gray-600"></div>
          </div>
        </div>
        <div class="rounded nc-theme" v-if="themes" v-for="theme in themes" :style="'background:'+theme.colors.fill.primary+';'" @click="select_theme(theme)" v-bind:class="{'active': active_theme == theme._id}">
          <div class="nc-inner" :style="'background:'+theme.colors.fill.secondary+';'">
            <div class="nc-bottom-inner"  :style="'background:'+theme.colors.text.primary+';'"></div>
          </div>
        </div>
        <div class="rounded nc-theme nc-add bg-gray-200" @click="open_modal">
          <div class="nc-inner flex items-center justify-center">
            <span class="font-semibold text-gray-700 text-4xl">+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full mb-8">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Custom HTML</h2>
      <textarea rows="5" class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border" placeholder="Place your third party scripts here (e.g. Google Analytics, Intercom, etc.)" v-model="custom_html"></textarea>
      <button @click="save_changes" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">Save changes</button>
    </div>
    <div class="flex flex-col p-6 bg-white shadow rounded w-full">
      <h2 class="text-gray-800 font-semibold text-lg w-full mb-2">Custom CSS</h2>
      <textarea rows="5" class="p-2 mt-2 mb-4 text-sm border-solid border-gray-300 rounded border" placeholder="e.g. a { color: rgba(0,0,0,.8); }" v-model="custom_css"></textarea>
      <button @click="save_changes" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center">Save changes</button>
    </div>
    <div v-if="modal" @click="close_modal" class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col bg-white shadow rounded overflow-hidden w-full max-w-xl">
        <div class="p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modal_intent == 'save'">Create new theme</h2>
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modal_intent == 'edit'">Edit theme</h2>
          <p class="text-gray-600 text-sm" v-if="modal_intent == 'save'">Fill out the form below to add your new theme.</p>
          <p class="text-gray-600 text-sm" v-if="modal_intent == 'edit'">Fill out the form below to edit & save your theme changes.</p>
        </div>
        <form class="p-6 pt-4 bg-gray-100 w-full">
          <div v-if="this.error" class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm">
            <img style="width: 12px;" src="/caution.svg">
            <div class="flex flex-col ml-2">
              {{ this.error }}
            </div>
          </div>
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="label">Label</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="label" type="text" placeholder="e.g. 🌈 Colorful theme" v-model="pending_theme.label"/>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col mb-3 mr-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="primary_fill">Primary background fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="primary_fill" type="text" placeholder="e.g. #5353EC" v-model="pending_theme.colors.fill.primary"/>
            </div>
            <div class="flex flex-col mb-3 ml-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="secondary_fill">Secondary background fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="secondary_fill" type="text" placeholder="e.g. #0094DE" v-model="pending_theme.colors.fill.secondary"/>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col mb-3 mr-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="primary_text_fill">Primary text fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="primary_text_fill" type="text" placeholder="e.g. #FFFFFF" v-model="pending_theme.colors.text.primary"/>
            </div>
            <div class="flex flex-col mb-3 ml-3 w-1/2">
              <label class="font-medium text-sm text-gray-800" for="secondary_text_fill">Secondary text fill</label>
              <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="secondary_text_fill" type="text" placeholder="e.g. rgba(255,255,255,.75)" v-model="pending_theme.colors.text.secondary"/>
            </div>
          </div>
        </form>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0" v-if="modal_intent == 'save'">
          <button @click="save_theme(true)" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">Save and add theme</button>
          <button @click="save_theme(false)" type="button" class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center">Save theme and continue</button>
        </div>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0" v-if="modal_intent == 'edit'">
          <button @click="save_link_changes" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">Save changes</button>
          <button @click="delete_link" type="button" class="inline-flex p-3 text-sm text-white text-center bg-red-500 hover:bg-red-600 rounded font-semibold w-auto max-w-xs justify-center align-center">Delete link</button>
        </div>
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
  data: function() {
    return {
      error: null,
      themes: [],
      active_theme: null,
      custom_css: '',
      custom_html: '',
      modal: false,
      modal_intent: 'save',
      pending_theme: {
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
  mounted: function() {
    this.fetch_user_data();
    this.load_themes();
  },
  methods: {
    select_theme: function(theme) {
      if(!theme) theme = {_id: null};
      this.$axios.$post('/profile/activate-theme', {
        token: this.$store.getters['auth/get_token'],
        theme: theme._id,
      })
        .then((response) => {
          console.log('Themes activated successfully');
          console.log(response);
          this.active_theme = response.theme;
          this.refresh_preview();
        })
        .catch((error) => {
          console.log('Failed to activate theme');
          console.log(error);
        });
    },
    load_themes: function() {
      this.$axios.$post('/theme/fetch', {
        token: this.$store.getters['auth/get_token']
      })
      .then((response) => {
        console.log('Themes fetched successfully');
        console.log(response);
        this.themes = response;
      })
      .catch((error) => {
        //this.error = 'Failed to fetch themes';
        console.log('Failed to fetch themes');
        console.log(error);
      });
    },
    save_theme: function(close) {
      this.$axios.$post('/theme/create', {
        token: this.$store.getters['auth/get_token'],
        label: this.pending_theme.label,
        colors: {
          fill: {
            primary: this.pending_theme.colors.fill.primary || 'rgba(255,255,255,1)',
            secondary: this.pending_theme.colors.fill.secondary || 'rgba(255,255,255,.85)'
          },
          text: {
            primary: this.pending_theme.colors.text.primary || 'rgba(0,0,0,1)',
            secondary: this.pending_theme.colors.text.secondary || 'rgba(0,0,0,.85)'
          }
        }
      })
      .then((response) => {
        console.log('Theme created successfully');
        console.log(response);
        this.themes.push(response);
        if(close) return this.close_modal();
        this.set_pending(null);
        this.refresh_preview();
      })
      .catch((error) => {
        this.error = 'Failed to create theme';
        console.log('Failed to create theme');
        this.error = error;
      });
    },
    set_pending: function(theme) {
      if(theme === null) return this.pending_theme = {
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
      return this.pending_theme = theme;
    },
    open_modal: function() {
      this.set_pending(null);
      return this.modal = true;
    },
    close_modal: function() {
      this.set_pending(null);
      return this.modal = false;
    },
    refresh_preview: function() {
      document.getElementById('preview-frame').src = document.getElementById('preview-frame').src;
    },
    fetch_user_data: function() {
      this.$axios.$post('/user/fetch', {
        token : this.$store.getters['auth/get_token']
      })
        .then((response) => {
          console.log('Fetched user data successfully');
          console.log(response);
          if(response.active_profile.theme) this.active_theme = response.active_profile.theme;
          if(response.active_profile.custom_css) this.custom_css = response.active_profile.custom_css;
          if(response.active_profile.custom_html) this.custom_html = response.active_profile.custom_html;
        })
        .catch((error) => {
          console.log('Error fetching user data');
          console.log(error);
        });
    },
    save_changes: function() {
      this.$axios.$post('/profile/update', {
        token: this.$store.getters['auth/get_token'],
        custom_css: this.custom_css,
        custom_html: this.custom_html
      })
        .then((response) => {
          console.log('Successfully saved changes');
          console.log(response);
          this.refresh_preview();
        })
        .catch((error) => {
          console.log('Error saving changes');
          console.log(error);
        });
    },
  }
};
</script>
