import { CartFoodInfo } from '@/types/cart';
import { formatPrice } from '@/utils/number.utils';
import FormItem from 'antd/es/form/FormItem';
import Image from 'next/image';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { useContext, useRef, useState } from 'react';
import { CartContext } from './CartContext';
import { getFoodInputName } from '@/utils/food.utils';
import InputNumber from 'antd/es/input-number';
import { cartApi } from '@/api/cart';
import Button from 'antd/es/button';

type Props = {
  cartRowIndex: number;
  totalFoodItems: number;
  foodInfo: CartFoodInfo;
};
const CartItem = ({ foodInfo, cartRowIndex, totalFoodItems }: Props) => {
  const { updateCart, deleteCartItem } = useContext(CartContext);
  const [total, setTotal] = useState(foodInfo.quantity * foodInfo.price);
  const updateQuantityRef = useRef<NodeJS.Timeout>();
  const updateAbortRef = useRef<AbortController>();

  const onQuantityChange = (quantity: number | null) => {
    if (quantity === null) return;

    clearTimeout(updateQuantityRef.current);
    updateAbortRef.current?.abort();

    updateQuantityRef.current = setTimeout(async () => {
      updateAbortRef.current = new AbortController();

      const newTotal = quantity * foodInfo.price;
      setTotal(newTotal);
      try {
        await cartApi.updateItem(
          { food_id: foodInfo.food_id, quantity },
          updateAbortRef.current.signal
        );
        updateCart?.();
      } catch (error) {
        return;
      }
    }, 200);
  };

  return (
    <div
      className={
        cartRowIndex === totalFoodItems - 1
          ? 'w-full grid grid-cols-12'
          : 'w-full grid grid-cols-12 border-b border-solid border-x-gray-300'
      }
    >
      <div className='pl-8 col-span-4 flex items-center flex-row gap-3'>
        <Checkbox value={foodInfo.food_id} />
        <div className='relative h-36 w-36'>
          <Image
            src={foodInfo.image ?? ''}
            alt={foodInfo.description ?? foodInfo.name}
            fill
            sizes='100vw'
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div className='flex flex-col gap-3'>
          <span className='text-base'>{foodInfo.name}</span>
          <span className='text-sm text-gray-600'>{foodInfo.description}</span>
        </div>
      </div>
      <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
        {formatPrice(foodInfo.price)}
      </div>
      <div className='col-span-2 flex items-center justify-center flex-row gap-3 [&_.ant-form-item]:mb-0'>
        <FormItem
          name={getFoodInputName.quantity(foodInfo.food_id)}
          initialValue={foodInfo.quantity}
        >
          <InputNumber
            min={0}
            max={foodInfo.stock}
            onChange={onQuantityChange}
          />
        </FormItem>
      </div>
      <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
        {formatPrice(total)}
      </div>
      <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
        <Button
          color='danger'
          variant='filled'
          onClick={() => deleteCartItem?.(foodInfo.food_id)}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
