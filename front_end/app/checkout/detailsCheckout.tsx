import { OrderPreparationFood } from '@/types/order';
import { formatPrice } from '@/utils/number.utils';
import Image from 'next/image';

type Props = {
  foodList?: OrderPreparationFood[];
};
export default function DetailsCheckout({ foodList }: Props) {
  if (!foodList) return null;

  return (
    <>
      <div className='mt-3 ml-10 grid grid-cols-12'>
        <div className='col-span-6'>Món Ăn</div>
        <div className='col-span-2'>Đơn giá </div>
        <div className='col-span-2'>Số Lượng </div>
        <div className='col-span-2'>Thành tiền</div>
      </div>

      {foodList.map((item, index) => (
        <div key={index} className='mt-4 ml-10 grid grid-cols-12'>
          <div className='col-span-6 flex flex-row items-center gap-3'>
            <div className='w-16 h-16 relative'>
              <Image
                src={item.image ?? ''}
                alt={item.name}
                fill
                sizes='100vw'
                style={{
                  objectFit: 'cover',
                }}
              ></Image>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-base'>{item.name}</span>
              <span className='text-sm text-gray-600'>{item.description}</span>
            </div>
          </div>
          <div className='col-span-2 ml-1 flex items-center'>
            {formatPrice(item.price)}{' '}
          </div>
          <div className='col-span-2 ml-5 flex items-center '>
            {item.quantity}{' '}
          </div>
          <div className='col-span-2 ml-5  flex items-center'>
            {formatPrice(item.quantity * item.price)}
          </div>
        </div>
      ))}
    </>
  );
}
