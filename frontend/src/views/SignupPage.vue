<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import userService from "../services/user.service";

import Input from "../components/form/Input.vue";
import Button from "../components/UI/Button.vue";
import Link from "../components/UI/Link.vue";
import ModalWrapper from "../components/ModalWrapper.vue";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

const modalTitle = ref("");
const show = ref(false);
const showModal = () => (show.value = true);
const closeModal = () => (show.value = false);

const handleSubmit = async () => {
  if (password.value.length < 6) {
    modalTitle.value = "Độ dài mật khẩu phải lớn hơn hoặc bằng 6.";
    showModal();
    return;
  }

  if (name.value === "" || email.value === "" || password.value === "") {
    modalTitle.value = "Vui lòng điền đầy đủ thông tin.";
    showModal();
    return;
  }

  const response = await userService.signup({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  // Create account sucess
  if (response.insertedId) {
    router.push({ name: "login" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">ĐĂNG KÝ</h1>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3 w-72">
        <Input
          type="text"
          name="name"
          placeholder="họ và tên"
          v-model="name"
          required
        />
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
        <Button class="py-3 px-4">Đăng ký</Button>
      </form>

      <p class="mt-2 text-center">
        Đã có tài khoản?
        <Link route-name="login" classes="!text-main">Đăng nhập ngay</Link>
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
