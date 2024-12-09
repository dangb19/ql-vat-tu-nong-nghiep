<script setup>
import { formatCurrency } from "../../utils/utils";
defineProps({
  label: String,
  totalRevenue: Number,
  totalProfit: Number,
});
</script>
<template>
  <div class="text-gray-600 bg-white shadow-md rounded-lg p-4">
    <h2 class="text-center text-gray-800 text-2xl mb-4 font-semibold">
      {{ label }}
    </h2>
    <div class="flex justify-center gap-2">
      <div class="p-2 text-center">
        <h3 class="text-xl">Doanh thu</h3>
        <p class="text-2xl text-cyan-500">{{ formatCurrency(totalRevenue) }}</p>
      </div>
      <div class="p-2 text-center">
        <h3 class="text-xl">Lợi nhuận</h3>
        <p class="text-2xl text-lime-500">
          {{ formatCurrency(totalProfit) }}
        </p>
      </div>
    </div>
  </div>
</template>
