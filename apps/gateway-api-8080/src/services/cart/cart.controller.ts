import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { UserInReq } from '@app/shared/types/shared.type';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(AppGuard)
  getCart(@CurrentUser() userInfo: UserInReq) {
    return this.cartService.getCart(userInfo.user_id);
  }
}
