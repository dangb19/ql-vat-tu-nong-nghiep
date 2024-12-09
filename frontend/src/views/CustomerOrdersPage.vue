<script setup>
import { useRoute } from "vue-router";
import Pagination from "../components/pagination/Pagination.vue";

import { ref, watchEffect } from "vue";
import orderService from "../services/order.service";
import { formatCurrency, STATUS_MAPPING } from "../utils/utils";
const route = useRoute();
const customerId = route.params.id;
const page = ref(1);
const limit = 10;
const orders = ref([]);
const totalOrders = ref(0);

const fetchOrders = async () => {
  const res = await orderService.getOrdersByCustomer(customerId);
  if (res) {
    orders.value = res.orders;
    totalOrders.value = res.total;
  }
};

watchEffect(fetchOrders);

const changePage = (newPage) => {
  page.value = newPage;
};
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Lịch sử đơn hàng</h1>

    <section>
      <ul
        v-if="orders.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <li v-for="ord in orders" :key="ord._id" class="border p-4 rounded-lg">
          <router-link
            :to="{ name: 'order-details', params: { id: ord._id } }"
            class="flex flex-col items-start gap-2"
          >
            <h2 class="font-semibold text-xl">Đơn hàng #{{ ord.orderCode }}</h2>
            <p
              class="inline-block text-sm py-1 px-2 rounded-md"
              :class="STATUS_MAPPING[ord.status].style"
            >
              {{ STATUS_MAPPING[ord.status].name }}
            </p>
            <p class="font-semibold text-main">
              {{ formatCurrency(ord.totalAmount) }}
            </p>
          </router-link>
        </li>
      </ul>
      <p v-else>Chưa có đơn hàng nào.</p>
    </section>

    <Pagination
      :totalItems="totalOrders"
      :itemsPerPage="limit"
      @onPageChange="changePage"
    />
  </main>
</template>
