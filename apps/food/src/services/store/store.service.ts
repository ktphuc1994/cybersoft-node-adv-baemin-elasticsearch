import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  StoreAndFee,
  StoreAndMenu,
  StoreAndShippingPartner,
  ValidateShippingMethodRequest,
} from '@app/shared/schema/store.schema';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStoreDetail(storeId: number): Promise<StoreAndMenu> {
    const storeInfoPromise = this.prismaService.store.findFirst({
      where: { store_id: storeId },
      include: {
        shipping_partner: { select: { partner_name: true, service_fee: true } },
      },
      omit: { created_at: true, updated_at: true },
    });
    const menuListPromise = this.prismaService.menu.findMany({
      where: { menu_food: { some: { food: { store_id: storeId } } } },
      select: { menu_id: true, name: true },
    });
    const [storeInfo, menuList] = await Promise.all([
      storeInfoPromise,
      menuListPromise,
    ]);

    if (!storeInfo) throw new NotFoundException('Cửa hàng không tồn tại.');
    return { ...storeInfo, menuList };
  }

  async getStoreAndShippingPartner(
    store_id: number,
  ): Promise<StoreAndShippingPartner | null> {
    const storeInfo = await this.prismaService.store.findFirst({
      where: { store_id },
      select: {
        store_id: true,
        name: true,
        shipping_partner: {
          select: {
            service_fee: true,
            shipping_partner_method: { select: { shipping_method: true } },
          },
        },
      },
    });

    if (!storeInfo) return null;

    const shippingMethods =
      storeInfo.shipping_partner.shipping_partner_method.map(
        (shippingInfo) => shippingInfo.shipping_method,
      );

    return {
      store_id: storeInfo.store_id,
      name: storeInfo.name,
      service_fee: storeInfo.shipping_partner.service_fee,
      shippingMethods,
    };
  }

  async validateShippingMethod({
    store_id,
    method_id,
  }: ValidateShippingMethodRequest): Promise<StoreAndFee | null> {
    const storeInfo = await this.prismaService.store.findFirst({
      where: {
        store_id,
        shipping_partner: {
          shipping_partner_method: {
            some: { method_id },
          },
        },
      },
      select: {
        store_id: true,
        shipping_partner: {
          select: {
            service_fee: true,
            shipping_partner_method: {
              where: { method_id },
              select: { shipping_method: { select: { shipping_price: true } } },
            },
          },
        },
      },
    });

    if (!storeInfo) return null;

    return {
      store_id: storeInfo.store_id,
      service_fee: storeInfo.shipping_partner.service_fee.toNumber(),
      shipping_price:
        storeInfo.shipping_partner.shipping_partner_method[0].shipping_method
          .shipping_price,
    };
  }
}
