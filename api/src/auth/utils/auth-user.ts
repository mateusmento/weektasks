import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  }
);
