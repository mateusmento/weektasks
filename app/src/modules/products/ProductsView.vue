<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { createProductsRepository } from "@/lib/service/products.service";
import type { Product } from "./product.model";

const products = ref<Product[]>([]);
const productName = ref("");

const productsRepo = createProductsRepository();

onMounted(async () => {
  products.value = await productsRepo.fetchProducts();
});

async function createProduct() {
  productsRepo.createProduct({ name: productName.value });
}
</script>

<template>
  <main class="products-view">
    <div>
      <div class="page-title">
        <b>Your Products</b>
      </div>
      <ul class="product-list list menu">
        <li class="menu-item" v-for="product in products" :key="product.id">
          <router-link :to="`/products/${product.id}/backlog`">{{product.name}}</router-link>
        </li>
      </ul>
      <form class="form-group" @submit.prevent="createProduct">
        <input class="small" v-model="productName" placeholder="Product's name..."/>
        <button type="submit">Create</button>
      </form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.products-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.product-list {
  margin-bottom: 10px;
}
</style>
