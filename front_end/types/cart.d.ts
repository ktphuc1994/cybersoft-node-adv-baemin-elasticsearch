import { Food } from './food';

type CartFoodInfo = Omit<Food, 'store_id' | 'tags'> & {
  price: number;
  quantity: number;
};
type Cart = {
  store_id: number;
  name: string;
  food: CartFoodInfo[];
};

type SelectedItemsInfo = {
  storeId: number;
  storeName: string;
  foodIds: number[];
};

type UpdateCartItemRequest = {
  food_id: number;
  quantity: number;
};

export { CartFoodInfo, Cart, SelectedItemsInfo, UpdateCartItemRequest };
