<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: String,
  classes: String,
});
const emit = defineEmits(["changeSearchTerm"]);
const searchTerm = ref("");
</script>

<template>
  <div class="flex justify-center" :class="classes">
    <div class="mb-4 grow flex gap-2 max-w-4xl">
      <input
        v-model="searchTerm"
        type="text"
        :placeholder="props.placeholder"
        class="border border-gray-300 rounded px-4 py-2 grow"
      />
      <div class="flex">
        <button
          type="button"
          @click="emit('changeSearchTerm', searchTerm)"
          class="px-4 py-2 bg-blue-500 text-white rounded-l-md hover:bg-blue-600"
        >
          Tìm Kiếm
        </button>
        <button
          type="button"
          @click="
            () => {
              searchTerm = '';
              emit('changeSearchTerm', '');
            }
          "
          class="hover:bg-main-100 border-y-2 border-r-2 py-2 px-4 text-xl rounded-r-md"
        >
          &#128937;
        </button>
      </div>
    </div>
  </div>
</template>
