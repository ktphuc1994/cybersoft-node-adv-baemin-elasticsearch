import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GatewayHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const errorInformation = exception.getResponse();
    const statusCode = exception.getStatus();
    if (typeof errorInformation === 'string') {
      res.status(statusCode).json({ message: errorInformation });
      return;
    }

    res.status(statusCode).json(errorInformation);
  }
}
