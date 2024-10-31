type UserAddress = {
  address_id: number;
  user_id: number;
  full_address: string;
};

type UserProfile = {
  user_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  address: UserAddress[];
};

export { UserAddress, UserProfile };
