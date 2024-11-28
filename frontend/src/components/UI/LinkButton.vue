<script setup>
const props = defineProps(["routeName", "classes"]);
</script>

<template>
  <router-link
    :to="{ name: routeName }"
    class="inline-flex justify-center items-center py-2 px-6 btn-primary outline-none outline-offset-0 focus:outline-yellow-400"
    :class="classes"
  >
    <slot />
  </router-link>
</template>
