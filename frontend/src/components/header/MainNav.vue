<script setup>
import LinkButton from "../UI/LinkButton.vue";
import Link from "../UI/Link.vue";
import { useAuthStore } from "../../store";
import Dropdown from "../UI/Dropdown.vue";

const store = useAuthStore();
</script>

<template>
  <ul class="w-full flex flex-col gap-3 items-center md:flex-row">
    <li @click="$emit('closeMenu')">
      <Link route-name="home">Trang chủ</Link>
    </li>
    <!-- Dropdown quản lý -->
    <Dropdown />
    <li @click="$emit('closeMenu')">
      <Link route-name="report">Thống kê</Link>
    </li>
    <li @click="$emit('closeMenu')">
      <Link route-name="order">Đơn hàng</Link>
    </li>
    <li v-if="!store.isLoggedIn" @click="$emit('closeMenu')">
      <LinkButton route-name="login">Đăng nhập</LinkButton>
    </li>
    <li v-else-if="store.isLoggedIn" class="font-semibold underline">
      <router-link :to="{ name: 'profile' }">{{
        store.user?.name
      }}</router-link>
    </li>
  </ul>
</template>
