import { SERVER_API_URL, PATH_FOOD } from '@/constants/paths';
import { Food, FoodRequest, TodayFood } from '@/types/food';
import { parseObjectToParamString } from '@/utils/url.utils';
import { serverFetch } from './serverFetch';

type FoodApi = {
  getTodayFood: () => Promise<TodayFood[]>;
  getFoodList: (payload?: FoodRequest) => Promise<Food[]>;
};

const foodApi: FoodApi = {
  getTodayFood: async () => {
    const response = await serverFetch(`${SERVER_API_URL}${PATH_FOOD}/today`);
    return await response.json();
  },
  getFoodList: async (payload) => {
    const searchParams = parseObjectToParamString(payload);
    const response = await serverFetch(
      `${SERVER_API_URL}${PATH_FOOD}?${searchParams}`
    );
    return await response.json();
  },
};

export { foodApi };
