<script setup>
import { ref, watchEffect } from "vue";
import TotalRevenueProfitCard from "./TotalRevenueProfitCard.vue";
import reportService from "../../services/report.service";

const totalRevenueProfit = ref({});

watchEffect(async () => {
  const res = await reportService.getTotalRevenueProfit();
  if (res) totalRevenueProfit.value = res;
});
</script>
<template>
  <section class="mb-10 md:mb-20 grid grid-cols-2 gap-10">
    <TotalRevenueProfitCard
      label="Hôm nay"
      v-if="totalRevenueProfit?.today"
      :totalRevenue="totalRevenueProfit.today.totalRevenue"
      :totalProfit="totalRevenueProfit.today.totalProfit"
    />
    <TotalRevenueProfitCard
      label="Tháng này"
      v-if="totalRevenueProfit?.thismonth"
      :totalRevenue="totalRevenueProfit.thismonth.totalRevenue"
      :totalProfit="totalRevenueProfit.thismonth.totalProfit"
    />
    <TotalRevenueProfitCard
      label="Năm nay"
      v-if="totalRevenueProfit?.thisyear"
      :totalRevenue="totalRevenueProfit.thisyear.totalRevenue"
      :totalProfit="totalRevenueProfit.thisyear.totalProfit"
    />
    <TotalRevenueProfitCard
      label="Toàn thời gian"
      v-if="totalRevenueProfit?.alltime"
      :totalRevenue="totalRevenueProfit.alltime.totalRevenue"
      :totalProfit="totalRevenueProfit.alltime.totalProfit"
    />
  </section>
</template>
