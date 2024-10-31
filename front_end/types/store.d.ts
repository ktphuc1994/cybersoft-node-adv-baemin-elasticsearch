type Store = {
  store_id: number;
  address: string;
  name: string;
  image: string | null;
  open_hour: string | null;
  close_hour: string | null;
  price_range: string | null;
  rating: number | null;
  total_rating: number | null;
  partner_id: number | null;
  menuList: {
    menu_id: number;
    name: string;
  }[];
  shipping_partner?: {
    partner_name: string;
    service_fee: number;
  };
};

type ShippingMethod = {
  method_id: number;
  shipping_name: string;
  shipping_price: number;
  shipping_time: string;
};

type Voucher = {
  voucher_id: number;
  percentage: string; // number - decimal
};

export { Store, ShippingMethod, Voucher };
