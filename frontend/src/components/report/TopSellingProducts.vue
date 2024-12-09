<script setup>
import { ref, watchEffect } from "vue";
import orderService from "../../services/order.service";

const topProducts = ref([]);

watchEffect(async () => {
  const res = await orderService.getTopSellingProducts();
  if (res) {
    topProducts.value = res;
  }
});
</script>

<template>
  <section class="mb-10">
    <h2 class="text-3xl mb-5">Top 10 sản phẩm bán chạy</h2>
    <ul class="flex flex-col gap-4">
      <li
        v-for="(product, index) in topProducts"
        :key="product.productId"
        class="flex items-center gap-2"
      >
        <span
          class="flex justify-center items-center p-5 size-8 rounded-full border-2 border-main-800 bg-main-50"
          >{{ index + 1 }}</span
        >
        <div>
          <h3 class="text-lg">{{ product.productName }}</h3>
          <p class="text-gray-600 italic">
            Đã bán: {{ product.totalQuantity }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>
