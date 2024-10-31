import { z } from 'zod';
import { checkIsInteger, checkIsNumber } from '../utils/number';

const stringNumberSchema = z
  .custom<number>(
    (value) => {
      return checkIsNumber(value);
    },
    { message: `phải là dạng số (number)` },
  )
  .transform((value) => Number(value));

const stringIntegerSchema = z
  .custom<number>(
    (value) => {
      return checkIsInteger(value);
    },
    { message: `phải là số nguyên (integer)` },
  )
  .transform((value) => Number(value));

export { stringNumberSchema, stringIntegerSchema };
