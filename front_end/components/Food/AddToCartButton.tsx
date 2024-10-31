'use client';

import { cartApi } from '@/api/cart';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { ReactNode, useRef, useState } from 'react';

type AddToCartButtonProps = {
  foodId: number;
};
type PopoverContentProps = {
  text: string;
  onClick: () => void;
};

const PopoverContent = ({ text, onClick }: PopoverContentProps) => (
  <span className='inline-block p-1' onClick={onClick}>
    {text}
  </span>
);

const defaultPopoverInfo = {
  content: '',
};

const AddToCartButton = ({ foodId }: AddToCartButtonProps) => {
  const [popoverInfo, setPopoverInfo] = useState<{
    content?: ReactNode;
    color?: string;
  }>(defaultPopoverInfo);
  const removePopoverRef = useRef<NodeJS.Timeout>();

  const handleHidePopover = () => {
    clearTimeout(removePopoverRef.current);
    setPopoverInfo(defaultPopoverInfo);
  };

  const handleAddToCart = async () => {
    try {
      await cartApi.addToCart(foodId);
      setPopoverInfo({
        content: (
          <PopoverContent
            text='Thêm giỏ hàng thành công'
            onClick={handleHidePopover}
          />
        ),
        color: 'green',
      });
    } catch (error: any) {
      if (error.statusCode === 401) {
        setPopoverInfo({
          content: (
            <PopoverContent
              text='Vui lòng đăng nhập'
              onClick={handleHidePopover}
            />
          ),
          color: 'orange',
        });
        return;
      }

      setPopoverInfo({
        content: (
          <PopoverContent
            text='Thêm giỏ hàng thất bại'
            onClick={handleHidePopover}
          />
        ),
        color: 'red',
      });
    } finally {
      removePopoverRef.current = setTimeout(
        () => setPopoverInfo(defaultPopoverInfo),
        3000
      );
    }
  };

  return (
    <Popover
      placement='topLeft'
      content={popoverInfo?.content}
      color={popoverInfo?.color}
      open={!!popoverInfo.content}
      rootClassName='[&_.ant-popover-inner]:[&_.ant-popover-content]:p-0'
    >
      <div
        className='h-6 w-6 rounded-md flex justify-center items-center bg-beamin text-white font-bold cursor-pointer hover:brightness-110'
        onClick={handleAddToCart}
      >
        <PlusOutlined />
      </div>
    </Popover>
  );
};

export { AddToCartButton };
