<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { computed, ref, watchEffect } from "vue";
import { Bar } from "vue-chartjs";
import { isValidYear } from "../../utils/utils";
import reportService from "../../services/report.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  year: Number,
});

const data = ref([]);

const fetchData = async () => {
  if (isValidYear(props.year)) {
    const res = await reportService.getTotalRevenueProfitByMonth(props.year);
    data.value = res;
  }
};

const chartData = computed(() => {
  return {
    labels: data.value.map((value) => "Tháng " + value._id), // Các tháng
    datasets: [
      {
        label: "Doanh thu",
        backgroundColor: "rgba(6, 182, 212, 0.6)",
        borderColor: "rgba(6, 182, 212, 1)",
        data: data.value.map((value) => value.totalRevenue),
      },
      {
        label: "Lợi nhuận",
        backgroundColor: "rgba(132, 204, 22, 0.6)",
        borderColor: "rgba(132, 204, 22, 1)",
        data: data.value.map((value) => value.totalProfit),
      },
    ],
  };
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          "Thống kê Doanh thu - Lợi nhuận theo Tháng (" +
          (props.year || new Date().getFullYear()) +
          ")",
        font: {
          size: 32,
        },
        padding: {
          top: 20,
          bottom: 10,
        },
      },
    },
  };
});

watchEffect(fetchData);
</script>
<template>
  <div class="h-[500px] overflow-auto mb-10">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
