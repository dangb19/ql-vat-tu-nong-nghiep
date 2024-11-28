<template>
  <router-link
    @click="$emit('closeMenu')"
    :to="{ name: 'home' }"
    class="flex gap-2 items-center"
  >
    <span id="logo" class="inline-block size-10 rounded-full overflow-hidden">
      <img src="../../assets/logo.png" alt="logo" />
    </span>
    <span
      class="self-center text-2xl font-semibold whitespace-nowrap text-main"
    >
      AgriPro
    </span>
  </router-link>
</template>
