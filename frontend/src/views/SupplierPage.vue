<script setup>
import supplierService from "../services/supplier.service";
import Pagination from "../components/pagination/Pagination.vue";
import DeleteIcon from "../components/icons/DeleteIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";

import { ref, watchEffect } from "vue";

const suppliers = ref([]);

const fetchSuppliers = async () => {
  const response = await supplierService.getAll();

  if (response) {
    suppliers.value = response;
  }
};

const handleDelete = async (id) => {
  console.log("click");
  await supplierService.delete(id);

  fetchSuppliers();
};

watchEffect(fetchSuppliers);
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý nhà cung cấp</h1>

    <div class="flex justify-end mb-4">
      <router-link
        :to="{ name: 'supplier-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Thêm nhà cung cấp</span>
        <span class="w-4 inline-block"><PlusIcon /></span>
      </router-link>
    </div>

    <section v-if="suppliers">
      <!-- List -->
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="(supplier, index) in suppliers"
          :key="index"
          class="relative overflow-hidden rounded-md py-6 px-10 bg-lime-200"
        >
          <router-link
            :to="{
              name: 'supplier-update',
              params: {
                id: supplier._id,
              },
            }"
          >
            <p class="text-gray-600 text-lg">
              {{ supplier.name }}
            </p>
          </router-link>
          <!-- Actions -->
          <div class="absolute top-0 right-0 bg-slate-200 rounded-md">
            <button
              class="w-8 text-gray-400"
              @click.stop="() => handleDelete(supplier._id)"
              @mouseover.stop
            >
              <DeleteIcon />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <Pagination :totalItems="suppliers.length" :itemsPerPage="20" />
  </main>
</template>
