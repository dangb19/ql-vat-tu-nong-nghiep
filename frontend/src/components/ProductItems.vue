<script setup>
import ProductItem from "./ProductItem.vue";
const props = defineProps({
  products: Array,
});
</script>
<template>
  <ul class="grid grid-cols-3 md:grid-cols-5 gap-1">
    <li class="border" v-for="product in products" :key="product._id">
      <ProductItem
        :to="{ name: 'product-details', params: { id: product._id } }"
        :product="product"
      />
    </li>
  </ul>
</template>
