<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);

const links = ref([
  { label: "Người dùng", routeName: "user" },
  { label: "Khách hàng", routeName: "customer" },
  { label: "Danh mục", routeName: "category" },
  { label: "Sản phẩm", routeName: "product" },
  { label: "Tồn kho", routeName: "inventory" },
  { label: "Giảm giá", routeName: "discount" },
  { label: "Nhà sản xuất", routeName: "manufacturer" },
  { label: "Nhà cung cấp", routeName: "supplier" },
]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (event) => {
  if (!event.target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});
onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="px-3 py-2 inline-block text-gray-700 hover:text-main outline-none outline-offset-0 rounded-md"
    >
      Quản lý &#129131;
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute mt-2 w-48 bg-white hover:cursor-pointer rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
    >
      <ul class="py-2" v-if="links">
        <router-link
          :to="{ name: item.routeName }"
          v-for="(item, index) in links"
          :key="index"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          {{ item.label }}
        </router-link>
      </ul>
    </div>
  </div>
</template>
