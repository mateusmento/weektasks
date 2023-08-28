import { authenticate } from '@/lib/auth/authenticate';
import { useAuthUserStore } from '@/lib/auth/auth-user.store';
import { createProductsRepository } from '../service/products.service';
import { useActiveProductStore } from '../stores/active-product.store';

export async function beforeEnter(to: any) {
  const store = useAuthUserStore();
  const user = await authenticate();

  if (to.params.id) {
    const productService = createProductsRepository();
    const activeProductStore = useActiveProductStore();
    activeProductStore.product = await productService.findProduct(to.params.id);
  }

  if (!user) {
    store.user = null;
    return { name: 'signin' };
  } else {
    store.user = user;
  }
}
