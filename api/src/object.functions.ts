import { plainToClassFromExist } from 'class-transformer';

export function patchObject<T>(object: T, partial: Partial<T>) {
  return plainToClassFromExist(object, partial);
}
