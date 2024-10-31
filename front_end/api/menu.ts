import { Menu } from '@/types/menu';
import { SERVER_API_URL, PATH_MENU } from '@/constants/paths';
import { serverFetch } from './serverFetch';

type MenuApi = {
  getMenuList: () => Promise<Menu[]>;
};

const menuApi: MenuApi = {
  getMenuList: async () => {
    const response = await serverFetch(`${SERVER_API_URL}${PATH_MENU}`);
    return await response.json();
  },
};

export { menuApi };
