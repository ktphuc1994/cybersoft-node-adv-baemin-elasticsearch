'use client';

import { Cart, SelectedItemsInfo } from '@/types/cart';
import Checkbox, { CheckboxProps } from 'antd/es/checkbox/Checkbox';
import CheckboxGroup from 'antd/es/checkbox/Group';
import CartItem from './CartItem';
import { useMemo, useState } from 'react';

type Props = {
  storeInfo: Cart;
  selectedItemsInfo?: SelectedItemsInfo;
  onSelectItems: (itemInfo: SelectedItemsInfo) => void;
};

const CartStore = ({ storeInfo, selectedItemsInfo, onSelectItems }: Props) => {
  const [foodIdList, setFoodIdList] = useState<number[]>([]);

  const foodIds = useMemo(
    () => storeInfo.food.map((foodInfo) => foodInfo.food_id),
    [storeInfo.food]
  );

  const selectedIds = useMemo(() => {
    if (!selectedItemsInfo) return foodIdList;
    if (selectedItemsInfo.storeId !== storeInfo.store_id) return [];
    return selectedItemsInfo.foodIds;
  }, [selectedItemsInfo, foodIdList]);

  const checkAll = storeInfo.food.length === selectedIds.length;
  const indeterminate =
    selectedIds.length !== 0 &&
    storeInfo.food.length > 0 &&
    selectedIds.length < storeInfo.food.length;

  const onChange = (list: number[]) => {
    setFoodIdList(list);
    onSelectItems({
      storeId: storeInfo.store_id,
      storeName: storeInfo.name,
      foodIds: list,
    });
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    const newCheckList = e.target.checked ? foodIds : [];
    setFoodIdList(newCheckList);
    onSelectItems({
      storeId: storeInfo.store_id,
      storeName: storeInfo.name,
      foodIds: newCheckList,
    });
  };

  if (storeInfo.food.length === 0) return null;

  return (
    <div
      className='w-full flex flex-col bg-white rounded-md '
      key={`cart-id-no-${storeInfo.store_id}`}
    >
      <div className=' flex flex-row my-7 ml-8 items-center gap-3'>
        <Checkbox
          indeterminate={indeterminate}
          checked={checkAll}
          onChange={onCheckAllChange}
        />
        <span className='text-base font-normal'> {storeInfo.name}</span>
      </div>
      <div className='w-full border-t border-b border-solid border-gray-600 py-3'>
        <CheckboxGroup
          value={selectedIds}
          onChange={onChange}
          className='w-full'
        >
          {storeInfo.food.map((foodInfo, index) => (
            <CartItem
              key={`store-${storeInfo.store_id}-food-id-${foodInfo.food_id}`}
              cartRowIndex={index}
              totalFoodItems={storeInfo.food.length}
              foodInfo={foodInfo}
            />
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
};

export default CartStore;
