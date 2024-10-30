import { prismaErrorCodes } from '@app/shared/constants/prismaErrorCode.const';
import { UnprocessableContentException } from '@app/shared/exceptions/UnprocessableContent.exception';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  AddCartRequest,
  CartFood,
  RemoveCartRequest,
  RemoveManyCartRequest,
  UpdateCartRequest,
  ValidateCartRequest,
} from '@app/shared/schema/cart.schema';
import { checkIsArrayDuplicated } from '@app/shared/utils/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCart(user_id: number) {
    const storeList = await this.prismaService.store.findMany({
      where: { food: { some: { cart: { some: { user_id } } } } },
      select: {
        store_id: true,
        name: true,
        food: {
          where: { cart: { some: { user_id } } },
          select: {
            food_id: true,
            name: true,
            description: true,
            image: true,
            price: true,
            stock: true,
            cart: { where: { user_id }, select: { quantity: true } },
          },
        },
      },
    });

    const result = storeList.map((store) => {
      const foodList = store.food.map((foodInfo) => ({
        food_id: foodInfo.food_id,
        name: foodInfo.name,
        description: foodInfo.description,
        image: foodInfo.image,
        price: foodInfo.price,
        quantity: foodInfo.cart[0].quantity,
        stock: foodInfo.stock,
      }));
      return { ...store, food: foodList };
    });

    return result;
  }

  getCartTotalItem(user_id: number): Promise<number> {
    return this.prismaService.cart.count({ where: { user_id } });
  }

  async addToCart({ food_id, user_id, stock }: AddCartRequest) {
    if (stock === 0) throw new BadRequestException('Món ăn đã hết hàng.');

    const existItem = await this.prismaService.cart.findFirst({
      where: { user_id, food_id },
    });

    if (!existItem)
      return this.prismaService.cart.create({
        data: { user_id, food_id, quantity: 1 },
      });

    if (stock <= existItem.quantity)
      throw new BadRequestException(
        `Số lượng món được đặt tối đa là ${stock}.`,
      );

    return this.prismaService.cart.update({
      where: { user_id_food_id: { user_id, food_id } },
      data: { quantity: existItem.quantity + 1, updated_at: new Date() },
    });
  }

  async updateItemInCart({
    user_id,
    food_id,
    quantity,
    stock,
  }: UpdateCartRequest) {
    if (stock === 0) throw new BadRequestException('Món ăn đã hết hàng.');

    const existItem = await this.prismaService.cart.findFirst({
      where: { user_id, food_id },
    });
    if (!existItem)
      throw new BadRequestException('Món ăn không tồn tại trong giỏ hàng.');

    if (stock < quantity)
      throw new BadRequestException(
        `Số lượng món được đặt tối đa là ${stock}.`,
      );

    return this.prismaService.cart.update({
      where: { user_id_food_id: { user_id, food_id } },
      data: { quantity, updated_at: new Date() },
    });
  }

  async removeCartItem({ food_id, user_id }: RemoveCartRequest) {
    try {
      await this.prismaService.cart.delete({
        where: { user_id_food_id: { food_id, user_id } },
      });
      return 'Success';
    } catch (error) {
      if (
        !(error instanceof PrismaClientKnownRequestError) ||
        error.code !== prismaErrorCodes.notFound
      )
        throw new UnprocessableContentException(
          'Không thể xóa món ăn. Xin hãy thử lại sau.',
        );

      throw new BadRequestException(
        'Không thể xóa món ăn. Món ăn không tồn tại trong giỏ hàng.',
      );
    }
  }

  removeManyCartItems({ user_id, foodIds }: RemoveManyCartRequest) {
    return this.prismaService.cart.deleteMany({
      where: { user_id, food_id: { in: foodIds } },
    });
  }

  async validateCartItems({
    user_id,
    foodIds,
  }: ValidateCartRequest): Promise<CartFood[] | null> {
    if (checkIsArrayDuplicated(foodIds))
      throw new BadRequestException('Món ăn bị trùng.');

    const cartFoodList = await this.prismaService.cart.findMany({
      where: { user_id, food_id: { in: foodIds } },
      select: {
        food_id: true,
        quantity: true,
        food: {
          select: { name: true, price: true, image: true, description: true },
        },
      },
    });

    if (cartFoodList.length !== foodIds.length) return null;
    return cartFoodList.map((foodInfo) => ({
      ...foodInfo.food,
      food_id: foodInfo.food_id,
      quantity: foodInfo.quantity,
    }));
  }
}
