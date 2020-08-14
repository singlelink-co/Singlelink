<template>
  <section class="flex flex-col items-center w-full h-full bg-gray-100">
    <div class="flex flex-col p-8 max-w-lg items-center justify-center w-full">
      <div v-if="!blocks || blocks.length === 0" class="flex flex-row p-2 mt-4 mb-2 bg-orange-200 text-orange-600 rounded justify-center items-center text-sm text-center w-full border border-orange-300 shadow-sm">
        You don't have any links to display</br>Click the button below to create one!
      </div>
      <button @click="add_new_block" type="button" class="mt-2 mb-8 w-full p-4 text-center text-md text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">Add new block</button>
      <div v-if="blocks && blocks.length > 0" v-for="block in blocks" :key="block.id" class="flex flex-row text-sm text-gray-800 p-4 bg-white text-center font-medium items-center justify-center rounded shadow w-full mb-4">{{ block.content }}</div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'dashboard',
  data: function () {
    return {
      blocks: [],
      i: 0
    };
  },
  methods: {
    add_new_block: function () {
      this.i++;
      this.blocks.push({id: this.i, content: 'Yee'});
    }
  },
  mounted: function() {

  }
};
</script>
