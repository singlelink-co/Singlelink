<template>
    <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
        <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
            <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl"><span v-if="intent=='create'">Create</span><span v-if="intent=='edit'">Edit</span> link</h1>
        </div>
        <div class="flex flex-col mb-4 justify-start w-full" v-if="intent!='view'">
            <label class="font-semibold mb-2">Label</label>
            <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="pendingLink.label" placeholder="e.g. My beautiful theme" type="text"/>
        </div>
        <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-lg w-full mb-6">
            <div class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2">
                <h2 class="text-gray-800 font-semibold text-lg">
                Customization
                </h2>
                <a href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432" target="_blank" class="text-gray-500 text-xs hover:underline hover:text-gray-600">Need help? Read our documentation</a>
            </div>
            <builder v-if="builderLoaded" v-model="builderCss"/>
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
                  extraEditorClassName: 'rounded overflow-hidden mb-2',
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                }"
                v-model="editorCss"
        ></MonacoEditor>
        </div>
        <div class="flex flex-col lg:flex-row items-center justify-start w-full mt-4">
            <div v-if="intent=='create'" @click="saveCreateTheme" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Create link</div>
            <div v-if="intent=='edit'" @click="saveEditTheme" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Save changes</div>
            <div v-if="intent=='edit'" @click="deleteTheme" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-red-500 bg-red-600 cursor-pointer">Delete link</div>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from "vue";

type ModalIntent = "create" | "edit";

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'authenticated',

  data() {
    const pendingLink: Link = {
      id: "",
      sortOrder: 0,
      label: "",
      subtitle: "",
      customCss: "",
      url: "",
      useDeepLink: false
    };

    return {
      links: new Array<Link>(),
      modalActive: false,
      modalIntent: 'create',
      pendingLink,
      user: '',
      error: '',
      intent: 'create',
      builderLoaded: false,
      builderCss: null,
      sortedLinks: new Array<Link>()
    };
  },

  async mounted() {
    await this.getUserData();
    await this.getLinks();
  },

  methods: {
    async getUserData() {
      try {
        this.user = await this.$axios.$post('/user', {
          token: this.$store.getters['auth/getToken']
        });
      } catch (err) {
        console.log('Error getting user data');
        console.log(err);
      }
    },
    async getLinks() {
      try {
        this.links = await this.$axios.$post('/profile/links', {
          token: this.$store.getters['auth/getToken']
        });
      } catch (err) {
        console.log('Error getting profile links');
        console.log(err);
      }
    },
    async deleteLink() {
      try {
        await this.$axios.$post('/link/delete', {
          token: this.$store.getters['auth/getToken'],
          id: this.pendingLink.id,
        });

        const index = this.links.findIndex(x => x.id === this.pendingLink.id);
        this.links.splice(index, 1);

        this.resortLinks();

        this.closeModal();

        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log('Link destruction unsuccessful');
        console.log(err);
      }
    },
    async saveLinkChanges() {
      try {
        await this.$axios.$post('/link/update', {
          token: this.$store.getters['auth/getToken'],
          link: {
            id: this.pendingLink.id,
            label: this.pendingLink.label,
            subtitle: this.pendingLink.subtitle,
            url: this.pendingLink.url,
            customCss: this.pendingLink.customCss,
            useDeepLink: this.pendingLink.useDeepLink
          }
        });

        const index = this.links.findIndex(x => x.id === this.pendingLink.id);
        this.links[index] = this.pendingLink;

        this.closeModal();
        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log('Link changes unsuccessful');
        console.log(err);
      }
    },
    clearErrors() {
      this.error = '';
    },
    async addNewLink(): Promise<boolean> {
      if (!this.pendingLink.label) {
        this.error = 'Link label required';
        return false;
      }

      if (!this.pendingLink.url) {
        this.error = 'Link URL required';
        return false;
      }

      try {
        const response = await this.$axios.post('/link/create', {
          token: this.$store.getters['auth/getToken'],
          link: {
            label: this.pendingLink.label,
            subtitle: this.pendingLink.subtitle,
            url: this.pendingLink.url,
            customCss: this.pendingLink.customCss || '',
            useDeepLink: this.pendingLink.useDeepLink
          }
        });

        this.links.push(response.data);
        this.clearPending();

        this.resortLinks();

        this.$root.$emit('refreshUserProfileView');
        return true;
      } catch (err) {
        console.log('Error adding new link to profile');
        console.log(err);
        return true;
      }
    },
    editLink(link: Link) {
      this.clearPending();

      this.pendingLink = {
        id: link.id,
        sortOrder: link.sortOrder,
        label: link.label,
        subtitle: link.subtitle,
        customCss: link.customCss,
        url: link.url,
        useDeepLink: link.useDeepLink
      };

      this.openModal('edit');
    },
  }
});
</script>