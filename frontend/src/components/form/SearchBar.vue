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
      <button
        type="button"
        @click="emit('changeSearchTerm', searchTerm)"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tìm Kiếm
      </button>
    </div>
  </div>
</template>
