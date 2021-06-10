<template>
  <section class="flex flex-col items-center h-full  flex-shrink-0">
    <div class="flex flex-row items-center justify-start mb-4 space-x-4 mb-4">
      <img class="w-8" src="/House.svg"/>
      <h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
        Site links
      </h1>
    </div>
    <div class="flex flex-col max-w-2xl items-center justify-center w-full flex-shrink-0">
      <div
        v-if="!links || links.length === 0"
        class="flex flex-row p-3 mt-4 mb-6 bg-orange-200 text-orange-600 rounded-2xl justify-center items-center text-sm text-center w-full border-3 text-lg font-semibold border-orange-300 shadow-sm"
      >
        This micro-site doesn't have any links to display.<br>Click the button below to create one! 👇
      </div>
      <n-link
        type="button"
        class="button"
        id="add-new-link-btn"
        to="/dashboard/link/"
      >
        Add new link
      </n-link>

      <draggable
        v-if="links && links.length > 0"
        v-model="sortedLinks"
        class="flex flex-col w-full flex-shrink-0"
        @change="updateLinkOrder"
      >
        <n-link
          v-for="link in sortedLinks"
          :key="link.id"
          class="flex flex-col flex-shrink-0 text-sm text-black p-8 bg-white text-center font-medium items-center justify-center rounded-2xl w-full mb-4 opacity-90 hover:opacity-100 cursor-pointer"
          style="box-shadow: inset 0 0 0 3px rgba(0,0,0,.05), 0 10px 25px rgba(83,83,267,.1);"
          :to="'/dashboard/link/' + link.id"
        >
          <span class="text-2xl font-bold">{{ link.label }}
            <span v-if="link.useDeepLink" class="ml-2 text-black text-lg">
              <i class="fas fa-mobile-alt"/>
            </span>
          </span>
          <span v-if="link.subtitle" class="text-xl font-bold opacity-70 sl-subtitle mt-1">
            {{ link.subtitle }}
          </span>
        </n-link>
      </draggable>
    </div>

    <transition name="fade">
      <div
        v-if="modalActive"
        class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);"
        @click="closeModal"
      >

        <div class="flex flex-col bg-blackish shadow rounded-lg overflow-hidden w-full max-w-xl" @click.stop>

          <div class="p-6 border border-t-0 border-r-0 border-l-0 border-gray-700">
            <h2 v-if="modalIntent === 'create'" class="text-black font-semibold text-xl">
              Create new link
            </h2>
            <h2 v-if="modalIntent === 'edit'" class="text-black font-semibold text-xl">
              Edit link
            </h2>
            <p v-if="modalIntent === 'create'" class="text-gray-800 text-sm">Fill out the form below to add a new link
              to
              your page.</p>
            <p v-if="modalIntent === 'edit'" class="text-gray-800 text-sm">Fill out the form below to edit & save your
              link changes.</p>
          </div>

          <form class="p-6 pt-4 bg-opaqueWhit w-full">

            <transition name="fade">
              <div
                v-if="error"
                class="flex flex-row p-2 mb-4 bg-orange-200 text-orange-600 rounded-lg w-full justify-center items-center text-sm border border-orange-300 shadow-sm"
              >
                <img style="width: 12px;" src="/caution.svg" alt="caution">
                <div class="flex flex-col ml-2">
                  {{ error }}
                </div>
              </div>
            </transition>

            <div class="flex flex-col mb-4">
              <label class="font-semibold text-base text-black" for="label">Label</label>
              <input
                id="label"
                v-model="pendingLink.label"
                class="p-2 text-sm border-solid border-gray-300 rounded-lg border"
                type="text"
                placeholder="e.g. My Calendar"
              >
            </div>

            <div class="flex flex-col mb-4">
              <label class="font-semibold text-base text-black" for="subtitle">Subtitle (optional)</label>
              <input
                id="subtitle"
                v-model="pendingLink.subtitle"
                class="p-2 text-sm border-solid border-gray-300 rounded-lg border"
                type="text"
                placeholder="e.g. A list of all my events and available times"
              >
            </div>

            <div class="flex flex-col mb-4">
              <label class="font-semibold text-base text-black" for="link">Link URL</label>
              <input
                id="link"
                v-model="pendingLink.url"
                class="p-2 text-sm border-solid border-gray-300 rounded-lg border"
                type="text"
                placeholder="e.g. Jane Doe"
              >
            </div>

            <div class="flex flex-col mb-4">
              <label class="font-semibold text-base text-black" for="custom_css">Custom CSS</label>
              <textarea
                id="custom_css"
                v-model="pendingLink.customCss"
                rows="3"
                class="p-2 text-sm border-solid border-gray-300 rounded-lg border"
                placeholder="e.g. background: #5353EC;"
              />
            </div>

            <div class="flex flex-row justify-between items-center mb-3">
              <label class="font-semibold text-base text-black" for="custom_css">
                Create Deep Link
                <a href="https://en.wikipedia.org/wiki/Deep_linking">(?)
                  <span class="ml-2 text-xl">
                  <i class="fas fa-mobile-alt"/>
                </span>
                </a>
              </label>
              <input
                id="deep_link"
                v-model="pendingLink.useDeepLink"
                class="p-2 mt-2 text-sm border-solid border-gray-300 rounded-lg border"
                style="outline:none !important;"
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
              id="save-and-add-link-btn"
              class="inline-flex p-3 text-sm text-black text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveAndClose"
            >
              Save and add link
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-black text-center bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
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
              class="inline-flex p-3 text-sm text-black text-center bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold w-auto max-w-xs justify-center align-center mr-2"
              @click="saveLinkChanges"
            >
              Save changes
            </button>
            <button
              type="button"
              class="inline-flex p-3 text-sm text-black text-center bg-red-500 hover:bg-red-600 rounded-lg font-semibold w-auto max-w-xs justify-center align-center"
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

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'authenticated',
  head: {
    title: 'Dashboard - ' + process.env.APP_NAME,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'View, manage, and create new microsites from your ' + process.env.APP_NAME + ' dashboard'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'View, manage, and create new microsites from your ' + process.env.APP_NAME + ' dashboard'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Dashboard - ' + process.env.APP_NAME
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Dashboard - ' + process.env.APP_NAME
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'View, manage, and create new microsites from your ' + process.env.APP_NAME + ' dashboard'
      },
    ],
  },
  data() {
    const pendingLink: EditorLink = {
      id: "",
      sortOrder: 0,
      type: "link",
      label: "",
      subtitle: "",
      customCss: "",
      url: "",
      useDeepLink: false
    };

    return {
      links: new Array<EditorLink>(),
      modalActive: false,
      modalIntent: 'create',
      pendingLink,
      user: '',
      error: '',
      sortedLinks: new Array<EditorLink>()
    };
  },

  async mounted() {
    await this.getUserData();
    await this.getLinks();

    this.resortLinks();
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

    editLink(link: EditorLink) {
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

        this.resortLinks();

        this.$root.$emit('refreshUserProfileView');
      } catch (err) {
        console.log('Error reordering links');
        console.log(err);
      }
    },

    resortLinks() {
      try {
        this.sortedLinks = this.links.sort(function (a: EditorLink, b: EditorLink) {
          return a.sortOrder - b.sortOrder;
        });

        this.pendingLink.sortOrder = this.links.length;
      } catch (err) {
        console.log(err);
      }
    }
  }
});
</script>

<style>
* {
  flex-shrink: 0;
  flex-basis: auto !important;
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

.button {
  color: #FFF !important;
}

.button {
  @apply mb-8 w-full font-bold rounded-full px-8 py-4 text-lg text-center;
  background: #5353ec;
  background: linear-gradient(to bottom, #5353ec, #1717ca);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .2), 0 2px 25px rgba(83, 83, 267, .25);
  transition: .1s ease-in;
}

.button:hover {
  transform: scale(1.01);
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, .4), 0 2px 15px rgba(83, 83, 267, .75);
}

.button:focus {
  transform: scale(1);
  box-shadow: inset 0 0 0 5px rgba(255, 255, 255, .5), 0 2px 20px rgba(83, 83, 267, .95);
}
</style>
