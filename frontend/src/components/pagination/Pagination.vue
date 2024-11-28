<script setup>
import { ref } from "vue";
import PagButtons from "./PagButtons.vue";

const emit = defineEmits(["onPageChange"]);
const props = defineProps({
  totalItems: Array,
  itemsPerPage: Number,
});

const currentPage = ref(1);

const changeCurrentPage = (newPage) => {
  console.log("newpage", newPage);
  emit("onPageChange", newPage);
  currentPage.value = newPage;
};

// Reset currentPage if items change
// watch(
//   () => props.items,
//   () => (currentPage.value = 1)
// );
</script>

<template>
  <PagButtons
    :totalItems="totalItems"
    :itemsPerPage="itemsPerPage"
    :currentPage="currentPage"
    @onPageChange="changeCurrentPage"
  />
</template>
