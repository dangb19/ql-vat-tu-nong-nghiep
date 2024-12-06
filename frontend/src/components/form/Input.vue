<script setup>
const props = defineProps([
  "type",
  "name",
  "placeholder",
  "required",
  "classes",
  "step",
]);
const model = defineModel();
const emit = defineEmits(["onChange"]);
</script>
<template>
  <input
    :type="type"
    :name="name"
    :required="required"
    :placeholder="placeholder"
    v-model="model"
    @change="(e) => emit('onChange', e)"
    :class="classes"
    :step="step"
    min="0"
    class="bg-yellow-100 py-3 px-4 text-gray-800 placeholder:text-gray-600 outline-none outline-offset-0 focus:outline-yellow-400 rounded-md"
  />
</template>
