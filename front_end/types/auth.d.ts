type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = LoginRequest & {
  first_name?: string;
  last_name?: string;
  phone?: string;
};

type AccessToken = {
  access_token: string;
};

export { LoginRequest, RegisterRequest, AccessToken };
