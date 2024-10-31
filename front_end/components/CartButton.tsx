'use client';

import { cartApi } from '@/api/cart';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Button from 'antd/es/button';
import { useEffect, useState } from 'react';

const CartButton = () => {
  const [totalItems, setTotalItems] = useState<string>();

  useEffect(() => {
    cartApi
      .getTotalItems()
      .then((cartCount) => setTotalItems(cartCount.toString()))
      .catch((_error) => {});
  }, []);

  return (
    <div className='relative'>
      <Button
        href='/cart'
        type='text'
        style={{
          fontSize: '20px',
          width: '40px',
          height: '100%',
          color: '#3AC5C9',
        }}
        icon={<ShoppingCartOutlined />}
      />
      {totalItems && totalItems !== '0' ? (
        <span className='absolute top-0 right-0 inline-block px-1 h-4 bg-red-600 text-white text-xs text-center rounded-full aspect-square'>
          {totalItems}
        </span>
      ) : null}
    </div>
  );
};

export default CartButton;
