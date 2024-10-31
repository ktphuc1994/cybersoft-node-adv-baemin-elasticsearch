import { Controller } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VOUCHER_PATTERN } from '@app/shared/constants/microservice-pattern.const';

@Controller()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @MessagePattern(VOUCHER_PATTERN.LIST)
  getVoucherList() {
    return this.voucherService.getVoucherList();
  }

  @MessagePattern(VOUCHER_PATTERN.DETAIL)
  getVoucherById(@Payload() voucher_id: number) {
    return this.voucherService.getVoucherById(voucher_id);
  }
}
