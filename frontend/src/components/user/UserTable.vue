<script setup>
import { ref } from "vue";
import ModalWrapper from "../ModalWrapper.vue";
import Button from "../UI/Button.vue";
import userService from "../../services/user.service";
import PlusIcon from "../icons/PlusIcon.vue";

const props = defineProps({
  users: Array,
});

const emit = defineEmits(["updateSortFieldAndOrder", "reFetchData"]);

const _user = ref();
const sortOrder = ref("asc");

const toggleStatus = async () => {
  if (_user.value) {
    const response = await userService.toggleStatus(
      _user.value._id,
      _user.value.status
    );
    if (response) {
      emit("reFetchData");
      // Thông báo
    } else {
      // Thông báo
    }
  }
};

const changeSortFieldAndOrder = (sortField) => {
  const order = sortOrder.value === "asc" ? "desc" : "asc";
  sortOrder.value = order;
  emit("updateSortFieldAndOrder", sortField, order);
};
</script>
<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-bold">Danh sách</h2>
      <router-link
        :to="{ name: 'signup' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Tạo tài khoản</span>
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
              @click="changeSortFieldAndOrder('email')"
            >
              Email
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              @click="changeSortFieldAndOrder('role')"
            >
              Vai trò
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              @click="changeSortFieldAndOrder('status')"
            >
              Trạng thái
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="index"
            :class="{
              'text-gray-400': user.status !== 'active',
            }"
          >
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ user.name }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ user.email }}
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ user.role }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ user.status }}
            </td>
            <td class="border border-gray-300 px-4 py-2 space-x-2">
              <router-link
                :to="{ name: 'user-update', params: { id: user._id } }"
                class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sửa
              </router-link>
              <button
                @click="
                  () => {
                    _user = user;
                    toggleStatus();
                  }
                "
                class="px-2 py-1 bg-red-500 text-white rounded"
                :class="{
                  'bg-blue-500': user.role !== 'admin',
                }"
              >
                {{ user.status === "active" ? "Tắt" : "Bật" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
