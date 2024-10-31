import { CLIENT_API_URL, PATH_USER } from '@/constants/paths';
import { UserProfile } from '@/types/user';
import { clientFetch } from './clientFetch';

type UserApi = {
  getUserProfile: () => Promise<UserProfile>;
};

const userApi: UserApi = {
  getUserProfile: async () => {
    const response = await clientFetch(`${CLIENT_API_URL}${PATH_USER}/profile`);
    return await response.json();
  },
};

export { userApi };
