<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import userService from "../services/user.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const user = reactive({
  name: "",
  email: "",
  role: "staff",
});

// const store = useAuthStore();
const router = useRouter();
const route = useRoute();

// Danh sách các vai trò
const roles = ["admin", "staff"];

watchEffect(async () => {
  const response = await userService.getUser(route.params.id);

  if (response) {
    user.name = response?.name || "";
    user.email = response?.email || "";
    user.role = response?.role || "";
  }
});

const userInfoEmpty = (userObj) => Object.values(user).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!userInfoEmpty(user) && route.params.id) {
    await userService.updateProfile(route.params.id, user);

    router.push({ name: "user" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">
        CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG
      </h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-2 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="họ và tên"
          v-model="user.name"
          required
        />
        <select
          name="role"
          v-model="user.role"
          placeholder="giới tính"
          required
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">Chọn vai trò</option>
          <option>{{ roles[0] }}</option>
          <option>{{ roles[1] }}</option>
        </select>
        <Input
          type="text"
          name="email"
          placeholder="email"
          v-model="user.email"
          required
          classes="col-span-2"
        />

        <LinkButton
          route-name="user"
          classes="!bg-transparent border border-main-200"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4">Lưu</Button>
      </form>
    </div>
  </main>
</template>
