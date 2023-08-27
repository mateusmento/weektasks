<script lang="ts" setup>
import BacklogItems from './BacklogItems.vue';
</script>

<template>
  <div class="product-backlog">
    <div class="topsection">
      <div>
        <div class="subtitle">Product</div>
        <div class="title">Weektasks</div>
      </div>

      <div>
        <div class="subtitle">Collaborators</div>
      </div>
    </div>

    <div class="product-backlog-label">Product Backlog</div>

    <BacklogItems />
  </div>
</template>

<style lang="scss" scoped>
.product-backlog {
  background-color: white;
  width: 700px;
  padding: 60px;
  position: relative;
  top: 0;
  bottom: 0;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);
}

.topsection {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.subtitle {
  font-size: 20px;
  color: #777;
}

.title {
  font-size: 32px;
  color: #474747;
}

.product-backlog-label {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
