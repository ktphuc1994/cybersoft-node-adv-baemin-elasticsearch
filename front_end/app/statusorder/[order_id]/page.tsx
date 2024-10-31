'use client';

import { ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import Status from './status';
import DetailsCheckout from '@/app/checkout/detailsCheckout';
import { OrderInfo } from '@/types/order';
import { orderApi } from '@/api/order';
import { useParams } from 'next/navigation';
import useMessage from 'antd/es/message/useMessage';
import CommonLoading from '@/components/CommonLoading';
import { ORDER_STATUS } from '@/constants/order';
import { formatPrice } from '@/utils/number.utils';

const status = [
  {
    id: '1',
    number: 1,
    name: 'Nhà hàng đã nhận đơn',
    st: false,
  },
  {
    id: '2',
    number: 2,
    name: 'Shipper đã nhận đơn',
    st: false,
  },
  {
    id: '3',
    number: 3,
    name: 'Shipper đang đến nhà hàng',
    st: false,
  },
  {
    id: '4',
    number: 4,
    name: 'Shipper đã đến nhà hàng',
    st: false,
  },

  {
    id: '5',
    number: 5,
    name: 'Shipper đang giao hàng',
    st: false,
  },
  {
    id: '6',
    number: 6,
    name: 'Đơn hàng hoàn tất',
    st: false,
  },
];

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>();
  const { order_id } = useParams<{ order_id: string }>();
  const [messageApi, contextHolder] = useMessage();

  const priceInfo = useMemo(() => {
    if (!orderInfo) return { rawTotal: 0, total: 0, totalItem: 0 };

    const rawTotal = orderInfo.food.reduce((totalRaw, foodInfo) => {
      return (totalRaw += foodInfo.price * foodInfo.quantity);
    }, 0);

    return {
      rawTotal,
      total:
        rawTotal -
        orderInfo.total_discount +
        orderInfo.service_fee +
        orderInfo.shipping_price,
      totalItem: orderInfo.food.length,
    };
  }, [orderInfo]);

  useEffect(() => {
    orderApi
      .getOrderById(order_id)
      .then((res) => setOrderInfo(res))
      .catch((error: any) => {
        messageApi.error(
          error.message ??
            'Unable to retrieve order information, please try again.'
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return <CommonLoading isLoading title='Đang tải thông tin đơn hàng' />;

  if (!orderInfo)
    return <h2 className='text-center text-3xl'>Không tìm thấy đơn hàng.</h2>;

  return (
    <>
      {contextHolder}
      <div className='flex flex-row w-full h-20 bg-white '>
        <div className='w-1/2 h-full flex flex-row  items-center gap-3'>
          <div className='ml-10 text-4xl  text-beamin font-bold'>
            <ShoppingCartOutlined />
          </div>
          <div className='text-2xl  text-beamin '>|</div>
          <div className='text-3xl  text-beamin font-bold'>
            Trình trạng đơn hàng
          </div>
        </div>
        <div className='w-1/2 h-full flex   items-center gap-3'></div>
      </div>
      <div className='grid grid-cols-12 '>
        <div className='col-span-3  pt-3 pb-3 pl-16'>
          <div className='w-full h-full bg-white rounded-md flex flex-col pl-4 pt-2 pb-4'>
            <div className='font-semibold'> Trình Trạng </div>
            <Status items={status} />
          </div>
        </div>
        <div className='col-span-9 pt-3 pl-6 pr-10 flex flex-col gap-2 pb-3 h-full'>
          <div className='w-full h-[70%] rounded-md'>
            <div className='w-full h-full relative'>
              <Image
                src={'/images/baemin-1.jpg'}
                alt=''
                fill
                sizes='100vw'
                style={{
                  objectFit: 'cover',
                }}
              ></Image>
            </div>
          </div>
          <div className='w-full  bg-white rounded-md p-4 flex flex-col'>
            <div className='w-full flex flex-row'>
              <div className='w-1/3 flex flex-col gap-2'>
                <div>Đồ ăn | {orderInfo.store_name}</div>
                <div className='text-gray-600 text-sm'>
                  {`${formatPrice(priceInfo.total)} - ${
                    priceInfo.totalItem
                  } món - ${orderInfo.payment_method}`}
                </div>
                <div className='text-gray-600 text-sm'>
                  {`${orderInfo.user.last_name} ${orderInfo.user.first_name} - ${orderInfo.user.phone}`}
                </div>
              </div>
              <div className='w-1/3 flex flex-col gap-2'>
                <div>Giao hàng đến</div>
                <div className='text-gray-600 text-sm'>{orderInfo.address}</div>
                <div className='text-gray-600 text-sm'>
                  thời gian hoàn thành:{' '}
                  {orderInfo.status === ORDER_STATUS.DELIVERED
                    ? 'Hoàn thành'
                    : 'Đang chờ'}
                </div>
              </div>
              <div className='w-1/3 flex flex-col  gap-2 pl-5'>
                <div className='font-medium flex flex-row justify-between '>
                  <span> Tổng ({priceInfo.totalItem} món):</span>
                  <span className='text-beamin'>
                    {formatPrice(priceInfo.rawTotal)}
                  </span>
                </div>
                <div className='text-sm flex flex-row justify-between border-t'>
                  <span> phí giao hàng:</span>
                  <span className='text-beamin'>
                    {formatPrice(orderInfo.shipping_price)}
                  </span>
                </div>
                <div className='text-sm flex flex-row justify-between '>
                  <span> phí dịch vụ:</span>
                  <span className='text-beamin'>
                    {formatPrice(orderInfo.service_fee)}
                  </span>
                </div>
                {orderInfo.total_discount ? (
                  <div className='text-sm flex flex-row justify-between '>
                    <span> Giảm giá:</span>
                    <span className='text-beamin'>
                      {formatPrice(orderInfo.total_discount)}
                    </span>
                  </div>
                ) : null}
                <div className='text-beamin w-full flex flex-row items-end justify-end text-xl font-medium pr-3 pt-3'>
                  <span>{formatPrice(priceInfo.total)}</span>
                </div>
              </div>
            </div>
            <div className='w-full mt-2 border-t'>
              <DetailsCheckout foodList={orderInfo.food} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
