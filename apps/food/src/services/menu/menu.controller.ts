import { Controller } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MessagePattern } from '@nestjs/microservices';
import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern(FOOD_PATTERN.MENU_LIST)
  getMenuList() {
    return this.menuService.getMenuList();
  }
}
