<script setup>
import OrderTable from "../components/order/OrderTable.vue";
import orderService from "../services/order.service";
import Pagination from "../components/pagination/Pagination.vue";

import { ref, watchEffect } from "vue";

const orders = ref([]);
const page = ref(1);
const limit = 10;
const totalOrders = ref(0);

const fetchOrders = async () => {
  const response = await orderService.getOrders(
    "date",
    "desc",
    page.value,
    limit,
    ""
  );

  if (response) {
    orders.value = response.orders;
    totalOrders.value = response.total;
  }
};

watchEffect(fetchOrders);

const changePage = (newPage) => {
  page.value = newPage;
};
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý đơn hàng</h1>

    <section>
      <OrderTable :orders="orders" @reFetchData="fetchOrders" />
    </section>

    <Pagination
      :totalItems="totalOrders"
      :itemsPerPage="limit"
      @onPageChange="changePage"
    />
  </main>
</template>
