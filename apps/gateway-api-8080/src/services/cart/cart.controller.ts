import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { UserInReq } from '@app/shared/types/shared.type';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { Observable } from 'rxjs';
import {
  AddCartRequest,
  UpdateCartRequest,
} from '@app/shared/schema/cart.schema';

@UseGuards(AppGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() userInfo: UserInReq) {
    return this.cartService.getCart(userInfo.user_id);
  }

  @Get('total')
  getCartTotalItems(@CurrentUser() userInfo: UserInReq): Observable<number> {
    return this.cartService.getCartTotalItem(userInfo.user_id);
  }

  @Post('add')
  addToCart(
    @CurrentUser() userInfo: UserInReq,
    @Body() cartInfo: Pick<AddCartRequest, 'food_id'>,
  ) {
    return this.cartService.addToCart({
      food_id: cartInfo.food_id,
      user_id: userInfo.user_id,
    });
  }

  @Put('update')
  updateItemInCart(
    @CurrentUser() userInfo: UserInReq,
    @Body() cartInfo: Pick<UpdateCartRequest, 'food_id' | 'quantity'>,
  ) {
    return this.cartService.updateItemInCart({
      food_id: cartInfo.food_id,
      quantity: cartInfo.quantity,
      user_id: userInfo.user_id,
    });
  }

  @Delete('remove/:foodId')
  removeCartItem(
    @CurrentUser() userInfo: UserInReq,
    @Param('foodId') foodId: number,
  ) {
    return this.cartService.removeCartItem({
      food_id: foodId,
      user_id: userInfo.user_id,
    });
  }
}
