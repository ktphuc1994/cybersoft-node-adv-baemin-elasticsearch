import { SERVER_API_URL, PATH_BANNER } from '@/constants/paths';
import { Banner } from '@/types/banner';
import { serverFetch } from './serverFetch';

type BannerApi = {
  getAllBanner: () => Promise<Banner[]>;
};

const bannerApi: BannerApi = {
  getAllBanner: async () => {
    const response = await serverFetch(`${SERVER_API_URL}${PATH_BANNER}`);
    return await response.json();
  },
};

export { bannerApi };
