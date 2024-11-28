<script setup>
import { ref } from "vue";

import userService from "../services/user.service";
import { useAuthStore } from "../store";
import { useRouter } from "vue-router";

import Input from "../components/form/Input.vue";
import Button from "../components/UI/Button.vue";
import Link from "../components/UI/Link.vue";
import ModalWrapper from "../components/ModalWrapper.vue";

const store = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const modalTitle = ref("");
const show = ref(false);
const showModal = () => (show.value = true);
const closeModal = () => (show.value = false);

// Login
const handleSubmit = async () => {
  if (password.value.length < 6) {
    modalTitle.value = "Độ dài mật khẩu phải lớn hơn hoặc bằng 6.";
    showModal();
    return;
  }

  if (email.value === "" || password.value === "") {
    modalTitle.value = "Vui lòng điền đầy đủ thông tin.";
    showModal();
    return;
  }

  try {
    const user = await userService.login({
      email: email.value,
      password: password.value,
    });
    if (user._id) {
      store.login(user);
      router.push({ name: "home" });
    }
  } catch (error) {
    modalTitle.value = "Đăng nhập thất bại, vui lòng thử lại sau!";
    showModal();
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">ĐĂNG NHẬP</h1>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3 w-72">
        <Input
          type="email"
          name="email"
          placeholder="email"
          v-model="email"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="mật khẩu"
          v-model="password"
          required
        />
        <Button class="py-3 px-4">Đăng nhập</Button>
      </form>

      <p class="mt-2 text-center">
        Chưa có tài khoản?
        <Link route-name="signup" classes="!text-main">Đăng ký ngay</Link>
      </p>
    </div>

    <!-- Modal -->
    <ModalWrapper :show-modal="show">
      <template #title> {{ modalTitle }} </template>

      <template #actions>
        <div></div>
        <Button :on-click="closeModal" classes="grow py-2">OK</Button>
      </template>
    </ModalWrapper>
  </main>
</template>
