<template>
  <section class="flex flex-col p-8 items-start overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-start justify-start space-x-4">
      <h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
        Appearance
      </h1>
    </div>
    <!--<p class="font-bold text-black opacity-70 text-xl mt-2">This page isn't ready yet. Check back soon for more updates!</p>-->

    <div class="flex flex-col p-6 bg-white shadow rounded-xl w-full mb-8 mt-4">
      <div
        class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2"
      >
        <h2 class="text-gray-800 font-semibold text-lg">
          Customization
        </h2>
        <a
          href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432"
          class="text-gray-500 text-xs hover:underline hover:text-gray-600"
        >Need help? Read our documentation</a>
      </div>
      <builder v-if="builderCssLoaded" v-model="builderCss"/>
      <button
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-gdp hover:bg-indigo-700 rounded-xl font-semibold w-auto max-w-xs justify-center align-center"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>

    <div class="flex lg:hidden flex-col p-4 bg-orange-200 border border-orange-600 rounded-xl w-full mb-8">
              <span class="text-orange-500 text-sm text-center mx-auto w-full">
                View on desktop to edit custom HTML & CSS
              </span>
    </div>
    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-xl w-full mb-8">
      <div
        class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2"
      >
        <h2 class="text-gray-800 font-semibold text-lg">
          Custom HTML
        </h2>
        <a
          href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432"
          target="_blank"
          class="text-gray-500 text-xs hover:underline hover:text-gray-600"
        >Need help? Read our
          documentation</a>
      </div>
      <MonacoEditor
        v-model="customHtml"
        height="350"
        language="html"
        theme="vs-dark"
        :options="{
                  extraEditorClassName: 'rounded overflow-hidden mb-2',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (modalIntent === 'view'),
                }"
      />
      <button
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-gdp hover:bg-indigo-700 rounded-xl font-semibold w-auto max-w-xs justify-center align-center"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>

    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-xl w-full">
      <div
        class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2"
      >
        <h2 class="text-gray-800 font-semibold text-lg">
          Custom CSS
        </h2>
        <a
          href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432"
          target="_blank"
          class="text-gray-500 text-xs hover:underline hover:text-gray-600"
        >Need help? Read our
          documentation</a>
      </div>
      <MonacoEditor
        v-model="editorCss"
        height="350"
        language="css"
        theme="vs-dark"
        :options="{
                  extraEditorClassName: 'rounded overflow-hidden',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (modalIntent === 'view'),
                }"
      />
      <button
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-gdp hover:bg-indigo-700 rounded-xl font-semibold w-auto max-w-xs justify-center align-center"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>

    <!-- Your Themes-->
    <div class="flex flex-col p-6 bg-white shadow rounded-xl w-full mt-8 mb-8">
      <theme-list
        :active="activeThemeId"
        name="Your themes"
        :cols="2"
        :themes="themes"
        :extended="false"
        icon="edit"
      />
      <a
        type="button"
        class="inline-flex mt-4 p-3 text-sm text-white text-center bg-gdp hover:bg-indigo-700 rounded-xl font-semibold w-auto max-w-xs justify-center align-center"
        href="/dashboard/appearance/theme/create"
      >
        Create new theme
      </a>

    </div>

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import builder from "~/components/no-code/builder.vue";

type ThemeModalIntent = "create" | "edit" | "view";

export default Vue.extend({
  name: 'DashboardAppearance',
  components: {
    builder
  },
  layout: 'dashboard',
  middleware: 'authenticated',

  data() {
    return {
      error: '',
      themes: new Array<EditorTheme>(),
      globalThemes: new Array<EditorTheme>(),
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
      } as EditorTheme,
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
  mounted() {
    this.getUserData();
    this.loadThemes();
  },
  methods: {
    async getUserData() {
      try {
        const token = this.$store.getters['auth/getToken'];
        const profileResponse = await this.$axios.$post<Profile>('/profile/active-profile', {
          token
        });
        this.activeThemeId = profileResponse.themeId ?? null;
        this.customCss = profileResponse.customCss ?? '';
        this.editorCss = this.customCss.split('/* SL-NO-CODE */')[0];
        if (this.customCss.split('/* SL-NO-CODE */').length > 1) {
          this.builderCss = this.customCss.split('/* SL-NO-CODE */')[1];
        }
        this.builderCssLoaded = true;
        this.customHtml = profileResponse.customHtml ?? '';
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
    async loadThemes() {
      try {
        // Grab themes from response
        this.themes = (await this.$axios.$post<EditorTheme[]>('/themes', {
          token: this.$store.getters['auth/getToken'],
          includeGlobal: false
        }));
      } catch (error) {
        console.log('Failed to get themes');
        console.log(error);
      }
    },
    setPending(theme: EditorTheme | null) {
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
    async saveChanges() {
      try {
        // console.log('Builder CSS');
        // console.log(this.builderCss);
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

    getNewTheme(): EditorTheme {
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
  },
});
</script>
