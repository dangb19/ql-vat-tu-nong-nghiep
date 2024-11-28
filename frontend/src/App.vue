<script setup>
import { watchEffect } from "vue";
import MainHeader from "./components/header/MainHeader.vue";
import userService from "./services/user.service";
import { useAuthStore } from "./store";
import Footer from "./components/Footer.vue";

const store = useAuthStore();

watchEffect(async () => {
  const userData = await userService.getProfile();

  if (!store.isLoggedIn && userData) {
    store.login(userData);
  }
});
</script>

<template>
  <div>
    <MainHeader />

    <div class="min-h-screen px-4 mt-8 mb-16 lg:mx-32 xl:mx-40">
      <router-view />
    </div>

    <Footer />
  </div>
</template>
