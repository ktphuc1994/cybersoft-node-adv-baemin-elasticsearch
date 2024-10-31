import { SERVER_API_URL, PATH_STORE } from '@/constants/paths';
import { Store } from '@/types/store';
import { serverFetch } from './serverFetch';

type StoreApi = {
  getStoreById: (storeId: number) => Promise<Store>;
};

const storeApi: StoreApi = {
  getStoreById: async (storeId) => {
    const response = await serverFetch(
      `${SERVER_API_URL}${PATH_STORE}/${storeId}`
    );
    return await response.json();
  },
};

export { storeApi };
