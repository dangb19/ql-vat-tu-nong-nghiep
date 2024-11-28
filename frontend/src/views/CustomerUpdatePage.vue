<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import customerService from "../services/customer.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const customer = reactive({
  name: "",
  address: "",
  phoneNumber: "",
});

const customerId = ref(null);

// const store = useAuthStore();
const router = useRouter();
const route = useRoute();

// onMounted(() => {
//   const timer = setTimeout(() => {
//     if (!store.isLoggedIn) {
//       router.push({ name: "login" });
//     }
//     clearTimeout(timer);
//   }, 300);
// });

watchEffect(async () => {
  const response = await customerService.get(route.params.id);

  if (response) {
    customerId.value = response?._id;
    customer.name = response?.name || "";
    customer.address = response?.address || "";
    customer.phoneNumber = response?.phoneNumber || "";
  }
});

const customerInfoEmpty = (customerObj) =>
  Object.values(customer).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!customerInfoEmpty(customer) && customerId.value) {
    await customerService.update(customerId.value, customer);

    router.push({ name: "customer" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">
        CHỈNH SỬA THÔNG TIN KHÁCH HÀNG
      </h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-2 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="họ và tên"
          v-model="customer.name"
          required
        />
        <Input
          type="text"
          name="phone"
          placeholder="điện thoại"
          v-model="customer.phoneNumber"
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="địa chỉ"
          v-model="customer.address"
          required
          classes="col-span-2"
        />

        <LinkButton
          route-name="customer"
          classes="!bg-transparent border border-main-200"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4">Lưu</Button>
      </form>
    </div>
  </main>
</template>
