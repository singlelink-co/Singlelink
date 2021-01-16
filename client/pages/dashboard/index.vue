<template>
  <section class="flex flex-col items-center w-full h-full bg-gray-100 flex-shrink-0">
    <div class="flex flex-col p-8 max-w-lg items-center justify-center w-full flex-shrink-0">
      <div
        v-if="!links || links.length === 0"
        class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded justify-center items-center text-sm text-center w-full border border-orange-300 shadow-sm"
      >
        You don't have any links to display.<br>Click the button below to create one!
      </div>
      <button
        type="button"
        class="mt-2 mb-8 w-full p-4 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
        @click="openModal('create')"
      >
        Add new link
      </button>

      <draggable
        v-if="links && links.length > 0"
        v-model="sortedLinks"
        class="flex flex-col w-full flex-shrink-0"
        @change="updateLinkOrder"
      >
        <div
          v-for="link in sortedLinks"
          :key="link.id"
          class="flex flex-col flex-shrink-0 text-sm text-gray-800 p-4 bg-white text-center font-medium items-center justify-center rounded shadow w-full mb-4 hover:bg-gray-100 cursor-pointer"
          @click="editLink(link)"
        >
          <span>{{ link.label }}
            <span v-if="link.useDeepLink" class="ml-2 text-black text-xl">
              <i class="fas fa-mobile-alt"/>
            </span>
          </span>
          <span v-if="link.subtitle" class="text-sm text-gray-700 sl-subtitle mt-1">
            {{ link.subtitle }}
          </span>
        </div>
      </draggable>
    </div>

    <transition name="fade">
      <div
        v-if="modalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="closeModal"
      >

        <div class="flex flex-col bg-white shadow rounded overflow-hidden w-full max-w-xl" @click.stop>

          <div class="p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
            <h2 v-if="modalIntent === 'create'" class="text-gray-800 font-semibold text-xl">
              Create new link
            </h2>
            <h2 v-if="modalIntent === 'edit'" class="text-gray-800 font-semibold text-xl">
              Edit link
            </h2>
            <p v-if="modalIntent === 'create'" class="text-gray-600 text-sm">Fill out the form below to add a new link
              to
              your page.</p>
            <p v-if="modalIntent === 'edit'" class="text-gray-600 text-sm">Fill out the form below to edit & save your
              link changes.</p>
          </div>

          <form class="p-6 pt-4 bg-gray-100 w-full">

            <transition name="fade">
              <div
                v-if="error"
                class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
              >
                <img style="width: 12px;" src="/caution.svg" alt="caution">
                <div class="flex flex-col ml-2">
                  {{ error }}
                </div>
              </div>
            </transition>

            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="label">Label</label>
              <input
                id="label"
                v-model="pendingLink.label"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                type="text"
                placeholder="e.g. My Calendar"
              >
            </div>

            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="subtitle">Subtitle (optional)</label>
              <input
                id="subtitle"
                v-model="pendingLink.subtitle"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                type="text"
                placeholder="e.g. A list of all my events and available times"
              >
            </div>

            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="link">Link URL</label>
              <input
                id="link"
                v-model="pendingLink.url"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                type="text"
                placeholder="e.g. Jane Doe"
              >
            </div>

            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="custom_css">Custom CSS</label>
              <textarea
                id="custom_css"
                v-model="pendingLink.customCss"
                rows="3"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                placeholder="e.g. background: #5353EC;"
              />
            </div>

            <div class="flex flex-col mb-3">
              <label class="font-medium text-sm text-gray-800" for="custom_css">
                Create Deep Link
                <a href="https://en.wikipedia.org/wiki/Deep_linking">(?)
                  <span class="ml-2 text-black text-xl">
                  <i class="fas fa-mobile-alt"/>
                </span>
                </a>
              </label>
              <input
                id="deep_link"
                v-model="pendingLink.useDeepLink"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border"
                type="checkbox"
                placeholder="e.g. background: #5353EC;"
                aria-label="create deep link"
              >
            </div>

          </form>

          <div
            v-if="modalIntent === 'create'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveAndClose"
            >
              Save and add link
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center"
              @click="saveAndContinue"
            >
              Save and continue
            </button>
          </div>

          <div
            v-if="modalIntent === 'edit'"
            class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
          >
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveLinkChanges"
            >
              Save changes
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-white text-center bg-red-500 hover:bg-red-600 rounded font-semibold w-auto max-w-xs justify-center align-center"
              @click="deleteLink"
            >
              Delete link
            </button>
          </div>

        </div>

      </div>
    </transition>

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
      sortedLinks: new Array<Link>()
    };
  },

  async mounted() {
    await this.getUserData();
    await this.getLinks();

    try {
      this.sortedLinks = this.links.sort(function (a: Link, b: Link) {
        return a.sortOrder - b.sortOrder;
      });

      this.pendingLink.sortOrder = this.links.length;
    } catch (err) {
      console.log(err);
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

    openModal(intent: ModalIntent) {
      if (intent) {
        this.modalIntent = intent;
      } else {
        this.modalIntent = 'create';
      }

      this.modalActive = true;
    },

    closeModal() {
      this.clearPending();
      this.modalActive = false;
    },

    async saveAndClose() {
      const result = await this.addNewLink();

      if (result) {
        this.closeModal();
      }
    },

    async saveAndContinue() {
      await this.addNewLink();
    },

    async deleteLink() {
      try {
        await this.$axios.$post('/link/delete', {
          token: this.$store.getters['auth/getToken'],
          id: this.pendingLink.id,
        });

        const index = this.links.findIndex(x => x.id === this.pendingLink.id);
        this.links.splice(index, 1);

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
          id: this.pendingLink.id,
          label: this.pendingLink.label,
          subtitle: this.pendingLink.subtitle,
          url: this.pendingLink.url,
          customCss: this.pendingLink.customCss,
          useDeepLink: this.pendingLink.useDeepLink
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
          label: this.pendingLink.label,
          subtitle: this.pendingLink.subtitle,
          url: this.pendingLink.url,
          customCss: this.pendingLink.customCss || '',
          useDeepLink: this.pendingLink.useDeepLink
        });

        this.links.push(response.data);
        this.clearPending();

        this.$root.$emit('refreshUserProfileView');
        return true;
      } catch (err) {
        console.log('Error adding new link to profile');
        console.log(err);
        return true;
      }
    },

    clearPending() {
      this.clearErrors();

      this.pendingLink = {
        id: '',
        sortOrder: this.links.length,
        label: '',
        subtitle: '',
        url: '',
        customCss: '',
        useDeepLink: false
      };
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

    async updateLinkOrder(event: any) {
      try {
        const response = await this.$axios.$post('/link/reorder', {
          token: this.$store.getters['auth/getToken'],
          target: event.moved.element.id,
          newIndex: event.moved.newIndex,
          oldIndex: event.moved.oldIndex,
        });

        console.log('Successfully reordered links');
        this.links = response;

        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log('Error reordering links');
        console.log(err);
      }
    },
  }
});
</script>

<style>
* { flex-shrink: 0; flex-basis: auto !important;}
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
