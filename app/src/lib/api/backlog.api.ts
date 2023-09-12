import { axios } from '@/lib/axios';
import type { Issue } from '../models/issue.model';

export const createBacklogRepository = (productId: number) => ({
  async fetchBacklogItems() {
    const url = `/products/${productId}/backlog-items`;
    return axios.get<any[]>(url).then((res) => res.data);
  },

  async createIssue(item: any) {
    const url = `/products/${productId}/issues`;
    return axios.post<Issue>(url, item).then((res) => res.data);
  },

  removeIssue(id: number) {
    return axios.delete(`/issues/` + id);
  },

  async includeItem(item: any) {
    const url = `/products/${productId}/backlog-items`;
    return axios.post(url, item).then((res) => res.data);
  },

  removeItem(id: number) {
    return axios.delete(`/products/${productId}/backlog-items/${id}`);
  },

  moveItem(id: number, order: number) {
    const url = `/products/${productId}/backlog-items/${id}/order`;
    return axios.put(url, { order });
  },
});

export class BacklogApi {
  async fetchBacklogItems(productId: number) {
    const url = `/products/${productId}/backlog-items`;
    return axios.get<any[]>(url).then((res) => res.data);
  }

  async createIssue(productId: number, item: any) {
    const url = `/products/${productId}/issues`;
    return axios.post<Issue>(url, item).then((res) => res.data);
  }

  removeIssue(id: number) {
    return axios.delete(`/issues/` + id);
  }

  async includeItem(productId: number, item: any) {
    const url = `/products/${productId}/backlog-items`;
    return axios.post(url, item).then((res) => res.data);
  }

  removeItem(productId: number, id: number) {
    return axios.delete(`/products/${productId}/backlog-items/${id}`);
  }

  moveItem(productId: number, id: number, order: number) {
    const url = `/products/${productId}/backlog-items/${id}/order`;
    return axios.put(url, { order });
  }
}
