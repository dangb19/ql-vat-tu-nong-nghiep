<script setup>
import { reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import manufacturerService from "../services/manufacturer.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const manufacturer = reactive({
  name: "",
  email: "",
  address: "",
  phoneNumber: "",
});

// const store = useAuthStore();
const router = useRouter();
const route = useRoute();

watchEffect(async () => {
  const response = await manufacturerService.get(route.params.id);

  if (response) {
    manufacturer.name = response?.name || "";
    manufacturer.email = response?.email || "";
    manufacturer.address = response?.address || "";
    manufacturer.phoneNumber = response?.phoneNumber || "";
  }
});

const manufacturerInfoEmpty = (manufacturerObj) =>
  Object.values(manufacturer).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!manufacturerInfoEmpty(manufacturer) && route.params.id) {
    await manufacturerService.update(route.params.id, manufacturer);

    router.push({ name: "manufacturer" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">CHỈNH SỬA NSX</h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-4 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="tên NSX"
          v-model="manufacturer.name"
          class="col-span-2"
          required
        />
        <Input
          type="text"
          name="email"
          placeholder="email"
          v-model="manufacturer.email"
          class="col-span-2"
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="địa chỉ"
          v-model="manufacturer.address"
          class="col-span-2"
          required
        />
        <Input
          type="text"
          name="phoneNumber"
          placeholder="sđt"
          v-model="manufacturer.phoneNumber"
          class="col-span-2"
          required
        />
        <LinkButton
          route-name="manufacturer"
          classes="!bg-transparent border border-main-200 col-span-2"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4 col-span-2">Lưu</Button>
      </form>
    </div>
  </main>
</template>
