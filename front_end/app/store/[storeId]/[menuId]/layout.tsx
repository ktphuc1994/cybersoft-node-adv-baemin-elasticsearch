import { storeApi } from '@/api/store';
import { FoodMenuTab } from '@/components/FoodMenuTab';
import { checkIsNumber } from '@/utils/number.utils';
import {
  ClockCircleOutlined,
  DollarOutlined,
  DoubleRightOutlined,
  LikeFilled,
  StarFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

type Props = Readonly<
  PropsWithChildren & {
    params: {
      storeId: string;
      menuId?: string;
    };
  }
>;
const DetailFoodLayout = async ({ children, params }: Props) => {
  const storeId = params.storeId;
  if (!checkIsNumber(storeId)) return <div>storeId must be a number</div>;
  const storeInfo = await storeApi.getStoreById(Number(storeId));

  return (
    <section className='relative top-20 w-full'>
      <div className='flex flex-col w-full h-auto'>
        <div className='bg-white w-full h-80 flex'>
          <div className='w-[45%] h-full py-4 px-10'>
            <div className='w-full relative h-full'>
              <Image
                src={storeInfo.image ?? ''}
                alt={storeInfo.name}
                fill
                sizes='100vw'
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
          <div className=' w-[55%] h-full relative'>
            <div className='absolute top-0 left-0 px-8 py-4'>
              <span className='text-[13px] text-[#187CAA]'>
                <a href=''>Home</a>{' '}
                <DoubleRightOutlined className='text-[10px]' />{' '}
                <a href=''>{storeInfo.name}</a>{' '}
              </span>
              <div className='flex flex-row text-[11px] justify-start items-center mt-3'>
                <div className='bg-beamin text-white p-1 mr-2 cursor-pointer tracking-wider flex gap-1'>
                  <LikeFilled />
                  <span>Yêu thích</span>
                </div>
                <span className='text-[#959595]'>
                  QUÁN ĂN -{' '}
                  <a href='' className='text-[#0288D1]'>
                    {storeInfo.name}
                  </a>
                </span>
              </div>
              <div className='text-[22px] font-bold mt-2'>{storeInfo.name}</div>
              <div className='text-[13px] mt-1'>{storeInfo.address}</div>
              <div className='flex flex-row text-[14px] gap-2 justify-start items-center'>
                <ol className='flex flex-row text-[#FFC107] gap-1'>
                  <li>
                    <span>{storeInfo.rating}</span>
                    <StarFilled />
                  </li>
                </ol>
                <p className='bg-[#FFC107] py-[2px] px-1 text-white rounded-md'>
                  {storeInfo.total_rating}
                </p>
                <span>đánh giá trên Baemin</span>
              </div>
              <div className='flex flex-row gap-4 justify-start items-center my-1 text-[15px]'>
                <div className='flex flex-row gap-1 text-[#6CC942] justify-start items-center'>
                  <div className='w-2 h-2 bg-[#6CC942] rounded-full'></div>
                  <span>Mở cửa</span>
                </div>
                <div className='flex flex-row gap-1 justify-start items-center'>
                  <span className='text-[#3AC5C9]'>
                    <ClockCircleOutlined />
                  </span>
                  <span>
                    {dayjs(storeInfo.open_hour).format('HH:mm')} -{' '}
                    {dayjs(storeInfo.close_hour).format('HH:mm')}
                  </span>
                </div>
              </div>
              <div className='flex flex-row gap-1 justify-start items-center text-[#959595] text-[15px]'>
                <span className='text-[#c0c0c0] text-[16px]'>
                  <DollarOutlined />
                </span>{' '}
                <span>{storeInfo.price_range}</span>
              </div>
            </div>

            <div className='w-full flex flex-col absolute bottom-0 left-0 px-8 mb-4 text-[#959595] text-[13px]'>
              <div className='border-t-[1px]'></div>
              <div className='flex flex-row gap-4 justify-start items-center py-[10px]'>
                <div className='flex flex-col '>
                  <span>PHÍ DỊCH VỤ</span>
                  <span className='text-beamin font-bold text-[14px]'>
                    {storeInfo.shipping_partner?.service_fee}% Phí dịch vụ
                  </span>
                </div>
                <div className='border-l border-solid h-6'></div>
                <div className='flex flex-col'>
                  <span>DỊCH VỤ BỞI</span>
                  <span className='text-beamin font-bold text-[14px]'>
                    {storeInfo.shipping_partner?.partner_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='py-[13px] px-[26px] font-bold text-beamin text-[14px]'>
            THỰC ĐƠN
          </div>
          <div className='w-full flex flex-row gap-3'>
            <div className='w-[20%] bg-white p-5'>
              <ul>
                {storeInfo.menuList.map((menuInfo) => (
                  <FoodMenuTab
                    key={`food-menu-key-${menuInfo.menu_id}`}
                    isActive={params.menuId === menuInfo.menu_id.toString()}
                    href={`/store/${storeId}/${menuInfo.menu_id}`}
                    label={menuInfo.name}
                  />
                ))}
              </ul>
            </div>
            {storeInfo.menuList.length === 0 ? (
              <div>No food for this store</div>
            ) : (
              children
            )}
            <div className='w-[30%] bg-white'></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailFoodLayout;
