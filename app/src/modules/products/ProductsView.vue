<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { createProductsRepository } from '@/lib/api/products.api';
import type { Product } from './product.model';

const products = reactive({
  own: [] as Product[],
  collaborating: [] as Product[],
});

const productName = ref('');

const productsRepo = createProductsRepository();

onMounted(async () => {
  const { own, collaborating } = await productsRepo.fetchProducts();
  products.own = own;
  products.collaborating = collaborating;
});

async function createProduct() {
  const product = await productsRepo.createProduct({ name: productName.value });
  products.own.push(product);
}
</script>

<template>
  <main class="products-view">
    <div class="products">
      <div>
        <div class="page-title">
          <b>Your Products</b>
        </div>

        <ul v-if="products.own.length > 0" class="product-list list menu">
          <li class="menu-item" v-for="product in products.own" :key="product.id">
            <router-link :to="`/products/${product.id}/backlog`">{{ product.name }}</router-link>
          </li>
        </ul>

        <form class="form-group" @submit.prevent="createProduct">
          <input class="small" v-model="productName" placeholder="Product's name..." />
          <button type="submit">Create</button>
        </form>
      </div>

      <div>
        <div class="page-title">
          <b>Collaborating Products</b>
        </div>

        <ul v-if="products.collaborating.length > 0" class="product-list list menu">
          <li class="menu-item" v-for="product in products.collaborating" :key="product.id">
            <router-link :to="`/products/${product.id}/backlog`">{{ product.name }}</router-link>
          </li>
        </ul>
      </div>
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

.products {
  display: flex;
  gap: 40px;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.product-list {
  margin-bottom: 10px;
}
</style>
@/lib/api/products.api
