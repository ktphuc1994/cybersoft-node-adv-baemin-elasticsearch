import { Request } from 'express';

type JwtRequest = Request & {
  jwt: string | null;
};

export { JwtRequest };
