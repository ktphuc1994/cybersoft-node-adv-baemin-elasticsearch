import { Controller } from '@nestjs/common';
import { BannerService } from './banner.service';
import { MessagePattern } from '@nestjs/microservices';
import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';

@Controller()
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @MessagePattern(FOOD_PATTERN.BANNER_LIST)
  getMenuList() {
    return this.bannerService.getAllBanner();
  }
}
