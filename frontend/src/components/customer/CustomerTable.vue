<script setup>
import { ref } from "vue";
import ModalWrapper from "../ModalWrapper.vue";
import Button from "../UI/Button.vue";
import customerService from "../../services/customer.service";
import PlusIcon from "../icons/PlusIcon.vue";

const props = defineProps({
  customers: Array,
});

const emit = defineEmits(["updateSortFieldAndOrder", "reFetchData"]);

const deleteId = ref();
const sortOrder = ref("asc");

const editCustomer = (customer) => {
  alert(`Sửa khách hàng: ${customer.name}`);
};
const deleteCustomer = async () => {
  if (deleteId.value) {
    const response = await customerService.delete(deleteId.value);
    if (response) {
      emit("reFetchData");
      // Thông báo
    } else {
      // Thông báo
    }
  }
};
const viewOrders = (customer) => {
  alert(`Xem lịch sử đơn hàng của: ${customer.name}`);
};

const changeSortFieldAndOrder = (sortField) => {
  const order = sortOrder.value === "asc" ? "desc" : "asc";
  sortOrder.value = order;
  emit("updateSortFieldAndOrder", sortField, order);
};

// Modal

const show = ref(false);
const showModal = () => (show.value = true);
const closeModal = () => (show.value = false);
</script>
<template>
  <div class="p-4">
    <!-- Tiêu đề và nút thêm khách hàng -->
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-bold">Danh sách khách hàng</h2>
      <router-link
        :to="{ name: 'customer-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Thêm khách hàng</span>
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
              @click="changeSortFieldAndOrder('name')"
            >
              Tên
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              @click="changeSortFieldAndOrder('phoneNumber')"
            >
              Số điện thoại
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left">Địa chỉ</th>
            <th class="border border-gray-300 px-4 py-2 text-left">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customers" :key="index">
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ customer.name }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ customer.phoneNumber }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ customer.address }}
            </td>
            <td class="border border-gray-300 px-4 py-2 space-x-2">
              <router-link
                :to="{
                  name: 'customer-orders',
                  params: {
                    id: customer._id,
                  },
                }"
                class="px-2 py-1 bg-yellow-400 text-gray-600 rounded hover:bg-yellow-500"
              >
                Lịch sử đơn hàng
              </router-link>
              <router-link
                :to="{ name: 'customer-update', params: { id: customer._id } }"
                class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sửa
              </router-link>
              <button
                @click="
                  () => {
                    deleteId = customer._id;
                    showModal();
                  }
                "
                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
              <!-- <button
                @click="viewOrders(customer)"
                class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Lịch sử
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirm Modal -->
    <ModalWrapper :show-modal="show">
      <template #title> Xác nhận xóa khách hàng? </template>

      <template #actions>
        <Button
          :on-click="closeModal"
          classes="py-2 !bg-transparent !text-main border border-main"
          >Hủy</Button
        >
        <Button
          :on-click="
            () => {
              deleteCustomer();
              closeModal();
            }
          "
          classes="py-2"
          >Đồng ý</Button
        >
      </template>
    </ModalWrapper>
  </div>
</template>
