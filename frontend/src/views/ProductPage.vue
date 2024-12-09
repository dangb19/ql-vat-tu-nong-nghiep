<script setup>
import SearchBar from "../components/form/SearchBar.vue";
import ProductTable from "../components/product/ProductTable.vue";
import productService from "../services/product.service";
import Pagination from "../components/pagination/Pagination.vue";

import { ref, watchEffect } from "vue";

const searchTerm = ref("");

const products = ref([]);
const sortField = ref("name");
const sortOrder = ref("asc");
const page = ref(1);
const limit = 5;
const totalProducts = ref(0);

const fetchProducts = async () => {
  const response = await productService.getProducts(
    sortField.value,
    sortOrder.value,
    page.value,
    limit,
    searchTerm.value
  );

  if (response) {
    products.value = response.products;
    totalProducts.value = response.total;
  }
};

watchEffect(fetchProducts);

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
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý sản phẩm</h1>

    <section>
      <SearchBar
        placeholder="Tìm kiếm theo tên sản phẩm"
        @change-search-term="changeSearchTerm"
      />
      <ProductTable
        :products="products"
        @updateSortFieldAndOrder="changeSortFieldAndOrder"
        @reFetchData="fetchProducts"
      />
    </section>

    <Pagination
      :totalItems="totalProducts"
      :itemsPerPage="limit"
      @onPageChange="changePage"
    />
  </main>
</template>
