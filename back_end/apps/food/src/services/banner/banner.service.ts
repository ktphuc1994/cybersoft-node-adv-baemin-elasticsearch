import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Banner } from '@app/shared/types/banner.type';

@Injectable()
export class BannerService {
  constructor(private readonly prismaService: PrismaService) {}

  getAllBanner(): Promise<Banner[]> {
    return this.prismaService.banner.findMany({
      omit: { created_at: true, updated_at: true },
    });
  }
}
