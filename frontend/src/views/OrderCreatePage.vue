<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import orderService from "../services/order.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";
import { convertToISOString } from "../utils/utils";
import SearchBar from "../components/form/SearchBar.vue";

const order = reactive({
  customer: "",
  date: "",
  totalAmount: 0,
  status: "pending",
  createdBy: "",
  orderDetails: [],
  /*
  {
      "productId": {
        "$oid": "6745b691a9e3d9933233ff9f"
      },
      "productName": "Phân NPK Đầu Trâu 20-20-15+TE (HCM)",
      "quantity": 3,
      "price": 1485000,
      "subtotal": 4455000
    }
  */
});

// const store = useAuthStore();
const router = useRouter();

const orderInfoEmpty = (orderObj) =>
  Object.values(order).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!orderInfoEmpty(order)) {
    await orderService.create({
      ...order,
      date: convertToISOString(new Date()),
    });

    router.push({ name: "order" });
  }
};

const datas = ref();

const fetchDatas = async () => {
  const res = await orderService.getOrderInfo();
  if (res) {
    datas.value = res;
  }
};

watchEffect(fetchDatas);
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">TẠO ĐƠN HÀNG</h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-2 gap-3 max-w-[40rem]"
      >
        <div class="col-span-2 bg-gray-100 p-3 rounded-md">
          <h2 class="font-semibold">Sản phẩm</h2>
        </div>
        <SearchBar
          placeholder="Tìm kiếm sản phẩm"
          @change-search-term="changeSearchTerm"
          classes="col-span-2 p-0"
        />
        <div class="col-span-2 bg-yellow-100 p-3 rounded-md">
          <h2 class="font-semibold">Giỏ hàng</h2>
        </div>
        <select
          v-if="datas?.customers"
          name="category"
          v-model="order.customer"
          placeholder="chọn khách hàng"
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">Chọn khách hàng</option>
          <option
            v-for="cust in datas.customers"
            :key="cust._id"
            :value="cust._id"
          >
            {{ cust.name }}
          </option>
        </select>

        <select
          v-if="datas?.users"
          name="category"
          v-model="order.createdBy"
          placeholder="chọn người tạo đơn"
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">Chọn người tạo đơn</option>
          <option v-for="item in datas.users" :key="item._id" :value="item._id">
            {{ item.name }}
          </option>
        </select>

        <LinkButton
          route-name="order"
          classes="!bg-transparent border border-main-200"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4">Lưu</Button>
      </form>
    </div>
  </main>
</template>
