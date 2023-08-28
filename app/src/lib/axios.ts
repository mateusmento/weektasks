import Axios from 'axios';
import { envs } from './utils/envs';

export const axios = Axios.create({
  baseURL: envs.API_BASE_URL,
  withCredentials: true,
});
