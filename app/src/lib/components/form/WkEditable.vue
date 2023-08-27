<template>
  <input v-if="editable" v-bind="$attrs" v-model="modelValue" />
  <template v-else>
    <slot name="text" :attrs="$attrs" :value="modelValue">
      <span v-bind="$attrs">{{ modelValue }}</span>
    </slot>
  </template>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, useAttrs, withDefaults } from "vue";

withDefaults(
  defineProps<{
    editable?: boolean;
  }>(),
  {
    editable: false,
  }
);

let emit = defineEmits(["update:modelValue"]);

let $attrs = useAttrs();

let modelValue = computed({
  get: () => $attrs.modelValue,
  set: (v: any) => emit("update:modelValue", v),
});
</script>
