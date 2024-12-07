<script setup>
import { ref, watchEffect } from "vue";
import TotalRevenueProfitCards from "../components/report/TotalRevenueProfitCards.vue";
import BarChart from "../components/chart/BarChart.vue";
</script>

<template>
  <main class="text-gray-700">
    <h1 class="text-3xl text-center mb-10">Thống Kê</h1>
    <TotalRevenueProfitCards />

    <!-- Biểu đồ -->
    <BarChart />
  </main>
</template>
