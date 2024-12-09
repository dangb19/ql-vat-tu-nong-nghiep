<script setup>
import { ref, watchEffect } from "vue";
import orderService from "../../services/order.service";
import { formatCurrency } from "../../utils/utils";

const topCustomers = ref([]);

watchEffect(async () => {
  const res = await orderService.getTopCustomers();
  if (res) {
    topCustomers.value = res;
  }
});
</script>

<template>
  <section class="mb-10">
    <h2 class="text-3xl mb-5">Top 10 khách hàng</h2>
    <ul class="flex flex-col gap-4">
      <li
        v-for="(customer, index) in topCustomers"
        :key="customer._id"
        class="flex items-center gap-2"
      >
        <span
          class="flex justify-center items-center p-5 size-8 rounded-full border-2 border-main-800 bg-main-50"
          >{{ index + 1 }}</span
        >
        <div>
          <h3 class="text-lg">{{ customer.customerInfo.name }}</h3>
          <p class="text-gray-600 italic">
            Số đơn hàng: {{ customer.orderCount }} - Giá trị:
            {{ formatCurrency(customer.totalSpent) }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>
