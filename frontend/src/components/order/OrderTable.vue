<script setup>
import { ref } from "vue";
import ModalWrapper from "../ModalWrapper.vue";
import Button from "../UI/Button.vue";
import orderService from "../../services/order.service";
import PlusIcon from "../icons/PlusIcon.vue";

const props = defineProps({
  orders: Array,
});

const emit = defineEmits(["updateSortFieldAndOrder", "reFetchData"]);
</script>
<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-bold">Danh sách</h2>
      <!-- TEMPPPPPPPPPPPPPPPPP -->
      <router-link
        :to="{ name: 'home' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
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
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ order.customer }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ order.totalAmount }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ order.status }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ order.date }}
            </td>
            <td class="border border-gray-300 px-4 py-2 space-x-2">
              <button>BTN</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
