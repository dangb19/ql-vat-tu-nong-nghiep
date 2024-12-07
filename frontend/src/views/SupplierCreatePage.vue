<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
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

const supplierInfoEmpty = (supplierObj) =>
  Object.values(supplier).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!supplierInfoEmpty(supplier)) {
    await supplierService.create(supplier);

    router.push({ name: "supplier" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">THÊM NHÀ CUNG CẤP</h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-4 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="tên nhà cung cấp"
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
