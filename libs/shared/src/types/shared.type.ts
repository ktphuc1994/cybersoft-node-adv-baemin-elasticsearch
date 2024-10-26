type RequestWithUser = {
  user: UserInReq;
};
type UserInReq = { user_id: number; email: string; iat: number; exp: number };

type MicroserviceHttpExceptionType = {
  message: string;
  statusCode: number;
  error?: string;
};

export { RequestWithUser, UserInReq, MicroserviceHttpExceptionType };
