import Modal from 'antd/es/modal/Modal';
import Select from 'antd/es/select';
import Button from 'antd/es/button';
import { ShippingMethod } from '@/types/store';
import { memo, useRef, useState } from 'react';
import { formatPrice } from '@/utils/number.utils';

type Props = {
  shippingMethod?: ShippingMethod[];
  onSelectShippingMethod: (methodInfo: ShippingMethod) => void;
};

const ShippingMethodOption = ({
  shippingMethod,
}: {
  shippingMethod: ShippingMethod;
}) => {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <p>{shippingMethod.shipping_name}</p>
        <p className='text-xs'>{shippingMethod.shipping_time}</p>
      </div>
      <span>{formatPrice(shippingMethod.shipping_price)}</span>
    </div>
  );
};

const ShippingMethodSelection = memo(
  ({ shippingMethod, onSelectShippingMethod }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(shippingMethod?.[0]);
    const modalMethodIdRef = useRef<number>();

    const showMethodModal = () => {
      setIsModalOpen(true);
    };

    const handleOk = () => {
      setIsModalOpen(false);
      if (!modalMethodIdRef.current) return;

      const newMethod = shippingMethod?.find(
        (methodInfo) => methodInfo.method_id === modalMethodIdRef.current
      );
      if (!newMethod) return;

      setSelectedMethod(newMethod);
      onSelectShippingMethod(newMethod);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
      modalMethodIdRef.current = undefined;
    };

    const handleSelectShippingMethod = (value: number) => {
      modalMethodIdRef.current = value;
    };
    return (
      <>
        <div className='grid grid-cols-12 pt-4'>
          <div className='col-span-4 pt-3 text-sm ml-3'>
            Phương thức vận chuyển:
          </div>
          <div className='col-span-4 flex flex-col gap-1'>
            <span className='font-bold'>{selectedMethod?.shipping_name}</span>
            <span className='text-sm'>{selectedMethod?.shipping_time}</span>
          </div>
          <div className='col-span-2'>
            <Button variant='text' color='primary' onClick={showMethodModal}>
              Thay đổi
            </Button>
          </div>
          <div className='col-span-2'>
            {selectedMethod?.shipping_price ? (
              <span className=' text-sm'>
                {formatPrice(selectedMethod?.shipping_price)}
              </span>
            ) : null}
          </div>
        </div>
        <Modal
          title='Chọn địa chỉ'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Select<number, ShippingMethod>
            defaultValue={selectedMethod?.method_id}
            rootClassName='w-full'
            onChange={handleSelectShippingMethod}
            options={shippingMethod}
            fieldNames={{ value: 'method_id', label: 'shipping_name' }}
            optionRender={(option) => (
              <ShippingMethodOption shippingMethod={option.data} />
            )}
          />
        </Modal>
      </>
    );
  }
);

ShippingMethodSelection.displayName = 'ShippingMethodSelection';

export { ShippingMethodSelection };
