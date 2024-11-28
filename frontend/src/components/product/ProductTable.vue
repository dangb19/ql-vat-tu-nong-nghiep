<script setup>
import { ref } from "vue";
import ModalWrapper from "../ModalWrapper.vue";
import Button from "../UI/Button.vue";
import productService from "../../services/product.service";
import PlusIcon from "../icons/PlusIcon.vue";

const props = defineProps({
  products: Array,
});

const emit = defineEmits(["updateSortFieldAndOrder", "reFetchData"]);

const deleteId = ref();
const sortOrder = ref("asc");

const deleteProduct = async () => {
  if (deleteId.value) {
    const response = await productService.delete(deleteId.value);
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

// Modal

const show = ref(false);
const showModal = () => (show.value = true);
const closeModal = () => (show.value = false);
</script>
<template>
  <div class="p-4">
    <!-- Tiêu đề và nút thêm khách hàng -->
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-bold">Danh sách sản phẩm</h2>
      <router-link
        :to="{ name: 'product-create' }"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>Thêm sản phẩm</span>
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
              Hình ảnh
            </th>
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
              @click="changeSortFieldAndOrder('price')"
            >
              Giá bán
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              @click="changeSortFieldAndOrder('stockQuantity')"
            >
              Tồn kho
              <span class="text-gray-600">
                <span v-if="sortOrder === 'asc'">&#129129;</span
                ><span v-else>&#129131;</span>
              </span>
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left">Giảm giá</th>
            <th class="border border-gray-300 px-4 py-2 text-left">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td
              class="border border-gray-300 px-4 py-2 break-words flex justify-center"
            >
              <div class="rounded-md w-10">
                <img
                  class="w-full object-cover aspect-[9/16]"
                  :src="product.imageUrls[0]"
                  :alt="product.name + 'image'"
                />
              </div>
            </td>
            <td class="border border-gray-300 px-4 py-2 break-words">
              {{ product.name }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ product.price }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ product.stockQuantity }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ product.discountInfo[0]?.discountPercentage || 0 }}%
            </td>
            <td class="border border-gray-300 px-4 py-2 space-x-2">
              <router-link
                :to="{ name: 'product-details', params: { id: product._id } }"
                class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xem
              </router-link>
              <button
                @click="
                  () => {
                    deleteId = product._id;
                    showModal();
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

    <!-- Confirm Modal -->
    <ModalWrapper :show-modal="show">
      <template #title> Xác nhận xóa sản phẩm? </template>

      <template #actions>
        <Button
          :on-click="
            () => {
              closeModal();
              deleteId = null;
            }
          "
          classes="py-2 !bg-transparent !text-main border border-main"
          >Hủy</Button
        >
        <Button
          :on-click="
            () => {
              deleteProduct();
              deleteId = null;
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
