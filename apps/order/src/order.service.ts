import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  getInformationByFoodIds(): string {
    return 'Order Hello World!';
  }
}
