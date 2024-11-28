<script setup>
import { reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import supplierService from "../services/supplier.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const supplier = reactive({
  name: "",
  email: "",
  address: "",
  phoneNumber: "",
});

// const store = useAuthStore();
const router = useRouter();
const route = useRoute();

watchEffect(async () => {
  const response = await supplierService.get(route.params.id);

  if (response) {
    supplier.name = response?.name || "";
    supplier.email = response?.email || "";
    supplier.address = response?.address || "";
    supplier.phoneNumber = response?.phoneNumber || "";
  }
});

const supplierInfoEmpty = (supplierObj) =>
  Object.values(supplier).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!supplierInfoEmpty(supplier) && route.params.id) {
    await supplierService.update(route.params.id, supplier);

    router.push({ name: "supplier" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">
        CHỈNH SỬA NHÀ CUNG CẤP
      </h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-4 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="tên NSX"
          v-model="supplier.name"
          class="col-span-2"
          required
        />
        <Input
          type="text"
          name="email"
          placeholder="email"
          v-model="supplier.email"
          class="col-span-2"
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="địa chỉ"
          v-model="supplier.address"
          class="col-span-2"
          required
        />
        <Input
          type="text"
          name="phoneNumber"
          placeholder="sđt"
          v-model="supplier.phoneNumber"
          class="col-span-2"
          required
        />
        <LinkButton
          route-name="supplier"
          classes="!bg-transparent border border-main-200 col-span-2"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4 col-span-2">Lưu</Button>
      </form>
    </div>
  </main>
</template>
