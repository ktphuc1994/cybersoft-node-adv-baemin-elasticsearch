import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

const storeSchema = z.object({
  store_id: z.number(),
  address: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
  open_hour: z.date().nullable().optional(),
  close_hour: z.date().nullable().optional(),
  price_range: z.string().nullable().optional(),
  rating: z.instanceof(Decimal).nullable().optional(),
  total_rating: z.number().nullable().optional(),
  partner_id: z.number().nullable().optional(),
  shipping_partner: z
    .object({
      partner_name: z.string(),
      service_fee: z.instanceof(Decimal),
    })
    .optional(),
});
type Store = z.infer<typeof storeSchema>;

const storeAndMenuSchema = storeSchema.extend({
  menuList: z
    .object({
      menu_id: z.number(),
      name: z.string(),
    })
    .array(),
});
type StoreAndMenu = z.infer<typeof storeAndMenuSchema>;

const validateShippingMethodRequestSchema = z.object({
  store_id: z.number().int(),
  method_id: z.number().int(),
});
type ValidateShippingMethodRequest = z.infer<
  typeof validateShippingMethodRequestSchema
>;
type StoreAndFee = {
  store_id: number;
  service_fee: number;
  shipping_price: number;
};

type ShippingMethod = {
  method_id: number;
  shipping_name: string;
  shipping_price: number;
  shipping_time: string;
};
type StoreAndShippingPartner = Pick<Store, 'store_id' | 'name'> & {
  service_fee: Decimal;
  shippingMethods: ShippingMethod[];
};
type StoreAndShippingPartnerFromMicro = Omit<
  StoreAndShippingPartner,
  'service_fee'
> & {
  service_fee: string;
};

export {
  storeSchema,
  validateShippingMethodRequestSchema,
  type Store,
  type StoreAndMenu,
  type StoreAndShippingPartner,
  type StoreAndShippingPartnerFromMicro,
  type ValidateShippingMethodRequest,
  type StoreAndFee,
  type ShippingMethod,
};
