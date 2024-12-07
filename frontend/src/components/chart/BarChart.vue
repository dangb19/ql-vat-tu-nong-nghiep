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
import { computed } from "vue";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = computed(() => {
  return {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"], // Các tháng
    datasets: [
      {
        label: "Doanh thu",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        data: [5000000, 6000000, 4500000, 8000000],
      },
      {
        label: "Lợi nhuận",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        data: [2000000, 2500000, 1500000, 3000000],
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
        text: "Thống kê Doanh thu - Lợi nhuận theo Tháng",
      },
    },
  };
});
</script>
<template>
  <div class="h-[500px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
