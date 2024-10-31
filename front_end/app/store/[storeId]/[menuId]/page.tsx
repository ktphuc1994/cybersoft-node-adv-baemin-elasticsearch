import { foodApi } from '@/api/food';
import { AddToCartButton } from '@/components/Food/AddToCartButton';
import { checkIsInteger, formatPrice } from '@/utils/number.utils';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Input from 'antd/es/input/Input';
import Image from 'next/image';

type Props = {
  params: {
    storeId: string;
    menuId: string;
  };
};

const StoreMenuDetailPage = async ({ params }: Props) => {
  if (!checkIsInteger(params.menuId) || !checkIsInteger(params.storeId))
    return <div className='pt-20'>menuId hoặc storeId phải là số nguyên</div>;

  const foodList = await foodApi.getFoodList({
    storeId: Number(params.storeId),
    menuId: Number(params.menuId),
  });

  return (
    <div className='w-[50%] h-auto bg-white py-3 flex flex-col px-4'>
      <div className='w-full mb-5'>
        <Input addonBefore={<SearchOutlined />} placeholder='' />
      </div>
      <div className='flex flex-col w-full pl-1 gap-3'>
        <div className='flex flex-col w-full gap-43 border-b'>
          {foodList.map((foodInfo) => (
            <div className='flex flex-row' key={`food-key-${foodInfo.food_id}`}>
              <div className='w-[15%] relative h-16'>
                <Image
                  src={foodInfo.image ?? ''}
                  alt={foodInfo.name}
                  fill
                  sizes='100vw'
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className='w-[60%] flex flex-col gap-1 px-2'>
                <span className='font-bold text-[#464646] '>
                  {foodInfo.name}
                </span>
                <span className='text-wrap text-sm text-[#464646] '>
                  {foodInfo.description}
                </span>
              </div>
              <div className='w-[15%] flex justify-center items-center'>
                <span className='text-[#0288d1] font-bold text-base'>
                  {formatPrice(foodInfo.price)}
                </span>
              </div>
              <div className='w-[10%] flex justify-center items-center'>
                <AddToCartButton foodId={foodInfo.food_id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreMenuDetailPage;
