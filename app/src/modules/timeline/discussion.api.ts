import { axios } from '@/lib/axios';

export class DiscussionApi {
  findDiscussions(productId: number, page: number, pageSize: number) {
    return axios
      .get(`/products/${productId}/discussions`, { params: { page, pageSize } })
      .then((res) => res.data);
  }

  findDiscussion(discussionId: number) {
    return axios.get(`/discussions/${discussionId}`).then((res) => res.data);
  }

  createDiscussion(productId: number, discussion: any) {
    return axios.post(`/products/${productId}/discussions`, discussion).then((res) => res.data);
  }

  likeDiscussion(id: number) {
    return axios.put(`/discussions/${id}/like`).then((res) => res.data);
  }

  findReplies(discussionId: number) {
    return axios.get(`/discussions/${discussionId}/replies`).then((res) => res.data);
  }

  createReply(discussionId: number, reply: any) {
    return axios.post(`/discussions/${discussionId}/replies`, reply).then((res) => res.data);
  }

  likeReply(id: number) {
    return axios.put(`/replies/${id}/like`).then((res) => res.data);
  }
}
