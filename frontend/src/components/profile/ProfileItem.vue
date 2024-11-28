<script setup>
const props = defineProps(["label", "data"]);
</script>

<template>
  <li v-if="data">
    <h2 class="text-gray-500 text-sm">{{ label }}</h2>
    <p>{{ data }}</p>
  </li>
</template>
