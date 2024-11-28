<script setup>
import manufacturerService from "../services/manufacturer.service";
import Pagination from "../components/pagination/Pagination.vue";
import DeleteIcon from "../components/icons/DeleteIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";

import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const manufacturers = ref([]);

const fetchManufacturers = async () => {
  const response = await manufacturerService.getAll();

  if (response) {
    manufacturers.value = response;
  }
};

const handleDelete = async (id) => {
  console.log("click");
  await manufacturerService.delete(id);

  fetchManufacturers();
};

watchEffect(fetchManufacturers);
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý NSX</h1>

    <div class="flex justify-end mb-4">
      <router-link
        :to="{ name: 'manufacturer-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Thêm NSX</span>
        <span class="w-4 inline-block"><PlusIcon /></span>
      </router-link>
    </div>

    <section v-if="manufacturers">
      <!-- List -->
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="(manufacturer, index) in manufacturers"
          :key="index"
          class="relative overflow-hidden rounded-md py-6 px-10 bg-lime-200"
        >
          <router-link
            :to="{
              name: 'manufacturer-update',
              params: {
                id: manufacturer._id,
              },
            }"
          >
            <p class="text-gray-600 text-lg">
              {{ manufacturer.name }}
            </p>
          </router-link>
          <!-- Actions -->
          <div class="absolute top-0 right-0 bg-slate-200 rounded-md">
            <button
              class="w-8 text-gray-400"
              @click.stop="() => handleDelete(manufacturer._id)"
              @mouseover.stop
            >
              <DeleteIcon />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <Pagination :totalItems="manufacturers.length" :itemsPerPage="20" />
  </main>
</template>
