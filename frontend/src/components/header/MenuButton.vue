<script setup></script>

<template>
  <button
    @click="$emit('toggleMenu')"
    class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
  >
    <span class="sr-only">Open main menu</span>
    <!-- Hamburger icon -->
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16m-7 6h7"
      />
    </svg>
  </button>
</template>
