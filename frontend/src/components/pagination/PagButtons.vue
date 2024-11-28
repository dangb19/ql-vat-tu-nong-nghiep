<script setup>
import { computed } from "vue";

const props = defineProps({
  totalItems: Number,
  itemsPerPage: Number,
  currentPage: Number,
});

const emit = defineEmits(["onPageChange"]);

// Number of pages: start from 1
const totalPages = computed(() => {
  const totalItems = props.totalItems;
  const itemsPerPage = props.itemsPerPage;

  if (totalItems % props.itemsPerPage === 0) {
    return Math.trunc(totalItems / itemsPerPage);
  }
  return Math.trunc(totalItems / itemsPerPage) + 1;
});

// currentIndex start from 1 to maxIndex
const checkIndexForDisplayingNumberButton = (
  currentIndex,
  currentPageIndex
) => {
  const result = [
    currentPageIndex - 2,
    currentPageIndex - 1,
    currentPageIndex,
    currentPageIndex + 1,
    currentPageIndex + 2,
  ].includes(currentIndex); // true => display the button with number

  return result;
};
</script>

<template>
  <div class="mt-8">
    <div>
      <!-- CASE 1: totalPages > 1 then display pagination -->
      <div v-if="totalPages > 1">
        <!-- CASE 1.1: totalPages <= 5 -->
        <div v-if="totalPages <= 5" class="flex pagination-gap justify-center">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="emit('onPageChange', page)"
            class="pagination-item"
            :class="{ 'bg-yellow-200 font-bold': currentPage === page }"
          >
            {{ page }}
          </button>
        </div>

        <!-- CASE 1.2: totalPages > 5 -->
        <div
          v-if="totalPages > 5"
          class="flex justify-center items-center pagination-gap"
        >
          <!-- PREV -->
          <button
            v-if="currentPage > 1"
            @click="emit('onPageChange', currentPage - 1)"
            class="pagination-item"
          >
            &lt;
          </button>

          <div class="flex justify-center items-center pagination-gap">
            <!-- HEAD -->
            <div v-if="currentPage - 4 >= 1" class="flex pagination-gap">
              <button @click="emit('onPageChange', 1)" class="pagination-item">
                1
              </button>
              <div
                class="unselectable pagination-item hidden sm:flex justify-center items-center"
              >
                ...
              </div>
            </div>

            <!-- BODY: display pagination body base on currentPage index -->
            <!-- EXAMPLE: 1*,2,3 || 1,2*,3,4 || 1,2,3*,4,5 || 6,7,8*,9,10 || 7,8,9*,10 || 8,9,10* -->
            <div class="flex pagination-gap justify-center">
              <template v-for="page in totalPages">
                <button
                  :key="page"
                  v-if="checkIndexForDisplayingNumberButton(page, currentPage)"
                  @click="emit('onPageChange', page)"
                  class="pagination-item"
                  :class="{
                    'bg-yellow-200 font-bold': currentPage === page,
                  }"
                >
                  {{ page }}
                </button>
              </template>
            </div>

            <!-- TAIL -->
            <div
              v-if="currentPage + 4 <= totalPages"
              class="flex pagination-gap"
            >
              <div
                class="unselectable pagination-item hidden sm:flex justify-center items-center"
              >
                ...
              </div>
              <button
                @click="emit('onPageChange', totalPages)"
                class="pagination-item"
              >
                {{ totalPages }}
              </button>
            </div>
          </div>

          <!-- NEXT -->
          <button
            v-if="currentPage < totalPages"
            @click="emit('onPageChange', currentPage + 1)"
            class="pagination-item"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
</style>
