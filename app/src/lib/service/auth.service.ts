import { axios } from '@/lib/axios';

export const createAuthService = () => new AuthService();

class AuthService {
  signin(credentials: any) {
    return axios.post('/auth/access', credentials);
  }

  signout() {
    return axios.delete('/auth/access');
  }
}
