import { axios } from '@/lib/axios';
import type { User } from '@/lib/models/user.model';
import { AxiosError } from 'axios';

export async function authenticate(): Promise<User | undefined> {
  try {
    const { data } = await axios.get('/auth/access');
    return data.user;
  } catch (ex) {
    if (ex instanceof AxiosError) {
      return;
    } else {
      throw ex;
    }
  }
}
