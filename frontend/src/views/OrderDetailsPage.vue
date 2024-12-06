<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import orderService from "../services/order.service";
import { formatDate, STATUS_MAPPING } from "../utils/utils";
import OrderDetailTable from "../components/order/OrderDetailTable.vue";
import OrderStatus from "../components/order/OrderStatus.vue";

const route = useRoute();
const order = ref({});

const fetchOrder = async () => {
  const response = await orderService.get(route.params.id);
  if (response) {
    order.value = response;
  }
};

const updateStatus = async (orderId, newStatus) => {
  const res = await orderService.update(orderId, { status: newStatus });
  if (res) {
    fetchOrder();
  }
};

watchEffect(fetchOrder);
</script>

<template>
  <main>
    <div class="mb-4">
      <h1 v-if="order?.customerInfo" class="text-xl">
        Đơn hàng của <span>{{ order.customerInfo[0].name }}</span>
      </h1>
      <p v-if="order?.createdByInfo" class="text-gray-500">
        Người tạo: <span>{{ order.createdByInfo[0].name }}</span>
      </p>
    </div>
    <section
      v-if="order"
      class="overflow-hidden border border-gray-200 rounded-xl"
    >
      <div class="p-4 text-gray-600">
        <h2 class="font-semibold text-gray-800 text-lg mb-2">
          Chi tiết đơn hàng #{{ order.orderCode }}
        </h2>
        <p>Đặt lúc {{ formatDate(order.date) }}</p>
        <p class="flex gap-2">
          <span>Trạng thái đơn hàng:</span>
          <OrderStatus
            :status="order.status"
            classes="grow"
            @updateStatus="(newStatus) => updateStatus(order._id, newStatus)"
          />
        </p>
        <p v-if="order.customerInfo">
          Địa chỉ: {{ order.customerInfo[0]?.address }}
        </p>
        <p v-if="order.customerInfo">
          SĐT: {{ order.customerInfo[0]?.phoneNumber }}
        </p>
      </div>

      <OrderDetailTable
        :orderDetails="order.orderDetails"
        :totalAmount="order.totalAmount"
      />
    </section>
  </main>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  appearance: textfield;
}
</style>
>
