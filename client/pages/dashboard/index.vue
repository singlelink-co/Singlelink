<template>
  <section class="flex flex-col items-center w-full h-full bg-gray-100">
    <div class="flex flex-col p-8 max-w-lg items-center justify-center w-full">
      <div v-if="!links || links.length === 0"
           class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded justify-center items-center text-sm text-center w-full border border-orange-300 shadow-sm">
        You don't have any links to display<br>Click the button below to create one!
      </div>
      <button @click="openModal('save')" type="button"
              class="mt-2 mb-8 w-full p-4 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">
        Add new link
      </button>
      <draggable v-model="sortedLinks" :list="sortedLinks" @change="updateLinkOrder" class="flex flex-col w-full">
        <div v-if="links && links.length > 0" v-for="link in sortedLinks" :key="link.id" @click="editLink(link)"
             class="flex flex-col text-sm text-gray-800 p-4 bg-white text-center font-medium items-center justify-center rounded shadow w-full mb-4 hover:bg-gray-100 cursor-pointer">
          {{ link.label }}
          <span v-if="link.subtitle" class="text-sm text-gray-700 sl-subtitle mt-1">{{ link.subtitle }}</span>
        </div>
      </draggable>
    </div>
    <div v-if="modal" @click="closeModal"
         class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
         style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col bg-white shadow rounded overflow-hidden w-full max-w-xl">
        <div class="p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modalIntent === 'save'">Create new link</h2>
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modalIntent === 'edit'">Edit link</h2>
          <p class="text-gray-600 text-sm" v-if="modalIntent === 'save'">Fill out the form below to add a new link to
            your page.</p>
          <p class="text-gray-600 text-sm" v-if="modalIntent === 'edit'">Fill out the form below to edit & save your
            link changes.</p>
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
                   placeholder="e.g. My Calendar" v-model="pendingLink.label"/>
          </div>
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="subtitle">Subtitle (optional)</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="subtitle" type="text"
                   placeholder="e.g. A list of all my events and available times" v-model="pendingLink.subtitle"/>
          </div>
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="link">Link URL</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="link" type="text"
                   placeholder="e.g. Jane Doe" v-model="pendingLink.url"/>
          </div>
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="custom_css">Custom CSS</label>
            <textarea lines="3" class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="custom_css"
                      placeholder="e.g. background: #5353EC;" v-model="pendingLink.customCss"></textarea>
          </div>
        </form>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
             v-if="modalIntent === 'save'">
          <button @click="saveAndClose" type="button"
                  class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">
            Save and add link
          </button>
          <button @click="saveAndContinue" type="button"
                  class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center">
            Save and continue
          </button>
        </div>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0"
             v-if="modalIntent === 'edit'">
          <button @click="saveLinkChanges" type="button"
                  class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">
            Save changes
          </button>
          <button @click="deleteLink" type="button"
                  class="inline-flex p-3 text-sm text-white text-center bg-red-500 hover:bg-red-600 rounded font-semibold w-auto max-w-xs justify-center align-center">
            Delete link
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',

  data: function () {
    return {
      links: [],
      modal: false,
      modalIntent: 'create',
      pendingLink: {
        id: '',
        label: '',
        subtitle: '',
        link: '',
        customCss: '',
      },
      user: null,
      error: null
    };
  },

  computed: {
    sortedLinks: function () {
      try {
        return this.links.sort(function (a, b) {
          return a.sortOrder - b.sortOrder;
        });
      } catch (err) {
        console.log(err);
        return [];
      }
    }
  },

  methods: {
    getUserData: function () {
      this.$axios.$post('/user', {
        token: this.$store.getters['auth/getToken']
      })
        .then((response) => {
          this.user = response;
        })
        .catch((error) => {
          console.log('Error getting user data');
          console.log(error);
        });
    },

    getLinks: function () {
      this.$axios.$post('/profile/links', {
        token: this.$store.getters['auth/getToken']
      })
        .then((response) => {
          this.links = response;
        })
        .catch((error) => {
          console.log('Error getting profile links');
          console.log(error);
        });
    },

    openModal: function (intent) {
      if (intent) this.modalIntent = intent;
      this.modal = true;
    },

    closeModal: function () {
      this.clearPending();
      this.modal = false;
    },

    saveAndClose: function () {
      this.addNewLink(true);
    },

    saveAndContinue: function () {
      this.addNewLink();
    },

    deleteLink: function () {
      this.$axios.$post('/link/destroy', {
        token: this.$store.getters['auth/getToken'],
        id: this.pendingLink.id,
      })
        .then((response) => {
          this.links = response;
          this.refreshPreview();
          this.closeModal();
        })
        .catch((error) => {
          console.log('Link destruction unsuccessful');
          console.log(error);
        });
    },

    saveLinkChanges: function () {
      this.$axios.$post('/link/update', {
        token: this.$store.getters['auth/getToken'],
        id: this.pendingLink.id,
        label: this.pendingLink.label,
        subtitle: this.pendingLink.subtitle,
        url: this.pendingLink.url,
        customCss: this.pendingLink.customCss,
      })
        .then((response) => {
          this.links = response;
          this.refreshPreview();
          this.closeModal();
        })
        .catch((error) => {
          console.log('Link changes unsuccessful');
          console.log(error);
        });
    },

    clearErrors: function () {
      this.error = null;
    },

    addNewLink: function (close) {
      if (!this.pendingLink.label) return this.error = 'Link label required';
      if (!this.pendingLink.url) return this.error = 'Link URL required';
      this.$axios.post('/link/create', {
        label: this.pendingLink.label,
        subtitle: this.pendingLink.subtitle,
        url: this.pendingLink.url,
        customCss: this.pendingLink.customCss || '',
        token: this.$store.getters['auth/getToken']
      })
        .then((response) => {
          this.links.push(response.data);
          this.refreshPreview();
          this.clearPending();
          if (close) this.closeModal();
        })
        .catch((error) => {
          console.log('Error adding new link to profile');
          console.log(error);
        });
    },

    clearPending: function () {
      this.clearErrors();
      this.pendingLink = {
        label: '',
        subtitle: '',
        url: '',
        customCss: ''
      };
    },

    editLink: function (link) {
      this.clearPending();
      this.pendingLink = {
        id: link.id,
        label: link.label,
        subtitle: link.subtitle || null,
        customCss: link.customCss || null,
        url: link.url,
      };
      this.openModal('edit');
    },

    updateLinkOrder: function (event) {
      console.log(event);
      this.$axios.$post('/link/reorder', {
        token: this.$store.getters['auth/getToken'],
        target: event.moved.element.id,
        newIndex: event.moved.newIndex,
        oldIndex: event.moved.oldIndex,
      })
        .then((response) => {
          console.log('Successfully reordered links');
          console.log(response);
          this.links = response;
          this.refreshPreview();
        })
        .catch((error) => {
          console.log('Error reordering links');
          console.log(error);
        });
    },

    refreshPreview: function () {
      document.getElementById('preview-frame').contentWindow.location.reload();
    }
  },
  mounted: function () {
    this.getUserData();
    this.getLinks();
  }
};
</script>
