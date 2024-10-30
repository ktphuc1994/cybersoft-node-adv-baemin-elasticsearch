import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Voucher } from '@app/shared/schema/voucher.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VoucherService {
  constructor(private readonly prismaService: PrismaService) {}

  getVoucherList(): Promise<Voucher[]> {
    return this.prismaService.voucher.findMany({
      select: { voucher_id: true, percentage: true },
    });
  }

  getVoucherById(voucher_id: number): Promise<Voucher | null> {
    return this.prismaService.voucher.findFirst({
      where: { voucher_id },
      select: { voucher_id: true, percentage: true },
    });
  }
}
