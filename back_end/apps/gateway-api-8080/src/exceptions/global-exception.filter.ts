import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GatewayGlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const statusCode = exception.statusCode ?? 500;
    const message = exception.message
      ? exception.message
      : 'Internal Server Error';
    res.status(statusCode).json({ message, error: exception.error });
  }
}
