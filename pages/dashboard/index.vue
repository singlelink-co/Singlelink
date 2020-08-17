<template>
  <section class="flex flex-col items-center w-full h-full bg-gray-100">
    <div class="flex flex-col p-8 max-w-lg items-center justify-center w-full">
      <div v-if="!links || links.length === 0" class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded justify-center items-center text-sm text-center w-full border border-orange-300 shadow-sm">
        You don't have any links to display</br>Click the button below to create one!
      </div>
      <button @click="open_modal('save')" type="button" class="mt-2 mb-8 w-full p-4 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">Add new link</button>
      <draggable v-model="sorted_links" :list="sorted_links" @change="update_link_order" class="flex flex-col w-full">
        <div v-if="links && links.length > 0" v-for="link in sorted_links" :key="link._id" @click="edit_link(link)" class="flex flex-row text-sm text-gray-800 p-4 bg-white text-center font-medium items-center justify-center rounded shadow w-full mb-4 hover:bg-gray-100 cursor-pointer">{{ link.label }}</div>
      </draggable>
    </div>
    <div v-if="modal" @click="close_modal" class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col bg-white shadow rounded overflow-hidden w-full max-w-xl">
        <div class="p-6 border border-t-0 border-r-0 border-l-0 border-gray-200">
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modal_intent == 'save'">Create new link</h2>
          <h2 class="text-gray-800 font-semibold text-xl" v-if="modal_intent == 'edit'">Edit link</h2>
          <p class="text-gray-600 text-sm" v-if="modal_intent == 'save'">Fill out the form below to add a new link to your page.</p>
          <p class="text-gray-600 text-sm" v-if="modal_intent == 'edit'">Fill out the form below to edit & save your link changes.</p>
        </div>
        <form class="p-6 pt-4 bg-gray-100">
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="label">Label</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="label" type="text" placeholder="e.g. My Calendar" v-model="pending_link.label"/>
          </div>
          <div class="flex flex-col mb-3">
            <label class="font-medium text-sm text-gray-800" for="link">Link URL</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="link" type="text" placeholder="e.g. Jane Doe" v-model="pending_link.url"/>
          </div>
        </form>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0" v-if="modal_intent == 'save'">
          <button @click="save_and_close" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">Save and add link</button>
          <button @click="save_and_continue" type="button" class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center">Save and continue</button>
        </div>
        <div class="flex flex-row p-6 pt-3 pb-3 white border border-gray-200 border-r-0 border-l-0 border-b-0" v-if="modal_intent == 'edit'">
          <button @click="save_link_changes" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">Save changes</button>
          <button @click="delete_link" type="button" class="inline-flex p-3 text-sm text-white text-center bg-red-500 hover:bg-red-600 rounded font-semibold w-auto max-w-xs justify-center align-center">Delete link</button>
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
      modal_intent: 'create',
      pending_link: {
        _id: '',
        label: '',
        link: ''
      },
      user: null
    };
  },
  computed: {
    sorted_links: function () {
      try {
        return this.links.sort(function (a, b) {
          return a.order - b.order;
        });
        } catch(err) {
        console.log(err);
        return [];
      }
    }
  },
  methods: {
    fetch_user_data: function() {
      this.$axios.$post('/user/fetch', {
        token : this.$store.getters['auth/get_token']
      })
        .then((response) => {
          console.log('Fetched user data successfully');
          console.log(response);
          this.user = response;
        })
        .catch((error) => {
          console.log('Error fetching user data');
          console.log(error);
        });
    },
    fetch_links: function() {
      this.$axios.$post('/profile/links', {
        token : this.$store.getters['auth/get_token']
      })
        .then((response) => {
          console.log('Fetched links successfully');
          console.log(response);
          this.links = response;
        })
        .catch((error) => {
          console.log('Error fetching profile links');
          console.log(error);
        });
    },
    open_modal: function(intent) {
      if(intent) this.modal_intent = intent;
      this.modal = true;
    },
    close_modal: function () {
      this.clear_pending();
      this.modal = false;
    },
    save_and_close: function() {
      this.add_new_link();
      this.close_modal();
    },
    save_and_continue: function() {
      this.add_new_link();
    },
    delete_link: function() {
      this.$axios.$post('/link/destroy', {
        token : this.$store.getters['auth/get_token'],
        target: this.pending_link._id,
      })
      .then((response) => {
        console.log('Successfully destroyed link');
        console.log(response);
        this.links = response;
        this.refresh_preview();
        this.close_modal();
      })
        .catch((error) => {
          console.log('Link destruction unsuccessful');
          console.log(error);
        });
    },
    save_link_changes: function() {
      this.$axios.$post('/link/update', {
        token : this.$store.getters['auth/get_token'],
        target: this.pending_link._id,
        label: this.pending_link.label,
        url: this.pending_link.url,
      })
        .then((response) => {
          console.log('Successfully updated link');
          console.log(response);
          this.links = response;
          this.refresh_preview();
          this.close_modal();
        })
        .catch((error) => {
          console.log('Link changes unsuccessful');
          console.log(error);
        });
    },
    add_new_link: function () {
      if(!this.pending_link.label) return alert('Link label required');
      if(!this.pending_link.url) return alert('Link URL required');
      this.$axios.post('/link/create', {
        label: this.pending_link.label,
        url: this.pending_link.url,
        token : this.$store.getters['auth/get_token']
      })
        .then((response) => {
          console.log('Successfully added new link to profile');
          console.log(response);
          this.links.push(response.data);
          this.refresh_preview();
          this.clear_pending();
        })
        .catch((error) => {
          console.log('Error adding new link to profile');
          console.log(error);
        });
    },
    clear_pending: function () {
      this.pending_link = {
        label: '',
        url: '',
      };
    },
    edit_link: function(link) {
      console.log(link);
      this.clear_pending();
      this.pending_link = {
        _id: link._id,
        label: link.label,
        url: link.url
      };
      this.open_modal('edit');
    },
    update_link_order: function (event) {
      console.log(event);
      this.$axios.$post('/link/reorder', {
        token: this.$store.getters['auth/get_token'],
        target: event.moved.element._id,
        new_index: event.moved.newIndex,
        old_index: event.moved.oldIndex,
      })
        .then((response) => {
          console.log('Successfully reordered links');
          console.log(response);
          this.links = response;
          this.refresh_preview();
        })
        .catch((error) => {
          console.log('Error reordering links');
          console.log(error);
        });
    },
    refresh_preview: function() {
      document.getElementById('preview-frame').src = document.getElementById('preview-frame').src;
    }
  },
  mounted: function() {
    this.fetch_user_data();
    this.fetch_links();
  }
};
</script>
