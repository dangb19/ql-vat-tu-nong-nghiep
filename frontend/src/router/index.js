import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import LoginPage from "../views/LoginPage.vue";
import SignupPage from "../views/SignupPage.vue";
import ProductDetailsPage from "../views/ProductDetailsPage.vue";
import NotFound from "../views/NotFound.vue";
import UserPage from "../views/UserPage.vue";
import CustomerPage from "../views/CustomerPage.vue";
import CategoryPage from "../views/CategoryPage.vue";
import InventoryPage from "../views/InventoryPage.vue";
import DiscountPage from "../views/DiscountPage.vue";
import ManufacturerPage from "../views/ManufacturerPage.vue";
import SupplierPage from "../views/SupplierPage.vue";
import ProductPage from "../views/ProductPage.vue";
import CustomerUpdatePage from "../views/CustomerUpdatePage.vue";
import CustomerCreatePage from "../views/CustomerCreatePage.vue";
import UserUpdatePage from "../views/UserUpdatePage.vue";
import CategoryUpdatePage from "../views/CategoryUpdatePage.vue";
import CategoryCreatePage from "../views/CategoryCreatePage.vue";
import ProductCreatePage from "../views/ProductCreatePage.vue";
import ProductUpdatePage from "../views/ProductUpdatePage.vue";
import DiscountCreatePage from "../views/DiscountCreatePage.vue";
import DiscountUpdatePage from "../views/DiscountUpdatePage.vue";
import ManufacturerCreatePage from "../views/ManufacturerCreatePage.vue";
import ManufacturerUpdatePage from "../views/ManufacturerUpdatePage.vue";
import SupplierCreatePage from "../views/SupplierCreatePage.vue";
import SupplierUpdatePage from "../views/SupplierUpdatePage.vue";
import ProfileUpdatePage from "../views/ProfileUpdatePage.vue";
import ReportPage from "../views/ReportPage.vue";
import OrderPage from "../views/OrderPage.vue";
import OrderCreatePage from "../views/OrderCreatePage.vue";
import OrderDetailsPage from "../views/OrderDetailsPage.vue";
import CustomerOrdersPage from "../views/CustomerOrdersPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },

  {
    path: "/home",
    redirect: { name: "home" },
  },

  {
    path: "/product",
    children: [
      {
        path: "",
        name: "product",
        component: ProductPage,
      },
      {
        path: "create",
        name: "product-create",
        component: ProductCreatePage,
      },
      {
        path: "update/:id",
        name: "product-update",
        component: ProductUpdatePage,
      },
      {
        path: ":id",
        name: "product-details",
        component: ProductDetailsPage,
      },
    ],
  },
  {
    path: "/user",
    children: [
      {
        path: "",
        name: "user",
        component: UserPage,
      },
      {
        path: ":id",
        name: "user-update",
        component: UserUpdatePage,
      },
    ],
  },
  {
    path: "/customer",
    children: [
      {
        path: "",
        name: "customer",
        component: CustomerPage,
      },
      {
        path: "create",
        name: "customer-create",
        component: CustomerCreatePage,
      },
      {
        path: ":id/orders",
        name: "customer-orders",
        component: CustomerOrdersPage,
      },
      {
        path: ":id",
        name: "customer-update",
        component: CustomerUpdatePage,
      },
    ],
  },
  {
    path: "/category",
    children: [
      {
        path: "",
        name: "category",
        component: CategoryPage,
      },
      {
        path: "create",
        name: "category-create",
        component: CategoryCreatePage,
      },
      {
        path: ":id",
        name: "category-update",
        component: CategoryUpdatePage,
      },
    ],
  },
  {
    path: "/inventory",
    name: "inventory",
    component: InventoryPage,
  },
  {
    path: "/discount",
    children: [
      {
        path: "",
        name: "discount",
        component: DiscountPage,
      },
      {
        path: "create",
        name: "discount-create",
        component: DiscountCreatePage,
      },
      {
        path: ":id",
        name: "discount-update",
        component: DiscountUpdatePage,
      },
    ],
  },
  {
    path: "/manufacturer",
    children: [
      {
        path: "",
        name: "manufacturer",
        component: ManufacturerPage,
      },
      {
        path: "create",
        name: "manufacturer-create",
        component: ManufacturerCreatePage,
      },
      {
        path: ":id",
        name: "manufacturer-update",
        component: ManufacturerUpdatePage,
      },
    ],
  },
  {
    path: "/supplier",
    children: [
      {
        path: "",
        name: "supplier",
        component: SupplierPage,
      },
      {
        path: "create",
        name: "supplier-create",
        component: SupplierCreatePage,
      },
      {
        path: ":id",
        name: "supplier-update",
        component: SupplierUpdatePage,
      },
    ],
  },

  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },

  {
    path: "/signup",
    name: "signup",
    component: SignupPage,
  },

  {
    path: "/profile",
    children: [
      {
        path: "",
        name: "profile",
        component: ProfilePage,
      },

      {
        path: "update",
        name: "profile-update",
        component: ProfileUpdatePage,
      },
    ],
  },

  {
    path: "/order",
    children: [
      {
        path: "",
        name: "order",
        component: OrderPage,
      },

      {
        path: "create",
        name: "order-create",
        component: OrderCreatePage,
      },
      {
        path: ":id",
        name: "order-details",
        component: OrderDetailsPage,
      },
    ],
  },
  {
    path: "/report",
    name: "report",
    component: ReportPage,
  },
  {
    path: "/account",
    redirect: { name: "profile" },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (from.name === "genres" && to.name === "genres") return;

    return { left: 0, top: 0 };
  },
});

export default router;
