<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRouter } from "vue-router";
import userService from "../services/user.service";
import { format } from "date-fns";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const BROWSER_DATE_FORMAT = "yyyy-MM-dd";
const GENDER = ["nam", "nữ", "khác"];

const reader = reactive({
  name: "",
  email: "",
  birthDay: "",
  address: "",
  gender: GENDER[0],
  phone: "",
});

const readerId = ref(null);

const store = useAuthStore();
const router = useRouter();

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
    readerId.value = response?._id;

    reader.name = response?.name || "";
    reader.email = response?.email || "";
    reader.address = response?.address || "";
    reader.gender = response?.gender || "";
    reader.phone = response?.phone || "";
    reader.birthDay = response?.birthDay || "";
  }
});

const readerInfoEmpty = (readerObj) =>
  Object.values(reader).every((info) => !info);

const submit = async () => {
  // Save to DB
  console.log(reader.birthDay);
  if (!readerInfoEmpty(reader) && readerId.value) {
    await userService.updateProfile(readerId.value, {
      ...reader,
      birthDay: format(new Date(reader.birthDay), BROWSER_DATE_FORMAT),
    });

    router.push({ name: "profile" });
  }
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
          v-model="reader.name"
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="email"
          v-model="reader.email"
          required
        />
        <Input
          type="date"
          name="birthDay"
          placeholder="ngày sinh"
          v-model="reader.birthDay"
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="địa chỉ"
          v-model="reader.address"
          required
        />
        <select
          name="gender"
          v-model="reader.gender"
          placeholder="giới tính"
          required
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">Vui lòng chọn giới tính</option>
          <option>{{ GENDER[0] }}</option>
          <option>{{ GENDER[1] }}</option>
          <option>{{ GENDER[2] }}</option>
        </select>
        <Input
          type="text"
          name="phone"
          placeholder="điện thoại"
          v-model="reader.phone"
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
