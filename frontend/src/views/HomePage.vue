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
    6,
    ""
  );

  if (response) {
    products.value = response.products;
  }
});

watchEffect(async () => {
  const response = await orderService.getOrders2("date", "desc", 1, 8, "");

  if (response) {
    orders.value = response.orders;
  }
});
</script>

<template>
  <main class="text-gray-700">
    <!-- Section all products -->
    <section class="mb-10 md:mb-20">
      <div class="flex justify-between items-center text-xl text-gray-600 mb-4">
        <h1>@Tồn Kho</h1>
        <router-link
          :to="{ name: 'inventory' }"
          class="text-base hover:text-main-600"
          >Xem thêm >>></router-link
        >
      </div>
      <ProductItems :products="products" />
    </section>

    <section v-if="orders" class="mb-10 md:mb-20">
      <div class="flex justify-between items-center text-xl text-gray-600 mb-4">
        <h2>@Đơn hàng mới</h2>
        <router-link
          :to="{ name: 'order' }"
          class="text-base hover:text-main-600"
          >Xem thêm >>></router-link
        >
      </div>
      <ul class="grid grid-cols-2 items-stretch lg:grid-cols-4 gap-4">
        <li
          v-for="order in orders"
          :key="order._id"
          class="aspect-video p-4 text-lg bg-gray-100"
        >
          <router-link
            :to="{ name: 'order-details', params: { id: order._id } }"
          >
            <p>
              <span class="font-semibold">Đơn hàng của: </span
              ><span class="font-light">{{ order.customerInfo.name }}</span>
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
