import { Catch, HttpException, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { MicroserviceHttpExceptionType } from '../types/shared.type';

@Catch(HttpException)
export class MicroserviceHttpExceptionFilter
  implements RpcExceptionFilter<HttpException>
{
  catch(exception: HttpException): Observable<MicroserviceHttpExceptionType> {
    const errorInformation = exception.getResponse() as
      | string
      | MicroserviceHttpExceptionType;
    const statusCode = exception.getStatus();
    const message =
      typeof errorInformation === 'string'
        ? errorInformation
        : errorInformation.message;

    return throwError(() => ({ statusCode, message }));
  }
}
