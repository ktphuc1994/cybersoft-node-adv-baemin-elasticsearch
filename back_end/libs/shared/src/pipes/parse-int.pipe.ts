import {
  ArgumentMetadata,
  ParseIntPipe,
  ParseIntPipeOptions,
} from '@nestjs/common';

type ContructorProps = {
  fieldName?: string;
  options?: ParseIntPipeOptions;
};

export class EnhancedParseIntPipe extends ParseIntPipe {
  private fieldName?: string;
  constructor(constructorOption: ContructorProps) {
    super(constructorOption?.options);
    this.fieldName = constructorOption?.fieldName;
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    try {
      return await super.transform(value, metadata);
    } catch {
      if (this.fieldName) {
        throw this.exceptionFactory(
          `${this.fieldName} phải là số nguyên (integer)`,
        );
      }
      if (metadata.data) {
        throw this.exceptionFactory(
          `${metadata.data} phải là số nguyên (integer)`,
        );
      }
      throw this.exceptionFactory('yêu cầu định dạng là số nguyên (integer)');
    }
  }
}
