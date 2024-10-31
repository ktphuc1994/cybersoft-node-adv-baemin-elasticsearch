import { z } from 'zod';
import {
  StoreAndShippingPartner,
  StoreAndShippingPartnerFromMicro,
} from './store.schema';
import { CartFood } from './cart.schema';
import { Voucher } from './voucher.schema';
import { stringIntegerSchema } from './common.schema';

enum PAYMENT_TYPE {
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  CARD = 'CARD',
  COD = 'COD',
}
const paymentTypeSchema = z.nativeEnum(PAYMENT_TYPE);

enum ORDER_STATUS {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}
const orderStatusSchema = z.nativeEnum(ORDER_STATUS);

type GetOrderInfoQuery = {
  foodIds: string;
  storeId: string;
};

const createOrderRequestSchema = z.object({
  user_id: z.number().int(),
  address_id: z.number().int(),
  voucher_id: z.number().int().optional(),
  store_id: z.number().int(),
  method_id: z.number().int(),
  foodIds: z.number().int().array(),
  message: z.string().nullable().optional(),
  payment_method: paymentTypeSchema,
});
type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
type PlaceOrderRequest = Omit<CreateOrderRequest, 'foodIds'> & {
  shipping_price: number;
  service_fee_percentage: number;
  foodList: CartFood[];
  discountPercentage: number;
};

const updateStatusRequestSchema = z.object({
  status: orderStatusSchema,
  order_id: z.number().int(),
});
type UpdateStatusRequest = z.infer<typeof updateStatusRequestSchema>;

type OrderInfoRequest = {
  storeInfo: StoreAndShippingPartnerFromMicro;
  cartFoodList: CartFood[];
};

type OrderInfoResponse = {
  store: Omit<StoreAndShippingPartner, 'service_fee'> & {
    service_fee: number;
  };
  food: CartFood[];
  voucherList: Voucher[];
};

const orderDetailRequestSchema = z.object({
  order_id: stringIntegerSchema,
  user_id: z.number().int(),
});
type OrderDetailRequest = z.infer<typeof orderDetailRequestSchema>;

export {
  PAYMENT_TYPE,
  ORDER_STATUS,
  paymentTypeSchema,
  orderStatusSchema,
  createOrderRequestSchema,
  updateStatusRequestSchema,
  orderDetailRequestSchema,
  type GetOrderInfoQuery,
  type CreateOrderRequest,
  type PlaceOrderRequest,
  type UpdateStatusRequest,
  type OrderInfoRequest,
  type OrderInfoResponse,
  type OrderDetailRequest,
};
