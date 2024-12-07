<script setup>
import { computed, reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import productService from "../services/product.service";
import discountService from "../services/discount.service";
import supplierService from "../services/supplier.service";
import inventoryService from "../services/inventory.service";

import { formatCurrency, formatDate } from "../utils/utils";
import Link from "../components/UI/Link.vue";
import LinkButton from "../components/UI/LinkButton.vue";
import SelectModal from "../components/order/SelectModal.vue";
import Input from "../components/form/Input.vue";
import { useAuthStore } from "../store";

const route = useRoute();
const store = useAuthStore();
const product = ref(null);
const discounts = ref([]);
const showDiscountModal = ref(false);
const suppliers = ref([]);
const showInventoryModal = ref(false);
const inventory = reactive({
  supplier: "",
  costPrice: "",
  quantity: "",
});

const closeInventoryModal = () => (showInventoryModal.value = false);
const openInventoryModal = () => (showInventoryModal.value = true);
const closeDiscountModal = () => (showDiscountModal.value = false);
const openDiscountModal = () => (showDiscountModal.value = true);
const fetchDiscounts = async () => {
  const res = await discountService.getAll();
  if (res) {
    discounts.value = res;
  }
};
const fetchSuppliers = async () => {
  const res = await supplierService.getAll();
  if (res) {
    suppliers.value = res;
  }
};
const fetchProductDetails = async () => {
  const response = await productService.get(route.params.id);
  product.value = response;
};
const updateProductDiscount = async (discountId) => {
  if (product.value?._id) {
    await productService.updateDiscount(product.value._id, {
      discount: discountId,
    });
    fetchProductDetails();
    closeDiscountModal();
  }
};
const removeProductDiscount = async () => {
  if (product.value?._id) {
    await productService.removeDiscount(product.value._id);
    fetchProductDetails();
    closeDiscountModal();
  }
};
const inventoryIsValid = (inv) => {
  return Object.values(inv).every((value) => {
    if (Array.isArray(value)) {
      // Kiểm tra mảng rỗng
      return value.length > 0;
    }
    // Kiểm tra chuỗi rỗng, số 0, hoặc các giá trị khác
    return value !== "" && value !== 0;
  });
};

const submit = async () => {
  if (!inventoryIsValid(inventory)) return;
  await inventoryService.create({
    ...inventory,
    product: route.params.id,
    createdBy: store.user._id,
  });

  fetchProductDetails();
};

watchEffect(fetchDiscounts);
watchEffect(fetchSuppliers);
watchEffect(fetchProductDetails);
</script>

<template>
  <main>
    <section
      v-if="product"
      class="grid grid-cols-1 xl:grid-cols-[3fr_5fr] xl:gap-8 mt-6 mb-10"
    >
      <div class="place-self-center xl:place-self-auto">
        <img
          class="max-w-[20rem] xl:max-w-[30rem] aspect-[2/3] object-cover object-center rounded-xl"
          :src="product.imageUrls[0]"
          :alt="product.name"
        />
      </div>
      <div class="mt-6 xl:mt-0">
        <!-- product name -->
        <h1 class="text-3xl text-center xl:text-left text-gray-800">
          {{ product.name }}
        </h1>

        <!-- price -->
        <div class="text-2xl flex justify-between">
          <h2 class="my-5 text-center xl:text-left">
            <span>Giá bán: </span>
            <span class="text-gray-600">{{
              formatCurrency(product.price)
            }}</span>
          </h2>
        </div>

        <!-- Instock -->
        <div class="flex justify-between items-center gap-4 mt-4 text-lg">
          <div class="flex flex-wrap gap-2 grow items-center">
            <h3>Tồn kho:</h3>
            <p class="text-gray-600">
              {{ product.stockQuantity || 0 }}
            </p>
          </div>
          <div>
            <SelectModal
              label="Nhập hàng"
              :showModal="showInventoryModal"
              @closeModal="closeInventoryModal"
              @openModal="openInventoryModal"
              :onClick="submit"
            >
              <template v-slot:title>
                <h3 class="text-lg">Nhập hàng</h3>
              </template>
              <template v-slot:content>
                <form class="grid grid-cols-2 gap-3 max-w-[40rem]">
                  <Input
                    type="number"
                    name="price"
                    placeholder="giá nhập"
                    v-model="inventory.costPrice"
                    required
                  />
                  <Input
                    type="number"
                    name="quantity"
                    placeholder="số lượng"
                    v-model="inventory.quantity"
                    required
                  />
                  <select
                    v-if="suppliers"
                    name="supplier"
                    v-model="inventory.supplier"
                    placeholder="chọn nhà cung cấp"
                    required
                    class="col-span-2 bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none focus:outline-yellow-400 rounded-md"
                  >
                    <option disabled value="">chọn nhà cung cấp</option>
                    <option
                      v-for="supp in suppliers"
                      :key="supp._id"
                      :value="supp._id"
                    >
                      {{ supp.name }}
                    </option>
                  </select>
                </form>
              </template>
            </SelectModal>
          </div>
        </div>

        <!-- Discount -->
        <div class="flex justify-between items-center gap-4 mt-4 text-lg">
          <div class="flex flex-wrap gap-2 grow items-center">
            <h3>Mã giảm giá:</h3>
            <p class="text-gray-600" v-if="product.discountInfo[0]">
              {{ product.discountInfo[0].discountPercentage + "%" }} -
              {{ product.discountInfo[0].name }}
            </p>
            <p v-else class="text-gray-600">không</p>
          </div>
          <div>
            <SelectModal
              label="Điều chỉnh"
              :showModal="showDiscountModal"
              @closeModal="closeDiscountModal"
              @openModal="openDiscountModal"
            >
              <template v-slot:title>
                <div class="flex justify-between">
                  <h3 class="text-lg">Danh sách mã giảm giá</h3>
                  <button
                    type="button"
                    class="font-semibold underline"
                    @click="() => removeProductDiscount()"
                  >
                    Hủy áp dụng
                  </button>
                </div>
              </template>
              <template v-slot:content>
                <ul
                  v-if="discounts"
                  class="grid grid-cols-5 gap-1 text-[0.65rem] sm:text-sm"
                >
                  <li
                    class="flex flex-col gap-2 border group p-2 rounded-md cursor-pointer hover:bg-gray-100"
                    v-for="discount in discounts"
                    :key="discount._id"
                    @click="() => updateProductDiscount(discount._id)"
                  >
                    <h3 class="text-base">{{ discount.name }}</h3>
                    <p class="whitespace-nowrap font-semibold text-gray-800">
                      Giảm {{ discount.discountPercentage }}%
                    </p>
                    <p class="whitespace-nowrap text-gray-500">
                      Từ: {{ formatDate(discount.startDate) }}
                    </p>
                    <p class="whitespace-nowrap text-gray-500">
                      Đến: {{ formatDate(discount.endDate) }}
                    </p>
                  </li>
                </ul>
              </template>
            </SelectModal>
          </div>
        </div>

        <!-- Category -->
        <div class="flex justify-between gap-2 grow mt-4 text-lg">
          <h3>Danh mục:</h3>
          <p class="text-gray-600">
            {{ product.categoryInfo[0].name }}
          </p>
        </div>
        <!-- Manufacturer -->
        <div class="flex justify-between gap-2 grow mt-4 text-lg">
          <h3>NSX:</h3>
          <p class="text-gray-600">
            {{ product.manufacturerInfo[0].name }}
          </p>
        </div>

        <!-- Action -->
        <div class="flex justify-center m-4 mt-6">
          <LinkButton route-name="login"
            >Thay đổi thông tin sản phẩm</LinkButton
          >
        </div>
      </div>
    </section>

    <section v-if="product">
      <!-- product description -->
      <div>
        <h3 class="font-semibold text-lg">Mô tả</h3>
        <p class="text-[1rem] font-light whitespace-pre-line text-gray-600">
          {{ product.description }}
        </p>
      </div>
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
