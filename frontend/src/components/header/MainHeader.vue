<script setup>
import { ref } from "vue";
import Logo from "../header/Logo.vue";
import MenuButton from "../header/MenuButton.vue";
import MainNav from "./MainNav.vue";

const isMenuButtonHidden = ref(true);

function toggleMenu() {
  isMenuButtonHidden.value = !isMenuButtonHidden.value;
}
</script>

<template>
  <nav
    class="bg-white border border-gray-200 px-2 sm:px-4 py-2.5 rounded shadow"
  >
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <!-- Logo -->
      <Logo @closeMenu="() => (isMenuButtonHidden = true)" />

      <!-- Mobile menu button -->
      <div class="flex items-center md:hidden">
        <MenuButton @toggleMenu="toggleMenu" />
      </div>

      <!-- Navigation -->
      <div
        class="w-full md:block md:w-auto"
        :class="{ hidden: isMenuButtonHidden }"
      >
        <MainNav @closeMenu="() => (isMenuButtonHidden = true)" />
      </div>
    </div>
  </nav>
</template>
