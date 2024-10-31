'use client';

import { ShoppingCartOutlined } from '@ant-design/icons';
import DetailsCheckout from './detailsCheckout';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddessSelection } from '@/components/Checkout/AddessSelection';
import { VoucherSelection } from '@/components/Checkout/VoucherSelection';
import { ShippingMethodSelection } from '@/components/Checkout/ShippingMethodSelection';
import { PaymentMethodSelection } from '@/components/Checkout/PaymentMethodSelection';
import useMessage from 'antd/es/message/useMessage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { orderApi } from '@/api/order';
import { OrderPreparationInfo, OrderRequest } from '@/types/order';
import { userApi } from '@/api/user';
import { UserAddress, UserProfile } from '@/types/user';
import { PAYMENT_TYPE } from '@/constants/payment';
import { ShippingMethod, Voucher } from '@/types/store';
import { formatPrice } from '@/utils/number.utils';

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<OrderPreparationInfo>();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod>();
  const addressRef = useRef<number>();
  const paymentMethodRef = useRef<PAYMENT_TYPE>(PAYMENT_TYPE.MOMO);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const [messageApi, contextHolder] = useMessage();

  const priceInfo = useMemo(() => {
    if (!checkoutInfo)
      return { rawTotal: 0, serviceFee: 0, discount: 0, total: 0 };

    const rawTotal = checkoutInfo.food.reduce((totalRaw, foodInfo) => {
      return (totalRaw += foodInfo.price * foodInfo.quantity);
    }, 0);

    let discount = 0;
    if (selectedVoucher?.percentage)
      discount = (rawTotal * Number(selectedVoucher.percentage)) / 100;

    const serviceFee = (rawTotal * checkoutInfo.store.service_fee) / 100;

    let total = rawTotal + serviceFee - discount;
    if (selectedShippingMethod?.shipping_price)
      total += selectedShippingMethod.shipping_price;

    return { rawTotal, serviceFee, discount, total };
  }, [checkoutInfo?.food, selectedVoucher, selectedShippingMethod]);

  useEffect(() => {
    const storeId = searchParams.get('storeId') ?? '';
    const foodIds = searchParams.get('foodIds') ?? '';

    Promise.all([
      orderApi.getInfoByIds(storeId, foodIds),
      userApi.getUserProfile(),
    ])
      .then(([storeInfo, profile]) => {
        setCheckoutInfo(storeInfo);
        setUserProfile(profile);
        addressRef.current = profile.address[0]?.address_id;
        setSelectedShippingMethod(storeInfo.store.shippingMethods?.[0]);
      })
      .catch((error: any) => {
        messageApi.error(
          error.message ??
            'Không thể lấy thông tin món ăn. Vui lòng thử lại sau.'
        );
      });
  }, []);

  const onSelectAddress = useCallback((addressInfo: UserAddress) => {
    addressRef.current = addressInfo.address_id;
  }, []);

  const onSelectVoucher = useCallback((voucherInfo: Voucher) => {
    setSelectedVoucher(voucherInfo);
  }, []);

  const onSelectShippingMethod = useCallback((methodInfo: ShippingMethod) => {
    setSelectedShippingMethod(methodInfo);
  }, []);

  const onSelectPaymentMethod = useCallback((method: string) => {
    paymentMethodRef.current = method as PAYMENT_TYPE;
  }, []);

  const handlePlaceOrder = async () => {
    if (
      !addressRef.current ||
      !checkoutInfo ||
      !selectedShippingMethod?.method_id
    ) {
      messageApi.error(
        'Còn thiếu thông tin đơn hàng, vui lòng xem xét và chọn lại.'
      );
      return;
    }

    const orderRequest: OrderRequest = {
      address_id: addressRef.current,
      voucher_id: selectedVoucher?.voucher_id,
      store_id: checkoutInfo.store.store_id,
      method_id: selectedShippingMethod?.method_id,
      foodIds: checkoutInfo.food.map((foodInfo) => foodInfo.food_id),
      message: messageInputRef.current?.value,
      payment_method: paymentMethodRef.current,
    };

    try {
      setIsUpdating(true);
      const { order_id } = await orderApi.placeOrder(orderRequest);
      messageApi.success('Đặt hàng thành công');
      router.push(`/statusorder/${order_id}`);
    } catch (error: any) {
      messageApi.error(
        error.message ?? 'Không thể đặt hàng. Vui lòng thử lại sau.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className='flex flex-row w-full h-20 bg-white '>
        <div className='w-1/2 h-full flex flex-row  items-center gap-3'>
          <div className='ml-10 text-4xl  text-beamin font-bold'>
            <ShoppingCartOutlined />
          </div>
          <div className='text-2xl  text-beamin '>|</div>
          <div className='text-3xl  text-beamin font-bold'>Thanh Toán</div>
        </div>
        <div className='w-1/2 h-full flex   items-center gap-3'></div>
      </div>
      <div className='px-16 flex flex-col gap-3 '>
        {userProfile ? (
          <AddessSelection
            userProfile={userProfile}
            onSelectAddress={onSelectAddress}
          />
        ) : null}
        <div className='w-full bg-white rounded-md  flex flex-col pt-5 '>
          <div className='ml-10'>{checkoutInfo?.store.name}</div>

          <DetailsCheckout foodList={checkoutInfo?.food} />
          <VoucherSelection
            voucherList={checkoutInfo?.voucherList}
            onSelectVoucher={onSelectVoucher}
          />
          <div className='border-t w-full grid grid-cols-12 h-28'>
            <div className='col-span-5 border-r pt-4 pl-9 pb-10 flex flex-row items-center gap-3'>
              <span className='text-nowrap'>Lời Nhắn:</span>
              <input
                type='text'
                ref={messageInputRef}
                placeholder='Lưu ý cho người bán'
                className='border-gray-300  focus-visible:border-beamin border border-solid  mr-3  w-full h-8 pl-1'
              />
            </div>
            <div className='col-span-7'>
              {checkoutInfo?.store.shippingMethods ? (
                <ShippingMethodSelection
                  shippingMethod={checkoutInfo.store.shippingMethods}
                  onSelectShippingMethod={onSelectShippingMethod}
                />
              ) : null}
            </div>
          </div>
          <div className='border-t w-full  h-16 flex justify-end pr-5 gap-2 items-center'>
            <span>Tổng số tiền ({checkoutInfo?.food.length} sản phẩm):</span>
            <span className='text-beamin font-bold'>
              {formatPrice(priceInfo.rawTotal)}
            </span>
          </div>
        </div>
        <div className='w-full  flex flex-col bg-white rounded-md  pt-5 gap-3'>
          <PaymentMethodSelection onSelectPayment={onSelectPaymentMethod} />
          <div className='w-full   border-t flex flex-col justify-end items-end pt-4  gap-4'>
            <div className='flex justify-between w-[30%] '>
              <div className='text-sm text-gray-900'>Tổng tiền hàng</div>
              <div className='text-sm mr-5'>
                {formatPrice(priceInfo.rawTotal)}
              </div>
            </div>
            <div className='flex justify-between w-[30%] '>
              <div className='text-sm text-gray-900'>Phí vận chuyển</div>
              <div className='text-sm mr-5'>
                {formatPrice(selectedShippingMethod?.shipping_price ?? 0)}
              </div>
            </div>
            <div className='flex justify-between w-[30%] '>
              <div className='text-sm text-gray-900'>Phí dịch vụ</div>
              <div className='text-sm mr-5'>
                {formatPrice(priceInfo.serviceFee)}
              </div>
            </div>
            {priceInfo.discount ? (
              <div className='flex justify-between w-[30%] '>
                <div className='text-sm text-gray-900'>
                  Tổng cộng Voucher giảm giá:
                </div>
                <div className='text-sm mr-5'>
                  - {formatPrice(priceInfo.discount)}
                </div>
              </div>
            ) : null}
            <div className='flex justify-between w-[30%] '>
              <div className='text-sm text-gray-900'>Tổng thanh toán</div>
              <div className='text-2xl mr-5 text-beamin'>
                {formatPrice(priceInfo.total)}
              </div>
            </div>
          </div>
          <div className='w-full border-t  flex flex-row justify-between items-center  pt-4  gap-4 mb-4'>
            <div className='w-[70%] ml-8'>
              Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo{' '}
              <span className='text-blue-600 text-sm cursor-pointer'>
                Điều khoản Baemin
              </span>
            </div>
            <div className='w-[30%] pl-48 '>
              <button
                onClick={handlePlaceOrder}
                className='p-1 bg-beamin text-white w-36 rounded-md h-10 hover:brightness-105'
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
