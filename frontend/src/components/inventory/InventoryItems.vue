<script setup>
import { formatDate, formatCurrency } from "../../utils/utils";
const props = defineProps({
  inventories: Array,
});
</script>
<template>
  <ul
    v-if="inventories"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1"
  >
    <li
      class="border p-4"
      v-for="inventory in inventories"
      :key="inventory._id"
    >
      <p class="text-lg font-semibold">
        {{ inventory.productInfo[0]?.name || "?" }}
      </p>
      <p>Số lượng: {{ inventory.quantity }}</p>
      <p>
        Giá nhập:
        {{ formatCurrency(inventory.costPrice) }}
      </p>
      <p>Nhà cung cấp: {{ inventory.supplierInfo[0]?.name || "?" }}</p>
      <p>Người lập: {{ inventory.createdByInfo[0]?.name || "?" }}</p>
      <p>Vào {{ formatDate(inventory.date) }}</p>
    </li>
  </ul>
</template>
