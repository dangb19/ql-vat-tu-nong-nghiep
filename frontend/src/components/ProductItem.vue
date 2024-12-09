<script setup>
const props = defineProps({
  to: Object,
  product: Object,
});
</script>
<template>
  <router-link :to="to" class="group flex flex-col h-full text-center">
    <div class="overflow-hidden p-4">
      <img
        class="w-full rounded-md object-cover aspect-[9/16] group-hover:scale-105 transition-transform duration-300"
        :src="product.imageUrls[0]"
        :alt="product.name"
      />
    </div>

    <h3 class="text-md px-4">{{ product.name }}</h3>
    <!-- Phần tử muốn căn dưới đáy -->
    <p class="mt-auto whitespace-nowrap p-4">
      <span v-if="product.stockQuantity > 10" class="font-light"
        >Số lượng:
      </span>
      <span class="text-lg sm:text-base">
        <span class="text-lime-500" v-if="product.stockQuantity > 10">{{
          product.stockQuantity
        }}</span>
        <span class="text-yellow-300" v-else-if="product.stockQuantity > 0"
          >Sắp hết hàng ({{ product.stockQuantity }})</span
        >
        <span class="text-red-500" v-else>Hết hàng</span>
      </span>
    </p>
  </router-link>
</template>
