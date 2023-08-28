import { axios } from '@/lib/axios';
import type { Collaborator, Product } from '@/modules/products/product.model';

type FindProductsResult = {
  own: Product[];
  collaborating: Product[];
};

export const createProductsRepository = () => ({
  fetchProducts() {
    return axios.get<FindProductsResult>('/products').then((res) => res.data);
  },

  findProduct(id: number) {
    return axios.get<Product>(`/products/${id}`).then((res) => res.data);
  },

  createProduct(product: Partial<Product>) {
    return axios.post<Product>('/products', product).then((res) => res.data);
  },

  fetchCollaborators(id: number) {
    return axios.get<Collaborator[]>(`/products/${id}/collaborators`).then((res) => res.data);
  },

  includeCollaborator(id: number, userId: number) {
    return axios.post(`/products/${id}/collaborators`, { userId }).then((res) => res.data);
  },

  removeCollaborator(id: number, collabId: number) {
    return axios.delete(`/products/${id}/collaborators/${collabId}`);
  },
});
