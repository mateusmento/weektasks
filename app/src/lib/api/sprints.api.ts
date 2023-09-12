import { axios } from '@/lib/axios';
import type { Sprint } from '@/lib/models/sprint.model';

export class SprintApi {
  fetchSprints(productId: number) {
    return axios.get<any[]>(`/products/${productId}/sprints`).then((res) => res.data);
  }

  fetchPastSprints(productId: number) {
    return axios.get<Sprint[]>(`/products/${productId}/past-sprints`).then((res) => res.data);
  }

  createSprint(productId: number, sprint: any) {
    const url = `/products/${productId}/sprints`;
    return axios.post(url, sprint).then((res) => res.data);
  }

  patchSprint(id: number, partial: Partial<Sprint>) {
    return axios.patch('/sprints/' + id, partial).then((res) => res.data);
  }

  removeSprint(id: number) {
    return axios.delete('/sprints/' + id);
  }

  moveSprint(id: number, order: number) {
    return axios.put(`/sprints/${id}/order`, { order }).then((res) => res.data);
  }

  startSprint(id: number) {
    return axios.post<Sprint>(`/sprints/${id}/start`).then((res) => res.data);
  }

  endSprint(id: number) {
    return axios.post<Sprint>(`/sprints/${id}/end`).then((res) => res.data);
  }

  createIssue(id: number, issue: any) {
    return axios.post(`/sprints/${id}/issues`, issue).then((res) => res.data);
  }

  removeIssue(id: number) {
    return axios.delete(`/issues/${id}`);
  }

  includeItem(id: number, item: any) {
    return axios.post(`/sprints/${id}/backlog-items`, item).then((res) => res.data);
  }

  removeItem(id: number, itemId: number) {
    return axios.delete(`/sprints/${id}/backlog-items/${itemId}`);
  }

  moveItem(id: number, itemId: number, order: number) {
    return axios
      .put(`/sprints/${id}/backlog-items/${itemId}/order`, { order })
      .then((res) => res.data);
  }
}
