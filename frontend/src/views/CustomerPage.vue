<script setup>
import SearchBar from "../components/form/SearchBar.vue";
import CustomerTable from "../components/customer/CustomerTable.vue";
import customerService from "../services/customer.service";
import Pagination from "../components/pagination/Pagination.vue";

import { ref, watchEffect } from "vue";

const searchTerm = ref("");

const customers = ref([]);
const sortField = ref("name");
const sortOrder = ref("asc");
const page = ref(1);
const limit = 10;
const totalCustomers = ref(0);

const fetchCustomers = async () => {
  const response = await customerService.getCustomers(
    sortField.value,
    sortOrder.value,
    page.value,
    limit,
    searchTerm.value
  );

  if (response) {
    customers.value = response.customers;
    totalCustomers.value = response.total;
  }
};

watchEffect(fetchCustomers);

const changeSearchTerm = (newSearchTerm) => {
  searchTerm.value = newSearchTerm;
};
const changePage = (newPage) => {
  page.value = newPage;
};
const changeSortFieldAndOrder = (newSortField, newOrder) => {
  sortField.value = newSortField;
  sortOrder.value = newOrder;
};
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý khách hàng</h1>

    <section>
      <SearchBar
        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
        @change-search-term="changeSearchTerm"
      />
      <CustomerTable
        :customers="customers"
        @updateSortFieldAndOrder="changeSortFieldAndOrder"
        @reFetchData="fetchCustomers"
      />
    </section>

    <Pagination
      :totalItems="totalCustomers"
      :itemsPerPage="limit"
      @onPageChange="changePage"
    />
  </main>
</template>
