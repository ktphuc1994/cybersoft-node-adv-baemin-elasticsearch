import { Decimal } from '@prisma/client/runtime/library';

type Voucher = {
  voucher_id: number;
  percentage: Decimal;
};

export { type Voucher };
