<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style lang="sass" scoped>
header
  width: 100%
  background: rgb(239, 247, 255)

nav
  display: flex
  justify-content: flex-end
  width: 100%
  padding: 1rem
  font-size: 1rem
  a
    padding: 0 1rem
</style>
