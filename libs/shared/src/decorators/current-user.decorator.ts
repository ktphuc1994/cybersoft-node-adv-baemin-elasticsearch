import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInReq } from '../types/shared.type';

const getCurrentUserByContext = (ctx: ExecutionContext): UserInReq => {
  return ctx.switchToHttp().getRequest().user;
};
const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);

export { CurrentUser };
