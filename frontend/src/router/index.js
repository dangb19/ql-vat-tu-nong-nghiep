import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import EditProfilePage from "../views/EditProfilePage.vue";
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
        path: ":id",
        name: "product-details",
        component: ProductDetailsPage,
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    component: UserPage,
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
        path: "update/:id",
        name: "customer-update",
        component: CustomerUpdatePage,
      },
      {
        path: "create",
        name: "customer-create",
        component: CustomerCreatePage,
      },
    ],
  },
  {
    path: "/category",
    name: "category",
    component: CategoryPage,
  },
  {
    path: "/inventory",
    name: "inventory",
    component: InventoryPage,
  },
  {
    path: "/discount",
    name: "discount",
    component: DiscountPage,
  },
  {
    path: "/manufacturer",
    name: "manufacturer",
    component: ManufacturerPage,
  },
  {
    path: "/supplier",
    name: "supplier",
    component: SupplierPage,
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
        path: "edit",
        name: "profile-edit",
        component: EditProfilePage,
      },
    ],
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
