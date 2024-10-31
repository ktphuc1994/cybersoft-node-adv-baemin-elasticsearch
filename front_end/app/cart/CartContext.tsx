import { createContext } from 'react';

type CartContextType = {
  updateCart?: () => void;
  deleteCartItem?: (itemId: number) => void;
};
const CartContext = createContext<CartContextType>({});

export { CartContext };
