<script setup>
import { ref, watchEffect } from "vue";
import productService from "../services/product.service";
import inventoryService from "../services/inventory.service";
import ProductItems from "../components/ProductItems.vue";
import InventoryItems from "../components/inventory/InventoryItems.vue";
import Pagination from "../components/pagination/Pagination.vue";
import PieChart from "../components/chart/PieChart.vue";

const LIMIT = 6;
const products = ref([]);
const total = ref(0);
const page = ref(1);
const productStats = ref([0, 0, 0]);

const changePage = (newPage) => {
  page.value = newPage;
};

watchEffect(async () => {
  const response = await productService.getProducts(
    "stockQuantity",
    "asc",
    page.value,
    LIMIT,
    ""
  );

  if (response) {
    products.value = response.products;
    total.value = response.total;
  }
});

watchEffect(async () => {
  const res = await productService.getProductStats();
  if (res) {
    productStats.value = [
      res.totalProducts - (res.lowStock + res.outOfStock),
      res.outOfStock,
      res.lowStock,
    ];
  }
});

// Inventories
const LIMIT2 = 6;
const inventories = ref([]);
const total2 = ref(0);
const page2 = ref(1);

const changePage2 = (newPage) => {
  page2.value = newPage;
};

watchEffect(async () => {
  const res = await inventoryService.getInventories(
    "date",
    "desc",
    page2.value,
    LIMIT2,
    ""
  );
  if (res) {
    inventories.value = res.inventories;
    total2.value = res.total;
  }
});
</script>

<template>
  <main class="text-gray-700">
    <!-- Section all products -->
    <section class="mb-10 md:mb-20">
      <h2 class="text-xl text-gray-600 mb-4">@Sản phẩm sắp hết hàng</h2>

      <ProductItems :products="products" />
      <Pagination
        :totalItems="total"
        :itemsPerPage="LIMIT"
        @onPageChange="changePage"
      />

      <!-- Chart -->
      <div class="mt-10">
        <PieChart :data="productStats" />
      </div>
    </section>

    <section class="mb-10 md:mb-20">
      <h2 class="text-xl text-gray-600 mb-4">@Lịch sử nhập hàng</h2>
      <!-- List herre -->
      <InventoryItems :inventories="inventories" />
      <Pagination
        :totalItems="total2"
        :itemsPerPage="LIMIT2"
        @onPageChange="changePage2"
      />
    </section>
  </main>
</template>
