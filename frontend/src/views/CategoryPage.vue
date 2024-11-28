<script setup>
import categoryService from "../services/category.service";
import Pagination from "../components/pagination/Pagination.vue";
import DeleteIcon from "../components/icons/DeleteIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";

import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const categories = ref([]);

const fetchCategories = async () => {
  const response = await categoryService.getAll();

  if (response) {
    categories.value = response;
  }
};

const handleDelete = async (id) => {
  console.log("click");
  await categoryService.delete(id);

  fetchCategories();
};

watchEffect(fetchCategories);
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý danh mục</h1>

    <div class="flex justify-end mb-4">
      <router-link
        :to="{ name: 'category-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Thêm danh mục</span>
        <span class="w-4 inline-block"><PlusIcon /></span>
      </router-link>
    </div>

    <section v-if="categories">
      <!-- List -->
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="(category, index) in categories"
          :key="index"
          class="grow relative overflow-hidden rounded-md py-6 px-8 bg-lime-200"
        >
          <router-link
            :to="{
              name: 'category-update',
              params: {
                id: category._id,
              },
            }"
          >
            <p class="text-gray-600 text-lg">
              {{ category.name }}
            </p>
          </router-link>
          <!-- Actions -->
          <div class="absolute top-0 right-0 bg-slate-200 rounded-md">
            <button
              class="w-8 text-gray-400"
              @click.stop="() => handleDelete(category._id)"
              @mouseover.stop
            >
              <DeleteIcon />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <Pagination :totalItems="categories.length" :itemsPerPage="20" />
  </main>
</template>
