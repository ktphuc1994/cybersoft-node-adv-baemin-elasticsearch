import { CLIENT_API_URL, PATH_ORDER } from '@/constants/paths';
import { OrderInfo, OrderPreparationInfo, OrderRequest } from '@/types/order';
import { checkIsInteger } from '@/utils/number.utils';
import { clientFetch } from './clientFetch';

type OrderApi = {
  getInfoByIds: (
    storeId: string,
    foodIds: string
  ) => Promise<OrderPreparationInfo>;
  placeOrder: (orderInfo: OrderRequest) => Promise<{ order_id: number }>;
  getOrderById: (orderId: string) => Promise<OrderInfo>;
};

const orderApi: OrderApi = {
  getInfoByIds: async (storeId, foodIds) => {
    if (!checkIsInteger(storeId))
      throw new Error('storeId phải là dạng integer.');

    let isFoodIdsValid = true;
    for (let foodId of foodIds.split(',')) {
      if (!checkIsInteger(foodId)) {
        isFoodIdsValid = false;
        break;
      }
    }
    if (!foodIds || !isFoodIdsValid)
      throw new Error('foodIds phải là dạng integer');

    const response = await clientFetch(
      `${CLIENT_API_URL}${PATH_ORDER}/information-by-food-ids?storeId=${storeId}&foodIds=${foodIds}`
    );
    return await response.json();
  },
  placeOrder: async (orderInfo) => {
    const response = await clientFetch(
      `${CLIENT_API_URL}${PATH_ORDER}/create`,
      {
        method: 'POST',
        body: JSON.stringify(orderInfo),
      }
    );
    return await response.json();
  },
  getOrderById: async (orderId) => {
    const response = await clientFetch(
      `${CLIENT_API_URL}${PATH_ORDER}/detail/${orderId}`
    );
    return await response.json();
  },
};

export { orderApi };
