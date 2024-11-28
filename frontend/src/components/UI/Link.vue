<script setup>
const props = defineProps(["routeName", "isButton", "classes"]);
</script>

<template>
  <router-link
    :to="{ name: routeName }"
    active-class="text-main"
    :class="classes"
    class="inline-block py-2 px-3 text-center rounded-md text-gray-700 hover:text-main outline-none outline-offset-0"
  >
    <slot />
  </router-link>
</template>
