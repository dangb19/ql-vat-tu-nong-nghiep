<script setup>
import { Teleport } from "vue";

const props = defineProps({
  showModal: Boolean,
});
</script>

<template>
  <Teleport to="#modals">
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed z-50 top-0 left-0 w-full h-full flex transition-opacity duration-200 ease-in-out bg-[rgba(0,0,0,0.5)]"
      >
        <div
          class="flex flex-col gap-6 w-[18rem] m-auto -translate-y-10 p-6 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-200 ease-in-out"
        >
          <div class="text-xl text-gray-800 font-semibold">
            <slot name="title">title</slot>
          </div>

          <div class="flex flex-col gap-2 text-sm font-light">
            <slot name="content"></slot>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <slot name="actions">
              actions
              <button class="modal-default-button" @click="$emit('closeModal')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
