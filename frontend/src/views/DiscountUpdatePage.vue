<script setup>
import { reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import discountService from "../services/discount.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";
import { convertToISOString, convertToBrowserDate } from "../utils/utils";

const discount = reactive({
  name: "",
  description: "",
  discountPercentage: 0,
  startDate: "",
  endDate: "",
});

// const store = useAuthStore();
const router = useRouter();
const route = useRoute();

watchEffect(async () => {
  const response = await discountService.get(route.params.id);

  if (response) {
    discount.name = response?.name || "";
    discount.description = response?.description || "";
    discount.discountPercentage = response?.discountPercentage || "";
    discount.startDate = convertToBrowserDate(response?.startDate) || "";
    discount.endDate = convertToBrowserDate(response?.endDate) || "";
  }
});

const discountInfoEmpty = (discountObj) =>
  Object.values(discount).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!discountInfoEmpty(discount) && route.params.id) {
    await discountService.update(route.params.id, {
      ...discount,
      startDate: convertToISOString(discount.startDate),
      endDate: convertToISOString(discount.endDate),
    });

    router.push({ name: "discount" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">
        CHỈNH SỬA MÃ GIẢM GIÁ
      </h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-6 gap-3 max-w-[40rem]"
      >
        <textarea
          name="description"
          placeholder="mô tả ..."
          v-model="discount.description"
          class="col-span-6 min-h-60 bg-yellow-100 p-4"
        />
        <Input
          type="text"
          name="name"
          placeholder="tên mã"
          v-model="discount.name"
          class="col-span-2"
          required
        />

        <Input
          type="date"
          name="startDate"
          placeholder="ngày bắt đầu"
          v-model="discount.startDate"
          class="col-span-2"
          required
        />
        <Input
          type="date"
          name="endDate"
          placeholder="ngày kết thúc"
          v-model="discount.endDate"
          class="col-span-2"
          required
        />
        <Input
          type="number"
          name="discountPercentage"
          placeholder="phần trăm giảm 0-100"
          min="0"
          max="100"
          v-model="discount.discountPercentage"
          class="col-span-2"
          required
        />
        <LinkButton
          route-name="discount"
          classes="!bg-transparent border border-main-200 col-span-2"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4 col-span-2">Lưu</Button>
      </form>
    </div>
  </main>
</template>
