import { AxiosError } from 'axios';
import { Alert } from './alert';

export async function requestApi<T>(action: Promise<T> | (() => Promise<T>)) {
  try {
    return await (action instanceof Function ? action() : action);
  } catch (ex) {
    if (ex instanceof AxiosError) Alert.error(ex.response?.data.message);
    throw ex;
  }
}
