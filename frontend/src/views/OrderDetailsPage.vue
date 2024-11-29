<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import orderService from "../services/order.service";

import { formatCurrency } from "../utils/utils";
import Link from "../components/UI/Link.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const route = useRoute();

const order = ref(null);

watchEffect(async () => {
  const response = await orderService.get(route.params.id);
  order.value = response;
});
</script>

<template>
  <main>
    <!-- <section
      v-if="order"
      class="grid grid-cols-1 xl:grid-cols-[3fr_5fr] xl:gap-8 mt-6 mb-10"
    >
      <div class="place-self-center xl:place-self-auto">
        <img
          class="max-w-[20rem] xl:max-w-[30rem] aspect-[2/3] object-cover object-center rounded-xl"
          :src="order.imageUrls[0]"
          :alt="order.name"
        />
      </div>
      <div class="mt-6 xl:mt-0">

        <h1 class="text-3xl text-center xl:text-left text-gray-800">
          {{ order.name }}
        </h1>


        <div class="text-2xl flex justify-between">
          <h2 class="my-5 text-center xl:text-left">
            <span>Giá bán: </span>
            <span class="text-gray-600">{{
              formatCurrency(order.price)
            }}</span>
          </h2>
        </div>

 
        <div class="flex justify-between items-center gap-4 mt-4 text-lg">
          <div class="flex flex-wrap gap-2 grow items-center">
            <h3>Tồn kho:</h3>
            <p class="text-gray-600">
              {{ order.stockQuantity || 0 }}
            </p>
          </div>
          <div>
            <Link route-name="login" class="text-lg text-main"
              >Nhập&nbsp;hàng&nbsp;&#129125;</Link
            >
          </div>
        </div>


        <div class="flex justify-between items-center gap-4 mt-4 text-lg">
          <div class="flex flex-wrap gap-2 grow items-center">
            <h3>Mã giảm giá:</h3>
            <p class="text-gray-600" v-if="order.discountInfo[0]">
              {{ order.discountInfo[0].discountPercentage + "%" }} -
              {{ order.discountInfo[0].name }}
            </p>
            <p v-else class="text-gray-600">không</p>
          </div>
          <div>
            <Link route-name="login" class="text-lg text-main"
              >Chỉnh&nbsp;sửa&nbsp;&#129125;</Link
            >
          </div>
        </div>

        <div class="flex justify-between gap-2 grow mt-4 text-lg">
          <h3>Danh mục:</h3>
          <p class="text-gray-600">
            {{ order.categoryInfo[0].name }}
          </p>
        </div>

        <div class="flex justify-between gap-2 grow mt-4 text-lg">
          <h3>NSX:</h3>
          <p class="text-gray-600">
            {{ order.manufacturerInfo[0].name }}
          </p>
        </div>


        <div class="flex justify-between gap-2 grow mt-4 text-lg">
          <h3>Nguồn nhập:</h3>
          <p class="text-gray-600">
            {{ order.supplierInfo[0].name }}
          </p>
        </div>


        <div class="flex justify-center m-4 mt-6">
          <LinkButton route-name="login"
            >Thay đổi thông tin sản phẩm</LinkButton
          >
        </div>
      </div>
    </section> -->
    <h1>DETAILS</h1>
    <!-- <section v-if="order">

      <div>
        <h3 class="font-semibold text-lg">Mô tả</h3>
        <p class="text-[1rem] font-light whitespace-pre-line text-gray-600">
          {{ order.description }}
        </p>
      </div>
    </section> -->
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
