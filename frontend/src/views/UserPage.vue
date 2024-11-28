<script setup>
import SearchBar from "../components/form/SearchBar.vue";
import UserTable from "../components/user/UserTable.vue";
import userService from "../services/user.service";
import Pagination from "../components/pagination/Pagination.vue";

import { ref, watchEffect } from "vue";

const searchTerm = ref("");

const users = ref([]);
const sortField = ref("name");
const sortOrder = ref("asc");
const page = ref(1);
const limit = 10;
const totalUsers = ref(0);

const fetchUsers = async () => {
  const response = await userService.getUsers(
    sortField.value,
    sortOrder.value,
    page.value,
    limit,
    searchTerm.value
  );

  if (response) {
    users.value = response.users;
    totalUsers.value = response.total;
  }
};

watchEffect(fetchUsers);

const changeSearchTerm = (newSearchTerm) => {
  searchTerm.value = newSearchTerm;
};
const changePage = (newPage) => {
  page.value = newPage;
};
const changeSortFieldAndOrder = (newSortField, newOrder) => {
  sortField.value = newSortField;
  sortOrder.value = newOrder;
};
</script>

<template>
  <main>
    <h1 class="text-xl text-center text-gray-600 mb-4">Quản lý người dùng</h1>

    <section>
      <SearchBar
        placeholder="Tìm kiếm theo tên hoặc email"
        @change-search-term="changeSearchTerm"
      />
      <UserTable
        :users="users"
        @updateSortFieldAndOrder="changeSortFieldAndOrder"
        @reFetchData="fetchUsers"
      />
    </section>

    <Pagination
      :totalItems="totalUsers"
      :itemsPerPage="limit"
      @onPageChange="changePage"
    />
  </main>
</template>
