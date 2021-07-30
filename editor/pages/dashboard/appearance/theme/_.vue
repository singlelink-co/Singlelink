<template>
  <section
    class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll"
  >
    <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
      <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl">
        <span v-if="intent==='create'">Create</span><span v-if="intent==='edit'">Edit</span> theme
      </h1>
    </div>
    <div v-if="intent!=='view'" class="flex flex-col mb-4 justify-start w-full">
      <label class="font-semibold mb-2">Display name</label>
      <input
        v-model="theme.label"
        class="p-3 rounded-lg bg-white text-sm text-gray-700"
        placeholder="e.g. My beautiful theme"
        type="text"
      >
    </div>
    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full mb-6">
      <div
        class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2"
      >
        <h2 class="text-gray-800 font-semibold text-lg">
          Customization
        </h2>
        <a
          href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432"
          target="_blank"
          class="text-gray-500 text-xs hover:underline hover:text-gray-600"
        >Need help? Read our documentation</a>
      </div>
      <builder v-if="builderLoaded" v-model="builderCss"/>
    </div>
    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full mb-6">
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
        >Need help? Read our documentation</a>
      </div>
      <MonacoEditor
        v-model="theme.customHtml"
        height="350"
        language="html"
        theme="vs-dark"
        :options="{
                    extraEditorClassName: 'rounded overflow-hidden mb-2',
                    autoIndent: 'full',
                    autoClosingQuotes: true,
                    }"
      />
    </div>
    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full">
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
        >Need help? Read our documentation</a>
      </div>
      <MonacoEditor
        v-model="editorCss"
        height="350"
        language="css"
        theme="vs-dark"
        :options="{
                  extraEditorClassName: 'rounded overflow-hidden mb-2',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                }"
      />
    </div>

    <div class="flex flex-col lg:flex-row items-center justify-start w-full mt-4">
      <div
        v-if="intent==='create'"
        class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
        @click="saveCreateTheme"
      >
        Create theme
      </div>
      <div
        v-if="intent==='edit'"
        class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer"
        @click="saveEditTheme"
      >
        Save changes
      </div>
      <div
        v-if="intent==='edit'"
        class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-red-500 bg-red-600 cursor-pointer"
        @click="deleteTheme"
      >
        Delete theme
      </div>
    </div>
  </section>
</template>

<script type="ts">
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  data() {
    return {
      id: null,
      themes: [],
      builderCss: '',
      editorCss: '',
      theme: {
        label: null,
        colors: {
          fill: {
            primary: 'rgba(255,255,255,1)',
            secondary: 'rgba(255,255,255,.85)'
          },
          text: {
            primary: 'rgba(0,0,0,1)',
            secondary: 'rgba(0,0,0,.85)'
          }
        },
        customHtml: null,
        customCss: null
      },
      intent: 'edit',
      builderLoaded: false,
    };
  },
  head() {
    return {
      title: 'Theme editing - Singlelink',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex'
        }
      ]
    };
  },
  mounted() {
    this.id = this.$route.path.replace('/dashboard/appearance/theme/', '');
    if (this.id !== 'create') {
      this.loadThemes();
    } else {
      this.intent = 'create';
      this.builderLoaded = true;
    }
  },
  methods: {
    async loadThemes() {
      try {
        // Grab themes from response
        this.themes = await this.$axios.$post('/themes', {
          token: this.$store.getters['auth/getToken'],
          includeGlobal: false
        });
        for (let i = 0; i < this.themes.length; i++) {
          if (this.themes[i].id === this.id) {
            this.theme = this.themes[i];
            if (!this.theme.colors) {
              this.theme.colors = {
                fill: {
                  primary: 'rgba(255,255,255,1)',
                  secondary: 'rgba(255,255,255,.85)'
                },
                text: {
                  primary: 'rgba(0,0,0,1)',
                  secondary: 'rgba(0,0,0,.85)'
                }
              };
            }
            this.editorCss = this.theme.customCss.split('/* SL-NO-CODE */')[0];
            if (this.theme.customCss.split('/* SL-NO-CODE */').length > 1) {
              this.builderCss = this.theme.customCss.split('/* SL-NO-CODE */')[1];
              this.builderLoaded = true;
            } else {
              this.builderLoaded = true;
            }
          }
        }

        // console.log(this.themes);
      } catch (error) {
        console.log('Failed to get themes');
        console.log(error);
      }
    },
    async saveCreateTheme() {
      try {
        const response = await this.$axios.$post('/theme/create', {
          token: this.$store.getters['auth/getToken'],
          label: this.theme.label,
          colors: {
            fill: {
              primary: this.theme.colors.fill.primary ?? 'rgba(255,255,255,1)',
              secondary: this.theme.colors.fill.secondary ?? 'rgba(255,255,255,.85)'
            },
            text: {
              primary: this.theme.colors.text.primary ?? 'rgba(0,0,0,1)',
              secondary: this.theme.colors.text.secondary ?? 'rgba(0,0,0,.85)'
            }
          },
          customCss: this.editorCss + '/* SL-NO-CODE */' + this.builderCss,
          customHtml: this.theme.customHtml,
        });
        /* if (close) {
            this.closeModal();
            return;
        } */
        // console.log('Created');
        // console.log(response);
        window.location.href = '/dashboard/appearance/theme/' + response.id;
      } catch (error) {
        this.error = 'Failed to create theme';
        console.log('Failed to create theme');
      }
    },
    async saveEditTheme() {
      try {
        const response = await this.$axios.$post('/theme/update', {
          token: this.$store.getters['auth/getToken'],
          id: this.theme.id,
          label: this.theme.label,
          colors: {
            fill: {
              primary: this.theme.colors.fill.primary ?? 'rgba(255,255,255,1)',
              secondary: this.theme.colors.fill.secondary ?? 'rgba(255,255,255,.85)'
            },
            text: {
              primary: this.theme.colors.text.primary ?? 'rgba(0,0,0,1)',
              secondary: this.theme.colors.text.secondary ?? 'rgba(0,0,0,.85)'
            }
          },
          customCss: this.editorCss + '/* SL-NO-CODE */' + this.builderCss,
          customHtml: this.theme.customHtml,
        });
        /* const themeId = response.id;
        const index = this.themes.findIndex(x => x.id === themeId);
        this.themes[index] = this.theme;
        if (this.theme.global) {
            const token = this.$store.getters['auth/getToken'];
            await this.$axios.$post('theme/admin/set-global', {
                token,
                id: response.id,
                global: this.theme.global
            });
        } */
        window.location.reload();
        return;
      } catch (error) {
        console.log(error);
        this.error = 'Failed to edit theme';
        console.log('Failed to edit theme');
      }
    },
    async deleteTheme() {
      try {
        const response = await this.$axios.$post('/theme/delete', {
          token: this.$store.getters['auth/getToken'],
          id: this.theme.id,
        });
        const themeId = response.id;
        const index = this.themes.findIndex(x => x.id === themeId);
        this.themes.splice(index, 1);
        this.closeModal();
        window.location.href = '/dashboard/appearance/';
        return;
      } catch (error) {
        this.error = 'Failed to create theme';
        console.log('Failed to create theme');
      }
    },
  }
};
</script>
