<script setup>
import { formatDate, formatCurrency } from "../../utils/utils";

const props = defineProps({
  orderDetails: Array,
  totalAmount: Number,
});
</script>
<template>
  <div class="overflow-x-auto mt-10">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100 text-gray-600">
          <th class="px-4 py-2 text-left">Sản phẩm</th>
          <th class="px-4 py-2 text-right">Đơn giá</th>
          <th class="px-4 py-2 text-center">Số lượng</th>
          <th class="px-4 py-2 text-right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(detail, index) in orderDetails"
          :key="index"
          class="text-gray-600 border-b border-gray-200"
        >
          <td class="px-4 py-2 break-words">
            <div class="flex gap-2 items-center">
              <img
                :src="detail.productImage"
                :alt="detail.productName"
                class="max-w-16"
              />
              <router-link
                :to="{
                  name: 'product-details',
                  params: { id: detail.productId },
                }"
                class="text-blue-600 hover:text-blue-800 underline"
                >{{ detail.productName }}</router-link
              >
            </div>
          </td>
          <td class="px-4 py-2 break-words text-right">
            {{ formatCurrency(detail.price) }}
          </td>
          <td class="px-4 py-2 text-center">
            {{ detail.quantity }}
          </td>
          <td class="px-4 py-2 text-right">
            {{ formatCurrency(detail.subtotal) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="p-4 bg-yellow-100 text-gray-800 font-bold">
          <td></td>
          <td></td>
          <td class="text-center">Tổng tiền</td>
          <td class="text-right px-4 py-2">
            {{ formatCurrency(totalAmount) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
