import { axios } from '@/lib/axios';
import type { Collaborator, Product } from '@/modules/products/product.model';

type FindProductsResult = {
  own: Product[];
  collaborating: Product[];
};

type Id = string | number;

export class ProductApi {
  fetchProducts() {
    return axios.get<FindProductsResult>('/products').then((res) => res.data);
  }

  findProduct(id: Id) {
    return axios.get<Product>(`/products/${id}`).then((res) => res.data);
  }

  createProduct(product: Partial<Product>) {
    return axios.post<Product>('/products', product).then((res) => res.data);
  }

  fetchCollaborators(id: Id) {
    return axios.get<Collaborator[]>(`/products/${id}/collaborators`).then((res) => res.data);
  }

  includeCollaborator(id: Id, userId: Id) {
    return axios.post(`/products/${id}/collaborators`, { userId: +userId }).then((res) => res.data);
  }

  removeCollaborator(id: Id, collabId: Id) {
    return axios.delete(`/products/${id}/collaborators/${collabId}`);
  }
}
