<script setup>
import { ref } from "vue";
import PlusIcon from "../icons/PlusIcon.vue";
import { formatDate, formatCurrency } from "../../utils/utils";

const props = defineProps({
  orders: Array,
});

const emit = defineEmits(["updateSortFieldAndOrder", "reFetchData"]);

const deleteId = ref();
</script>
<template>
  <div class="p-4">
    <!-- Tiêu đề và nút thêm khách hàng -->
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-bold">Danh sách đơn hàng</h2>
      <router-link
        :to="{ name: 'order-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <!-- TEMPPPPPPPPPPPPPppp -->
        <span>Tạo đơn hàng</span>
        <span class="w-4 inline-block"><PlusIcon /></span>
      </router-link>
    </div>
    <!-- Responsive Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
            >
              Khách hàng
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
            >
              Giá trị đơn hàng
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
            >
              Trạng thái
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
            >
              Ngày đặt
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left">Tạo bởi</th>
            <th class="border border-gray-300 px-4 py-2 text-left">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ order.customerInfo[0]?.name }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ formatCurrency(order.totalAmount) }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ order.status }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ formatDate(order.date) }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ order.createdByInfo[0].name }}
            </td>
            <td class="border border-gray-300 px-4 py-2 space-x-2">
              <!-- TEPPPPPP----------------- -->
              <router-link
                :to="{
                  name: 'order-details',
                  params: {
                    id: order._id,
                  },
                }"
                class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xem
              </router-link>
              <button
                @click="
                  () => {
                    deleteId = order._id;
                  }
                "
                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
