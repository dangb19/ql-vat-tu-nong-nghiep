<script setup>
import { computed, ref, watch } from "vue";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "vue-chartjs";

const props = defineProps({
  data: Array, // Nhận dữ liệu từ bên ngoài
});

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Reactive cho dữ liệu biểu đồ
const chartData = computed(() => {
  return {
    labels: ["Còn hàng", "Hết hàng", "Sắp hết hàng"],
    datasets: [
      {
        label: "Thống kê sản phẩm",
        data: props.data, // Dữ liệu ban đầu là rỗng
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };
});

// Options biểu đồ
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê số lượng sản phẩm",
    },
  },
};

// Theo dõi và cập nhật dữ liệu biểu đồ khi props.data thay đổi
watch(
  () => props.data,
  (newData) => {
    chartData.value.datasets[0].data = [...newData];
  },
  { immediate: true } // Kích hoạt ngay khi component mount
);
</script>

<template>
  <div>
    <!-- Truyền dữ liệu reactive -->
    <Pie :data="chartData" :options="options" />
  </div>
</template>
