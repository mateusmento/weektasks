<script lang="ts" setup>
defineProps<{
  thick?: boolean;
}>();
</script>

<template>
  <div class="colorful-bar" :class="{ thick }">
    <div class="purple"></div>
    <div class="yellow"></div>
    <div class="green"></div>
    <div class="orange"></div>
    <div class="cyan"></div>
  </div>
</template>

<style scoped>
.colorful-bar {
  display: flex;
}
.colorful-bar div {
  height: 2px;
}
.colorful-bar.thick div {
  height: 10px;
}
.purple {
  background-color: #8459ff;
  flex: 3;
}
.yellow {
  background-color: #ffee59;
  flex: 1;
}
.green {
  background-color: #a2ff59;
  flex: 2;
}
.orange {
  background-color: #ffd159;
  flex: 1.5;
}
.cyan {
  background-color: #59ffc3;
  flex: 2.5;
}
</style>
