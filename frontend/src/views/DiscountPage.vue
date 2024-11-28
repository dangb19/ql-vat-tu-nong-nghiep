<script setup>
import discountService from "../services/discount.service";
import Pagination from "../components/pagination/Pagination.vue";
import DeleteIcon from "../components/icons/DeleteIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";

import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const discounts = ref([]);

const fetchDiscounts = async () => {
  const response = await discountService.getAll();

  if (response) {
    discounts.value = response;
  }
};

const handleDelete = async (id) => {
  console.log("click");
  await discountService.delete(id);

  fetchDiscounts();
};

watchEffect(fetchDiscounts);
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Mã giảm giá</h1>

    <div class="flex justify-end mb-4">
      <router-link
        :to="{ name: 'discount-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Thêm mã mới</span>
        <span class="w-4 inline-block"><PlusIcon /></span>
      </router-link>
    </div>

    <section v-if="discounts">
      <!-- List -->
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="(discount, index) in discounts"
          :key="index"
          class="relative overflow-hidden rounded-md py-6 px-10 bg-lime-200"
        >
          <router-link
            :to="{
              name: 'discount-update',
              params: {
                id: discount._id,
              },
            }"
          >
            <p class="text-gray-600 text-lg">
              {{ discount.name }}
            </p>
          </router-link>
          <!-- Actions -->
          <div class="absolute top-0 right-0 bg-slate-200 rounded-md">
            <button
              class="w-8 text-gray-400"
              @click.stop="() => handleDelete(discount._id)"
              @mouseover.stop
            >
              <DeleteIcon />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <Pagination :totalItems="discounts.length" :itemsPerPage="20" />
  </main>
</template>
