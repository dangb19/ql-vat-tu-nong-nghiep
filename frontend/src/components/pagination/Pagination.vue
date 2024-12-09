<script setup>
import { ref } from "vue";
import PagButtons from "./PagButtons.vue";

const emit = defineEmits(["onPageChange"]);
const props = defineProps({
  totalItems: Number,
  itemsPerPage: Number,
});

const currentPage = ref(1);

const changeCurrentPage = (newPage) => {
  emit("onPageChange", newPage);
  currentPage.value = newPage;
};
</script>

<template>
  <PagButtons
    :totalItems="totalItems"
    :itemsPerPage="itemsPerPage"
    :currentPage="currentPage"
    @onPageChange="changeCurrentPage"
  />
</template>
