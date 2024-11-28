<script setup>
import { ref, watchEffect } from "vue";
import productService from "../services/product.service";
import ProductItems from "../components/ProductItems.vue";

const products = ref([]);

watchEffect(async () => {
  const response = await productService.getProducts(
    "stockQuantity",
    "asc",
    1,
    15,
    ""
  );

  if (response) {
    products.value = response.products;
  }
});
</script>

<template>
  <main class="text-gray-700">
    <!-- Section all products -->
    <section class="mb-10 md:mb-20">
      <h1 class="text-xl text-gray-600 mb-4">Tồn Kho</h1>
      <ProductItems :products="products" />
    </section>

    <section class="mb-10 md:mb-20">
      <h2 class="text-xl text-gray-600 mb-4">Đơn hàng chưa xử lý</h2>
    </section>
  </main>
</template>
