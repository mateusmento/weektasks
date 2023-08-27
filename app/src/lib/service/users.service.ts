import { axios } from '@/lib/axios';
import type { User } from '@/lib/models/user.model';

export const createUsersRepository = () => ({
  searchUsers(name: string) {
    return axios.get<User[]>('/users', { params: { name } }).then((res) => res.data);
  },

  createUser(user: any) {
    return axios.post('/auth/users', user).then((res) => res.data);
  },
});
