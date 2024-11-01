import { HttpException } from '@nestjs/common';
import { CustomHttpStatus } from '../constants/httpStatus';

export class UnprocessableContentException extends HttpException {
  constructor(message?: string) {
    super(
      message ?? 'Unable to process request',
      CustomHttpStatus.UNPROCCESSABLE_CONTENT,
    );
  }
}
