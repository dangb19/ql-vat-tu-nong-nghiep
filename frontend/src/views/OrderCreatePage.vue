<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useAuthStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import productService from "../services/product.service";
import customerService from "../services/customer.service";
import orderService from "../services/order.service";
import Button from "../components/UI/Button.vue";
import Input from "../components/form/Input.vue";
import LinkButton from "../components/UI/LinkButton.vue";
import { convertToISOString } from "../utils/utils";
import SearchBar from "../components/form/SearchBar.vue";
import SelectModal from "../components/order/SelectModal.vue";
import { formatCurrency } from "../utils/utils";
import Pagination from "../components/pagination/Pagination.vue";

const store = useAuthStore();
const router = useRouter();
const showProductModal = ref(false);
const showCustomerModal = ref(false);
const searchProduct = ref("");
const searchCustomer = ref("");
const productData = ref();
const customerData = ref();
const order = reactive({
  customer: "",
  totalAmount: 0,
  createdBy: "",
  orderDetails: [],
});
const customerName = ref("");

const openProductModal = () => (showProductModal.value = true);
const closeProductModal = () => (showProductModal.value = false);
const openCustomerModal = () => (showCustomerModal.value = true);
const closeCustomerModal = () => (showCustomerModal.value = false);

const changeSearchProduct = (newSearchTerm) =>
  (searchProduct.value = newSearchTerm);
const changeSearchCustomer = (newSearchTerm) =>
  (searchCustomer.value = newSearchTerm);

const changeOrderCustomer = (cust) => {
  order.customer = cust._id;
  customerName.value = cust.name;
};

const totalAmount = computed(() =>
  order.orderDetails.reduce((total, ord) => {
    return total + ord.subtotal;
  }, 0)
);

const isOrderValid = (order) => {
  return Object.values(order).every((value) => {
    if (Array.isArray(value)) {
      // Kiểm tra mảng rỗng
      return value.length > 0;
    }
    // Kiểm tra chuỗi rỗng, số 0, hoặc các giá trị khác
    return value !== "" && value !== 0;
  });
};

const submit = async () => {
  // Save to DB
  order.createdBy = store.user._id;
  order.totalAmount = totalAmount;

  if (isOrderValid(order)) {
    await orderService.create(order);
    router.push({ name: "order" });
  }
};

const currentProductPage = ref(1);
const fetchProducts = async () => {
  const res = await productService.getProducts(
    "stockQuantity",
    "desc",
    currentProductPage.value,
    8,
    searchProduct.value
  );
  if (res) {
    productData.value = res;
  }
};
const currentCustomerPage = ref(1);
const fetchCustomers = async () => {
  const res = await customerService.getCustomers(
    "stockQuantity",
    "desc",
    currentCustomerPage.value,
    10,
    searchCustomer.value
  );
  if (res) {
    customerData.value = res;
  }
};

const removeProduct = (id) => {
  order.orderDetails = order.orderDetails.filter((ord) => ord.productId !== id);
};
const addProduct = (product) => {
  const _id = product._id;
  const _name = product.name;
  const _discount = product.discountInfo[0]?.discountPercentage / 100 || 0;
  const _price = product.price * (1 - _discount);
  const index = order.orderDetails.findIndex((ord) => ord.productId === _id);

  if (product.stockQuantity === 0) return;

  if (index === -1) {
    order.orderDetails = [
      ...order.orderDetails,
      {
        productId: _id,
        productName: _name,
        productImage: product.imageUrls[0] || "",
        price: _price,
        quantity: 1,
        subtotal: _price,
      },
    ];
  } else if (index >= 0) {
    if (product.stockQuantity === order.orderDetails[index].quantity) return;
    order.orderDetails[index].quantity += 1;
    order.orderDetails[index].subtotal =
      order.orderDetails[index].quantity * order.orderDetails[index].price;
  }
};
const increaseQuantity = (id) => {
  const index = order.orderDetails.findIndex((ord) => ord.productId === id);
  const stockQuantity =
    productData.value?.products.find((ord) => ord._id === id)?.stockQuantity ||
    0;

  if (index >= 0 && order.orderDetails[index].quantity < stockQuantity) {
    order.orderDetails[index].quantity += 1;
    order.orderDetails[index].subtotal =
      order.orderDetails[index].quantity * order.orderDetails[index].price;
  }
};
const decreaseQuantity = (id) => {
  const index = order.orderDetails.findIndex((ord) => ord.productId === id);
  if (index >= 0) {
    if (order.orderDetails[index].quantity === 1) {
      removeProduct(id);
    } else if (order.orderDetails[index].quantity > 1) {
      order.orderDetails[index].quantity -= 1;
      order.orderDetails[index].subtotal =
        order.orderDetails[index].quantity * order.orderDetails[index].price;
    }
  }
};

watchEffect(fetchProducts);
watchEffect(fetchCustomers);
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="mt-40">
      <h1 class="text-xl text-center text-gray-800 mb-5">TẠO ĐƠN HÀNG</h1>

      <form @submit.prevent="submit" class="grid grid-cols-2 gap-3 max-w-7xl">
        <!-- PRODUCT -->
        <SelectModal
          label="Chọn sản phẩm"
          :showModal="showProductModal"
          @closeModal="closeProductModal"
          @openModal="openProductModal"
        >
          <template v-slot:title>
            <SearchBar
              placeholder="Tìm kiếm sản phẩm"
              @change-search-term="changeSearchProduct"
              classes="p-0"
            />
          </template>
          <template v-slot:content>
            <ul
              v-if="productData?.products"
              class="grid grid-cols-4 sm:grid-cols-4 xl:grid-cols-8 gap-1 text-[0.65rem] sm:text-sm"
            >
              <li
                class="flex flex-col gap-2 max-h-64 md:max-h-none border group text-center cursor-pointer"
                :class="{
                  'opacity-50': product.stockQuantity === 0,
                  '!cursor-not-allowed': product.stockQuantity === 0,
                }"
                v-for="product in productData.products"
                :key="product._id"
                @click="
                  () => {
                    if (product.stockQuantity === 0) return;
                    addProduct(product);
                  }
                "
              >
                <div class="overflow-hidden p-4">
                  <img
                    class="w-full rounded-md object-cover aspect-[9/16] group-hover:scale-105 transition-transform duration-300"
                    :src="product.imageUrls[0]"
                    :alt="product.name"
                  />
                </div>
                <h3 class="grow">{{ product.name }}</h3>
                <p class="whitespace-nowrap">
                  Tồn kho: {{ product.stockQuantity }}
                </p>
                <p class="whitespace-nowrap">
                  Giá: {{ formatCurrency(product.price) }}
                </p>
              </li>
            </ul>
            <!-- Pagination -->
            <Pagination
              :totalItems="productData.total"
              :itemsPerPage="8"
              @onPageChange="
                (newPage) => {
                  currentProductPage = newPage;
                }
              "
            />
          </template>
        </SelectModal>

        <!-- CUSTOMER -->
        <SelectModal
          :label="customerName || 'Chọn khách hàng'"
          :showModal="showCustomerModal"
          @closeModal="closeCustomerModal"
          @openModal="openCustomerModal"
        >
          <template v-slot:title>
            <SearchBar
              placeholder="Tìm kiếm khách hàng"
              @change-search-term="changeSearchCustomer"
              classes="p-0"
            />
          </template>
          <template v-slot:content>
            <ul
              v-if="customerData?.customers"
              class="grid grid-cols-2 md:grid-cols-5 gap-1 text-[0.65rem] sm:text-sm"
            >
              <li
                class="flex flex-col gap-2 border group text-center cursor-pointer hover:bg-gray-100"
                v-for="customer in customerData.customers"
                :key="customer._id"
                @click="
                  () => {
                    changeOrderCustomer(customer);
                    closeCustomerModal();
                  }
                "
              >
                <h3 class="text-gray-700 font-semibold">{{ customer.name }}</h3>
                <p class="whitespace-nowrap">SĐT: {{ customer.phoneNumber }}</p>
              </li>
            </ul>
            <!-- Pagination -->
            <Pagination
              :totalItems="customerData.total"
              :itemsPerPage="10"
              @onPageChange="
                (newPage) => {
                  currentCustomerPage = newPage;
                }
              "
            />
          </template>
        </SelectModal>

        <!-- CART -->
        <div class="col-span-2 bg-yellow-50 p-3 rounded-md">
          <div class="flex gap-2 justify-between text-xl font-bold mb-4">
            <h2 class="text-gray-700">Giỏ hàng</h2>
            <p class="text-red-600">{{ formatCurrency(totalAmount) }}</p>
          </div>
          <table>
            <tr
              v-for="(ordProduct, index) in order.orderDetails"
              :key="ordProduct.productId"
              class="font-light"
            >
              <td>{{ index + 1 }}.</td>
              <td class="pr-4">{{ ordProduct.productName }}</td>
              <td class="pr-4">{{ formatCurrency(ordProduct.price) }}</td>
              <td class="pr-4 flex text-center align-middle">
                <button
                  type="button"
                  @click="() => decreaseQuantity(ordProduct.productId)"
                  class="size-8 border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                >
                  &minus;
                </button>
                <p
                  class="grow px-4 border border-gray-200 flex items-center justify-center"
                >
                  {{ ordProduct.quantity }}
                </p>
                <button
                  type="button"
                  @click="() => increaseQuantity(ordProduct.productId)"
                  class="size-8 border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                >
                  &plus;
                </button>
              </td>
              <td class="pr-4 text-red-400 font-bold text-right">
                {{ formatCurrency(ordProduct.subtotal) }}
              </td>
              <td>
                <button
                  type="button"
                  class="underline"
                  @click="() => removeProduct(ordProduct.productId)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </table>
        </div>

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
