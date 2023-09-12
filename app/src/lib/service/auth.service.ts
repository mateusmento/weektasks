import { axios } from '@/lib/axios';

export const createAuthService = () => new AuthApi();

export class AuthApi {
  signin(credentials: any) {
    return axios.post('/auth/access', credentials);
  }

  signout() {
    return axios.delete('/auth/access');
  }
}
