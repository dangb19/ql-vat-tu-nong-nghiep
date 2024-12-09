<script setup>
import OrderTable from "../components/order/OrderTable.vue";
import orderService from "../services/order.service";
import Pagination from "../components/pagination/Pagination.vue";
import { ref, watchEffect } from "vue";
import SearchBar from "../components/form/SearchBar.vue";

const orders = ref([]);
const page = ref(1);
const limit = 10;
const totalOrders = ref(0);
const searchTerm = ref("");

const fetchOrders = async () => {
  const response = await orderService.getOrders2(
    "date",
    "desc",
    page.value,
    limit,
    searchTerm.value
  );

  if (response) {
    orders.value = response.orders;
    totalOrders.value = response.total;
  }
};
const changePage = (newPage) => {
  page.value = newPage;
};
const changeSearchTerm = (newValue) => (searchTerm.value = newValue);

watchEffect(fetchOrders);
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý đơn hàng</h1>
    <SearchBar
      placeholder="Tìm đơn hàng theo tên khách hàng"
      @change-search-term="changeSearchTerm"
    />
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
