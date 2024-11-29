<script setup>
import { ref, watchEffect } from "vue";
import productService from "../services/product.service";
import orderService from "../services/order.service";
import ProductItems from "../components/ProductItems.vue";
import { formatCurrency, formatDate } from "../utils/utils";

const products = ref([]);
const orders = ref([]);

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

watchEffect(async () => {
  const response = await orderService.getOrders2("date", "desc", 1, 15, "");

  if (response) {
    orders.value = response.orders;
  }
});
</script>

<template>
  <main class="text-gray-700">
    <!-- Section all products -->
    <section class="mb-10 md:mb-20">
      <h1 class="text-xl text-gray-600 mb-4">@Tồn Kho</h1>
      <ProductItems :products="products" />
    </section>

    <section v-if="orders" class="mb-10 md:mb-20">
      <h2 class="text-xl text-gray-600 mb-4">@Đơn hàng chưa xử lý</h2>
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="order in orders"
          :key="order._id"
          class="p-4 text-lg bg-gray-100"
        >
          <router-link :to="{ name: 'order' }">
            <p>
              <span class="font-semibold">Đơn hàng của: </span
              ><span class="font-light">{{ order.customerInfo[0].name }}</span>
            </p>
            <p>
              <span class="font-semibold">Số tiền: </span
              ><span class="font-light">{{
                formatCurrency(order.totalAmount)
              }}</span>
            </p>
            <p>
              <span class="font-semibold">Ngày đặt: </span
              ><span class="font-light">{{ formatDate(order.date) }}</span>
            </p>
          </router-link>
        </li>
      </ul>
    </section>
  </main>
</template>
