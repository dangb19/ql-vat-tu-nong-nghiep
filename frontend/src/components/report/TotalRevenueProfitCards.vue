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
  <section
    v-if="totalRevenueProfit"
    class="mb-10 md:mb-20 grid grid-cols-1 md:grid-cols-2 gap-10"
  >
    <TotalRevenueProfitCard
      label="Hôm nay"
      :totalRevenue="totalRevenueProfit?.today?.totalRevenue || 0"
      :totalProfit="totalRevenueProfit?.today?.totalProfit || 0"
    />
    <TotalRevenueProfitCard
      label="Tháng này"
      v-if="totalRevenueProfit?.thismonth"
      :totalRevenue="totalRevenueProfit?.thismonth?.totalRevenue || 0"
      :totalProfit="totalRevenueProfit?.thismonth?.totalProfit || 0"
    />
    <TotalRevenueProfitCard
      label="Năm nay"
      v-if="totalRevenueProfit?.thisyear"
      :totalRevenue="totalRevenueProfit?.thisyear?.totalRevenue || 0"
      :totalProfit="totalRevenueProfit?.thisyear?.totalProfit || 0"
    />
    <TotalRevenueProfitCard
      label="Toàn thời gian"
      v-if="totalRevenueProfit?.alltime"
      :totalRevenue="totalRevenueProfit?.alltime?.totalRevenue || 0"
      :totalProfit="totalRevenueProfit?.alltime?.totalProfit || 0"
    />
  </section>
</template>
