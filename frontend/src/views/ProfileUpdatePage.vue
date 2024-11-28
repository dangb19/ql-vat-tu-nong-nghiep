<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRouter } from "vue-router";
import userService from "../services/user.service";
import { format } from "date-fns";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const store = useAuthStore();
const router = useRouter();

const user = reactive({
  name: store.user?.name,
  email: store.user?.email,
});

onMounted(() => {
  const timer = setTimeout(() => {
    if (!store.isLoggedIn) {
      router.push({ name: "login" });
    }
    clearTimeout(timer);
  }, 300);
});

watchEffect(async () => {
  const response = await userService.getProfile();

  if (response) {
    user.name = response?.name || "";
    user.email = response?.email || "";
  }
});

const submit = async () => {
  await userService.updateProfile(store.user?._id, user);

  router.push({ name: "profile" });
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">
        CHỈNH SỬA THÔNG TIN
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
        <Input
          type="email"
          name="email"
          placeholder="email"
          v-model="user.email"
          required
        />
        <LinkButton
          route-name="profile"
          classes="!bg-transparent border border-main-200"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4">Lưu thay đổi</Button>
      </form>
    </div>
  </main>
</template>
