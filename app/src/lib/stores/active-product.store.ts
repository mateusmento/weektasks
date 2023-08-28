import type { Product } from '@/modules/products/product.model';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useActiveProductStore = defineStore('active-product', () => {
  const product = ref<Product>();
  return { product };
});
