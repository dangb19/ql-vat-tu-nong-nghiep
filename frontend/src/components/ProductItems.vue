<script setup>
import ProductItem from "./ProductItem.vue";
const props = defineProps({
  products: Array,
});
</script>
<template>
  <ul class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-1">
    <li class="border" v-for="product in products" :key="product._id">
      <ProductItem
        :to="{ name: 'product-details', params: { id: product._id } }"
        :product="product"
      />
    </li>
  </ul>
</template>
