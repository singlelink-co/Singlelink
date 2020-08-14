<template>
  <section class="flex flex-col items-center w-full h-full bg-gray-100">
    <div class="flex flex-col p-8 max-w-lg items-center justify-center w-full">
      <div v-if="!blocks || blocks.length === 0" class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded justify-center items-center text-sm text-center w-full border border-orange-300 shadow-sm">
        You don't have any links to display</br>Click the button below to create one!
      </div>
      <button @click="open_modal" type="button" class="mt-2 mb-8 w-full p-4 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">Add new block</button>
      <div v-if="blocks && blocks.length > 0" v-for="block in blocks" :key="block.id" class="flex flex-row text-sm text-gray-800 p-4 bg-white text-center font-medium items-center justify-center rounded shadow w-full mb-4">{{ block.label }}</div>
    </div>
    <div v-if="modal" @click="close_modal" class="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,.5); backdrop-filter: saturate(180%) blur(5px);">
      <div v-on:click.stop class="flex flex-col p-6 bg-white shadow rounded w-full max-w-lg">
        <h2 class="text-gray-800 font-semibold text-xl">Create new block</h2>
        <p class="text-gray-600 text-sm">Fill out the form below to add a new block to your page.</p>
        <form class="p-4 mt-2 bg-gray-100 rounded-sm">
          <div class="flex flex-col mr-4 mb-3">
            <label class="font-medium text-sm text-gray-800" for="label">Label</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="label" type="text" placeholder="e.g. My Calendar" v-model="pending_block.label"/>
          </div>
          <div class="flex flex-col mr-4 mb-3">
            <label class="font-medium text-sm text-gray-800" for="link">Link URL</label>
            <input class="p-2 mt-2 text-sm border-solid border-gray-300 rounded border" id="link" type="text" placeholder="e.g. Jane Doe" v-model="pending_block.link"/>
          </div>
          <div class="flex flex-row mt-6">
            <button @click="save_and_close" type="button" class="inline-flex p-3 text-sm text-white text-center bg-indigo-600 hover:bg-indigo-700 rounded font-semibold w-auto max-w-xs justify-center align-center mr-2">Save and add block</button>
            <button @click="save_and_continue" type="button" class="inline-flex p-3 text-sm text-white text-center bg-gray-500 hover:bg-gray-600 rounded font-semibold w-auto max-w-xs justify-center align-center">Save and continue</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'dashboard',
  data: function () {
    return {
      blocks: [],
      i: 0,
      modal: false,
      pending_block: {
        label: '',
        link: ''
      }
    };
  },
  methods: {
    open_modal: function() {
      this.modal = true;
    },
    close_modal: function () {
      this.modal = false;
    },
    save_and_close: function() {
      this.add_new_block();
      this.close_modal();
    },
    save_and_continue: function() {
      this.add_new_block();
    },
    add_new_block: function () {
      this.i++;
      this.blocks.push({id: this.i, label: this.pending_block.label, link: this.pending_block.link});
      this.clear_pending();
    },
    clear_pending: function () {
      this.pending_block = {
        label: '',
        link: '',
      };
    }
  },
  mounted: function() {

  }
};
</script>
