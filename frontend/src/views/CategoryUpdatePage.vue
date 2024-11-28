<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import categoryService from "../services/category.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const category = reactive({
  name: "",
  description: "",
});

// const store = useAuthStore();
const router = useRouter();
const route = useRoute();

watchEffect(async () => {
  const response = await categoryService.get(route.params.id);

  if (response) {
    category.name = response?.name || "";
    category.description = response?.description || "";
  }
});

const categoryInfoEmpty = (categoryObj) =>
  Object.values(category).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!categoryInfoEmpty(category) && route.params.id) {
    await categoryService.update(route.params.id, category);

    router.push({ name: "category" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">CHỈNH SỬA DANH MỤC</h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-6 gap-3 max-w-[40rem]"
      >
        <textarea
          name="description"
          placeholder="mô tả ..."
          v-model="category.description"
          class="col-span-6 min-h-60 bg-yellow-100 p-4"
        />
        <Input
          type="text"
          name="name"
          placeholder="tên danh mục"
          v-model="category.name"
          class="col-span-2"
          required
        />
        <LinkButton
          route-name="category"
          classes="!bg-transparent border border-main-200 col-span-2"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4 col-span-2">Lưu</Button>
      </form>
    </div>
  </main>
</template>
