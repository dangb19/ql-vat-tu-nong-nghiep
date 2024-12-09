<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import productService from "../services/product.service";

import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";

const product = reactive({
  name: "",
  category: "",
  manufacturer: "",
  price: "",
  discount: "",
  imageUrls: [],
  description: "",
});

// const store = useAuthStore();
const router = useRouter();

const productInfoEmpty = (productObj) =>
  Object.values(product).every((info) => !info);

const submit = async () => {
  // Save to DB
  if (!productInfoEmpty(product)) {
    await productService.create(product);

    router.push({ name: "product" });
  }
};

// FETCH
const datas = ref();

const fetchDatas = async () => {
  const res = await productService.getProductInfo();
  if (res) {
    datas.value = res;
  }
};

watchEffect(fetchDatas);
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">THÊM SẢN PHẨM</h1>

      <form
        @submit.prevent="submit"
        class="grid grid-cols-3 gap-3 max-w-[40rem]"
      >
        <Input
          type="text"
          name="name"
          placeholder="tên sản phẩm"
          v-model="product.name"
          classes="col-span-2"
          required
        />
        <Input
          type="number"
          name="price"
          placeholder="giá bán"
          v-model="product.price"
          required
        />

        <select
          v-if="datas?.discounts"
          name="category"
          v-model="product.discount"
          placeholder="danh mục"
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">chọn mã giảm giá</option>
          <option
            v-for="disc in datas.discounts"
            :key="disc._id"
            :value="disc._id"
          >
            {{ disc.name + " - " + disc.discountPercentage + "%" }}
          </option>
        </select>

        <select
          v-if="datas?.categories"
          name="category"
          v-model="product.category"
          placeholder="danh mục"
          required
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">chọn danh mục</option>
          <option
            v-for="cate in datas.categories"
            :key="cate._id"
            :value="cate._id"
          >
            {{ cate.name }}
          </option>
        </select>

        <select
          v-if="datas?.manufacturers"
          name="manufacturer"
          v-model="product.manufacturer"
          placeholder="nhà sản xuất"
          required
          class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
        >
          <option disabled value="">chọn nhà sản xuất</option>
          <option
            v-for="manu in datas.manufacturers"
            :key="manu._id"
            :value="manu._id"
          >
            {{ manu.name }}
          </option>
        </select>

        <Input
          type="text"
          name="imageUrls"
          placeholder="url hình ảnh"
          v-model="product.imageUrls[0]"
          classes="col-span-3"
          required
        />
        <textarea
          type="text"
          name="description"
          placeholder="mô tả sản phẩm"
          v-model="product.description"
          class="col-span-3 h-60 bg-yellow-100 p-4 resize-none"
          required
        />
        <!-- temp -->
        <div></div>
        <LinkButton
          route-name="product"
          classes="!bg-transparent border border-main-200"
          >Hủy</LinkButton
        >
        <Button class="py-3 px-4">Lưu</Button>
      </form>
    </div>
  </main>
</template>
