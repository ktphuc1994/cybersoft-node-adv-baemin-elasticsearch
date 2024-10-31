import { CLIENT_API_URL, PATH_AUTH } from '@/constants/paths';
import { AccessToken, LoginRequest, RegisterRequest } from '@/types/auth';
import { clientFetch } from './clientFetch';

type AuthApi = {
  login: (loginInfo: LoginRequest) => Promise<AccessToken>;
  register: (registerInfo: RegisterRequest) => Promise<AccessToken>;
};

const authApi: AuthApi = {
  login: async (loginInfo) => {
    const response = await clientFetch(`${CLIENT_API_URL}${PATH_AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify(loginInfo),
    });
    return await response.json();
  },
  register: async (registerInfo) => {
    const response = await clientFetch(
      `${CLIENT_API_URL}${PATH_AUTH}/register`,
      {
        method: 'POST',
        body: JSON.stringify(registerInfo),
      }
    );
    return await response.json();
  },
};

export { authApi };
