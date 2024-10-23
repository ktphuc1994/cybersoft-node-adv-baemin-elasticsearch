import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  getHello() {
    return this.prismaService.user.findMany();
  }
}
