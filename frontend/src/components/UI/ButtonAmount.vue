<script setup>
const props = defineProps(["onClick", "classes"]);
</script>

<template>
  <button
    @click="onClick"
    :class="classes"
    class="flex justify-center items-center bg-[#333333] outline-none outline-offset-0 focus:outline-yellow-400"
  >
    <slot />
  </button>
</template>
