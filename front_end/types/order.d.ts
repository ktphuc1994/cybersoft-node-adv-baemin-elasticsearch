import { PAYMENT_TYPE } from '@/constants/payment';
import { Food } from './food';
import { ShippingMethod, Store, Voucher } from './store';
import { ORDER_STATUS } from '@/constants/order';
import { UserAddress, UserProfile } from './user';

type OrderPreparationFood = Pick<
  Food,
  'food_id' | 'name' | 'price' | 'description' | 'image'
> & { quantity: number };

type OrderPreparationInfo = {
  store: {
    store_id: number;
    name: string;
    service_fee: number;
    shippingMethods: ShippingMethod[];
  };
  food: OrderPreparationFood[];
  voucherList: Voucher[];
};

type OrderRequest = {
  address_id: number;
  voucher_id?: number;
  store_id: number;
  method_id: number;
  foodIds: number[];
  message?: string;
  payment_method: PAYMENT_TYPE;
};

type OrderInfo = {
  status: ORDER_STATUS;
  payment_method: PAYMENT_TYPE;
  shipping_price: number;
  service_fee: number;
  total_discount: number;
  user: Pick<UserProfile, 'first_name' | 'last_name' | 'phone'>;
  address: UserAddress['full_address'];
  store_name: Store['name'];
  food: OrderPreparationFood[];
};

export { OrderPreparationFood, OrderPreparationInfo, OrderRequest, OrderInfo };
