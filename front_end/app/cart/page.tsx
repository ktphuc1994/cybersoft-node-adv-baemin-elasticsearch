'use client';
import { ShoppingCartOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'antd/es/button';
import useMessage from 'antd/es/message/useMessage';
import { Cart, SelectedItemsInfo } from '@/types/cart';
import { cartApi } from '@/api/cart';
import { CartContext } from './CartContext';
import Form, { useForm } from 'antd/es/form/Form';
import { getFoodInputName } from '@/utils/food.utils';
import CommonLoading from '@/components/CommonLoading';
import Link from 'next/link';
import { formatPrice } from '@/utils/number.utils';
import DetailsCart from './DetailsCart';

export default function Home() {
  const [cartDetails, setCartDetails] = useState<Cart[]>();
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isCartUpdating, setIsCartUpdating] = useState(false);
  const [selectedFoodInfo, setSelectedFoodInfo] = useState<SelectedItemsInfo>();
  const [messageApi, contextHolder] = useMessage();
  const [form] = useForm();

  const totalFoodsInfo = useMemo(() => {
    if (!selectedFoodInfo || selectedFoodInfo.foodIds.length === 0)
      return { totalItem: 0, total: 0, params: '' };

    const storeInfo = cartDetails?.find(
      (store) => store.store_id === selectedFoodInfo?.storeId
    );
    if (!storeInfo) return { totalItem: 0, total: 0, params: '' };

    let total: number = 0;
    storeInfo.food.forEach((foodInfo) => {
      if (!selectedFoodInfo?.foodIds.includes(foodInfo.food_id)) return;
      total += foodInfo.quantity * foodInfo.price;
    });

    return {
      totalItem: selectedFoodInfo.foodIds.length,
      total,
      params: selectedFoodInfo.foodIds.join(','),
    };
  }, [selectedFoodInfo, cartDetails]);

  const retrieveCartInfo = useCallback(async () => {
    try {
      return await cartApi.getCartInfo();
    } catch (error: any) {
      messageApi.error(
        error.message ?? 'Unable to retrieve cart, please try again.'
      );
    } finally {
      setIsCartLoading(false);
      setIsCartUpdating(false);
    }
  }, []);

  useEffect(() => {
    const getCartDetail = async () => {
      const newCartDetails = await retrieveCartInfo();
      setCartDetails(newCartDetails);
    };
    getCartDetail();
  }, []);

  const onSelectFoods = (itemInfo: SelectedItemsInfo) => {
    setSelectedFoodInfo(itemInfo);
  };

  const updateCart = useCallback(async () => {
    setIsCartUpdating(true);
    const newCartDetails = await retrieveCartInfo();
    const foodList: Record<string, number> = {};
    newCartDetails?.forEach((storeInfo) => {
      storeInfo.food.forEach(({ food_id, quantity }) => {
        const quantityName = getFoodInputName.quantity(food_id);
        foodList[quantityName] = quantity;
      });
    });
    form.setFieldsValue(foodList);
    setCartDetails(newCartDetails);
    setIsCartUpdating(false);
  }, [retrieveCartInfo]);

  const deleteCartItem = useCallback(
    async (foodId: number) => {
      setIsCartUpdating(true);
      try {
        await cartApi.deleteItem(foodId);
        const newCartDetails = await retrieveCartInfo();
        setCartDetails(newCartDetails);
      } catch (error: any) {
        messageApi.error(
          error.message ?? 'Unable to delete cart item, please try again.'
        );
      } finally {
        setIsCartUpdating(false);
      }
    },
    [retrieveCartInfo]
  );

  return (
    <>
      {contextHolder}
      <CommonLoading title='Updating cart...' isLoading={isCartUpdating} />
      <div className='flex flex-row w-full h-20 bg-white'>
        <div className='w-1/2 h-full flex flex-row  items-center gap-3'>
          <div className='ml-10 text-4xl  text-beamin font-bold'>
            <ShoppingCartOutlined />
          </div>
          <div className='text-2xl  text-beamin '>|</div>
          <div className='text-3xl  text-beamin font-bold'>Giỏ hàng</div>
        </div>
        <div className='w-1/2 h-full flex   items-center gap-3'></div>
      </div>
      <div className='mt-4 px-16 flex flex-col gap-4  pb-16 rounded-md'>
        <div className=' w-full h-16  bg-white  grid grid-cols-12'>
          <div className='pl-8  col-span-4 flex items-center flex-row gap-5'>
            <span className='text-base font-normal'> Món Ăn</span>
          </div>
          <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
            <span className='text-base font-normal  text-gray-600'>
              Đơn giá
            </span>
          </div>
          <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
            <span className='text-base font-normal  text-gray-600'>
              Số lượng
            </span>
          </div>
          <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
            <span className='text-base font-normal  text-gray-600'>
              Số tiền
            </span>
          </div>
          <div className='col-span-2 flex items-center justify-center flex-row gap-3'>
            <span className='text-base font-normal  text-gray-600'>
              Thao tác
            </span>
          </div>
        </div>
        <CartContext.Provider value={{ updateCart, deleteCartItem }}>
          <Form form={form}>
            <DetailsCart
              details={cartDetails}
              isLoading={isCartLoading}
              onSelectItems={onSelectFoods}
            />
          </Form>
        </CartContext.Provider>
        <div className='w-full px-16 fixed bottom-0 left-0'>
          <div className='w-full py-4 px-2 flex flex-row items-center bg-white'>
            <div className='flex flex-row gap-2 w-1/2 h-full items-center'>
              {selectedFoodInfo?.storeName ? (
                <>
                  <Button variant='filled' color='danger'>
                    Hủy
                  </Button>
                  <div> Quán Đã chọn: </div>
                  <div>{selectedFoodInfo.storeName}</div>
                </>
              ) : null}
            </div>
            <div className='flex flex-row gap-2 w-1/2 h-full items-center justify-end'>
              <div className=''>
                {' '}
                Tổng thanh toán ({totalFoodsInfo.totalItem} Sản phẩm):
              </div>
              <div className='text-red-600'>
                {formatPrice(totalFoodsInfo.total)}
              </div>
              <div>
                <Link
                  href={`/checkout?storeId=${selectedFoodInfo?.storeId}&foodIds=${totalFoodsInfo.params}`}
                >
                  <Button
                    disabled={
                      !selectedFoodInfo ||
                      selectedFoodInfo?.foodIds.length === 0
                    }
                    type='primary'
                  >
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
