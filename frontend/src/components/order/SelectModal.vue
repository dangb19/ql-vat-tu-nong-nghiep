<script setup>
import { Teleport } from "vue";

const props = defineProps({
  showModal: Boolean,
  label: String,
  classes: String,
  onClick: Function,
});
</script>

<template>
  <div
    class="bg-yellow-100 p-3 rounded-md text-gray-600 hover:bg-yellow-200 duration-200"
  >
    <button type="button" :class="classes" @click="$emit('openModal')">
      {{ label || "button" }}
    </button>
    <Teleport to="#modals">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed z-50 top-0 left-0 w-full h-full flex transition-opacity duration-200 ease-in-out bg-[rgba(0,0,0,0.5)]"
        >
          <div
            class="flex flex-col gap-6 max-w-7xl m-auto -translate-y-10 p-6 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-200 ease-in-out overflow-y-scroll"
          >
            <div>
              <slot name="title">Select Modal</slot>
            </div>

            <div class="flex flex-col gap-2 text-sm font-light">
              <slot name="content"></slot>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="modal-default-button py-2 px-4 rounded-md border border-yellow-100"
                @click="$emit('closeModal')"
              >
                Hủy
              </button>
              <button
                type="button"
                class="modal-default-button bg-yellow-100 py-3 px-4 rounded-md"
                @click="
                  () => {
                    if (onClick) onClick();
                    $emit('closeModal');
                  }
                "
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
