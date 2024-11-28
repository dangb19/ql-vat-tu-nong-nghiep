<script setup></script>

<template>
  <main>
    <div class="flex flex-col gap-4 justify-center items-center h-[30rem]">
      <h1 class="text-main text-3xl">NOT FOUND :(</h1>
      <router-link :to="{ name: 'home' }" class="text-black text-xl underline">
        Trở về trang chủ
      </router-link>
    </div>
  </main>
</template>
