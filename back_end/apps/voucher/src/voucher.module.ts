import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
