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
  status: "active",
});

// const store = useAuthStore();
const router = useRouter();

const userInfoEmpty = (userObj) => Object.values(user).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!userInfoEmpty(user)) {
    await userService.create(user);

    router.push({ name: "user" });
  }
};
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5"></h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-1 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="họ và tên"
          v-model="user.name"
          required
        />
        <Input
          type="text"
          name="phone"
          placeholder="điện thoại"
          v-model="user.email"
          required
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
