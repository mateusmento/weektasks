<template>
  <div
    class="combo-box dropdown"
    :class="{ active: showOptions }"
    v-on-click-outside="() => (showOptions = false)"
  >
    <input
      v-model="textModel"
      v-bind="$attrs"
      :placeholder="placeholder"
      autocomplete="off"
      @keyup="onKeyUp"
      @click="showOptions = options.length > 0"
    />
    <ul class="dropdown-menu list menu">
      <li
        class="menu-item"
        v-for="option of options"
        :key="option[trackby]"
        @click="selectOption(option)"
      >
        {{ option[labelBy] }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const props = defineProps<{
  value: any;
  text: string;
  search: (text: string) => Promise<any[]>;
  trackby: string;
  labelBy: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:value', 'update:text']);

const showOptions = ref(false);
const options = ref<any[]>([]);

const updateValue = (v: any) => emit('update:value', v);

const textModel = computed({
  get: () => props.text,
  set: (v: any) => emit('update:text', v),
});

async function onKeyUp() {
  if (props.text.trim() === '') {
    options.value = [];
    showOptions.value = false;
  } else {
    options.value = await props.search(props.text);
    showOptions.value = options.value.length > 0;
  }
}

function selectOption(option: any) {
  updateValue(option);
  showOptions.value = false;
}
</script>

<style lang="sass" scoped></style>
