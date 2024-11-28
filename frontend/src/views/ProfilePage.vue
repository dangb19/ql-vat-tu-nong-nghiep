<script setup>
import { onMounted, ref, watchEffect } from "vue";
import userService from "../services/user.service";
import Button from "../components/UI/Button.vue";
import EditIcon from "../components/icons/EditIcon.vue";
import ProfileItem from "../components/profile/ProfileItem.vue";
import { useAuthStore } from "../store";
import { useRouter } from "vue-router";

const reader = ref(null);
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
    reader.value = response;
  }
});

const logout = async () => {
  const response = await userService.logout();
  if (response) {
    store.logout();
    router.push({ name: "login" });
  }
};

const toEditProfilePage = () => {
  router.push({ name: "profile-edit" });
};
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">@Thông tin tài khoản</h1>

    <section class="flex flex-col gap-4 justify-center items-center">
      <ul
        v-if="reader"
        class="relative flex gap-20 bg-orange-100 rounded-lg p-4"
      >
        <div class="flex flex-col gap-4">
          <ProfileItem label="Tên" :data="reader.name" />
          <ProfileItem label="Ngày sinh" :data="reader.birthDay" />
          <ProfileItem label="Giới tính" :data="reader.gender" />
        </div>
        <div class="flex flex-col gap-4">
          <ProfileItem label="Email" :data="reader.email" />
          <ProfileItem label="Địa chỉ" :data="reader.address" />
          <ProfileItem label="Điện thoại" :data="reader.phone" />
        </div>

        <!-- Edit Icon -->
        <button
          @click="toEditProfilePage"
          class="absolute -top-3 -right-3 bg-white size-10 p-2 rounded-full border-2 border-main-200 outline-none outline-offset-0 focus:outline-yellow-400"
        >
          <EditIcon />
        </button>
      </ul>

      <Button :onclick="logout" class="py-2 px-6">Đăng xuất</Button>
    </section>
  </main>
</template>
