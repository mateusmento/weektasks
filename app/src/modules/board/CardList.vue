<script lang="ts" setup>
defineProps<{
  title: string;
  issues: any[];
}>();
</script>

<template>
  <div class="card-list">
    <div class="header">
      <h4>{{ title }}</h4>
      <div class="issues-count">{{ issues.length }} issues</div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  height: 100%;
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 0 3px rgba(#000, 0.25);
  background: #fff;
}

.header {
  padding: 10px 20px;
  font-size: 18px;
}

.issues-count {
  color: #777;
  font-size: 14px;
  margin-top: 10px;
}

.content {
  border-radius: 10px;
  background: #f4f9ff;
  padding: 10px;
}
</style>
