import { axios } from '@/lib/axios';

export const createBacklogRepository = (productId: number) => ({
  async fetchBacklogItems() {
    const url = `/products/${productId}/backlog-items`;
    return axios.get<any[]>(url).then((res) => res.data);
  },

  async createIssue(item: any) {
    const url = `/products/${productId}/issues`;
    return axios.post<any[]>(url, item).then((res) => res.data);
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
