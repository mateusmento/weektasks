<script lang="ts" setup>
import IconChecked from '@/lib/components/icons/IconChecked.vue';
import IconRadioChecked from '@/lib/components/icons/IconRadioChecked.vue';
import IconUnchecked from '@/lib/components/icons/IconUnchecked.vue';

defineProps<{
  modelValue?: boolean,
  radio?: boolean,
}>();
</script>

<template>
  <IconChecked v-if="modelValue && !radio" @click="$emit('update:modelValue', false)"/>
  <IconRadioChecked v-else-if="modelValue && radio" @click="$emit('update:modelValue', false)"/>
  <IconUnchecked v-else @click="$emit('update:modelValue', true)"/>
</template>
