<script setup>
import { ref, watchEffect } from "vue";
import TotalRevenueProfitCards from "../components/report/TotalRevenueProfitCards.vue";
import BarChart from "../components/chart/BarChart.vue";
import TopSellingProducts from "../components/report/TopSellingProducts.vue";
import TopCustomers from "../components/report/TopCustomers.vue";

const thisYear = new Date().getFullYear();
const barChartYear = ref(thisYear);
</script>

<template>
  <main class="text-gray-700">
    <h1 class="text-3xl text-center mb-10">Thống Kê</h1>
    <TotalRevenueProfitCards />

    <!-- Biểu đồ -->
    <BarChart :year="barChartYear" />

    <div class="flex flex-wrap justify-between">
      <TopSellingProducts />

      <TopCustomers />
    </div>
  </main>
</template>
