import { ArgumentMetadata, ParseIntPipe } from '@nestjs/common';

export class EnhancedParseIntPipe extends ParseIntPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    try {
      return await super.transform(value, metadata);
    } catch {
      let errorMessage = 'yêu cầu định dạng là số nguyên (integer)';
      if (metadata.data) {
        errorMessage = `${metadata.data} phải là số nguyên (integer)`;
      }
      throw this.exceptionFactory(errorMessage);
    }
  }
}
