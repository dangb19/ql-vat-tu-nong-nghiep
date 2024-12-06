<script setup>
import { ref } from "vue";
import { STATUS_MAPPING, STATUS } from "../../utils/utils";

const emit = defineEmits(["updateStatus"]);
const props = defineProps({
  status: String,
  classes: String,
});

const isShowDropdown = ref(false);

const toggleDropdown = () => (isShowDropdown.value = !isShowDropdown.value);
</script>
<template>
  <div class="relative inline-block" :class="classes">
    <button
      @click="toggleDropdown"
      type="button"
      :class="
        STATUS_MAPPING[status || STATUS.pending].style +
        ' py-[0.15rem] px-[0.4rem] rounded-md text-sm'
      "
    >
      {{ STATUS_MAPPING[status || STATUS.pending].name }}
    </button>
    <!-- Dropdown -->
    <div
      v-show="isShowDropdown"
      class="absolute bottom-0 left-0 z-30 translate-y-full flex flex-col gap-2 bg-white shadow-md p-2 rounded-lg"
    >
      <button
        v-if="status !== STATUS.pending"
        type="button"
        @click="
          () => {
            emit('updateStatus', STATUS.pending);
            toggleDropdown();
          }
        "
        :class="
          STATUS_MAPPING[STATUS.pending].style +
          ' py-[0.15rem] px-[0.4rem] rounded-md text-sm'
        "
      >
        đang xử lý
      </button>
      <button
        v-if="status !== STATUS.completed"
        type="button"
        @click="
          () => {
            emit('updateStatus', STATUS.completed);
            toggleDropdown();
          }
        "
        :class="
          STATUS_MAPPING[STATUS.completed].style +
          ' py-[0.15rem] px-[0.4rem] rounded-md text-sm'
        "
      >
        hoàn thành
      </button>
      <button
        v-if="status !== STATUS.cancelled"
        type="button"
        @click="
          () => {
            emit('updateStatus', STATUS.cancelled);
            toggleDropdown();
          }
        "
        :class="
          STATUS_MAPPING[STATUS.cancelled].style +
          ' py-[0.15rem] px-[0.4rem] rounded-md text-sm'
        "
      >
        hủy đơn hàng
      </button>
    </div>
  </div>
</template>
