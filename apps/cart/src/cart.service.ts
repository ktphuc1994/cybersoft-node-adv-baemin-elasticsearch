import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  getCart(userId: number) {
    return `UserId: ${userId}`;
  }
}
