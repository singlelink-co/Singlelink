<template>
  <section class="flex flex-col p-8 items-center overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-center justify-start mb-4 space-x-4 mb-4">
      <img class="w-8" src="/Pencil.svg"/>
      <h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
        <span v-if="intent==='create'">Create link</span>
        <span v-if="intent==='edit'">Edit link</span>
      </h1>
    </div>
    <div class="flex flex-col mb-4 justify-start w-full" v-if="intent!=='view'">
      <label class="font-semibold mb-2">Label</label>
      <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border" v-model="pendingLink.label"
             placeholder="e.g. My blog" type="text"/>
    </div>
    <div class="flex flex-col mb-4 justify-start w-full" v-if="intent!=='view'">
      <label class="font-semibold mb-2">Link type</label>
      <select class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border"
              v-model="pendingLink.type">
        <option disabled selected>Select a link type</option>
        <option value="link">Vanilla link (default)</option>
        <option value="image">Image</option>
        <option value="divider">Divider</option>
        <option value="html">HTML snippet</option>
        <option value="youtube">Youtube video</option>
      </select>
    </div>
    <div class="flex flex-col mb-4 justify-start w-full" v-if="intent!=='view'">
      <label class="font-semibold mb-2">Subtitle (optional)</label>
      <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border" v-model="pendingLink.subtitle"
             placeholder="e.g. Read more about my adverntures in Peru!" type="text"/>
    </div>
    <div class="flex flex-col mb-8 justify-start w-full" v-if="intent!=='view'">
      <label class="font-semibold mb-2">Link URL</label>
      <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-2xl border" v-model="pendingLink.url"
             placeholder="e.g. https://janedoe.com/blog" type="url"/>
    </div>
    <!--<div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-2xl w-full mb-6">
        <div class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2">
            <h2 class="text-gray-800 font-semibold text-lg">
            Customization
            </h2>
            <a href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432" target="_blank" class="text-gray-500 text-xs hover:underline hover:text-gray-600">Need help? Read our documentation</a>
        </div>
        <builder v-if="builderLoaded" v-model="builderCss"/>
    </div>-->
    <div class="hidden lg:flex flex-col p-6 bg-white shadow rounded-2xl w-full">
      <div
        class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 items-start lg:justify-between lg:items-center w-full mb-2">
        <h2 class="text-gray-800 font-semibold text-lg">
          Custom CSS
        </h2>
        <a
          href="https://www.notion.so/neutroncreative/Customizing-your-Singlelink-profile-ab34c4a8e3174d66835fa460774e7432"
          target="_blank" class="text-gray-500 text-xs hover:underline hover:text-gray-600">Need help? Read our
          documentation</a>
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
      <div v-if="intent==='create'" @click="addNewLink" class="button cursor-pointer">Create link</div>
      <div v-if="intent==='edit'" @click="saveLinkChanges"
           class="flex-grow text-center text-lg px-8 py-4 font-bold text-white rounded-2xl hover:bg-indigo-500 bg-gdp lg:mr-4 mb-4 lg:mb-0 cursor-pointer">
        Save changes
      </div>
      <div v-if="intent==='edit'" @click="deleteLink"
           class="flex-grow text-center text-lg px-8 py-4 font-bold text-white rounded-2xl hover:bg-red-500 bg-red-600 cursor-pointer">
        Delete link
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'authenticated',
  head: {
    title: 'Link panel - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'View, manage, and create new links from your ' + process.env.APP_NAME + ' link panel'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'View, manage, and create new links from your ' + process.env.APP_NAME + ' link panel'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Link panel - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Link panel - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'View, manage, and create new links from your ' + process.env.APP_NAME + ' link panel'
      },
    ],
  },
  data() {
    const pendingLink: EditorLink = {
      id: "",
      sortOrder: 0,
      label: "",
      type: "link",
      subtitle: "",
      customCss: "",
      url: "",
      useDeepLink: false
    };

    return {
      id: '',
      links: new Array<EditorLink>(),
      modalActive: false,
      modalIntent: 'create',
      pendingLink,
      user: '',
      error: '',
      intent: '',
      builderLoaded: false,
      builderCss: null as string | null | undefined,
      editorCss: null as string | null | undefined,
      sortedLinks: new Array<EditorLink>()
    };
  },

  async mounted() {
    await this.getUserData();
    await this.getLinks();
    // Fetch selected link from links
    this.id = this.$route.params.pathMatch;
    if (this.id) {
      this.intent = 'edit';
    } else {
      this.intent = 'create';
    }
    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i].id == this.id) {
        this.pendingLink = this.links[i];
        this.editorCss = this.pendingLink.customCss;
        break;
      }
    }
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

        //this.resortLinks();

        //this.closeModal();

        return this.$router.push('/dashboard/');
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
            type: this.pendingLink.type,
            subtitle: this.pendingLink.subtitle,
            url: this.pendingLink.url,
            customCss: this.editorCss, // + this.builderCss
            useDeepLink: this.pendingLink.useDeepLink
          }
        });

        const index = this.links.findIndex(x => x.id === this.pendingLink.id);
        this.links[index] = this.pendingLink;

        //this.closeModal();
        return this.$router.push('/dashboard/');
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
            type: this.pendingLink.type,
            url: this.pendingLink.url,
            customCss: this.pendingLink.customCss || '',
            useDeepLink: this.pendingLink.useDeepLink
          }
        });

        this.links.push(response.data);
        //this.clearPending();

        //this.resortLinks();

        this.$root.$emit('refreshUserProfileView');
        return true;
      } catch (err) {
        console.log('Error adding new link to profile');
        console.log(err);
        return true;
      }
    },
    editLink(link: EditorLink) {
      //this.clearPending();

      this.pendingLink = {
        id: link.id,
        sortOrder: link.sortOrder,
        label: link.label,
        type: link.type,
        subtitle: link.subtitle,
        customCss: link.customCss,
        url: link.url,
        useDeepLink: link.useDeepLink
      };

      //this.openModal('edit');
    },
  }
});
</script>
